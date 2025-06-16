import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Calendar, History, RefreshCw } from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useAppContext } from '@/contexts/AppContext';

const WeatherWidget = () => {
  const { fields } = useAppContext();
  const [activeTab, setActiveTab] = useState('current');
  
  console.log('WeatherWidget - Available fields:', fields);
  
  // Use coordinates from the first field as default
  const firstField = fields.find(field => field.coordinates);
  const latitude = firstField?.coordinates?.lat;
  const longitude = firstField?.coordinates?.lng;
  
  console.log('WeatherWidget - Using coordinates:', { latitude, longitude, fromField: firstField?.name });
  
  const { weatherData, loading, syncWeatherData, getWeatherDescription } = useWeatherData(latitude, longitude);

  // Auto-sync forecast data on component mount
  useEffect(() => {
    if (latitude && longitude && weatherData.forecast.length === 0) {
      syncWeatherData('forecast');
    }
  }, [latitude, longitude]);

  const getWeatherIcon = (weatherCode: number | null) => {
    if (!weatherCode) return Sun;
    
    if (weatherCode === 0) return Sun;
    if (weatherCode >= 1 && weatherCode <= 3) return Cloud;
    if (weatherCode >= 51 && weatherCode <= 99) return CloudRain;
    return Cloud;
  };

  const getCurrentWeather = () => {
    const current = weatherData.current;
    if (!current) return null;

    return {
      temperature: current.temperature_celsius || 0,
      condition: getWeatherDescription(current.weather_code),
      humidity: current.relative_humidity_percent || 0,
      windSpeed: current.wind_speed_kph || 0,
      precipitation: 0 // We'll calculate this from forecast
    };
  };

  const getDailyForecast = () => {
    const forecast = weatherData.forecast;
    if (!forecast.length) return [];

    // Group hourly data by day and get daily aggregates
    const dailyData = new Map();
    
    forecast.forEach(item => {
      const date = new Date(item.timestamp).toDateString();
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date,
          temperatures: [],
          conditions: [],
          weatherCodes: []
        });
      }
      
      const dayData = dailyData.get(date);
      if (item.temperature_celsius) dayData.temperatures.push(item.temperature_celsius);
      if (item.weather_code) dayData.weatherCodes.push(item.weather_code);
    });

    return Array.from(dailyData.values()).slice(0, 5).map(dayData => {
      const avgTemp = dayData.temperatures.length > 0 
        ? Math.round(dayData.temperatures.reduce((a: number, b: number) => a + b, 0) / dayData.temperatures.length)
        : 0;
      
      const mostCommonWeatherCode = dayData.weatherCodes.length > 0 
        ? dayData.weatherCodes.sort((a: number, b: number) => 
            dayData.weatherCodes.filter((v: number) => v === a).length - dayData.weatherCodes.filter((v: number) => v === b).length
          ).pop()
        : 0;

      const date = new Date(dayData.date);
      const dayName = date.toLocaleDateString('ro-RO', { weekday: 'short' });
      
      return {
        day: dayName,
        temp: `${avgTemp}°`,
        icon: getWeatherIcon(mostCommonWeatherCode),
        condition: getWeatherDescription(mostCommonWeatherCode)
      };
    });
  };

  const getExtendedForecast = () => {
    const forecast = weatherData.forecast;
    if (!forecast.length) return [];

    // Group by day for 14-day forecast
    const dailyData = new Map();
    
    forecast.forEach(item => {
      const date = new Date(item.timestamp).toDateString();
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date: item.timestamp,
          temperatures: [],
          humidity: [],
          windSpeed: [],
          weatherCodes: []
        });
      }
      
      const dayData = dailyData.get(date);
      if (item.temperature_celsius) dayData.temperatures.push(item.temperature_celsius);
      if (item.relative_humidity_percent) dayData.humidity.push(item.relative_humidity_percent);
      if (item.wind_speed_kph) dayData.windSpeed.push(item.wind_speed_kph);
      if (item.weather_code) dayData.weatherCodes.push(item.weather_code);
    });

    return Array.from(dailyData.values()).slice(0, 14).map(dayData => {
      const avgTemp = dayData.temperatures.length > 0 
        ? Math.round(dayData.temperatures.reduce((a: number, b: number) => a + b, 0) / dayData.temperatures.length)
        : 0;
      
      const avgHumidity = dayData.humidity.length > 0 
        ? Math.round(dayData.humidity.reduce((a: number, b: number) => a + b, 0) / dayData.humidity.length)
        : 0;

      const avgWind = dayData.windSpeed.length > 0 
        ? Math.round(dayData.windSpeed.reduce((a: number, b: number) => a + b, 0) / dayData.windSpeed.length)
        : 0;
      
      const mostCommonWeatherCode = dayData.weatherCodes.length > 0 
        ? dayData.weatherCodes.sort((a: number, b: number) => 
            dayData.weatherCodes.filter((v: number) => v === a).length - dayData.weatherCodes.filter((v: number) => v === b).length
          ).pop()
        : 0;

      const date = new Date(dayData.date);
      
      return {
        date: date.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' }),
        temp: `${avgTemp}°`,
        icon: getWeatherIcon(mostCommonWeatherCode),
        condition: getWeatherDescription(mostCommonWeatherCode),
        humidity: avgHumidity,
        wind: avgWind
      };
    });
  };

  const getRecentHistory = () => {
    const historical = weatherData.historical;
    if (!historical.length) return [];

    // Group by day for last 30 days
    const dailyData = new Map();
    
    historical.forEach(item => {
      const date = new Date(item.timestamp).toDateString();
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date: item.timestamp,
          temperatures: [],
          humidity: [],
          precipitation: []
        });
      }
      
      const dayData = dailyData.get(date);
      if (item.temperature_celsius) dayData.temperatures.push(item.temperature_celsius);
      if (item.relative_humidity_percent) dayData.humidity.push(item.relative_humidity_percent);
      if (item.precipitation_mm) dayData.precipitation.push(item.precipitation_mm);
    });

    return Array.from(dailyData.values()).slice(-30).map(dayData => {
      const avgTemp = dayData.temperatures.length > 0 
        ? Math.round(dayData.temperatures.reduce((a: number, b: number) => a + b, 0) / dayData.temperatures.length)
        : 0;
      
      const avgHumidity = dayData.humidity.length > 0 
        ? Math.round(dayData.humidity.reduce((a: number, b: number) => a + b, 0) / dayData.humidity.length)
        : 0;

      const totalPrecipitation = dayData.precipitation.length > 0 
        ? Math.round(dayData.precipitation.reduce((a: number, b: number) => a + b, 0))
        : 0;

      const date = new Date(dayData.date);
      
      return {
        date: date.toLocaleDateString('ro-RO'),
        temperature: avgTemp,
        humidity: avgHumidity,
        precipitation: totalPrecipitation
      };
    });
  };

  const currentWeather = getCurrentWeather();
  const forecast = getDailyForecast();
  const extendedForecast = getExtendedForecast();
  const recentHistory = getRecentHistory();

  if (!latitude || !longitude) {
    console.log('WeatherWidget - No coordinates available from fields');
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <p className="text-center text-blue-100">
            {fields.length === 0 
              ? "Adăugați un teren pentru a vedea datele meteo"
              : "Adăugați coordonate GPS la terenuri pentru a vedea datele meteo"
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vremea și Prognoze</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => syncWeatherData('forecast')}
              disabled={loading}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {currentWeather ? 'Actualizat' : 'Fără date'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="current" className="text-white data-[state=active]:bg-white/20">
              Actuală
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-white data-[state=active]:bg-white/20">
              <Calendar className="h-4 w-4 mr-1" />
              14 Zile
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white data-[state=active]:bg-white/20">
              <History className="h-4 w-4 mr-1" />
              Istoric
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {currentWeather ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Sun className="h-12 w-12" />
                    <div>
                      <p className="text-3xl font-bold">{currentWeather.temperature}°C</p>
                      <p className="text-blue-100">{currentWeather.condition}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Droplets className="h-4 w-4 mb-1" />
                      <span className="text-sm">{currentWeather.humidity}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wind className="h-4 w-4 mb-1" />
                      <span className="text-sm">{currentWeather.windSpeed} km/h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CloudRain className="h-4 w-4 mb-1" />
                      <span className="text-sm">{currentWeather.precipitation}%</span>
                    </div>
                  </div>
                </div>

                {forecast.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {forecast.map((day, index) => {
                      const IconComponent = day.icon;
                      return (
                        <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                          <p className="text-xs mb-2">{day.day}</p>
                          <IconComponent className="h-5 w-5 mx-auto mb-2" />
                          <p className="text-sm font-semibold">{day.temp}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-100 mb-4">Nu sunt disponibile date meteo curente</p>
                <Button 
                  onClick={() => syncWeatherData('forecast')}
                  disabled={loading}
                  className="bg-white/20 text-white hover:bg-white/30"
                >
                  {loading ? 'Se încarcă...' : 'Actualizează datele'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            {extendedForecast.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {extendedForecast.map((day, index) => {
                  const IconComponent = day.icon;
                  return (
                    <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">{day.date}</p>
                          <p className="text-xs text-blue-100">{day.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{day.temp}</p>
                        <div className="flex space-x-3 text-xs">
                          <span>{day.humidity}%</span>
                          <span>{day.wind} km/h</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-100 mb-4">Nu sunt disponibile prognoze</p>
                <Button 
                  onClick={() => syncWeatherData('forecast')}
                  disabled={loading}
                  className="bg-white/20 text-white hover:bg-white/30"
                >
                  {loading ? 'Se încarcă...' : 'Descarcă prognoza'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {recentHistory.length > 0 ? (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <p className="text-sm text-blue-100 mb-3">Ultimele 30 de zile</p>
                  {recentHistory.map((day, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{day.date}</p>
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <span className="flex items-center">
                          <Thermometer className="h-3 w-3 mr-1" />
                          {day.temperature}°C
                        </span>
                        <span className="flex items-center">
                          <Droplets className="h-3 w-3 mr-1" />
                          {day.humidity}%
                        </span>
                        <span className="flex items-center">
                          <CloudRain className="h-3 w-3 mr-1" />
                          {day.precipitation}mm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-100">
                    Istoricul complet de 365 zile este disponibil pentru analiză detaliată
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-100 mb-4">Nu sunt disponibile date istorice</p>
                <Button 
                  onClick={() => {
                    const endDate = new Date().toISOString().split('T')[0];
                    const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    syncWeatherData('historical', { startDate, endDate });
                  }}
                  disabled={loading}
                  className="bg-white/20 text-white hover:bg-white/30"
                >
                  {loading ? 'Se încarcă...' : 'Descarcă istoricul (365 zile)'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* AI Recommendation */}
        <div className="bg-amber-500/20 border border-amber-300/30 rounded-lg p-3">
          <p className="text-sm font-medium mb-1">🌾 Recomandare AI</p>
          <p className="text-sm text-blue-100">
            {currentWeather ? 
              `Cu ${currentWeather.temperature}°C și ${currentWeather.humidity}% umiditate, condițiile sunt potrivite pentru lucrările agricole.` :
              'Sincronizați datele meteo pentru recomandări personalizate AI.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
