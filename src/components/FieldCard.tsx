
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Thermometer, Droplets, Wind, Edit, Eye, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, Field } from '@/contexts/AppContext';
import { useWeatherData } from '@/hooks/useWeatherData';
import EditFieldDialog from './EditFieldDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FieldCardProps {
  field: Field;
}

const FieldCard = ({ field }: FieldCardProps) => {
  const navigate = useNavigate();
  const { deleteField } = useAppContext();
  const [isEditingField, setIsEditingField] = useState(false);
  const { weatherData, getWeatherDescription } = useWeatherData(
    field.coordinates?.lat,
    field.coordinates?.lng
  );

  const handleDelete = () => {
    if (window.confirm('Sigur doriți să ștergeți acest teren?')) {
      deleteField(field.id);
    }
  };

  const handleViewDetails = () => {
    navigate(`/field/${field.id}`);
  };

  // Get current weather from latest data
  const currentWeather = weatherData.current;
  const todayForecast = weatherData.forecast.find(item => {
    const itemDate = new Date(item.timestamp).toDateString();
    const today = new Date().toDateString();
    return itemDate === today;
  });

  const weatherToShow = currentWeather || todayForecast;

  return (
    <Card className="hover:shadow-lg transition-shadow border-green-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-green-800">
          {field.name}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye className="mr-2 h-4 w-4" />
              Vezi detalii
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault();
              setIsEditingField(true);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Editează
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Șterge
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Field Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {field.location}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Suprafață:</span>
            <Badge variant="secondary">{field.area} ha</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cultură:</span>
            <Badge variant="outline">{field.crop}</Badge>
          </div>
        </div>

        {/* Weather Info */}
        {weatherToShow ? (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Vremea Actuală</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-sm">
                  {weatherToShow.temperature_celsius ? `${Math.round(weatherToShow.temperature_celsius)}°C` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  {weatherToShow.relative_humidity_percent ? `${weatherToShow.relative_humidity_percent}%` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {weatherToShow.wind_speed_kph ? `${Math.round(weatherToShow.wind_speed_kph)} km/h` : 'N/A'}
                </span>
              </div>
              <div className="text-xs text-gray-600 col-span-2">
                {getWeatherDescription(weatherToShow.weather_code)}
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t pt-4">
            <div className="text-sm text-gray-500 text-center py-2">
              Date meteo indisponibile
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button 
            onClick={handleViewDetails}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Vezi Detalii
          </Button>
        </div>
      </CardContent>

      <EditFieldDialog 
        field={field} 
        isOpen={isEditingField} 
        onOpenChange={setIsEditingField} 
        trigger={<></>} 
      />
    </Card>
  );
};

export default FieldCard;
