
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import InteractiveMap from '@/components/InteractiveMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MapPin } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const MapView = () => {
  const { addField } = useAppContext();
  const { toast } = useToast();
  const [isAddingField, setIsAddingField] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [newField, setNewField] = useState({
    name: '',
    parcelCode: '',
    size: '',
    crop: '',
    status: 'healthy',
    location: '',
    plantingDate: '',
    harvestDate: '',
    workType: '',
    costs: '',
    inputs: '',
    roi: '',
    color: '#22c55e'
  });

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsAddingField(true);
    setNewField(prev => ({
      ...prev,
      location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }));
  };

  const handleAddField = () => {
    if (!newField.name || !newField.crop || !selectedLocation) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const fieldData = {
      name: newField.name,
      parcelCode: newField.parcelCode || `P-${Date.now()}`,
      area: parseFloat(newField.size) || 0,
      size: parseFloat(newField.size) || 0,
      crop: newField.crop,
      status: newField.status,
      location: newField.location,
      coordinates: selectedLocation,
      plantingDate: newField.plantingDate,
      harvestDate: newField.harvestDate,
      workType: newField.workType,
      costs: parseFloat(newField.costs) || 0,
      inputs: newField.inputs,
      roi: parseFloat(newField.roi) || 0,
      color: newField.color
    };

    addField(fieldData);
    
    setNewField({
      name: '',
      parcelCode: '',
      size: '',
      crop: '',
      status: 'healthy',
      location: '',
      plantingDate: '',
      harvestDate: '',
      workType: '',
      costs: '',
      inputs: '',
      roi: '',
      color: '#22c55e'
    });
    setSelectedLocation(null);
    setIsAddingField(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Harta Parcelelor</h1>
            <p className="text-green-600">Vizualizează și gestionează parcelele din exploatație</p>
          </div>
          
          <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă parcelă
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Adaugă parcelă nouă</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Nume parcelă *</Label>
                  <Input
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    placeholder="ex: Parcela Nord"
                  />
                </div>
                
                <div>
                  <Label>Cod parcelă</Label>
                  <Input
                    value={newField.parcelCode}
                    onChange={(e) => setNewField({ ...newField, parcelCode: e.target.value })}
                    placeholder="ex: PN-001"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Suprafața (ha) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newField.size}
                      onChange={(e) => setNewField({ ...newField, size: e.target.value })}
                      placeholder="ex: 12.5"
                    />
                  </div>
                  <div>
                    <Label>Cultură *</Label>
                    <Select onValueChange={(value) => setNewField({ ...newField, crop: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează cultura" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grâu">Grâu</SelectItem>
                        <SelectItem value="Porumb">Porumb</SelectItem>
                        <SelectItem value="Floarea-soarelui">Floarea-soarelui</SelectItem>
                        <SelectItem value="Rapiță">Rapiță</SelectItem>
                        <SelectItem value="Orz">Orz</SelectItem>
                        <SelectItem value="Ovăz">Ovăz</SelectItem>
                        <SelectItem value="Soia">Soia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Locația</Label>
                  <Input
                    value={newField.location}
                    onChange={(e) => setNewField({ ...newField, location: e.target.value })}
                    placeholder="Coordonatele vor fi completate automat"
                    disabled
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data plantării</Label>
                    <Input
                      type="date"
                      value={newField.plantingDate}
                      onChange={(e) => setNewField({ ...newField, plantingDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Data recoltării</Label>
                    <Input
                      type="date"
                      value={newField.harvestDate}
                      onChange={(e) => setNewField({ ...newField, harvestDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setIsAddingField(false)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Anulează
                  </Button>
                  <Button 
                    onClick={handleAddField} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Adaugă parcela
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-green-200 overflow-hidden">
          <InteractiveMap onMapClick={handleMapClick} />
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Fă click pe hartă pentru a adăuga o parcelă nouă la locația selectată</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
