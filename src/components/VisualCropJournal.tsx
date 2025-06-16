
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Calendar, Cloud, Sprout, Plus, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface VisualCropJournalProps {
  fieldId?: string;
}

const VisualCropJournal = ({ fieldId }: VisualCropJournalProps) => {
  const { toast } = useToast();
  const { fields, fieldPhotos } = useAppContext();
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  
  // Helper function to get field name from field_id
  const getFieldName = (fieldIdToFind?: string) => {
    if (!fieldIdToFind) return 'N/A';
    const field = fields.find(f => f.id === fieldIdToFind);
    return field ? field.name : 'N/A';
  };

  // Filtrează pozele pentru terenul specific dacă este specificat fieldId
  const displayedPhotos = fieldId 
    ? (fieldPhotos || []).filter((photo: any) => photo.field_id === fieldId)
    : (fieldPhotos || []);

  // Mock data for demonstration
  const [photos] = useState([
    {
      id: 1,
      date: '2024-06-01',
      field_name: 'Parcela Nord',
      activity: 'Semănat',
      crop_stage: 'Pregătire sol',
      weather_conditions: 'Însorit, 22°C',
      notes: 'Sol în condiții optime pentru semănat',
      image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400',
      field_id: '1'
    },
    {
      id: 2,
      date: '2024-05-15',
      field_name: 'Câmp Sud',
      activity: 'Tratament fitosanitar',
      crop_stage: 'Creștere',
      weather_conditions: 'Noros, 18°C',
      notes: 'Aplicat fungicid preventiv',
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
      field_id: '2'
    },
    {
      id: 3,
      date: '2024-05-01',
      field_name: 'Livada Est',
      activity: 'Fertilizare',
      crop_stage: 'Dezvoltare',
      weather_conditions: 'Ploios, 15°C',
      notes: 'Îngrășământ NPK aplicat înainte de ploaie',
      image_url: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400',
      field_id: '3'
    }
  ]);

  const activities = [
    'Arare', 'Semănat', 'Fertilizare', 'Tratament fitosanitar', 
    'Irigare', 'Recoltare', 'Monitorizare', 'Altele'
  ];

  const cropStages = [
    'Pregătire sol', 'Semănat', 'Răsărire', 'Creștere', 
    'Dezvoltare', 'Înflorire', 'Maturare', 'Recoltare'
  ];

  const handleAddPhoto = () => {
    toast({
      title: "Fotografie adăugată",
      description: "Fotografia a fost salvată în jurnalul vizual.",
    });
    setIsAddingPhoto(false);
  };

  // Combină pozele default cu cele adăugate de utilizator
  const allPhotos = [...photos, ...displayedPhotos];

  return (
    <Card className="bg-white border-green-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-800 flex items-center space-x-2">
          <Camera className="h-5 w-5" />
          <span>Jurnal Vizual - Foto în Timp</span>
        </CardTitle>
        {!fieldId && (
          <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Adaugă Foto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adaugă fotografie nouă</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Teren</Label>
                  <Select onValueChange={setSelectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează terenul" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map(field => (
                        <SelectItem key={field.id} value={field.id.toString()}>{field.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Activitate</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează activitatea" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.map(activity => (
                        <SelectItem key={activity} value={activity.toLowerCase()}>{activity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Stadiu cultură</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează stadiul" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropStages.map(stage => (
                        <SelectItem key={stage} value={stage.toLowerCase()}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condiții meteo</Label>
                  <Input placeholder="ex: Însorit, 22°C" />
                </div>
                <div>
                  <Label>Notițe</Label>
                  <Textarea placeholder="Observații despre activitate..." />
                </div>
                <div>
                  <Label>Fotografii</Label>
                  <Input type="file" accept="image/*" multiple />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setIsAddingPhoto(false)} variant="outline" className="flex-1">
                    Anulează
                  </Button>
                  <Button onClick={handleAddPhoto} className="flex-1 bg-green-600 hover:bg-green-700">
                    Salvează Foto
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allPhotos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nu există fotografii încă. Adaugă prima fotografie!</p>
            </div>
          ) : (
            allPhotos.map((photo) => (
              <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src={photo.image_url} 
                    alt={`${photo.activity} - ${photo.field_name || getFieldName(photo.field_id)}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/90 text-gray-800">
                      {photo.field_name || getFieldName(photo.field_id)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{photo.activity}</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{photo.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-1">
                      <Sprout className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-gray-600">{photo.crop_stage}</span>
                    </div>
                    {photo.weather_conditions && (
                      <div className="flex items-center space-x-1">
                        <Cloud className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-gray-600">{photo.weather_conditions}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{photo.notes}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualCropJournal;
