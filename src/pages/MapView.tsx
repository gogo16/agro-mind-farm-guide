import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SatelliteMonitoring from '@/components/SatelliteMonitoring';
import InteractiveMap from '@/components/InteractiveMap';
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
  const navigate = useNavigate();
  const [mapType, setMapType] = useState('roadmap');
  const [showFieldInfo, setShowFieldInfo] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
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
    if (!newField.name || !newField.parcelCode || !newField.size) {
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
      size: parseFloat(newField.size),
      crop: newField.crop || 'Necunoscută',
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
    toast({
      title: "Succes",
      description: `Terenul "${newField.name}" (${newField.parcelCode}) a fost adăugat cu succes.`
    });
  };
  const handleViewFieldDetails = field => {
    navigate(`/field/${field.id}`);
  };
  const handleCenterOnMap = field => {
    if (field.coordinates) {
      // Folosește funcția globală expusă de InteractiveMap
      if ((window as any).centerMapOnField) {
        (window as any).centerMapOnField(field);
      }
      toast({
        title: "Hartă centrată",
        description: `Harta a fost centrată pe ${field.name}`
      });
    } else {
      toast({
        title: "Coordonate lipsă",
        description: `Nu sunt disponibile coordonate pentru ${field.name}`,
        variant: "destructive"
      });
    }
  };
  const handleFieldSelect = field => {
    setSelectedField(field);
    setShowFieldInfo(true);
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
                          <Label htmlFor="crop">Cultură</Label>
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
                          <Label htmlFor="inputs">Îngrășăminte folosite</Label>
                          <Input id="inputs" value={newField.inputs} onChange={e => setNewField({
                          ...newField,
                          inputs: e.target.value
                        })} placeholder="ex: NPK 16:16:16, Uree" />
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
                  backgroundColor: field.color || '#22c55e'
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
                  <InteractiveMap mapType={mapType} onFieldSelect={handleFieldSelect} />

                  {/* Field Info Modal */}
                  {showFieldInfo && selectedField && <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64 border z-20">
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
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleViewFieldDetails(selectedField)}>
                          Vezi detalii complete
                        </Button>
                        <Button size="sm" variant="outline" className="w-full" onClick={() => handleCenterOnMap(selectedField)}>
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