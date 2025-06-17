
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Sprout, Calendar, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddFieldDialog from './AddFieldDialog';
import EditFieldDialog from './EditFieldDialog';
import { useFields } from '@/hooks/useFields';

const FieldsOverview = () => {
  const navigate = useNavigate();
  const { fields, loading, error } = useFields();
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);

  if (loading) {
    return (
      <Card className="bg-white border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Terenurile Mele</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Se încarcă terenurile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Terenurile Mele</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Eroare la încărcarea terenurilor: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Încearcă din nou
            </Button>
          </div>
        </CardContent>
      </Card>
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
    <Card className="bg-white border-green-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-800">Terenurile Mele</CardTitle>
        <AddFieldDialog 
          isOpen={isAddingField} 
          onOpenChange={setIsAddingField}
          trigger={
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă teren
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-8">
            <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nu aveți terenuri adăugate</h3>
            <p className="text-gray-600 mb-4">
              Începeți prin a adăuga primul teren pentru a gestiona activitățile agricole.
            </p>
            <Button 
              onClick={() => setIsAddingField(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adaugă primul teren
            </Button>
          </div>
        ) : (
          fields.map((field) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              style={{ 
                borderLeft: `4px solid ${field.culoare || '#22c55e'}`,
                backgroundColor: field.culoare ? `${field.culoare}08` : 'transparent'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: field.culoare || '#22c55e' }}
                  ></div>
                  <h4 className="font-semibold text-gray-900">{field.nume_teren}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {field.cod_parcela}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(field.cultura)}>
                    {getStatusText(field.cultura, field.data_insamantare)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingField(field);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Sprout className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Cultură:</span>
                  <span className="font-medium">{field.cultura || 'Necunoscută'}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">Suprafață:</span>
                  <span className="font-medium">{field.suprafata} ha</span>
                </div>
                
                {field.data_insamantare && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-600">Plantat:</span>
                    <span className="font-medium">{field.data_insamantare}</span>
                  </div>
                )}
                
                {field.varietate && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Varietate:</span>
                    <span className="font-medium">{field.varietate}</span>
                  </div>
                )}
              </div>

              {field.ingrasaminte_folosite && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong>Îngrășăminte:</strong> {field.ingrasaminte_folosite}
                  </p>
                </div>
              )}

              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/field/${field.id}`)}
                >
                  Vezi detalii
                </Button>
              </div>
            </div>
          ))
        )}

        {editingField && (
          <EditFieldDialog
            field={editingField}
            isOpen={!!editingField}
            onOpenChange={(open) => !open && setEditingField(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FieldsOverview;
