import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Sprout, Calendar, AlertTriangle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface FieldsOverviewProps {
  detailed?: boolean;
}

const FieldsOverview = ({ detailed = false }: FieldsOverviewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    area: '',
    crop: '',
    variety: '',
    coords: ''
  });

  const fields = [
    {
      id: 1,
      name: 'Parcela Nord',
      area: '12.5 ha',
      crop: 'Grâu',
      variety: 'Glosa',
      plantingDate: '2024-10-15',
      status: 'healthy',
      lastActivity: 'Fertilizare',
      nextTask: 'Irigare',
      coords: '45.7489, 21.2087'
    },
    {
      id: 2,
      name: 'Câmp Sud',
      area: '8.3 ha',
      crop: 'Porumb',
      variety: 'Pioneer',
      plantingDate: '2024-04-20',
      status: 'attention',
      lastActivity: 'Insecticid',
      nextTask: 'Recoltat',
      coords: '45.7456, 21.2134'
    },
    {
      id: 3,
      name: 'Livada Est',
      area: '15.2 ha',
      crop: 'Floarea-soarelui',
      variety: 'LG5550',
      plantingDate: '2024-05-10',
      status: 'excellent',
      lastActivity: 'Herbicid',
      nextTask: 'Monitorizare',
      coords: '45.7512, 21.2156'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excelent</Badge>;
      case 'healthy':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Sănătos</Badge>;
      case 'attention':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Atenție</Badge>;
      default:
        return <Badge variant="secondary">Necunoscut</Badge>;
    }
  };

  const handleAddField = () => {
    if (!newField.name || !newField.area || !newField.crop) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succes",
      description: `Terenul "${newField.name}" a fost adăugat cu succes.`,
    });
    
    setNewField({ name: '', area: '', crop: '', variety: '', coords: '' });
    setIsAddingField(false);
  };

  if (!detailed) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Terenurile tale</CardTitle>
          <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
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
                    placeholder="ex: Parcela Vest"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Suprafață *</Label>
                  <Input
                    id="area"
                    value={newField.area}
                    onChange={(e) => setNewField({...newField, area: e.target.value})}
                    placeholder="ex: 10.5 ha"
                  />
                </div>
                <div>
                  <Label htmlFor="crop">Cultură *</Label>
                  <Select onValueChange={(value) => setNewField({...newField, crop: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează cultura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grau">Grâu</SelectItem>
                      <SelectItem value="porumb">Porumb</SelectItem>
                      <SelectItem value="floarea-soarelui">Floarea-soarelui</SelectItem>
                      <SelectItem value="soia">Soia</SelectItem>
                      <SelectItem value="rapita">Rapiță</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="variety">Varietate</Label>
                  <Input
                    id="variety"
                    value={newField.variety}
                    onChange={(e) => setNewField({...newField, variety: e.target.value})}
                    placeholder="ex: Pioneer"
                  />
                </div>
                <div>
                  <Label htmlFor="coords">Coordonate GPS</Label>
                  <Input
                    id="coords"
                    value={newField.coords}
                    onChange={(e) => setNewField({...newField, coords: e.target.value})}
                    placeholder="ex: 45.7489, 21.2087"
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
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.slice(0, 3).map((field) => (
            <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{field.name}</p>
                  <p className="text-sm text-gray-600">{field.crop} • {field.area}</p>
                </div>
              </div>
              {getStatusBadge(field.status)}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Gestionarea Terenurilor</h2>
        <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Teren nou
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
                  placeholder="ex: Parcela Vest"
                />
              </div>
              <div>
                <Label htmlFor="area">Suprafață *</Label>
                <Input
                  id="area"
                  value={newField.area}
                  onChange={(e) => setNewField({...newField, area: e.target.value})}
                  placeholder="ex: 10.5 ha"
                />
              </div>
              <div>
                <Label htmlFor="crop">Cultură *</Label>
                <Select onValueChange={(value) => setNewField({...newField, crop: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează cultura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grau">Grâu</SelectItem>
                    <SelectItem value="porumb">Porumb</SelectItem>
                    <SelectItem value="floarea-soarelui">Floarea-soarelui</SelectItem>
                    <SelectItem value="soia">Soia</SelectItem>
                    <SelectItem value="rapita">Rapiță</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="variety">Varietate</Label>
                <Input
                  id="variety"
                  value={newField.variety}
                  onChange={(e) => setNewField({...newField, variety: e.target.value})}
                  placeholder="ex: Pioneer"
                />
              </div>
              <div>
                <Label htmlFor="coords">Coordonate GPS</Label>
                <Input
                  id="coords"
                  value={newField.coords}
                  onChange={(e) => setNewField({...newField, coords: e.target.value})}
                  placeholder="ex: 45.7489, 21.2087"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <Card key={field.id} className="bg-white border-green-200 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-green-800">{field.name}</CardTitle>
                {getStatusBadge(field.status)}
              </div>
              <p className="text-sm text-gray-600">{field.area}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Sprout className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{field.crop} - {field.variety}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Plantat: {field.plantingDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{field.coords}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-1">Ultima activitate:</p>
                <p className="text-sm font-medium">{field.lastActivity}</p>
                <p className="text-xs text-gray-500 mt-2 mb-1">Următoarea sarcină:</p>
                <p className="text-sm font-medium text-green-600">{field.nextTask}</p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/map')}
                >
                  Vezi pe hartă
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => navigate(`/field/${field.id}`)}
                >
                  Detalii
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FieldsOverview;
