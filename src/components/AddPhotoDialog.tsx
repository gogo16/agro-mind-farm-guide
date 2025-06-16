
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface AddPhotoDialogProps {
  fieldId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

const AddPhotoDialog = ({ fieldId, isOpen, onOpenChange, trigger }: AddPhotoDialogProps) => {
  const { toast } = useToast();
  const { fields, addFieldPhoto } = useAppContext();
  const [photoData, setPhotoData] = useState({
    activity: '',
    crop_stage: '',
    weather_conditions: '',
    notes: '',
    imageFile: null as File | null
  });

  const field = fields.find(f => f.id === fieldId);

  const activities = [
    'Arare', 'Semănat', 'Fertilizare', 'Tratament fitosanitar', 
    'Irigare', 'Recoltare', 'Monitorizare', 'Altele'
  ];

  const cropStages = [
    'Pregătire sol', 'Semănat', 'Răsărire', 'Creștere', 
    'Dezvoltare', 'Înflorire', 'Maturare', 'Recoltare'
  ];

  const handleAddPhoto = async () => {
    if (!photoData.activity || !photoData.crop_stage || !photoData.imageFile) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii și să adaugi o imagine.",
        variant: "destructive"
      });
      return;
    }

    // For now, create a local URL for the image
    // In production, this would be uploaded to Supabase Storage
    const photoUrl = URL.createObjectURL(photoData.imageFile);

    const newPhoto = {
      field_id: fieldId,
      date: new Date().toISOString().split('T')[0],
      activity: photoData.activity,
      crop_stage: photoData.crop_stage,
      weather_conditions: photoData.weather_conditions,
      notes: photoData.notes,
      image_url: photoUrl
    };

    await addFieldPhoto(newPhoto);

    setPhotoData({
      activity: '',
      crop_stage: '',
      weather_conditions: '',
      notes: '',
      imageFile: null
    });
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoData({ ...photoData, imageFile: file });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă fotografie nouă - {field?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Activitate *</Label>
            <Select value={photoData.activity} onValueChange={(value) => setPhotoData({...photoData, activity: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează activitatea" />
              </SelectTrigger>
              <SelectContent>
                {activities.map(activity => (
                  <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Stadiu cultură *</Label>
            <Select value={photoData.crop_stage} onValueChange={(value) => setPhotoData({...photoData, crop_stage: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează stadiul" />
              </SelectTrigger>
              <SelectContent>
                {cropStages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Condiții meteo</Label>
            <Input 
              value={photoData.weather_conditions}
              onChange={(e) => setPhotoData({...photoData, weather_conditions: e.target.value})}
              placeholder="ex: Însorit, 22°C" 
            />
          </div>
          <div>
            <Label>Notițe</Label>
            <Textarea 
              value={photoData.notes}
              onChange={(e) => setPhotoData({...photoData, notes: e.target.value})}
              placeholder="Observații despre activitate..." 
            />
          </div>
          <div>
            <Label>Fotografii *</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
              Anulează
            </Button>
            <Button onClick={handleAddPhoto} className="flex-1 bg-green-600 hover:bg-green-700">
              Salvează Foto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoDialog;
