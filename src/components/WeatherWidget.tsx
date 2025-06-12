
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Calendar, History } from 'lucide-react';

const WeatherWidget = () => {
  const [activeTab, setActiveTab] = useState('current');

  const currentWeather = {
    temperature: 22,
    condition: 'Parțial înnorat',
    humidity: 65,
    windSpeed: 12,
    precipitation: 5
  };

  const forecast = [
    { day: 'Azi', temp: '22°', icon: Sun, condition: 'Însorit' },
    { day: 'Mâine', temp: '19°', icon: CloudRain, condition: 'Ploaie' },
    { day: 'Joi', temp: '24°', icon: Cloud, condition: 'Înnorat' },
    { day: 'Vineri', temp: '26°', icon: Sun, condition: 'Însorit' },
    { day: 'Sâmbătă', temp: '23°', icon: CloudRain, condition: 'Ploaie' },
  ];

  // Generate 14-day forecast
  const extendedForecast = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const icons = [Sun, Cloud, CloudRain];
    const conditions = ['Însorit', 'Înnorat', 'Ploaie'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = 22;
    const tempVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    
    return {
      date: date.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' }),
      temp: `${baseTemp + tempVariation}°`,
      icon: randomIcon,
      condition: randomCondition,
      humidity: 60 + Math.floor(Math.random() * 20),
      wind: 8 + Math.floor(Math.random() * 12)
    };
  });

  // Generate 365-day history (sample data)
  const weatherHistory = Array.from({ length: 365 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (365 - index));
    const baseTemp = 15;
    const seasonalVariation = 10 * Math.sin((index / 365) * 2 * Math.PI); // Seasonal pattern
    const randomVariation = Math.floor(Math.random() * 10) - 5;
    
    return {
      date: date.toLocaleDateString('ro-RO'),
      temperature: Math.round(baseTemp + seasonalVariation + randomVariation),
      humidity: 50 + Math.floor(Math.random() * 30),
      precipitation: Math.floor(Math.random() * 20)
    };
  });

  // Get recent history (last 30 days for display)
  const recentHistory = weatherHistory.slice(-30);

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vremea și Prognoze</span>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            Alertă Agricolă
          </Badge>
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
            {/* Current Weather */}
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

            {/* 5-day forecast */}
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
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="text-sm text-blue-100 mb-3">Ultimele 30 de zile (din 365 disponibile)</p>
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
                      {day.precipitation}%
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
          </TabsContent>
        </Tabs>

        {/* Agricultural Alert */}
        <div className="bg-amber-500/20 border border-amber-300/30 rounded-lg p-3">
          <p className="text-sm font-medium mb-1">🌾 Recomandare AI</p>
          <p className="text-sm text-blue-100">
            Condițiile sunt ideale pentru udarea grâului pe Parcela 3. Vântul scade după-amiaza.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
