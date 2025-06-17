
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SatelliteMonitoring from '@/components/SatelliteMonitoring';
import InteractiveMap from '@/components/InteractiveMap';
import AddFieldDialog from '@/components/AddFieldDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Satellite, Layers, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFields } from '@/hooks/useFields';

const MapView = () => {
  const { toast } = useToast();
  const { fields } = useFields();
  const navigate = useNavigate();
  const [mapType, setMapType] = useState('roadmap');
  const [showFieldInfo, setShowFieldInfo] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);

  const handleViewFieldDetails = (field: any) => {
    navigate(`/field/${field.id}`);
  };

  const handleCenterOnMap = (field: any) => {
    if (field.coordonate_gps) {
      // Folosește funcția globală expusă de InteractiveMap
      if ((window as any).centerMapOnField) {
        (window as any).centerMapOnField(field);
      }
      toast({
        title: "Hartă centrată",
        description: `Harta a fost centrată pe ${field.nume_teren}`
      });
    } else {
      toast({
        title: "Coordonate lipsă",
        description: `Nu sunt disponibile coordonate pentru ${field.nume_teren}`,
        variant: "destructive"
      });
    }
  };

  const handleFieldSelect = (field: any) => {
    setSelectedField(field);
    setShowFieldInfo(true);
  };

  // Transform field data for compatibility with InteractiveMap
  const transformedFields = fields.map(field => ({
    id: field.id,
    name: field.nume_teren,
    parcelCode: field.cod_parcela,
    size: field.suprafata,
    crop: field.cultura || 'Necunoscută',
    coordinates: field.coordonate_gps,
    color: field.culoare || '#22c55e'
  }));

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
                  <AddFieldDialog />
                </div>
              </CardContent>
            </Card>

            {/* Fields List */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Terenurile tale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fields.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Sprout className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nu ai încă terenuri adăugate</p>
                    <p className="text-xs">Folosește butonul "Adaugă teren" pentru a începe</p>
                  </div>
                ) : (
                  fields.map(field => (
                    <div 
                      key={field.id} 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100 transition-colors" 
                      onClick={() => {
                        const transformedField = {
                          id: field.id,
                          name: field.nume_teren,
                          parcelCode: field.cod_parcela,
                          size: field.suprafata,
                          crop: field.cultura || 'Necunoscută',
                          coordinates: field.coordonate_gps,
                          color: field.culoare || '#22c55e'
                        };
                        setSelectedField(transformedField);
                        setShowFieldInfo(true);
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow flex-shrink-0" 
                        style={{ backgroundColor: field.culoare || '#22c55e' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{field.nume_teren}</p>
                        <p className="text-xs text-gray-600 truncate">
                          {field.cultura || 'Necunoscută'} • {field.suprafata} ha • {field.cod_parcela}
                        </p>
                        {field.data_insamantare && (
                          <p className="text-xs text-green-600">
                            Însămânțat: {new Date(field.data_insamantare).toLocaleDateString('ro-RO')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-green-200 h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <InteractiveMap 
                    mapType={mapType} 
                    onFieldSelect={handleFieldSelect}
                    fields={transformedFields}
                  />

                  {/* Field Info Modal */}
                  {showFieldInfo && selectedField && (
                    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64 border z-20">
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
                        {selectedField.coordinates && (
                          <p><strong>Coordonate:</strong> {
                            Array.isArray(selectedField.coordinates) 
                              ? `${selectedField.coordinates.length} puncte`
                              : `${selectedField.coordinates.lat}, ${selectedField.coordinates.lng}`
                          }</p>
                        )}
                      </div>
                      <div className="mt-4 space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full bg-green-600 hover:bg-green-700" 
                          onClick={() => handleViewFieldDetails(selectedField)}
                        >
                          Vezi detalii complete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => handleCenterOnMap(selectedField)}
                        >
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

        {/* Satellite Monitoring - moved below the map */}
        <div className="mt-6">
          <SatelliteMonitoring />
        </div>
      </div>
    </div>
  );
};

export default MapView;
