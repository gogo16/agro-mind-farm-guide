
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const AddFieldDialog = () => {
  const { toast } = useToast();
  const { addField } = useAppContext();
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    parcelCode: '',
    size: '',
    crop: '',
    variety: '',
    coords: '',
    plantingDate: '',
    harvestDate: '',
    workType: '',
    costs: '',
    inputs: '',
    color: '#22c55e'
  });

  const validateCoordinates = (coordsString: string) => {
    if (!coordsString.trim()) return { isValid: true, coordinates: undefined };
    
    try {
      // Împarte coordonatele pe linii noi sau puncte și virgule
      const coordPairs = coordsString.split(/[\n;]/).map(line => line.trim()).filter(line => line);
      
      if (coordPairs.length === 1) {
        // Un singur punct (centru)
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
        // Poligon (minimum 3 puncte)
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

  const handleAddField = () => {
    if (!newField.name || !newField.parcelCode || !newField.size || !newField.crop) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    // Validează coordonatele
    const coordValidation = validateCoordinates(newField.coords);
    if (!coordValidation.isValid) {
      toast({
        title: "Eroare coordonate",
        description: coordValidation.error,
        variant: "destructive"
      });
      return;
    }

    // Creează obiectul teren cu toate datele necesare pentru toate secțiunile
    const fieldData = {
      name: newField.name,
      parcelCode: newField.parcelCode,
      size: parseFloat(newField.size),
      crop: newField.crop,
      variety: newField.variety,
      status: 'healthy',
      location: newField.name,
      coordinates: coordValidation.coordinates,
      coordinatesType: coordValidation.type || 'point',
      plantingDate: newField.plantingDate,
      harvestDate: newField.harvestDate,
      workType: newField.workType,
      costs: newField.costs ? parseFloat(newField.costs) : undefined,
      inputs: newField.inputs,
      roi: 0,
      color: newField.color,
      // Date pentru secțiunile aplicației
      mapData: {
        geometry: coordValidation.coordinates,
        type: coordValidation.type || 'point',
        color: newField.color,
        style: {
          fillColor: newField.color,
          fillOpacity: 0.3,
          strokeColor: newField.color,
          strokeWeight: 2
        }
      },
      // Date pentru inventar
      inventoryData: {
        inputs: newField.inputs,
        costs: newField.costs ? parseFloat(newField.costs) : 0,
        workType: newField.workType
      },
      // Date pentru documente și APIA/AFIR
      documentData: {
        parcelCode: newField.parcelCode,
        size: parseFloat(newField.size),
        crop: newField.crop,
        variety: newField.variety,
        coordinates: coordValidation.coordinates,
        coordinatesType: coordValidation.type || 'point'
      },
      // Date pentru calendar
      calendarData: {
        plantingDate: newField.plantingDate,
        harvestDate: newField.harvestDate,
        workType: newField.workType,
        crop: newField.crop
      },
      // Date pentru AI
      aiData: {
        crop: newField.crop,
        variety: newField.variety,
        size: parseFloat(newField.size),
        plantingDate: newField.plantingDate,
        harvestDate: newField.harvestDate,
        inputs: newField.inputs,
        soilType: 'unknown', // va fi actualizat ulterior
        climateZone: 'temperate' // va fi actualizat ulterior
      }
    };

    addField(fieldData);
    
    toast({
      title: "Succes",
      description: `Terenul "${newField.name}" (${newField.parcelCode}) a fost adăugat cu succes.`
    });
    
    setNewField({
      name: '',
      parcelCode: '',
      size: '',
      crop: '',
      variety: '',
      coords: '',
      plantingDate: '',
      harvestDate: '',
      workType: '',
      costs: '',
      inputs: '',
      color: '#22c55e'
    });
    setIsAddingField(false);
  };

  return (
    <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-1" />
          Adaugă teren
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă teren nou</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nume teren *</Label>
            <Input id="name" value={newField.name} onChange={e => setNewField({
            ...newField,
            name: e.target.value
          })} placeholder="ex: Parcela Vest" />
          </div>
          <div>
            <Label htmlFor="parcelCode">Cod parcelă *</Label>
            <Input id="parcelCode" value={newField.parcelCode} onChange={e => setNewField({
            ...newField,
            parcelCode: e.target.value
          })} placeholder="ex: PV-001" />
          </div>
          <div>
            <Label htmlFor="size">Suprafață (ha) *</Label>
            <Input id="size" type="number" value={newField.size} onChange={e => setNewField({
            ...newField,
            size: e.target.value
          })} placeholder="ex: 10.5" />
          </div>
          <div>
            <Label htmlFor="crop">Cultură *</Label>
            <Select onValueChange={value => setNewField({
            ...newField,
            crop: value
          })}>
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
            <Label htmlFor="variety">Varietate</Label>
            <Input id="variety" value={newField.variety} onChange={e => setNewField({
            ...newField,
            variety: e.target.value
          })} placeholder="ex: Antonius, Glosa" />
          </div>
          <div>
            <Label htmlFor="plantingDate">Data însămânțare</Label>
            <Input id="plantingDate" type="date" value={newField.plantingDate} onChange={e => setNewField({
            ...newField,
            plantingDate: e.target.value
          })} />
          </div>
          <div>
            <Label htmlFor="harvestDate">Data recoltare</Label>
            <Input id="harvestDate" type="date" value={newField.harvestDate} onChange={e => setNewField({
            ...newField,
            harvestDate: e.target.value
          })} />
          </div>
          <div>
            <Label htmlFor="workType">Tip lucrare</Label>
            <Select onValueChange={value => setNewField({
            ...newField,
            workType: value
          })}>
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
            <Label htmlFor="costs">Costuri estimate (RON)</Label>
            <Input id="costs" type="number" value={newField.costs} onChange={e => setNewField({
            ...newField,
            costs: e.target.value
          })} placeholder="ex: 2500" />
          </div>
          
          <div>
            <Label htmlFor="color">Culoare pe hartă</Label>
            <Select onValueChange={value => setNewField({
            ...newField,
            color: value
          })}>
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
            <Label htmlFor="inputs">Inputuri folosite</Label>
            <Input id="inputs" value={newField.inputs} onChange={e => setNewField({
            ...newField,
            inputs: e.target.value
          })} placeholder="ex: NPK 16:16:16, Herbicid" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="coords" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Coordonate GPS</span>
            </Label>
            <Textarea 
              id="coords" 
              value={newField.coords} 
              onChange={e => setNewField({
                ...newField,
                coords: e.target.value
              })} 
              placeholder="Pentru un punct: 45.7489, 21.2087&#10;Pentru un poligon (min. 3 puncte):&#10;45.7489, 21.2087&#10;45.7490, 21.2088&#10;45.7491, 21.2089"
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-600 mt-1">
              Format: latitudine,longitudine. Pentru poligon, introduceți minimum 3 puncte pe linii separate.
            </p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button onClick={() => setIsAddingField(false)} variant="outline" className="flex-1">
            Anulează
          </Button>
          <Button onClick={handleAddField} className="flex-1 bg-green-600 hover:bg-green-700">
            Adaugă teren
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldDialog;
