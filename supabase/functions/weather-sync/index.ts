
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherDataPoint {
  user_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  temperature_celsius: number | null;
  precipitation_mm: number | null;
  relative_humidity_percent: number | null;
  wind_speed_kph: number | null;
  weather_code: number | null;
  data_type: 'forecast' | 'historical' | 'current';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, latitude, longitude, data_type, start_date, end_date, forecast_days } = await req.json()

    if (!user_id || !latitude || !longitude || !data_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let apiUrl: string
    let params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: 'temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m,weather_code',
      timezone: 'Europe/Bucharest'
    })

    if (data_type === 'forecast' || data_type === 'current') {
      apiUrl = 'https://api.open-meteo.com/v1/forecast'
      params.append('forecast_days', (forecast_days || 16).toString())
    } else if (data_type === 'historical') {
      apiUrl = 'https://archive-api.open-meteo.com/v1/archive'
      if (start_date && end_date) {
        params.append('start_date', start_date)
        params.append('end_date', end_date)
      }
    }

    console.log(`Fetching weather data from: ${apiUrl}?${params.toString()}`)

    const response = await fetch(`${apiUrl}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`)
    }

    const weatherData = await response.json()

    if (!weatherData.hourly) {
      throw new Error('Invalid weather data received')
    }

    // Process and store weather data
    const dataPoints: WeatherDataPoint[] = []
    const { time, temperature_2m, precipitation, relative_humidity_2m, wind_speed_10m, weather_code } = weatherData.hourly

    for (let i = 0; i < time.length; i++) {
      dataPoints.push({
        user_id,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timestamp: time[i],
        temperature_celsius: temperature_2m[i],
        precipitation_mm: precipitation[i],
        relative_humidity_percent: relative_humidity_2m[i],
        wind_speed_kph: wind_speed_10m[i],
        weather_code: weather_code[i],
        data_type
      })
    }

    // Insert data into database
    const { error } = await supabaseClient
      .from('weather_data')
      .insert(dataPoints)

    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Inserted ${dataPoints.length} weather data points`,
        data_points: dataPoints.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in weather-sync function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
