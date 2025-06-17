
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Sprout, Calendar, ArrowLeft, Edit, History, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import VisualCropJournal from '@/components/VisualCropJournal';
import EditFieldDialog from '@/components/EditFieldDialog';
import AddPhotoDialog from '@/components/AddPhotoDialog';
import SoilSection from '@/components/SoilSection';
import { useAppContext } from '@/contexts/AppContext';

const FieldDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fields, tasks } = useAppContext();
  const [isEditingField, setIsEditingField] = useState(false);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  const field = id ? fields.find(f => f.id === id) : null;

  // Get completed tasks for this field
  const completedActivities = tasks.filter(task => 
    task.field_name === field?.name && task.status === 'completed'
  ).map(task => ({
    id: task.id,
    date: task.due_date || new Date().toISOString().split('T')[0],
    activity: task.title,
    details: task.description || 'Activitate completată',
    cost: 0,
    weather: 'N/A'
  }));

  // Get the last completed task for work type
  const lastCompletedTask = tasks
    .filter(task => task.field_name === field?.name && task.status === 'completed')
    .sort((a, b) => new Date(b.due_date || b.date).getTime() - new Date(a.due_date || a.date).getTime())[0];

  if (!field) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Parcela nu a fost găsită</h1>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              Înapoi la Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure field.size is always treated as a number
  const fieldSize = Number(field.size);

  // Calculate basic progress (simplified without AI)
  const plantingDate = field.planting_date ? new Date(field.planting_date) : null;
  const harvestDate = field.harvest_date ? new Date(field.harvest_date) : null;
  const today = new Date();

  let developmentProgress = 50; // Default
  let daysToHarvest = 60; // Default

  if (plantingDate && harvestDate) {
    const totalDays = Math.floor((harvestDate.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    daysToHarvest = Math.floor((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    developmentProgress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
    daysToHarvest = Math.max(0, daysToHarvest);
  }

  // Simple field status
  let fieldStatus = 'Activ';
  let statusColor = 'green';
  if (plantingDate && harvestDate) {
    if (today < plantingDate) {
      fieldStatus = 'Pregătire';
      statusColor = 'blue';
    } else if (today > harvestDate) {
      fieldStatus = 'Recoltat';
      statusColor = 'gray';
    } else {
      fieldStatus = 'În dezvoltare';
      statusColor = 'green';
    }
  }

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-green-700 hover:text-green-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-green-800">{field.name}</h1>
              <p className="text-green-600">{field.crop} • {fieldSize} ha • {field.parcel_code}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <AddPhotoDialog 
              fieldId={field.id} 
              isOpen={isAddingPhoto} 
              onOpenChange={setIsAddingPhoto} 
              trigger={
                <Button variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Adaugă poză
                </Button>
              } 
            />
            <EditFieldDialog 
              field={field} 
              isOpen={isEditingField} 
              onOpenChange={setIsEditingField} 
              trigger={
                <Button className="bg-green-600 hover:bg-green-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Editează
                </Button>
              } 
            />
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sprout className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Cultură</span>
              </div>
              <p className="text-lg font-bold text-green-800">{field.crop}</p>
              <p className="text-sm text-gray-600">{field.parcel_code}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Suprafață</span>
              </div>
              <p className="text-lg font-bold text-green-800">{fieldSize} ha</p>
              <p className="text-sm text-gray-600">{field.coordinates ? `${(field.coordinates as any).lat}, ${(field.coordinates as any).lng}` : 'N/A'}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Plantat</span>
              </div>
              <p className="text-lg font-bold text-green-800">{field.planting_date || 'N/A'}</p>
              <p className="text-sm text-gray-600">Data însămânțare</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-5 h-5 rounded-full ${statusColor === 'green' ? 'bg-green-500' : statusColor === 'yellow' ? 'bg-yellow-500' : statusColor === 'red' ? 'bg-red-500' : statusColor === 'blue' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <Badge className={getStatusColor(statusColor)}>{fieldStatus}</Badge>
              <p className="text-sm text-gray-600 mt-1">Monitorizare continuă</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[480px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Prezentare</TabsTrigger>
            <TabsTrigger value="activities">Istoric Activități</TabsTrigger>
            <TabsTrigger value="journal">Jurnal Foto</TabsTrigger>
            <TabsTrigger value="soil">Sol</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Informații Generale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Cod parcelă</p>
                      <p className="font-medium">{field.parcel_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tip lucrare</p>
                      <p className="font-medium">{lastCompletedTask?.title || field.work_type || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Istoric îngrășăminte/chimicale</p>
                      <p className="font-medium">{field.inputs || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Progres Sezon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progres dezvoltare</span>
                        <span>{Math.round(developmentProgress)}%</span>
                      </div>
                      <Progress value={developmentProgress} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Zile până la recoltare</span>
                        <span>{daysToHarvest} zile</span>
                      </div>
                      <Progress 
                        value={Math.max(0, 100 - (daysToHarvest / 120) * 100)} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-800 flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Istoric Activități</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedActivities.length > 0 ? completedActivities.map(activity => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                      <Badge variant="secondary" className="text-xs">{activity.date}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Sarcină completată</span>
                      <span className="font-medium text-green-600">Finalizat</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Nu există activități completate pentru acest teren</p>
                    <p className="text-sm">Activitățile completate vor apărea aici</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <VisualCropJournal fieldId={field.id} />
          </TabsContent>

          <TabsContent value="soil" className="space-y-6">
            <SoilSection fieldId={field.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FieldDetails;
