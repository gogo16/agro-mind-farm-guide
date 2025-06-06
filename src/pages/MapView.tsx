
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Satellite, Layers, Plus, Sprout } from 'lucide-react';

const MapView = () => {
  const [mapType, setMapType] = useState('roadmap');
  const [showFieldInfo, setShowFieldInfo] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  const fields = [
    {
      id: 1,
      name: 'Parcela Nord',
      area: '12.5 ha',
      crop: 'Grâu',
      color: '#22c55e',
      coords: { lat: 45.7489, lng: 21.2087 },
      status: 'healthy'
    },
    {
      id: 2,
      name: 'Câmp Sud',
      area: '8.3 ha',
      crop: 'Porumb',
      color: '#f59e0b',
      coords: { lat: 45.7456, lng: 21.2134 },
      status: 'attention'
    },
    {
      id: 3,
      name: 'Livada Est',
      area: '15.2 ha',
      crop: 'Floarea-soarelui',
      color: '#3b82f6',
      coords: { lat: 45.7512, lng: 21.2156 },
      status: 'excellent'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
                    <Button 
                      variant={mapType === 'roadmap' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMapType('roadmap')}
                      className="justify-start"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Hartă normală
                    </Button>
                    <Button 
                      variant={mapType === 'satellite' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMapType('satellite')}
                      className="justify-start"
                    >
                      <Satellite className="h-4 w-4 mr-2" />
                      Satelit
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adaugă parcelă nouă
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fields List */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Parcelele tale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fields.map((field) => (
                  <div 
                    key={field.id} 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedField(field);
                      setShowFieldInfo(true);
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: field.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{field.name}</p>
                      <p className="text-xs text-gray-600">{field.crop} • {field.area}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        field.status === 'excellent' ? 'bg-green-100 text-green-800' :
                        field.status === 'healthy' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {field.status === 'excellent' ? 'Excelent' :
                       field.status === 'healthy' ? 'Sănătos' : 'Atenție'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-green-200 h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  {/* Placeholder for Google Maps */}
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-800 mb-2">Google Maps va fi integrat aici</h3>
                      <p className="text-gray-600 mb-4">Pentru a activa harta, este necesară o cheie API Google Maps</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                        {fields.map((field) => (
                          <div 
                            key={field.id}
                            className="bg-white/80 p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              setSelectedField(field);
                              setShowFieldInfo(true);
                            }}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: field.color }}
                              ></div>
                              <span className="text-sm font-medium">{field.name}</span>
                            </div>
                            <p className="text-xs text-gray-600">{field.area}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Sprout className="h-3 w-3 text-green-600" />
                              <span className="text-xs">{field.crop}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Field Info Modal */}
                  {showFieldInfo && selectedField && (
                    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64 border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-green-800">{selectedField.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowFieldInfo(false)}
                        >
                          ✕
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Cultură:</strong> {selectedField.crop}</p>
                        <p><strong>Suprafață:</strong> {selectedField.area}</p>
                        <p><strong>Coordonate:</strong> {selectedField.coords.lat}, {selectedField.coords.lng}</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                          Vezi detalii complete
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          Centrează pe hartă
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
