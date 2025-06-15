
import { supabase } from '@/integrations/supabase/client';

export interface SyncOptions {
  userId: string;
  latitude: number;
  longitude: number;
  dataType: 'forecast' | 'historical' | 'current';
  startDate?: string;
  endDate?: string;
  forecastDays?: number;
}

export class WeatherSyncService {
  static async syncForUser(userId: string, coordinates: { lat: number; lng: number }) {
    try {
      // Sync current forecast
      await this.syncWeatherData({
        userId,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        dataType: 'forecast',
        forecastDays: 16
      });

      // Check if we have historical data for this user/location
      const { data: existingHistorical } = await supabase
        .from('weather_data')
        .select('id')
        .eq('user_id', userId)
        .eq('latitude', coordinates.lat)
        .eq('longitude', coordinates.lng)
        .eq('data_type', 'historical')
        .limit(1);

      // If no historical data exists, fetch last 365 days
      if (!existingHistorical || existingHistorical.length === 0) {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        await this.syncWeatherData({
          userId,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          dataType: 'historical',
          startDate,
          endDate
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error in syncForUser:', error);
      return { success: false, error };
    }
  }

  static async syncWeatherData(options: SyncOptions) {
    const { data, error } = await supabase.functions.invoke('weather-sync', {
      body: {
        user_id: options.userId,
        latitude: options.latitude,
        longitude: options.longitude,
        data_type: options.dataType,
        start_date: options.startDate,
        end_date: options.endDate,
        forecast_days: options.forecastDays || 16
      }
    });

    if (error) {
      throw error;
    }

    return data;
  }

  static async setupDailySync() {
    // This would be called to set up cron jobs for daily syncing
    // For now, we'll implement manual syncing
    console.log('Daily sync setup would be implemented here');
  }
}
