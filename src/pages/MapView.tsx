import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import InteractiveMap from '@/components/InteractiveMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MapPin, Layers } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const MapView = () => {
  const { toast } = useToast();
  const { fields, addField } = useAppContext();
  const [isAddingField, setIsAddingField] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [fieldForm, setFieldForm] = useState({
    name: '',
    crop: '',
    size: '',
    location: '',
    parcel_code: '',
    planting_date: '',
    harvest_date: '',
    color: '#22c55e'
  });

  const [mapCenter, setMapCenter] = useState({ lat: 45.9432, lng: 24.9668 }); // Romania center

  const crops = [
    'Grâu',
    'Porumb',
    'Floarea-soarelui',
    'Orz',
    'Ovăz',
    'Rapiță',
    'Soia',
    'Cartofi',
    'Sfeclă de zahăr'
  ];

  const colors = [
    { name: 'Verde', value: '#22c55e' },
    { name: 'Albastru', value: '#3b82f6' },
    { name: 'Roșu', value: '#ef4444' },
    { name: 'Galben', value: '#eab308' },
    { name: 'Portocaliu', value: '#f97316' },
    { name: 'Mov', value: '#a855f7' },
    { name: 'Roz', value: '#ec4899' },
    { name: 'Turcoaz', value: '#06b6d4' }
  ];

  const handleMapClick = (coordinates: { lat: number; lng: number }) => {
    setSelectedCoordinates(coordinates);
    setIsAddingField(true);
  };

  const handleAddField = async () => {
    if (!fieldForm.name || !fieldForm.crop || !fieldForm.size) {
      toast({
        title: "Eroare",
        description: "Vă rugăm completați toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCoordinates) {
      toast({
        title: "Eroare", 
        description: "Vă rugăm selectați o locație pe hartă.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addField({
        name: fieldForm.name,
        crop: fieldForm.crop,
        size: parseFloat(fieldForm.size),
        location: fieldForm.location,
        parcel_code: fieldForm.parcel_code,
        planting_date: fieldForm.planting_date,
        harvest_date: fieldForm.harvest_date,
        color: fieldForm.color,
        coordinates: selectedCoordinates,
        costs: 0,
        inputs: '',
        roi: 0,
        work_type: '',
        status: 'active',
        soil_data: {}
      });

      setFieldForm({
        name: '',
        crop: '',
        size: '',
        location: '',
        parcel_code: '',
        planting_date: '',
        harvest_date: '',
        color: '#22c55e'
      });
      setSelectedCoordinates(null);
      setIsAddingField(false);

      toast({
        title: "Succes",
        description: "Parcela a fost adăugată cu succes."
      });
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea parcelei.",
        variant: "destructive"
      });
    }
  };

  // Calculate total area
  const totalArea = fields.reduce((sum, field) => sum + Number(field.size), 0);

  // Group fields by crop
  const fieldsByCrop = fields.reduce((acc, field) => {
    const crop = field.crop || 'Necunoscut';
    if (!acc[crop]) acc[crop] = [];
    acc[crop].push(field);
    return acc;
  }, {} as Record<string, typeof fields>);

  useEffect(() => {
    // Get user location for map center
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
          // Keep default Romania center
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Vizualizare Hartă</h1>
            <p className="text-green-600">Gestionează parcelele pe hartă interactivă</p>
          </div>

          <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Parcelă
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adaugă Parcelă Nouă</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nume parcelă *</Label>
                  <Input
                    id="name"
                    value={fieldForm.name}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Parcela Nord"
                  />
                </div>

                <div>
                  <Label htmlFor="crop">Cultură *</Label>
                  <Select value={fieldForm.crop} onValueChange={(value) => setFieldForm(prev => ({ ...prev, crop: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează cultura" />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map(crop => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Suprafață (ha) *</Label>
                    <Input
                      id="size"
                      type="number"
                      step="0.1"
                      value={fieldForm.size}
                      onChange={(e) => setFieldForm(prev => ({ ...prev, size: e.target.value }))}
                      placeholder="Ex: 2.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parcel_code">Cod parcelă</Label>
                    <Input
                      id="parcel_code"
                      value={fieldForm.parcel_code}
                      onChange={(e) => setFieldForm(prev => ({ ...prev, parcel_code: e.target.value }))}
                      placeholder="Ex: P001"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Locație</Label>
                  <Input
                    id="location"
                    value={fieldForm.location}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ex: Județul Ilfov"
                  />
                </div>

                <div>
                  <Label htmlFor="color">Culoare pe hartă</Label>
                  <Select value={fieldForm.color} onValueChange={(value) => setFieldForm(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: color.value }}
                            />
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="planting_date">Data plantării</Label>
                    <Input
                      id="planting_date"
                      type="date"
                      value={fieldForm.planting_date}
                      onChange={(e) => setFieldForm(prev => ({ ...prev, planting_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="harvest_date">Data recoltării</Label>
                    <Input
                      id="harvest_date"
                      type="date"
                      value={fieldForm.harvest_date}
                      onChange={(e) => setFieldForm(prev => ({ ...prev, harvest_date: e.target.value }))}
                    />
                  </div>
                </div>

                {selectedCoordinates && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Coordonate: {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setIsAddingField(false);
                    setSelectedCoordinates(null);
                  }}>
                    Anulează
                  </Button>
                  <Button onClick={handleAddField} className="bg-green-600 hover:bg-green-700">
                    Adaugă Parcela
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-green-200">
              <CardContent className="p-0">
                <InteractiveMap
                  fields={fields}
                  center={mapCenter}
                  onMapClick={handleMapClick}
                  selectedCoordinates={selectedCoordinates}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Statistici</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total parcele</p>
                  <p className="text-2xl font-bold text-green-800">{fields.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Suprafață totală</p>
                  <p className="text-2xl font-bold text-green-800">{totalArea.toFixed(1)} ha</p>
                </div>
              </CardContent>
            </Card>

            {/* Fields by Crop */}
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Parcele pe culturi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(fieldsByCrop).map(([crop, cropFields]) => (
                  <div key={crop} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{crop}</span>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-800">{cropFields.length}</p>
                      <p className="text-xs text-gray-500">
                        {cropFields.reduce((sum, f) => sum + Number(f.size), 0).toFixed(1)} ha
                      </p>
                    </div>
                  </div>
                ))}
                {Object.keys(fieldsByCrop).length === 0 && (
                  <p className="text-gray-500 text-center py-4">Nu există parcele adăugate</p>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Legendă</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {fields.map(field => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: field.color }}
                    />
                    <span className="text-sm text-gray-700">{field.name}</span>
                    <span className="text-xs text-gray-500">({field.parcel_code})</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 text-sm">
              <strong>Instrucțiuni:</strong> Faceți clic pe hartă pentru a selecta locația unei noi parcele, 
              apoi completați formularul pentru a o adăuga. Parcelele existente sunt afișate cu culorile selectate.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapView;
