
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
    
    // Updated base URL
    const EU_API_BASE = 'https://agridata.ec.europa.eu/agrifood/api'
    
    let apiUrl: string
    
    switch (action) {
      case 'prices':
        const memberStateCodes = url.searchParams.get('memberStateCodes') || 'RO'
        const productCodes = url.searchParams.get('productCodes') || ''
        const stageCodes = url.searchParams.get('stageCodes') || ''
        const marketCodes = url.searchParams.get('marketCodes') || ''
        const beginDate = url.searchParams.get('beginDate') || ''
        const endDate = url.searchParams.get('endDate') || ''
        
        // Build the prices URL with better parameter handling
        apiUrl = `${EU_API_BASE}/cereals/prices?memberStateCodes=${memberStateCodes}`
        if (productCodes) {
          // Split product codes and test them individually for better error handling
          const products = productCodes.split(',')
          console.log('Testing product codes:', products)
          apiUrl += `&productCodes=${productCodes}`
        }
        if (stageCodes) apiUrl += `&stageCodes=${stageCodes}`
        if (marketCodes) apiUrl += `&marketCodes=${marketCodes}`
        if (beginDate) apiUrl += `&beginDate=${beginDate}`
        if (endDate) apiUrl += `&endDate=${endDate}`
        break
        
      case 'products':
        // Get all available products to understand correct codes
        apiUrl = `${EU_API_BASE}/cereals/products`
        break
        
      case 'markets':
        apiUrl = `${EU_API_BASE}/cereals/markets`
        break
        
      case 'stages':
        apiUrl = `${EU_API_BASE}/cereals/stages`
        break
        
      case 'production':
        const memberStateCodesProduction = url.searchParams.get('memberStateCodes') || 'RO'
        const years = url.searchParams.get('years') || '2024'
        const crops = url.searchParams.get('crops') || ''
        
        apiUrl = `${EU_API_BASE}/cereals/production?memberStateCodes=${memberStateCodesProduction}&years=${years}`
        if (crops) apiUrl += `&crops=${crops}`
        break
        
      case 'test-single-product':
        // Test with a single known product for debugging
        const testProduct = url.searchParams.get('productCode') || 'commonWheat'
        const testBeginDate = url.searchParams.get('beginDate') || '01/01/2024'
        const testEndDate = url.searchParams.get('endDate') || '14/06/2025'
        
        apiUrl = `${EU_API_BASE}/cereals/prices?memberStateCodes=RO&productCodes=${testProduct}&beginDate=${testBeginDate}&endDate=${testEndDate}`
        break
        
      default:
        console.log('Invalid action parameter:', action)
        return new Response(
          JSON.stringify({ error: 'Invalid action parameter', availableActions: ['prices', 'products', 'markets', 'stages', 'production', 'test-single-product'] }),
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
      console.error('EU API error response:', errorText.substring(0, 500)) // Limit log size
      
      // Check if it's an HTML error page (Qlik Sense error)
      if (errorText.includes('<!doctype html>') || errorText.includes('<html>')) {
        return new Response(
          JSON.stringify({ 
            error: `EU API returned HTML error page (${response.status})`,
            details: 'This suggests invalid parameters or server-side rejection',
            suggestion: 'Check product codes, date format (DD/MM/YYYY), and member state codes'
          }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          error: `EU API error: ${response.status} - ${response.statusText}`,
          details: errorText.substring(0, 200)
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('EU API response received, data length:', Array.isArray(data) ? data.length : 'not array')
    
    // Log sample data for debugging (but limit size)
    if (Array.isArray(data) && data.length > 0) {
      console.log('Sample data:', JSON.stringify(data[0]).substring(0, 300))
    } else if (typeof data === 'object') {
      console.log('Non-array response:', JSON.stringify(data).substring(0, 300))
    }

    // Store prices in database if it's a prices request
    if (action === 'prices' && Array.isArray(data) && data.length > 0) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Transform and store data with better handling of missing fields
      const transformedData = data.map((item: any) => ({
        member_state_code: item.memberStateCode || item.memberState || 'RO',
        member_state_name: item.memberStateName || item.memberState || 'Romania',
        begin_date: item.beginDate || item.startDate,
        end_date: item.endDate || item.finishDate,
        reference_period: item.referencePeriod || item.date || item.beginDate,
        week_number: item.weekNumber || null,
        product_name: item.productName || item.product || 'Unknown',
        product_code: item.productCode || item.product || 'UNKNOWN',
        stage_name: item.stageName || item.stage || 'Unknown',
        stage_code: item.stageCode || item.stage || 'UNKNOWN',
        market_name: item.marketName || item.market || 'Unknown',
        market_code: item.marketCode || item.market || 'UNKNOWN',
        unit: item.unit || 'EUR/tonne',
        price: parseFloat(String(item.price || item.value || '0').replace(',', '.')),
        currency: 'EUR'
      }))

      console.log('Transformed data sample:', JSON.stringify(transformedData[0]).substring(0, 200))

      // Insert/update prices
      const { error } = await supabase
        .from('eu_market_prices')
        .upsert(transformedData, {
          onConflict: 'member_state_code,product_code,reference_period,market_code'
        })

      if (error) {
        console.error('Database error:', error)
      } else {
        console.log('Successfully stored', transformedData.length, 'price records')
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
