
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface Field {
  id: number;
  name: string;
  parcelCode: string;
  size: number;
  crop: string;
  status: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  plantingDate?: string;
  harvestDate?: string;
  workType?: string;
  costs?: number;
  inputs?: string;
  roi?: number;
}

interface EditFieldDialogProps {
  field: Field;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

const EditFieldDialog = ({ field, isOpen, onOpenChange, trigger }: EditFieldDialogProps) => {
  const { toast } = useToast();
  const { updateField } = useAppContext();
  const [editedField, setEditedField] = useState({
    name: field.name,
    parcelCode: field.parcelCode,
    size: field.size.toString(),
    crop: field.crop,
    plantingDate: field.plantingDate || '',
    harvestDate: field.harvestDate || '',
    workType: field.workType || '',
    costs: field.costs?.toString() || '',
    inputs: field.inputs || '',
    coords: field.coordinates ? `${field.coordinates.lat}, ${field.coordinates.lng}` : ''
  });

  const handleSave = () => {
    if (!editedField.name || !editedField.parcelCode || !editedField.size || !editedField.crop) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const coordinates = editedField.coords ? 
      { lat: parseFloat(editedField.coords.split(',')[0]), lng: parseFloat(editedField.coords.split(',')[1]) } : 
      undefined;

    updateField(field.id, {
      name: editedField.name,
      parcelCode: editedField.parcelCode,
      size: parseFloat(editedField.size),
      crop: editedField.crop,
      coordinates,
      plantingDate: editedField.plantingDate,
      harvestDate: editedField.harvestDate,
      workType: editedField.workType,
      costs: editedField.costs ? parseFloat(editedField.costs) : undefined,
      inputs: editedField.inputs
    });

    toast({
      title: "Succes",
      description: `Terenul "${editedField.name}" a fost actualizat cu succes.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editează teren: {field.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nume teren *</Label>
            <Input
              id="name"
              value={editedField.name}
              onChange={(e) => setEditedField({...editedField, name: e.target.value})}
              placeholder="ex: Parcela Vest"
            />
          </div>
          <div>
            <Label htmlFor="parcelCode">Cod parcelă *</Label>
            <Input
              id="parcelCode"
              value={editedField.parcelCode}
              onChange={(e) => setEditedField({...editedField, parcelCode: e.target.value})}
              placeholder="ex: PV-001"
            />
          </div>
          <div>
            <Label htmlFor="size">Suprafață (ha) *</Label>
            <Input
              id="size"
              type="number"
              value={editedField.size}
              onChange={(e) => setEditedField({...editedField, size: e.target.value})}
              placeholder="ex: 10.5"
            />
          </div>
          <div>
            <Label htmlFor="crop">Cultură *</Label>
            <Select value={editedField.crop} onValueChange={(value) => setEditedField({...editedField, crop: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează cultura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grâu">Grâu</SelectItem>
                <SelectItem value="Porumb">Porumb</SelectItem>
                <SelectItem value="Floarea-soarelui">Floarea-soarelui</SelectItem>
                <SelectItem value="Soia">Soia</SelectItem>
                <SelectItem value="Rapiță">Rapiță</SelectItem>
                <SelectItem value="Orz">Orz</SelectItem>
                <SelectItem value="Ovăz">Ovăz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="plantingDate">Data însămânțare</Label>
            <Input
              id="plantingDate"
              type="date"
              value={editedField.plantingDate}
              onChange={(e) => setEditedField({...editedField, plantingDate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="harvestDate">Data recoltare</Label>
            <Input
              id="harvestDate"
              type="date"
              value={editedField.harvestDate}
              onChange={(e) => setEditedField({...editedField, harvestDate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="workType">Tip lucrare</Label>
            <Input
              id="workType"
              value={editedField.workType}
              onChange={(e) => setEditedField({...editedField, workType: e.target.value})}
              placeholder="ex: Arătură conventională"
            />
          </div>
          <div>
            <Label htmlFor="costs">Costuri (RON)</Label>
            <Input
              id="costs"
              type="number"
              value={editedField.costs}
              onChange={(e) => setEditedField({...editedField, costs: e.target.value})}
              placeholder="ex: 2500"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="inputs">Inputuri folosite</Label>
            <Input
              id="inputs"
              value={editedField.inputs}
              onChange={(e) => setEditedField({...editedField, inputs: e.target.value})}
              placeholder="ex: NPK 16:16:16, Herbicid"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="coords">Coordonate GPS</Label>
            <Input
              id="coords"
              value={editedField.coords}
              onChange={(e) => setEditedField({...editedField, coords: e.target.value})}
              placeholder="ex: 45.7489, 21.2087"
            />
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
            Anulează
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
            Salvează modificările
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFieldDialog;
