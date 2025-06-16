import React from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import WeatherWidget from '@/components/WeatherWidget';
import VisualCropJournal from '@/components/VisualCropJournal';
import AddPhotoDialog from '@/components/AddPhotoDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';

const FieldDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { fields, tasks, fieldPhotos } = useAppContext();
  
  const field = fields.find(f => f.id === id);
  const fieldTasks = tasks.filter(task => task.field_name === field?.name);
  const fieldTasksToday = fieldTasks.filter(task => {
    const taskDate = task.due_date || task.date;
    return taskDate === new Date().toISOString().split('T')[0];
  });

  const photos = fieldPhotos.filter(photo => photo.field_id === id);

  if (!field) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Teren nu a fost găsit</h1>
            <p className="text-gray-600">Terenul solicitat nu există.</p>
          </div>
        </div>
      </div>
    );
  }

  // Parse coordinates safely
  let coordinates = null;
  try {
    if (typeof field.coordinates === 'string') {
      coordinates = JSON.parse(field.coordinates);
    } else if (typeof field.coordinates === 'object' && field.coordinates !== null) {
      coordinates = field.coordinates;
    }
  } catch (error) {
    console.error('Error parsing coordinates:', error);
  }

  const hasCoordinates = coordinates && typeof coordinates === 'object' && 'lat' in coordinates && 'lng' in coordinates;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-800">{field.name}</h1>
              <p className="text-green-600">Cod Parcelă: {field.parcel_code}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant={field.status === 'activ' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {field.status}
              </Badge>
              <AddPhotoDialog fieldId={field.id} />
            </div>
          </div>
        </div>

        {/* Field Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Field Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Detalii Teren</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Suprafață</Label>
                    <p className="text-lg font-semibold">{field.size} ha</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Cultură</Label>
                    <p className="text-lg font-semibold">{field.crop}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Varietate</Label>
                    <p className="text-lg font-semibold">{field.variety || 'Nespecificată'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Tip Lucrare</Label>
                    <p className="text-lg font-semibold">{field.work_type || 'Nespecificat'}</p>
                  </div>
                </div>
                
                {field.planting_date && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data Plantării</Label>
                    <p className="text-lg font-semibold">{new Date(field.planting_date).toLocaleDateString('ro-RO')}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Locație</Label>
                  <p className="text-lg font-semibold">{field.location}</p>
                  {hasCoordinates && (
                    <p className="text-sm text-gray-500">
                      Coordonate: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200 mt-6">
              <CardHeader>
                <CardTitle className="text-green-800">Sarcini pentru Acest Teren</CardTitle>
              </CardHeader>
              <CardContent>
                {fieldTasksToday.length > 0 ? (
                  <div className="space-y-3">
                    {fieldTasksToday.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nu există sarcini programate pentru astăzi</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Statistici Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sarcini Active</span>
                    <span className="font-semibold">{fieldTasks.filter(t => t.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fotografii</span>
                    <span className="font-semibold">{photos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Productivitate</span>
                    <span className="font-semibold">{field.productivity || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Widget */}
            <WeatherWidget />
          </div>
        </div>

        {/* Visual Crop Journal */}
        <VisualCropJournal fieldId={field.id} />
      </div>
    </div>
  );
};

export default FieldDetails;
