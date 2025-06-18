import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Sprout, Calendar, ArrowLeft, Edit, Camera, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditFieldDialog from '@/components/EditFieldDialog';
import SoilSection from '@/components/SoilSection';
import { useFields } from '@/hooks/useFields';
import { Coordinate } from '@/types/field';

const FieldDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fields, loading } = useFields();
  const [isEditingField, setIsEditingField] = useState(false);

  const field = fields.find(f => f.id === id);

  // Helper function to display GPS coordinates
  const displayCoordinates = (coords: Coordinate | Coordinate[] | null) => {
    if (!coords) return 'Coordonate nedefinite';
    
    if (Array.isArray(coords)) {
      if (coords.length === 1) {
        return `${coords[0].lat}, ${coords[0].lng}`;
      }
      return `${coords.length} puncte GPS`;
    }
    
    return `${coords.lat}, ${coords.lng}`;
  };

  // Helper function to get first coordinate for display
  const getFirstCoordinate = (coords: Coordinate | Coordinate[] | null) => {
    if (!coords) return null;
    
    if (Array.isArray(coords)) {
      return coords.length > 0 ? coords[0] : null;
    }
    
    return coords;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-4 text-lg text-gray-600">Se încarcă detaliile terenului...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Terenul nu a fost găsit</h1>
            <p className="text-gray-600 mb-6">Terenul solicitat nu există sau a fost șters.</p>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              Înapoi la Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (cultura?: string) => {
    if (!cultura) return 'bg-gray-100 text-gray-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (cultura?: string, data_insamantare?: string) => {
    if (!cultura) return 'Fără cultură';
    if (data_insamantare) return 'Plantat';
    return 'Pregătire teren';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-green-700 hover:text-green-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-green-800">{field.nume_teren}</h1>
              <p className="text-green-600">
                {field.cultura || 'Fără cultură'} • {Number(field.suprafata)} ha • {field.cod_parcela}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {/* TODO: Reconnect photo functionality */}
            <Button variant="outline" disabled>
              <Camera className="h-4 w-4 mr-2" />
              Adaugă poză (Temporar indisponibil)
            </Button>
            <Button 
              onClick={() => setIsEditingField(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editează
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sprout className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Cultură</span>
              </div>
              <p className="text-lg font-bold text-green-800">{field.cultura || 'Fără cultură'}</p>
              <p className="text-sm text-gray-600">{field.cod_parcela}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Suprafață</span>
              </div>
              <p className="text-lg font-bold text-green-800">{Number(field.suprafata)} ha</p>
              <p className="text-sm text-gray-600">{displayCoordinates(field.coordonate_gps)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Plantat</span>
              </div>
              <p className="text-lg font-bold text-green-800">
                {field.data_insamantare || 'Nedefinit'}
              </p>
              <p className="text-sm text-gray-600">Data însămânțare</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: field.culoare || '#22c55e' }}
                ></div>
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <Badge className={getStatusColor(field.cultura)}>
                {getStatusText(field.cultura, field.data_insamantare)}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">
                {field.varietate ? `Varietate: ${field.varietate}` : 'Fără varietate'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[360px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Prezentare</TabsTrigger>
            <TabsTrigger value="activities">Istoric Activități</TabsTrigger>
            <TabsTrigger value="soil">Sol</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Informații Generale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Cod parcelă</p>
                      <p className="font-medium">{field.cod_parcela}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Suprafață</p>
                      <p className="font-medium">{Number(field.suprafata)} ha</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cultură</p>
                      <p className="font-medium">{field.cultura || 'Nedefinită'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Varietate</p>
                      <p className="font-medium">{field.varietate || 'Nedefinită'}</p>
                    </div>
                  </div>
                  
                  {field.ingrasaminte_folosite && (
                    <div>
                      <p className="text-sm text-gray-600">Îngrășăminte folosite</p>
                      <p className="font-medium">{field.ingrasaminte_folosite}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Data însămânțare</p>
                      <p className="font-medium">{field.data_insamantare || 'Nedefinită'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Data recoltare</p>
                      <p className="font-medium">{field.data_recoltare || 'Nedefinită'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Coordonate GPS</CardTitle>
                </CardHeader>
                <CardContent>
                  {field.coordonate_gps ? (
                    <div className="space-y-2">
                      {Array.isArray(field.coordonate_gps) ? (
                        <div>
                          <p><strong>Număr de puncte:</strong> {field.coordonate_gps.length}</p>
                          <div className="mt-2 space-y-1">
                            {field.coordonate_gps.map((coord, index) => (
                              <p key={index} className="text-sm">
                                <strong>Punct {index + 1}:</strong> {coord.lat}, {coord.lng}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p><strong>Latitudine:</strong> {field.coordonate_gps.lat}</p>
                          <p><strong>Longitudine:</strong> {field.coordonate_gps.lng}</p>
                        </div>
                      )}
                      {/* TODO: Reconnect map functionality */}
                      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                        <p className="text-gray-600">Harta va fi disponibilă în curând</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Coordonate GPS nedefinite</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Istoric Activități</CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: Reconnect activities functionality */}
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Funcționalitatea va fi disponibilă în curând</p>
                  <p className="text-sm">Istoricul activităților va fi reconectat la noua structură de date</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soil" className="space-y-6">
           <SoilSection fieldId={Number(field.id)} />

          </TabsContent>
        </Tabs>

        {isEditingField && (
          <EditFieldDialog
            field={field}
            isOpen={isEditingField}
            onOpenChange={setIsEditingField}
          />
        )}
      </div>
    </div>
  );
};

export default FieldDetails;
