import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SatelliteMonitoring from '@/components/SatelliteMonitoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Satellite, Layers, Plus, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
const MapView = () => {
  const {
    toast
  } = useToast();
  const {
    fields,
    addField
  } = useAppContext();
  const [mapType, setMapType] = useState('roadmap');
  const [showFieldInfo, setShowFieldInfo] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    parcelCode: '',
    area: '',
    crop: '',
    coords: '',
    color: '#22c55e'
  });

  // For demonstration - replace with your actual Google Maps API key
  const GOOGLE_MAPS_API_KEY = AIzaSyDloS4Jj3CMvgpmdrWUECSOKs12A8wX1io ; 
  const handleAddField = () => {
    if (!newField.name || !newField.parcelCode || !newField.area || !newField.crop) {
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
    } : {
      lat: 45.75,
      lng: 21.21
    };
    addField({
      name: newField.name,
      parcelCode: newField.parcelCode,
      size: parseFloat(newField.area),
      crop: newField.crop,
      status: 'healthy',
      coordinates
    });
    setNewField({
      name: '',
      parcelCode: '',
      area: '',
      crop: '',
      coords: '',
      color: '#22c55e'
    });
    setIsAddingField(false);
    toast({
      title: "Succes",
      description: `Parcela "${newField.name}" (${newField.parcelCode}) a fost adăugată pe hartă.`
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Harta Terenurilor</h1>
          <p className="text-green-600">Vizualizează și gestionează toate parcelele tale</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Controale Hartă</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tip vedere</label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant={mapType === 'roadmap' ? 'default' : 'outline'} size="sm" onClick={() => setMapType('roadmap')} className="justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Hartă normală
                    </Button>
                    <Button variant={mapType === 'satellite' ? 'default' : 'outline'} size="sm" onClick={() => setMapType('satellite')} className="justify-start">
                      <Satellite className="h-4 w-4 mr-2" />
                      Satelit
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Adaugă parcelă nouă
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adaugă parcelă nouă pe hartă</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nume parcelă *</Label>
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
                          <Label htmlFor="area">Suprafață *</Label>
                          <Input id="area" value={newField.area} onChange={e => setNewField({
                          ...newField,
                          area: e.target.value
                        })} placeholder="ex: 10.5 ha" />
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
                              <SelectItem value="Linte">Linte</SelectItem>
                              <SelectItem value="Năut">Năut</SelectItem>
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
                          <Label htmlFor="coords">Coordonate GPS</Label>
                          <Input id="coords" value={newField.coords} onChange={e => setNewField({
                          ...newField,
                          coords: e.target.value
                        })} placeholder="ex: 45.7489, 21.2087" />
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
                        <div className="flex space-x-2">
                          <Button onClick={() => setIsAddingField(false)} variant="outline" className="flex-1">
                            Anulează
                          </Button>
                          <Button onClick={handleAddField} className="flex-1 bg-green-600 hover:bg-green-700">
                            Adaugă pe hartă
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Fields List */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Parcelele tale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fields.map(field => <div key={field.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => {
                setSelectedField(field);
                setShowFieldInfo(true);
              }}>
                    <div className="w-4 h-4 rounded-full border-2 border-white shadow" style={{
                  backgroundColor: '#22c55e'
                }}></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{field.name}</p>
                      <p className="text-xs text-gray-600">{field.crop} • {field.size} ha • {field.parcelCode}</p>
                    </div>
                    
                  </div>)}
              </CardContent>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-green-200 h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  {/* Google Maps Integration */}
                  {GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY" ? <iframe width="100%" height="100%" style={{
                  border: 0
                }} loading="lazy" allowFullScreen src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=45.7489,21.2087&zoom=14&maptype=${mapType}`}></iframe> : <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-green-800 mb-2">Google Maps va fi integrat aici</h3>
                        <p className="text-gray-600 mb-4">Pentru a activa harta, înlocuiește YOUR_GOOGLE_MAPS_API_KEY cu cheia ta API Google Maps</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                          {fields.map(field => <div key={field.id} className="bg-white/80 p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                        setSelectedField(field);
                        setShowFieldInfo(true);
                      }}>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-3 h-3 rounded-full" style={{
                            backgroundColor: '#22c55e'
                          }}></div>
                                <span className="text-sm font-medium">{field.name}</span>
                              </div>
                              <p className="text-xs text-gray-600">{field.size} ha • {field.parcelCode}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Sprout className="h-3 w-3 text-green-600" />
                                <span className="text-xs">{field.crop}</span>
                              </div>
                            </div>)}
                        </div>
                      </div>
                    </div>}

                  {/* Field Info Modal */}
                  {showFieldInfo && selectedField && <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64 border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-green-800">{selectedField.name}</h4>
                        <Button variant="ghost" size="sm" onClick={() => setShowFieldInfo(false)}>
                          ✕
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Cod parcelă:</strong> {selectedField.parcelCode}</p>
                        <p><strong>Cultură:</strong> {selectedField.crop}</p>
                        <p><strong>Suprafață:</strong> {selectedField.size} ha</p>
                        {selectedField.coordinates && <p><strong>Coordonate:</strong> {selectedField.coordinates.lat}, {selectedField.coordinates.lng}</p>}
                      </div>
                      <div className="mt-4 space-y-2">
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                          Vezi detalii complete
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          Centrează pe hartă
                        </Button>
                      </div>
                    </div>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Satellite Monitoring - moved below the map */}
        <div className="mt-6">
          <SatelliteMonitoring />
        </div>
      </div>
    </div>;
};
export default MapView;