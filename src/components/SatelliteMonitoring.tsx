
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Satellite, RefreshCw, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const SatelliteMonitoring = () => {
  const { fields, satelliteData, fetchSatelliteData } = useAppContext();
  const { toast } = useToast();
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'comparison' | 'overlay'>('comparison');

  const handleFetchSatelliteData = (fieldId: string) => {
    setIsLoading(true);
    fetchSatelliteData(fieldId);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Imagini satelit actualizate",
        description: "Datele pentru monitorizarea terenului au fost actualizate.",
      });
    }, 2000);
  };

  const selectedParcelData = selectedParcel ? satelliteData.find(d => d.field_id === selectedParcel) : null;
  const selectedField = selectedParcel ? fields.find(f => f.id === selectedParcel) : null;

  useEffect(() => {
    // Auto-fetch satellite data for all parcels on component mount
    fields.forEach(field => {
      if (!satelliteData.find(d => d.field_id === field.id)) {
        fetchSatelliteData(field.id);
      }
    });
  }, [fields]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center space-x-2">
          <Satellite className="h-5 w-5" />
          <span>Monitorizare Satelit</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Selectează parcela</label>
            <Select onValueChange={(value) => setSelectedParcel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Alege parcela pentru monitorizare..." />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name} ({field.parcel_code}) - {field.size} ha
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedParcel && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleFetchSatelliteData(selectedParcel)}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Se încarcă...' : 'Actualizează imagini'}
                  </Button>
                  <Select value={viewMode} onValueChange={(value: 'comparison' | 'overlay') => setViewMode(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comparison">Comparație</SelectItem>
                      <SelectItem value="overlay">Suprapunere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedParcelData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{selectedField?.name}</p>
                      <p className="text-sm text-gray-600">Cod: {selectedField?.parcel_code}</p>
                      <p className="text-xs text-gray-500">
                        Ultima actualizare: {new Date(selectedParcelData.analysis_date).toLocaleDateString('ro-RO')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedParcelData.change_detected ? (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Modificări detectate
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Fără modificări
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Imagine actuală</label>
                      <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center border-2 border-green-300">
                        <div className="text-center">
                          <Satellite className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-green-700 font-medium">Imagine satelit</p>
                          <p className="text-xs text-green-600">Astăzi</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Imagine din urmă cu 7 zile</label>
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-blue-300">
                        <div className="text-center">
                          <Satellite className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-blue-700 font-medium">Imagine satelit</p>
                          <p className="text-xs text-blue-600">Acum 7 zile</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {viewMode === 'overlay' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Suprapunere cu detectarea modificărilor</label>
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-orange-200 rounded-lg flex items-center justify-center border-2 border-purple-300">
                        <div className="text-center">
                          <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm text-purple-700 font-medium">Analiza modificărilor</p>
                          {selectedParcelData.change_detected && (
                            <p className="text-xs text-orange-600 mt-1">
                              {selectedParcelData.change_percentage?.toFixed(1)}% din suprafață modificată
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Satellite className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Informații tehnice:</span>
                    </div>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Rezoluție: 10m per pixel (Sentinel-2)</li>
                      <li>• Frecvență actualizare: 5 zile</li>
                      <li>• Analiza automată a vegetației (NDVI)</li>
                      <li>• Detectare modificări bazată pe AI</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Satellite className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Se încarcă datele satelit...</p>
                  <p className="text-sm text-gray-500 mt-1">Primele date pot dura până la 30 secunde</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SatelliteMonitoring;
