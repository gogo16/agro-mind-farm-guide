
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';
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
  coordinates?: { lat: number; lng: number } | Array<{ lat: number; lng: number }>;
  coordinatesType?: string;
  plantingDate?: string;
  harvestDate?: string;
  workType?: string;
  costs?: number;
  inputs?: string;
  roi?: number;
  variety?: string;
  color?: string;
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
  
  // Format coordonatele pentru afișare
  const formatCoordinatesForDisplay = (coordinates: any, type?: string) => {
    if (!coordinates) return '';
    
    if (Array.isArray(coordinates)) {
      return coordinates.map(coord => `${coord.lat}, ${coord.lng}`).join('\n');
    } else {
      return `${coordinates.lat}, ${coordinates.lng}`;
    }
  };

  const [editedField, setEditedField] = useState({
    name: field.name,
    parcelCode: field.parcelCode,
    size: field.size.toString(),
    crop: field.crop,
    variety: field.variety || '',
    plantingDate: field.plantingDate || '',
    harvestDate: field.harvestDate || '',
    workType: field.workType || '',
    costs: field.costs?.toString() || '',
    inputs: field.inputs || '',
    coords: formatCoordinatesForDisplay(field.coordinates, field.coordinatesType),
    color: field.color || '#22c55e'
  });

  const validateCoordinates = (coordsString: string) => {
    if (!coordsString.trim()) return { isValid: true, coordinates: undefined };
    
    try {
      const coordPairs = coordsString.split(/[\n;]/).map(line => line.trim()).filter(line => line);
      
      if (coordPairs.length === 1) {
        const [lat, lng] = coordPairs[0].split(',').map(coord => parseFloat(coord.trim()));
        if (isNaN(lat) || isNaN(lng)) {
          return { isValid: false, error: 'Coordonatele trebuie să fie în format: latitudine,longitudine' };
        }
        return { 
          isValid: true, 
          coordinates: { lat, lng },
          type: 'point'
        };
      } else if (coordPairs.length >= 3) {
        const coordinates = [];
        for (const pair of coordPairs) {
          const [lat, lng] = pair.split(',').map(coord => parseFloat(coord.trim()));
          if (isNaN(lat) || isNaN(lng)) {
            return { isValid: false, error: 'Toate coordonatele trebuie să fie în format: latitudine,longitudine' };
          }
          coordinates.push({ lat, lng });
        }
        return { 
          isValid: true, 
          coordinates: coordinates,
          type: 'polygon'
        };
      } else {
        return { isValid: false, error: 'Pentru un poligon sunt necesare minimum 3 puncte' };
      }
    } catch (error) {
      return { isValid: false, error: 'Format invalid de coordonate' };
    }
  };

  const handleSave = () => {
    if (!editedField.name || !editedField.parcelCode || !editedField.size || !editedField.crop) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const coordValidation = validateCoordinates(editedField.coords);
    if (!coordValidation.isValid) {
      toast({
        title: "Eroare coordonate",
        description: coordValidation.error,
        variant: "destructive"
      });
      return;
    }

    updateField(field.id, {
      name: editedField.name,
      parcelCode: editedField.parcelCode,
      size: parseFloat(editedField.size),
      crop: editedField.crop,
      variety: editedField.variety,
      coordinates: coordValidation.coordinates,
      coordinatesType: coordValidation.type || 'point',
      plantingDate: editedField.plantingDate,
      harvestDate: editedField.harvestDate,
      workType: editedField.workType,
      costs: editedField.costs ? parseFloat(editedField.costs) : undefined,
      inputs: editedField.inputs,
      color: editedField.color,
      // Actualizăm și datele structurate pentru alte secțiuni
      mapData: {
        geometry: coordValidation.coordinates,
        type: coordValidation.type || 'point',
        color: editedField.color,
        style: {
          fillColor: editedField.color,
          fillOpacity: 0.3,
          strokeColor: editedField.color,
          strokeWeight: 2
        }
      }
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
            <Label htmlFor="variety">Varietate</Label>
            <Input
              id="variety"
              value={editedField.variety}
              onChange={(e) => setEditedField({...editedField, variety: e.target.value})}
              placeholder="ex: Antonius, Glosa"
            />
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
            <Select value={editedField.workType} onValueChange={(value) => setEditedField({...editedField, workType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează tipul de lucrare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arătură conventională">Arătură conventională</SelectItem>
                <SelectItem value="Cultivare minimă">Cultivare minimă</SelectItem>
                <SelectItem value="No-till">No-till</SelectItem>
                <SelectItem value="Disc">Disc</SelectItem>
                <SelectItem value="Combinatorul">Combinatorul</SelectItem>
              </SelectContent>
            </Select>
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
          <div>
            <Label htmlFor="color">Culoare pe hartă</Label>
            <Select value={editedField.color} onValueChange={(value) => setEditedField({...editedField, color: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează culoarea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="#22c55e">Verde</SelectItem>
                <SelectItem value="#3b82f6">Albastru</SelectItem>
                <SelectItem value="#f59e0b">Portocaliu</SelectItem>
                <SelectItem value="#ef4444">Roșu</SelectItem>
                <SelectItem value="#8b5cf6">Violet</SelectItem>
                <SelectItem value="#ec4899">Roz</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="coords" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Coordonate GPS</span>
            </Label>
            <Textarea
              id="coords"
              value={editedField.coords}
              onChange={(e) => setEditedField({...editedField, coords: e.target.value})}
              placeholder="Pentru un punct: 45.7489, 21.2087&#10;Pentru un poligon (min. 3 puncte):&#10;45.7489, 21.2087&#10;45.7490, 21.2088&#10;45.7491, 21.2089"
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-600 mt-1">
              Format: latitudine,longitudine. Pentru poligon, introduceți minimum 3 puncte pe linii separate.
            </p>
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
