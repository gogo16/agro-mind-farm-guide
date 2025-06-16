
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Plus } from 'lucide-react';

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddFieldDialog = ({ open, onOpenChange }: AddFieldDialogProps) => {
  const { toast } = useToast();
  const { addField } = useAppContext();
  
  const [fieldData, setFieldData] = useState({
    name: '',
    parcel_code: '',
    size: '',
    crop: '',
    status: 'active',
    location: '',
    planting_date: '',
    harvest_date: '',
    work_type: '',
    costs: '',
    inputs: '',
    roi: '',
    color: '#22c55e'
  });

  const handleAddField = async () => {
    if (!fieldData.name || !fieldData.size) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi numele și suprafața terenului.",
        variant: "destructive"
      });
      return;
    }

    const newField = {
      name: fieldData.name,
      parcel_code: fieldData.parcel_code || undefined,
      size: parseFloat(fieldData.size),
      crop: fieldData.crop || undefined,
      status: fieldData.status,
      location: fieldData.location || undefined,
      coordinates: undefined,
      planting_date: fieldData.planting_date || undefined,
      harvest_date: fieldData.harvest_date || undefined,
      work_type: fieldData.work_type || undefined,
      costs: fieldData.costs ? parseFloat(fieldData.costs) : 0,
      inputs: fieldData.inputs || undefined,
      roi: fieldData.roi ? parseFloat(fieldData.roi) : 0,
      color: fieldData.color,
      soil_data: {},
      updated_at: new Date().toISOString(),
    };

    try {
      await addField(newField);
      setFieldData({
        name: '',
        parcel_code: '',
        size: '',
        crop: '',
        status: 'active',
        location: '',
        planting_date: '',
        harvest_date: '',
        work_type: '',
        costs: '',
        inputs: '',
        roi: '',
        color: '#22c55e'
      });
      onOpenChange(false);
      toast({
        title: "Succes",
        description: "Terenul a fost adăugat cu succes.",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea terenului.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-1" />
          Adaugă teren
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă teren nou</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nume teren *</Label>
            <Input
              id="name"
              value={fieldData.name}
              onChange={(e) => setFieldData({...fieldData, name: e.target.value})}
              placeholder="ex: Parcela Nord"
            />
          </div>
          <div>
            <Label htmlFor="parcel_code">Cod parcelă</Label>
            <Input
              id="parcel_code"
              value={fieldData.parcel_code}
              onChange={(e) => setFieldData({...fieldData, parcel_code: e.target.value})}
              placeholder="ex: PN-001"
            />
          </div>
          <div>
            <Label htmlFor="size">Suprafață (ha) *</Label>
            <Input
              id="size"
              type="number"
              step="0.01"
              value={fieldData.size}
              onChange={(e) => setFieldData({...fieldData, size: e.target.value})}
              placeholder="ex: 5.5"
            />
          </div>
          <div>
            <Label htmlFor="crop">Cultură</Label>
            <Select value={fieldData.crop} onValueChange={(value) => setFieldData({...fieldData, crop: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează cultura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grau">Grâu</SelectItem>
                <SelectItem value="porumb">Porumb</SelectItem>
                <SelectItem value="rapita">Rapiță</SelectItem>
                <SelectItem value="floarea-soarelui">Floarea soarelui</SelectItem>
                <SelectItem value="soia">Soia</SelectItem>
                <SelectItem value="orz">Orz</SelectItem>
                <SelectItem value="ovaz">Ovăz</SelectItem>
                <SelectItem value="alte-cereale">Alte cereale</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={fieldData.status} onValueChange={(value) => setFieldData({...fieldData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activ</SelectItem>
                <SelectItem value="fallow">În odihnă</SelectItem>
                <SelectItem value="planned">Planificat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Locație</Label>
            <Input
              id="location"
              value={fieldData.location}
              onChange={(e) => setFieldData({...fieldData, location: e.target.value})}
              placeholder="ex: Comuna X, Județul Y"
            />
          </div>
          <div>
            <Label htmlFor="planting_date">Data plantării</Label>
            <Input
              id="planting_date"
              type="date"
              value={fieldData.planting_date}
              onChange={(e) => setFieldData({...fieldData, planting_date: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="harvest_date">Data recoltării</Label>
            <Input
              id="harvest_date"
              type="date"
              value={fieldData.harvest_date}
              onChange={(e) => setFieldData({...fieldData, harvest_date: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="work_type">Tip lucrare</Label>
            <Select value={fieldData.work_type} onValueChange={(value) => setFieldData({...fieldData, work_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează tipul de lucrare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arare">Arare</SelectItem>
                <SelectItem value="discuire">Discuire</SelectItem>
                <SelectItem value="semănat">Semănat</SelectItem>
                <SelectItem value="fertilizare">Fertilizare</SelectItem>
                <SelectItem value="tratament">Tratament fitosanitar</SelectItem>
                <SelectItem value="recoltare">Recoltare</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="costs">Costuri (RON)</Label>
            <Input
              id="costs"
              type="number"
              step="0.01"
              value={fieldData.costs}
              onChange={(e) => setFieldData({...fieldData, costs: e.target.value})}
              placeholder="ex: 1500.50"
            />
          </div>
          <div>
            <Label htmlFor="roi">ROI (%)</Label>
            <Input
              id="roi"
              type="number"
              step="0.01"
              value={fieldData.roi}
              onChange={(e) => setFieldData({...fieldData, roi: e.target.value})}
              placeholder="ex: 15.5"
            />
          </div>
          <div>
            <Label htmlFor="color">Culoare</Label>
            <Input
              id="color"
              type="color"
              value={fieldData.color}
              onChange={(e) => setFieldData({...fieldData, color: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="inputs">Inputuri utilizate</Label>
            <Textarea
              id="inputs"
              value={fieldData.inputs}
              onChange={(e) => setFieldData({...fieldData, inputs: e.target.value})}
              placeholder="Descriere inputuri: semințe, îngrășăminte, tratamente..."
            />
          </div>
        </div>
        <div className="flex space-x-2 mt-6">
          <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
            Anulează
          </Button>
          <Button onClick={handleAddField} className="flex-1 bg-green-600 hover:bg-green-700">
            Adaugă terenul
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldDialog;
