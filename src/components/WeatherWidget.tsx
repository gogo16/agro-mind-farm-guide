
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
  console.log('WeatherWidget - Fields with coordinates:', fields.filter(f => f.coordinates));
  
  // Use coordinates from the first field with valid simple coordinates
  const firstFieldWithCoords = fields.find(field => 
    field.coordinates && 
    typeof field.coordinates === 'object' &&
    typeof field.coordinates.lat === 'number' && 
    typeof field.coordinates.lng === 'number' &&
    !isNaN(field.coordinates.lat) && 
    !isNaN(field.coordinates.lng)
  );
  
  const latitude = firstFieldWithCoords?.coordinates?.lat;
  const longitude = firstFieldWithCoords?.coordinates?.lng;
  
  console.log('WeatherWidget - Using coordinates:', { 
    latitude, 
    longitude, 
    fromField: firstFieldWithCoords?.name,
    totalFields: fields.length,
    fieldsWithCoords: fields.filter(f => f.coordinates).length
  });
  
  const { weatherData, loading, syncWeatherData, getWeatherDescription } = useWeatherData(latitude, longitude);

  // Auto-sync forecast data on component mount (only if no data exists)
  useEffect(() => {
    if (latitude && longitude && weatherData.forecast.length === 0 && weatherData.current === null) {
      console.log('Auto-syncing weather data for coordinates:', { latitude, longitude });
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
    console.log('WeatherWidget - No valid coordinates available from fields');
    const fieldsWithCoordinates = fields.filter(f => f.coordinates);
    const totalFields = fields.length;
    
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="text-center text-blue-100">
            {totalFields === 0 ? (
              <p>Adăugați un teren pentru a vedea datele meteo</p>
            ) : fieldsWithCoordinates.length === 0 ? (
              <div>
                <p className="mb-2">Aveți {totalFields} terenuri dar niciunul nu are coordonate GPS</p>
                <p className="text-sm">Editați terenurile și adăugați coordonate GPS pentru a vedea datele meteo</p>
              </div>
            ) : (
              <div>
                <p className="mb-2">Coordonate GPS detectate dar nevalide</p>
                <p className="text-sm">Verificați formatul coordonatelor GPS ale terenurilor</p>
              </div>
            )}
          </div>
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
              onClick={() => {
                console.log('Manual weather sync requested for coordinates:', { latitude, longitude });
                syncWeatherData('forecast');
              }}
              disabled={loading}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {firstFieldWithCoords?.name || 'Coordonate nevalide'}
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
            {weatherData.current || weatherData.forecast.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Sun className="h-12 w-12" />
                    <div>
                      <p className="text-3xl font-bold">
                        {weatherData.current?.temperature_celsius || 
                         (weatherData.forecast[0]?.temperature_celsius ? Math.round(weatherData.forecast[0].temperature_celsius) : 22)}°C
                      </p>
                      <p className="text-blue-100">
                        {getWeatherDescription(weatherData.current?.weather_code || weatherData.forecast[0]?.weather_code || 0)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Droplets className="h-4 w-4 mb-1" />
                      <span className="text-sm">
                        {weatherData.current?.relative_humidity_percent || 
                         weatherData.forecast[0]?.relative_humidity_percent || 65}%
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wind className="h-4 w-4 mb-1" />
                      <span className="text-sm">
                        {weatherData.current?.wind_speed_kph || 
                         weatherData.forecast[0]?.wind_speed_kph || 12} km/h
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CloudRain className="h-4 w-4 mb-1" />
                      <span className="text-sm">
                        {weatherData.current?.precipitation_mm || 
                         weatherData.forecast[0]?.precipitation_mm || 0}mm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Show basic 5-day forecast if available */}
                {weatherData.forecast.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {weatherData.forecast.slice(0, 5).map((item, index) => {
                      const date = new Date(item.timestamp);
                      const dayName = date.toLocaleDateString('ro-RO', { weekday: 'short' });
                      
                      return (
                        <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                          <p className="text-xs mb-2">{dayName}</p>
                          <Sun className="h-5 w-5 mx-auto mb-2" />
                          <p className="text-sm font-semibold">
                            {item.temperature_celsius ? Math.round(item.temperature_celsius) : '--'}°
                          </p>
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
            {weatherData.forecast.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {weatherData.forecast.slice(0, 14).map((item, index) => {
                  const date = new Date(item.timestamp);
                  const dateStr = date.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' });
                  
                  return (
                    <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Sun className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">{dateStr}</p>
                          <p className="text-xs text-blue-100">
                            {getWeatherDescription(item.weather_code)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {item.temperature_celsius ? Math.round(item.temperature_celsius) : '--'}°
                        </p>
                        <div className="flex space-x-3 text-xs">
                          <span>{item.relative_humidity_percent || '--'}%</span>
                          <span>{item.wind_speed_kph || '--'} km/h</span>
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
            {weatherData.historical.length > 0 ? (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <p className="text-sm text-blue-100 mb-3">Ultimele 30 de zile</p>
                  {weatherData.historical.slice(-30).map((item, index) => {
                    const date = new Date(item.timestamp);
                    const dateStr = date.toLocaleDateString('ro-RO');
                    
                    return (
                      <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{dateStr}</p>
                        </div>
                        <div className="flex space-x-4 text-sm">
                          <span className="flex items-center">
                            <Thermometer className="h-3 w-3 mr-1" />
                            {item.temperature_celsius ? Math.round(item.temperature_celsius) : '--'}°C
                          </span>
                          <span className="flex items-center">
                            <Droplets className="h-3 w-3 mr-1" />
                            {item.relative_humidity_percent || '--'}%
                          </span>
                          <span className="flex items-center">
                            <CloudRain className="h-3 w-3 mr-1" />
                            {item.precipitation_mm || 0}mm
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
            {weatherData.current || weatherData.forecast.length > 0 ? 
              `Condițiile meteo sunt monitorizate pentru terenul ${firstFieldWithCoords?.name}.` :
              'Sincronizați datele meteo pentru recomandări personalizate AI.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
