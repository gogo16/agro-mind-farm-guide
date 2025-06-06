
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

const WeatherWidget = () => {
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

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vremea astăzi</span>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            Alertă Agricolă
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
