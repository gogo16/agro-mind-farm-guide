
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Calendar, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeatherDataPoint {
  time: string;
  temperature_2m: number;
  precipitation: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
}

interface WeatherResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    weather_code: number[];
  };
}

const WeatherWidget = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('current');
  const [weatherData, setWeatherData] = useState<WeatherDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Romanian coordinates (Craiova region as example)
  const ROMANIA_LAT = 44.5642;
  const ROMANIA_LNG = 23.8822;

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${ROMANIA_LAT}&longitude=${ROMANIA_LNG}&hourly=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m,weather_code&forecast_days=16&timezone=Europe%2FBucharest`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data: WeatherResponse = await response.json();
      
      // Convert API response to our format
      const processedData: WeatherDataPoint[] = data.hourly.time.map((time, index) => ({
        time,
        temperature_2m: data.hourly.temperature_2m[index],
        precipitation: data.hourly.precipitation[index],
        relative_humidity_2m: data.hourly.relative_humidity_2m[index],
        wind_speed_10m: data.hourly.wind_speed_10m[index],
        weather_code: data.hourly.weather_code[index]
      }));
      
      setWeatherData(processedData);
      
      toast({
        title: "Date meteo actualizate",
        description: `Prognoză pe 16 zile încărcată cu succes pentru România.`,
      });
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast({
        title: "Eroare weather",
        description: "Nu s-au putut încărca datele meteo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode === 0) return Sun;
    if (weatherCode >= 1 && weatherCode <= 3) return Cloud;
    if (weatherCode >= 51 && weatherCode <= 99) return CloudRain;
    return Cloud;
  };

  const getWeatherDescription = (weatherCode: number): string => {
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

  const getCurrentWeather = () => {
    if (!weatherData.length) return null;
    return weatherData[0]; // First entry is current weather
  };

  const getDailyForecast = () => {
    if (!weatherData.length) return [];

    // Group by day and get daily averages
    const dailyData = new Map();
    
    weatherData.forEach(item => {
      const date = new Date(item.time);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          date: dateKey,
          dateObj: date,
          temperatures: [],
          weatherCodes: []
        });
      }
      
      const dayData = dailyData.get(dateKey);
      dayData.temperatures.push(item.temperature_2m);
      dayData.weatherCodes.push(item.weather_code);
    });

    return Array.from(dailyData.values())
      .slice(0, 16) // Show 16 days
      .map(dayData => {
        const avgTemp = Math.round(dayData.temperatures.reduce((a: number, b: number) => a + b, 0) / dayData.temperatures.length);
        const mostCommonWeatherCode = dayData.weatherCodes[0]; // Simplified

        const dayName = dayData.dateObj.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric' });
        
        return {
          day: dayName,
          temp: `${avgTemp}°`,
          icon: getWeatherIcon(mostCommonWeatherCode),
          condition: getWeatherDescription(mostCommonWeatherCode)
        };
      });
  };

  const currentWeather = getCurrentWeather();
  const forecast = getDailyForecast();

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vremea și Prognoze</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchWeatherData}
              disabled={loading}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              România
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="current" className="text-white data-[state=active]:bg-white/20">
              Actuală
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-white data-[state=active]:bg-white/20">
              <Calendar className="h-4 w-4 mr-1" />
              16 Zile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {currentWeather ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Sun className="h-12 w-12" />
                    <div>
                      <p className="text-3xl font-bold">{Math.round(currentWeather.temperature_2m)}°C</p>
                      <p className="text-blue-100">{getWeatherDescription(currentWeather.weather_code)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Droplets className="h-4 w-4 mb-1" />
                      <span className="text-sm">{currentWeather.relative_humidity_2m}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wind className="h-4 w-4 mb-1" />
                      <span className="text-sm">{Math.round(currentWeather.wind_speed_10m)} km/h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CloudRain className="h-4 w-4 mb-1" />
                      <span className="text-sm">{currentWeather.precipitation}mm</span>
                    </div>
                  </div>
                </div>

                {/* Show 7-day forecast */}
                {forecast.length > 0 && (
                  <div className="grid grid-cols-7 gap-1">
                    {forecast.slice(0, 7).map((day, index) => {
                      const Icon = day.icon;
                      return (
                        <div key={index} className="bg-white/10 rounded-lg p-2 text-center">
                          <p className="text-xs mb-1">{day.day}</p>
                          <Icon className="h-4 w-4 mx-auto mb-1" />
                          <p className="text-xs font-semibold">{day.temp}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-100 mb-4">Se încarcă datele meteo...</p>
                <Button 
                  onClick={fetchWeatherData}
                  disabled={loading}
                  className="bg-white/20 text-white hover:bg-white/30"
                >
                  {loading ? 'Se încarcă...' : 'Reîncarcă datele'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            {forecast.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-sm text-blue-100 mb-3">Prognoza pe 16 zile</p>
                {forecast.map((day, index) => {
                  const Icon = day.icon;
                  return (
                    <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">{day.day}</p>
                          <p className="text-xs text-blue-100">{day.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{day.temp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-100 mb-4">Nu sunt disponibile prognoze</p>
                <Button 
                  onClick={fetchWeatherData}
                  disabled={loading}
                  className="bg-white/20 text-white hover:bg-white/30"
                >
                  {loading ? 'Se încarcă...' : 'Descarcă prognoza'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* AI Recommendation */}
        <div className="bg-amber-500/20 border border-amber-300/30 rounded-lg p-3">
          <p className="text-sm font-medium mb-1">🌾 Recomandare AI</p>
          <p className="text-sm text-blue-100">
            Condițiile meteo sunt monitorizate pentru România. Prognoza pe 16 zile este disponibilă.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
