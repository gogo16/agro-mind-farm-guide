
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

  const handleAddField = () => {
    if (!newField.name || !newField.parcelCode || !newField.size || !newField.crop) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }
    const coordinates = newField.coords ? {
      lat: parseFloat(newField.coords.split(',')[0]),
      lng: parseFloat(newField.coords.split(',')[1])
    } : undefined;
    addField({
      name: newField.name,
      parcelCode: newField.parcelCode,
      size: parseFloat(newField.size),
      crop: newField.crop,
      status: 'healthy',
      location: newField.name,
      coordinates,
      plantingDate: newField.plantingDate,
      harvestDate: newField.harvestDate,
      workType: newField.workType,
      costs: newField.costs ? parseFloat(newField.costs) : undefined,
      inputs: newField.inputs,
      roi: 0,
      color: newField.color
    });
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
            <Label htmlFor="coords">Coordonate GPS</Label>
            <Input id="coords" value={newField.coords} onChange={e => setNewField({
            ...newField,
            coords: e.target.value
          })} placeholder="ex: 45.7489, 21.2087" />
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
