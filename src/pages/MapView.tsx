import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Edit, Eye, Layers, Navigation as NavigationIcon } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const MapView = () => {
  const { fields, addField } = useAppContext();
  const { toast } = useToast();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [mapType, setMapType] = useState<'satellite' | 'terrain' | 'road'>('satellite');
  const [newField, setNewField] = useState({
    name: '',
    size: '',
    crop: '',
    parcel_code: '',
    coordinates: { lat: 44.4268, lng: 26.1025 },
    color: '#22c55e'
  });

  const handleAddField = async () => {
    if (!newField.name || !newField.size) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addField({
        name: newField.name,
        size: parseFloat(newField.size),
        crop: newField.crop || null,
        parcel_code: newField.parcel_code || null,
        coordinates: newField.coordinates,
        color: newField.color,
        location: null,
        planting_date: null,
        harvest_date: null,
        soil_data: {},
        roi: 0,
        costs: 0,
        inputs: null,
        work_type: null,
        status: 'active',
        user_id: '', // This will be set in the context
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      toast({
        title: "Succes",
        description: `Terenul "${newField.name}" a fost adăugat cu succes.`
      });

      setNewField({
        name: '',
        size: '',
        crop: '',
        parcel_code: '',
        coordinates: { lat: 44.4268, lng: 26.1025 },
        color: '#22c55e'
      });
      setIsAddingField(false);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea terenului.",
        variant: "destructive"
      });
    }
  };

  // Mock map configuration
  const mapStyles = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem',
  };

  const mapOptions = {
    center: newField.coordinates,
    zoom: 10,
    mapTypeId: mapType,
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  };

  useEffect(() => {
    // This is where you would typically initialize the Google Maps JavaScript API
    // and create a map instance. Since this is a mock, we'll just log a message.
    console.log('Map component mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Hartă Terenuri</h1>
            <p className="text-green-600">Vizualizează și gestionează terenurile pe hartă</p>
          </div>
          <div className="flex space-x-2">
            <Select value={mapType} onValueChange={(value: 'satellite' | 'terrain' | 'road') => setMapType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="satellite">Satelit</SelectItem>
                <SelectItem value="terrain">Teren</SelectItem>
                <SelectItem value="road">Rutier</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă teren
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adaugă teren nou</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nume teren *</Label>
                    <Input
                      id="name"
                      value={newField.name}
                      onChange={(e) => setNewField({...newField, name: e.target.value})}
                      placeholder="ex: Parcela Nord"
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Suprafață (ha) *</Label>
                    <Input
                      id="size"
                      type="number"
                      step="0.01"
                      value={newField.size}
                      onChange={(e) => setNewField({...newField, size: e.target.value})}
                      placeholder="ex: 5.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crop">Cultură</Label>
                    <Input
                      id="crop"
                      value={newField.crop}
                      onChange={(e) => setNewField({...newField, crop: e.target.value})}
                      placeholder="ex: Grâu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parcel_code">Cod parcelă</Label>
                    <Input
                      id="parcel_code"
                      value={newField.parcel_code}
                      onChange={(e) => setNewField({...newField, parcel_code: e.target.value})}
                      placeholder="ex: P001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Culoare</Label>
                    <Input
                      id="color"
                      type="color"
                      value={newField.color}
                      onChange={(e) => setNewField({...newField, color: e.target.value})}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => setIsAddingField(false)} variant="outline" className="flex-1">
                      Anulează
                    </Button>
                    <Button onClick={handleAddField} className="flex-1 bg-green-600 hover:bg-green-700">
                      Adaugă teren
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <Card className="lg:col-span-3 bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Harta Interactivă</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center border-2 border-green-300 relative overflow-hidden">
                {/* Mock map background */}
                <div className="absolute inset-0 bg-green-50 opacity-30"></div>
                
                {/* Mock field markers */}
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform ${
                      selectedField === field.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ 
                      backgroundColor: field.color || '#22c55e',
                      left: `${20 + (index * 15) % 60}%`,
                      top: `${30 + (index * 10) % 40}%`
                    }}
                    onClick={() => setSelectedField(selectedField === field.id ? null : field.id)}
                  >
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                      {field.name.charAt(0)}
                    </div>
                  </div>
                ))}

                <div className="text-center z-10">
                  <NavigationIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Hartă Interactivă</h3>
                  <p className="text-green-600">Fă clic pe marcajele terenurilor pentru detalii</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Mod: {mapType === 'satellite' ? 'Satelit' : mapType === 'terrain' ? 'Teren' : 'Rutier'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field List */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Terenuri ({fields.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedField === field.id 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                  onClick={() => setSelectedField(selectedField === field.id ? null : field.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: field.color || '#22c55e' }}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{field.name}</h4>
                      <p className="text-sm text-gray-600">
                        {field.parcel_code} • {field.size} ha
                      </p>
                      {field.crop && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {field.crop}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {selectedField === field.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Vezi detalii
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Editează
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Nu ai terenuri adăugate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;
