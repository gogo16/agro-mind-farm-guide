
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFields } from '@/hooks/useFields';
import { Field } from '@/types/field';

interface EditFieldDialogProps {
  field: Field;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditFieldDialog = ({ field, isOpen, onOpenChange }: EditFieldDialogProps) => {
  const { toast } = useToast();
  const { updateField } = useFields();
  const [editField, setEditField] = useState({
    name: '',
    parcelCode: '',
    size: '',
    crop: '',
    variety: '',
    coords: '',
    plantingDate: '',
    harvestDate: '',
    inputs: '',
    color: '#22c55e'
  });

  // Convert coordinates to string format for editing
  const coordinatesToString = (coords: typeof field.coordonate_gps) => {
    if (!coords) return '';
    
    if (Array.isArray(coords)) {
      return coords.map(coord => `${coord.lat}, ${coord.lng}`).join('\n');
    }
    
    return `${coords.lat}, ${coords.lng}`;
  };

  useEffect(() => {
    if (field) {
      setEditField({
        name: field.nume_teren,
        parcelCode: field.cod_parcela,
        size: field.suprafata.toString(),
        crop: field.cultura || '',
        variety: field.varietate || '',
        coords: coordinatesToString(field.coordonate_gps),
        plantingDate: field.data_insamantare || '',
        harvestDate: field.data_recoltare || '',
        inputs: field.ingrasaminte_folosite || '',
        color: field.culoare || '#22c55e'
      });
    }
  }, [field]);

  const validateCoordinates = (coordsString: string) => {
    if (!coordsString.trim()) return {
      isValid: true,
      coordinates: undefined
    };

    try {
      // Împarte coordonatele pe linii noi sau puncte și virgule
      const coordPairs = coordsString.split(/[\n;]/).map(line => line.trim()).filter(line => line);
      
      if (coordPairs.length === 1) {
        // Un singur punct (centru)
        const [lat, lng] = coordPairs[0].split(',').map(coord => parseFloat(coord.trim()));
        if (isNaN(lat) || isNaN(lng)) {
          return {
            isValid: false,
            error: 'Coordonatele trebuie să fie în format: latitudine,longitudine'
          };
        }
        return {
          isValid: true,
          coordinates: { lat, lng },
          type: 'point'
        };
      } else if (coordPairs.length >= 2) {
        // Multiple puncte (2 sau mai multe pentru poligon/zonă)
        const coordinates = [];
        for (const pair of coordPairs) {
          const [lat, lng] = pair.split(',').map(coord => parseFloat(coord.trim()));
          if (isNaN(lat) || isNaN(lng)) {
            return {
              isValid: false,
              error: 'Toate coordonatele trebuie să fie în format: latitudine,longitudine'
            };
          }
          coordinates.push({ lat, lng });
        }
        return {
          isValid: true,
          coordinates: coordinates,
          type: coordinates.length === 2 ? 'two-points' : 'polygon'
        };
      } else {
        return {
          isValid: false,
          error: 'Introduceți cel puțin o coordonată'
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Format invalid de coordonate'
      };
    }
  };

  const handleSaveField = async () => {
    if (!editField.name || !editField.parcelCode || !editField.size) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    // Validează coordonatele
    const coordValidation = validateCoordinates(editField.coords);
    if (!coordValidation.isValid) {
      toast({
        title: "Eroare coordonate",
        description: coordValidation.error,
        variant: "destructive"
      });
      return;
    }

    try {
      // Creează obiectul de actualizare
      const updateData = {
        nume_teren: editField.name,
        cod_parcela: editField.parcelCode,
        suprafata: parseFloat(editField.size),
        cultura: editField.crop || undefined,
        varietate: editField.variety || undefined,
        data_insamantare: editField.plantingDate || undefined,
        data_recoltare: editField.harvestDate || undefined,
        culoare: editField.color,
        ingrasaminte_folosite: editField.inputs || undefined,
        coordonate_gps: coordValidation.coordinates
      };

      await updateField(field.id, updateData);
      
      toast({
        title: "Succes",
        description: `Terenul "${editField.name}" a fost actualizat cu succes.`
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza terenul. Încearcă din nou.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editează terenul</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-name">Nume teren *</Label>
            <Input 
              id="edit-name" 
              value={editField.name} 
              onChange={e => setEditField({ ...editField, name: e.target.value })} 
              placeholder="ex: Parcela Vest" 
            />
          </div>
          <div>
            <Label htmlFor="edit-parcelCode">Cod parcelă *</Label>
            <Input 
              id="edit-parcelCode" 
              value={editField.parcelCode} 
              onChange={e => setEditField({ ...editField, parcelCode: e.target.value })} 
              placeholder="ex: PV-001" 
            />
          </div>
          <div>
            <Label htmlFor="edit-size">Suprafață (ha) *</Label>
            <Input 
              id="edit-size" 
              type="number" 
              value={editField.size} 
              onChange={e => setEditField({ ...editField, size: e.target.value })} 
              placeholder="ex: 10.5" 
            />
          </div>
          <div>
            <Label htmlFor="edit-crop">Cultură</Label>
            <Select value={editField.crop} onValueChange={value => setEditField({ ...editField, crop: value })}>
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
                <SelectItem value="Secară">Secară</SelectItem>
                <SelectItem value="Mazăre">Mazăre</SelectItem>
                <SelectItem value="Fasole">Fasole</SelectItem>
                <SelectItem value="Lucernă">Lucernă</SelectItem>
                <SelectItem value="Trifoiul">Trifoiul</SelectItem>
                <SelectItem value="Cartof">Cartof</SelectItem>
                <SelectItem value="Sfeclă de zahăr">Sfeclă de zahăr</SelectItem>
                <SelectItem value="Morcov">Morcov</SelectItem>
                <SelectItem value="Ceapă">Ceapă</SelectItem>
                <SelectItem value="Usturoi">Usturoi</SelectItem>
                <SelectItem value="Varză">Varză</SelectItem>
                <SelectItem value="Roșii">Roșii</SelectItem>
                <SelectItem value="Ardei">Ardei</SelectItem>
                <SelectItem value="Castraveti">Castraveti</SelectItem>
                <SelectItem value="Dovleci">Dovleci</SelectItem>
                <SelectItem value="Pepeni">Pepeni</SelectItem>
                <SelectItem value="Capsuni">Capsuni</SelectItem>
                <SelectItem value="Zmeură">Zmeură</SelectItem>
                <SelectItem value="Mure">Mure</SelectItem>
                <SelectItem value="Altul">Altul</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-variety">Varietate</Label>
            <Input 
              id="edit-variety" 
              value={editField.variety} 
              onChange={e => setEditField({ ...editField, variety: e.target.value })} 
              placeholder="ex: Antonius, Glosa" 
            />
          </div>
          <div>
            <Label htmlFor="edit-plantingDate">Data însămânțare</Label>
            <Input 
              id="edit-plantingDate" 
              type="date" 
              value={editField.plantingDate} 
              onChange={e => setEditField({ ...editField, plantingDate: e.target.value })} 
            />
          </div>
          <div>
            <Label htmlFor="edit-harvestDate">Data recoltare</Label>
            <Input 
              id="edit-harvestDate" 
              type="date" 
              value={editField.harvestDate} 
              onChange={e => setEditField({ ...editField, harvestDate: e.target.value })} 
            />
          </div>
          <div>
            <Label htmlFor="edit-color">Culoare pe hartă</Label>
            <Select value={editField.color} onValueChange={value => setEditField({ ...editField, color: value })}>
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
                <SelectItem value="#06b6d4">Cyan</SelectItem>
                <SelectItem value="#84cc16">Verde deschis</SelectItem>
                <SelectItem value="#f97316">Portocaliu închis</SelectItem>
                <SelectItem value="#6366f1">Indigo</SelectItem>
                <SelectItem value="#a855f7">Mov</SelectItem>
                <SelectItem value="#10b981">Emerald</SelectItem>
                <SelectItem value="#f59e0b">Galben</SelectItem>
                <SelectItem value="#64748b">Gri</SelectItem>
                <SelectItem value="#7c2d12">Maro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="edit-inputs">Îngrășăminte folosite</Label>
            <Input 
              id="edit-inputs" 
              value={editField.inputs} 
              onChange={e => setEditField({ ...editField, inputs: e.target.value })} 
              placeholder="ex: NPK 16:16:16, Uree" 
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="edit-coords" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Coordonate GPS</span>
            </Label>
            <Textarea 
              id="edit-coords" 
              value={editField.coords} 
              onChange={e => setEditField({ ...editField, coords: e.target.value })} 
              placeholder="Pentru un punct: 44.3121, 23.7942&#10;Pentru mai multe puncte (zonă sau poligon):&#10;44.3121, 23.7942&#10;44.3122, 23.7943&#10;44.3123, 23.7944&#10;44.3124, 23.7945" 
              className="min-h-[80px]" 
            />
            <p className="text-xs text-gray-600 mt-1">
              Format: latitudine,longitudine. Pentru zonă complexă, introduceți toate punctele GPS pe linii separate (minim 2 puncte).
            </p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
            Anulează
          </Button>
          <Button onClick={handleSaveField} className="flex-1 bg-green-600 hover:bg-green-700">
            Salvează modificările
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFieldDialog;
