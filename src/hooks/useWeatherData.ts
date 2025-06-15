
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WeatherData {
  id: string;
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
  extraction_datetime: string;
  created_at: string;
}

export interface ProcessedWeatherData {
  current: WeatherData | null;
  forecast: WeatherData[];
  historical: WeatherData[];
}

export function useWeatherData(latitude?: number, longitude?: number) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData>({
    current: null,
    forecast: [],
    historical: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && latitude && longitude) {
      fetchWeatherData();
    }
  }, [user, latitude, longitude]);

  const fetchWeatherData = async () => {
    if (!user || !latitude || !longitude) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('latitude', latitude)
        .eq('longitude', longitude)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching weather data:', error);
        return;
      }

      // Process and categorize the data
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Type assertion to ensure data_type is properly typed
      const typedData = data as WeatherData[];

      const current = typedData.find(item => 
        item.data_type === 'current' || 
        (item.data_type === 'forecast' && new Date(item.timestamp) <= now && new Date(item.timestamp) >= twentyFourHoursAgo)
      ) || null;

      const forecast = typedData
        .filter(item => item.data_type === 'forecast' && new Date(item.timestamp) > now)
        .slice(0, 16 * 24); // Max 16 days of hourly data

      const historical = typedData
        .filter(item => item.data_type === 'historical')
        .slice(0, 365 * 24); // Max 365 days of hourly data

      setWeatherData({ current, forecast, historical });
    } catch (error) {
      console.error('Error in fetchWeatherData:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncWeatherData = async (dataType: 'forecast' | 'historical' | 'current', options?: {
    startDate?: string;
    endDate?: string;
    forecastDays?: number;
  }) => {
    if (!user || !latitude || !longitude) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('weather-sync', {
        body: {
          user_id: user.id,
          latitude,
          longitude,
          data_type: dataType,
          start_date: options?.startDate,
          end_date: options?.endDate,
          forecast_days: options?.forecastDays || 16
        }
      });

      if (error) {
        console.error('Error syncing weather data:', error);
        toast({
          title: "Eroare la sincronizarea datelor meteo",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Date meteo actualizate",
        description: `${data.data_points} puncte de date au fost sincronizate cu succes.`
      });

      // Refresh local data
      await fetchWeatherData();
    } catch (error) {
      console.error('Error in syncWeatherData:', error);
      toast({
        title: "Eroare la sincronizarea datelor meteo",
        description: "A apărut o eroare neașteptată.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (weatherCode: number | null): string => {
    if (!weatherCode) return 'Necunoscut';
    
    const weatherCodes: Record<number, string> = {
      0: 'Cer senin',
      1: 'Parțial înnorat',
      2: 'Parțial înnorat',
      3: 'Înnorat',
      45: 'Ceață',
      48: 'Ceață cu gheață',
      51: 'Burniță ușoară',
      53: 'Burniță moderată',
      55: 'Burniță densă',
      61: 'Ploaie ușoară',
      63: 'Ploaie moderată',
      65: 'Ploaie torențială',
      71: 'Ninsoare ușoară',
      73: 'Ninsoare moderată',
      75: 'Ninsoare abundentă',
      95: 'Furtună',
      96: 'Furtună cu grindină',
      99: 'Furtună severă cu grindină'
    };

    return weatherCodes[weatherCode] || 'Condiții meteo necunoscute';
  };

  return {
    weatherData,
    loading,
    syncWeatherData,
    getWeatherDescription,
    refetch: fetchWeatherData
  };
}
