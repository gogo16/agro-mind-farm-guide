
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sprout, Calendar, MapPin, Trash2, Sun, CloudRain, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import TaskBadges from './TaskBadges';

interface FieldCardProps {
  field: any;
}

const FieldCard = ({ field }: FieldCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteField, tasks } = useAppContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excelent</Badge>;
      case 'healthy':
        return null;
      case 'attention':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Atenție</Badge>;
      default:
        return null;
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-gray-500" />;
      default:
        return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleDeleteField = (fieldId: number, fieldName: string) => {
    deleteField(fieldId);
    toast({
      title: "Teren șters",
      description: `Terenul "${fieldName}" a fost șters cu succes.`
    });
    setIsDeleting(false);
  };

  return (
    <Card className="bg-white border-green-200 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-green-800">{field.name}</CardTitle>
            <p className="text-sm text-green-600 font-medium">{field.parcelCode}</p>
          </div>
          <div className="flex items-center space-x-2">
            <TaskBadges fieldName={field.name} tasks={tasks} />
            {getStatusBadge(field.status)}
          </div>
        </div>
        <p className="text-sm text-gray-600">{field.size} ha</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Sprout className="h-4 w-4 text-green-600" />
            <span className="text-sm">{field.crop}</span>
          </div>
          {field.plantingDate && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Plantat: {field.plantingDate}</span>
            </div>
          )}
          {field.coordinates && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm">{field.coordinates.lat}, {field.coordinates.lng}</span>
            </div>
          )}
        </div>

        {/* Weather Information Section */}
        <div className="border-t pt-3">
          <p className="text-xs text-gray-500 mb-2">Condiții meteo:</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getWeatherIcon(field.weather?.condition || 'sunny')}
              <span className="text-sm font-medium">
                {field.weather?.temperature || '22'}°C
              </span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Umiditate: {field.weather?.humidity || '65'}%</div>
              <div>Vânt: {field.weather?.windSpeed || '12'} km/h</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Actualizat: {field.weather?.lastUpdated || 'acum 30 min'}
          </div>
        </div>

        {field.costs && (
          <div className="border-t pt-3">
            <p className="text-xs text-gray-500 mb-1">Costuri:</p>
            <p className="text-sm font-medium">{field.costs.toLocaleString()} RON</p>
            {field.roi && (
              <>
                <p className="text-xs text-gray-500 mt-2 mb-1">ROI:</p>
                <p className="text-sm font-medium text-green-600">{field.roi}%</p>
              </>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate('/map')}>
            Vezi pe hartă
          </Button>
          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => navigate(`/field/${field.id}`)}>
            Detalii
          </Button>
          <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                <AlertDialogDescription>
                  Ești sigur că vrei să ștergi terenul <strong>"{field.name}"</strong>?
                  Această acțiune nu poate fi anulată.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleting(false)}>
                  Anulează
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteField(field.id, field.name)} className="bg-red-600 hover:bg-red-700">
                  Șterge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldCard;
