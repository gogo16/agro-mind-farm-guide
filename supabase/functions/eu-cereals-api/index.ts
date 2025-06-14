
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    
    // Correct EU API base URL
    const EU_API_BASE = 'https://ec.europa.eu/agrifood/api/cereal'
    
    let apiUrl: string
    
    switch (action) {
      case 'prices':
        const memberStateCodes = url.searchParams.get('memberStateCodes') || 'RO'
        const productCodes = url.searchParams.get('productCodes') || ''
        const beginDate = url.searchParams.get('beginDate') || ''
        const endDate = url.searchParams.get('endDate') || ''
        
        // Required parameters for EU API
        const stageCodes = 'FOB,FGATE,DEPSILO,DELPORT,CIF'
        const marketCodes = 'CON,BAN,MUT,OLT'
        
        if (!productCodes) {
          return new Response(
            JSON.stringify({ error: 'productCodes parameter is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        apiUrl = `${EU_API_BASE}/prices?memberStateCodes=${memberStateCodes}&productCodes=${productCodes}&stageCodes=${stageCodes}&marketCodes=${marketCodes}`
        if (beginDate) apiUrl += `&beginDate=${beginDate}`
        if (endDate) apiUrl += `&endDate=${endDate}`
        break
        
      case 'products':
        apiUrl = `${EU_API_BASE}/products`
        break
        
      case 'markets':
        apiUrl = `${EU_API_BASE}/markets`
        break
        
      case 'stages':
        apiUrl = `${EU_API_BASE}/stages`
        break
        
      case 'test-product':
        const testProduct = url.searchParams.get('productCode') || 'MAI'
        const testBeginDate = url.searchParams.get('beginDate') || '14/06/2024'
        const testEndDate = url.searchParams.get('endDate') || '14/06/2025'
        
        apiUrl = `${EU_API_BASE}/prices?memberStateCodes=RO&productCodes=${testProduct}&stageCodes=FOB,FGATE,DEPSILO,DELPORT,CIF&marketCodes=CON,BAN,MUT,OLT&beginDate=${testBeginDate}&endDate=${testEndDate}`
        break
        
      default:
        return new Response(
          JSON.stringify({ 
            error: 'Invalid action parameter', 
            availableActions: ['prices', 'products', 'markets', 'stages', 'test-product'] 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    console.log('Fetching from EU API:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'AgricultureApp/1.0'
      }
    })

    if (!response.ok) {
      console.error('EU API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('EU API error response:', errorText.substring(0, 500))
      
      return new Response(
        JSON.stringify({ 
          error: `EU API error: ${response.status} - ${response.statusText}`,
          details: errorText.substring(0, 200),
          url: apiUrl
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('EU API response received, data length:', Array.isArray(data) ? data.length : 'not array')
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('Sample data:', JSON.stringify(data[0]).substring(0, 300))
    }

    // Store prices in database if it's a prices request
    if (action === 'prices' && Array.isArray(data) && data.length > 0) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Helper function to extract numeric price from string like "€183.67"
      const extractNumericPrice = (priceString: string): number => {
        if (!priceString) return 0;
        // Remove currency symbols and extract numeric value
        const numericMatch = priceString.match(/[\d.,]+/);
        if (numericMatch) {
          const numericStr = numericMatch[0].replace(',', '.');
          const price = parseFloat(numericStr);
          console.log(`Parsed price: "${priceString}" -> ${price}`);
          return isNaN(price) ? 0 : price;
        }
        console.log(`Failed to parse price: "${priceString}"`);
        return 0;
      }

      // Transform data for storage
      const transformedData = data.map((item: any) => ({
        member_state_code: item.memberStateCode || 'RO',
        member_state_name: item.memberStateName || 'Romania',
        begin_date: item.beginDate,
        end_date: item.endDate,
        reference_period: item.referencePeriod,
        week_number: item.weekNumber || null,
        product_name: item.productName,
        product_code: item.productCode,
        stage_name: item.stageName,
        stage_code: item.stageCode,
        market_name: item.marketName,
        market_code: item.marketCode,
        unit: item.unit,
        price: extractNumericPrice(item.price),
        currency: 'EUR'
      }))

      console.log('Storing', transformedData.length, 'price records')

      // Insert/update prices
      const { error: pricesError } = await supabase
        .from('eu_market_prices')
        .upsert(transformedData, {
          onConflict: 'member_state_code,product_code,reference_period,market_code,stage_code'
        })

      if (pricesError) {
        console.error('Database error (prices):', pricesError)
      }

      // Also store in price history for AI training
      const historyData = transformedData.map((item: any) => ({
        product_code: item.product_code,
        price: item.price,
        currency: item.currency,
        date: item.reference_period,
        data_source: 'eu_api'
      }))

      const { error: historyError } = await supabase
        .from('price_history')
        .upsert(historyData, {
          onConflict: 'product_code,date,data_source'
        })

      if (historyError) {
        console.error('Database error (history):', historyError)
      } else {
        console.log('Successfully stored price history for AI training')
      }
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
