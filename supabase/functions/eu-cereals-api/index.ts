
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
    
    const EU_API_BASE = 'https://agridata.ec.europa.eu/extensions/DataPortal/API'
    
    let apiUrl: string
    
    switch (action) {
      case 'prices':
        const memberStateCodes = url.searchParams.get('memberStateCodes') || 'RO'
        const productCodes = url.searchParams.get('productCodes') || ''
        const stageCodes = url.searchParams.get('stageCodes') || ''
        const marketCodes = url.searchParams.get('marketCodes') || ''
        const beginDate = url.searchParams.get('beginDate') || ''
        const endDate = url.searchParams.get('endDate') || ''
        
        apiUrl = `${EU_API_BASE}/cereal/prices?memberStateCodes=${memberStateCodes}`
        if (productCodes) apiUrl += `&productCodes=${productCodes}`
        if (stageCodes) apiUrl += `&stageCodes=${stageCodes}`
        if (marketCodes) apiUrl += `&marketCodes=${marketCodes}`
        if (beginDate) apiUrl += `&beginDate=${beginDate}`
        if (endDate) apiUrl += `&endDate=${endDate}`
        break
        
      case 'products':
        apiUrl = `${EU_API_BASE}/cereal/products`
        break
        
      case 'markets':
        apiUrl = `${EU_API_BASE}/cereal/markets`
        break
        
      case 'stages':
        apiUrl = `${EU_API_BASE}/cereal/stages`
        break
        
      case 'production':
        const memberStateCodesProduction = url.searchParams.get('memberStateCodes') || 'RO'
        const years = url.searchParams.get('years') || '2024'
        const crops = url.searchParams.get('crops') || ''
        
        apiUrl = `${EU_API_BASE}/cereal/production?memberStateCodes=${memberStateCodesProduction}&years=${years}`
        if (crops) apiUrl += `&crops=${crops}`
        break
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    console.log('Fetching from EU API:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })

    if (!response.ok) {
      console.error('EU API error:', response.status, response.statusText)
      return new Response(
        JSON.stringify({ error: `EU API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('EU API response:', data)

    // Store prices in database if it's a prices request
    if (action === 'prices' && Array.isArray(data) && data.length > 0) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Transform and store data
      const transformedData = data.map((item: any) => ({
        member_state_code: item.memberStateCode,
        member_state_name: item.memberStateName,
        begin_date: item.beginDate,
        end_date: item.endDate,
        reference_period: item.referencePeriod,
        week_number: item.weekNumber,
        product_name: item.productName,
        product_code: item.productCode || 'UNKNOWN',
        stage_name: item.stageName,
        stage_code: item.stageCode || 'UNKNOWN',
        market_name: item.marketName,
        market_code: item.marketCode || 'UNKNOWN',
        unit: item.unit,
        price: parseFloat(item.price?.replace(',', '.') || '0'),
        currency: 'EUR'
      }))

      // Insert/update prices
      const { error } = await supabase
        .from('eu_market_prices')
        .upsert(transformedData, {
          onConflict: 'member_state_code,product_code,reference_period,market_code'
        })

      if (error) {
        console.error('Database error:', error)
      }
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
