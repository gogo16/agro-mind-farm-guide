
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFields } from '@/hooks/useFields';

interface Field {
  id: string;
  user_id: string;
  nume_teren: string;
  cod_parcela: string;
  suprafata: number;
  cultura?: string;
  varietate?: string;
  data_insamantare?: string;
  data_recoltare?: string;
  culoare?: string;
  ingrasaminte_folosite?: string;
  coordonate_gps?: { lat: number; lng: number } | null;
  created_at: string;
  updated_at: string;
  data_stergerii?: string;
  istoric_activitati?: any[];
}

interface EditFieldDialogProps {
  field: Field;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditFieldDialog = ({ field, isOpen, onOpenChange }: EditFieldDialogProps) => {
  const { toast } = useToast();
  const { updateField } = useFields();
  
  // Format coordonatele pentru afișare
  const formatCoordinatesForDisplay = (coordinates?: { lat: number; lng: number } | null) => {
    if (!coordinates) return '';
    return `${coordinates.lat}, ${coordinates.lng}`;
  };

  const [editedField, setEditedField] = useState({
    nume_teren: field.nume_teren,
    cod_parcela: field.cod_parcela,
    suprafata: field.suprafata.toString(),
    cultura: field.cultura || '',
    varietate: field.varietate || '',
    data_insamantare: field.data_insamantare || '',
    data_recoltare: field.data_recoltare || '',
    ingrasaminte_folosite: field.ingrasaminte_folosite || '',
    coords: formatCoordinatesForDisplay(field.coordonate_gps),
    culoare: field.culoare || '#22c55e'
  });

  const validateCoordinates = (coordsString: string) => {
    if (!coordsString.trim()) return { isValid: true, coordinates: undefined };
    
    try {
      const [lat, lng] = coordsString.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        return { isValid: false, error: 'Coordonatele trebuie să fie în format: latitudine,longitudine' };
      }
      return { 
        isValid: true, 
        coordinates: { lat, lng }
      };
    } catch (error) {
      return { isValid: false, error: 'Format invalid de coordonate' };
    }
  };

  const handleSave = async () => {
    if (!editedField.nume_teren || !editedField.cod_parcela || !editedField.suprafata) {
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

    try {
      await updateField(field.id, {
        nume_teren: editedField.nume_teren,
        cod_parcela: editedField.cod_parcela,
        suprafata: parseFloat(editedField.suprafata),
        cultura: editedField.cultura || undefined,
        varietate: editedField.varietate || undefined,
        coordonate_gps: coordValidation.coordinates,
        data_insamantare: editedField.data_insamantare || undefined,
        data_recoltare: editedField.data_recoltare || undefined,
        ingrasaminte_folosite: editedField.ingrasaminte_folosite || undefined,
        culoare: editedField.culoare
      });

      toast({
        title: "Succes",
        description: `Terenul "${editedField.nume_teren}" a fost actualizat cu succes.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      // Error is already handled in useFields hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editează teren: {field.nume_teren}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nume_teren">Nume teren *</Label>
            <Input
              id="nume_teren"
              value={editedField.nume_teren}
              onChange={(e) => setEditedField({...editedField, nume_teren: e.target.value})}
              placeholder="ex: Parcela Vest"
            />
          </div>
          <div>
            <Label htmlFor="cod_parcela">Cod parcelă *</Label>
            <Input
              id="cod_parcela"
              value={editedField.cod_parcela}
              onChange={(e) => setEditedField({...editedField, cod_parcela: e.target.value})}
              placeholder="ex: PV-001"
            />
          </div>
          <div>
            <Label htmlFor="suprafata">Suprafață (ha) *</Label>
            <Input
              id="suprafata"
              type="number"
              value={editedField.suprafata}
              onChange={(e) => setEditedField({...editedField, suprafata: e.target.value})}
              placeholder="ex: 10.5"
            />
          </div>
          <div>
            <Label htmlFor="cultura">Cultură</Label>
            <Select value={editedField.cultura} onValueChange={(value) => setEditedField({...editedField, cultura: value})}>
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
            <Label htmlFor="varietate">Varietate</Label>
            <Input
              id="varietate"
              value={editedField.varietate}
              onChange={(e) => setEditedField({...editedField, varietate: e.target.value})}
              placeholder="ex: Antonius, Glosa"
            />
          </div>
          <div>
            <Label htmlFor="data_insamantare">Data însămânțare</Label>
            <Input
              id="data_insamantare"
              type="date"
              value={editedField.data_insamantare}
              onChange={(e) => setEditedField({...editedField, data_insamantare: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="data_recoltare">Data recoltare</Label>
            <Input
              id="data_recoltare"
              type="date"
              value={editedField.data_recoltare}
              onChange={(e) => setEditedField({...editedField, data_recoltare: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="culoare">Culoare pe hartă</Label>
            <Select value={editedField.culoare} onValueChange={(value) => setEditedField({...editedField, culoare: value})}>
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
            <Label htmlFor="ingrasaminte_folosite">Îngrășăminte folosite</Label>
            <Input
              id="ingrasaminte_folosite"
              value={editedField.ingrasaminte_folosite}
              onChange={(e) => setEditedField({...editedField, ingrasaminte_folosite: e.target.value})}
              placeholder="ex: NPK 16:16:16, Uree"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="coords" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Coordonate GPS</span>
            </Label>
            <Input
              id="coords"
              value={editedField.coords}
              onChange={(e) => setEditedField({...editedField, coords: e.target.value})}
              placeholder="Format: latitudine,longitudine (ex: 45.7489, 21.2087)"
            />
            <p className="text-xs text-gray-600 mt-1">
              Format: latitudine,longitudine
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
