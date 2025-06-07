
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

const VisualCropJournal = () => {
  const { toast } = useToast();
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  
  const [photos] = useState([
    {
      id: 1,
      date: '2024-06-01',
      field: 'Parcela Nord',
      activity: 'Semănat',
      cropStage: 'Pregătire sol',
      weather: 'Însorit, 22°C',
      notes: 'Sol în condiții optime pentru semănat',
      imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400'
    },
    {
      id: 2,
      date: '2024-05-15',
      field: 'Câmp Sud',
      activity: 'Tratament fitosanitar',
      cropStage: 'Creștere',
      weather: 'Noros, 18°C',
      notes: 'Aplicat fungicid preventiv',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400'
    },
    {
      id: 3,
      date: '2024-05-01',
      field: 'Livada Est',
      activity: 'Fertilizare',
      cropStage: 'Dezvoltare',
      weather: 'Ploios, 15°C',
      notes: 'Îngrășământ NPK aplicat înainte de ploaie',
      imageUrl: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400'
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

  return (
    <Card className="bg-white border-green-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-800 flex items-center space-x-2">
          <Camera className="h-5 w-5" />
          <span>Jurnal Vizual - Foto în Timp</span>
        </CardTitle>
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
                    <SelectItem value="parcela-nord">Parcela Nord</SelectItem>
                    <SelectItem value="camp-sud">Câmp Sud</SelectItem>
                    <SelectItem value="livada-est">Livada Est</SelectItem>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img 
                  src={photo.imageUrl} 
                  alt={`${photo.activity} - ${photo.field}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white/90 text-gray-800">
                    {photo.field}
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
                    <span className="text-xs text-gray-600">{photo.cropStage}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cloud className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-gray-600">{photo.weather}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{photo.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualCropJournal;
