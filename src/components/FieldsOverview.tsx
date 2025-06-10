import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, Sprout, Calendar, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface FieldsOverviewProps {
  detailed?: boolean;
}

const FieldsOverview = ({
  detailed = false
}: FieldsOverviewProps) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    fields,
    addField,
    deleteField,
    tasks
  } = useAppContext();
  const [isAddingField, setIsAddingField] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excelent</Badge>;
      case 'healthy':
        return;
      case 'attention':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Atenție</Badge>;
      default:
        return;
    }
  };

  const getTodayTaskStats = (fieldName: string) => {
    const today = new Date().toISOString().split('T')[0];
    const fieldTasks = tasks.filter(task => 
      task.field === fieldName && 
      task.date === today && 
      task.status === 'pending'
    );
    
    const highPriority = fieldTasks.filter(task => task.priority === 'high').length;
    const mediumPriority = fieldTasks.filter(task => task.priority === 'medium').length;
    const lowPriority = fieldTasks.filter(task => task.priority === 'low').length;
    
    const badges = [];
    
    if (highPriority > 0) {
      badges.push({
        count: highPriority,
        color: 'bg-red-500',
        textColor: 'text-white'
      });
    }
    
    if (mediumPriority > 0) {
      badges.push({
        count: mediumPriority,
        color: 'bg-amber-500',
        textColor: 'text-white'
      });
    }
    
    if (lowPriority > 0) {
      badges.push({
        count: lowPriority,
        color: 'bg-green-500',
        textColor: 'text-white'
      });
    }
    
    return badges;
  };

  const handleAddField = () => {
    if (!newField.name || !newField.parcelCode || !newField.size || !newField.crop) {
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
    } : undefined;
    addField({
      name: newField.name,
      parcelCode: newField.parcelCode,
      size: parseFloat(newField.size),
      crop: newField.crop,
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
    toast({
      title: "Succes",
      description: `Terenul "${newField.name}" (${newField.parcelCode}) a fost adăugat cu succes.`
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
  };

  const handleDeleteField = (fieldId: number, fieldName: string) => {
    deleteField(fieldId);
    toast({
      title: "Teren șters",
      description: `Terenul "${fieldName}" a fost șters cu succes.`
    });
    setIsDeleting(null);
  };

  const addFieldDialog = <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-1" />
          Adaugă teren
        </Button>
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
            <Label htmlFor="inputs">Inputuri folosite</Label>
            <Input id="inputs" value={newField.inputs} onChange={e => setNewField({
            ...newField,
            inputs: e.target.value
          })} placeholder="ex: NPK 16:16:16, Herbicid" />
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
    </Dialog>;

  if (!detailed) {
    return <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Terenurile tale</CardTitle>
          {addFieldDialog}
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map(field => {
          const taskStats = getTodayTaskStats(field.name);
          return <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg border-2 border-white shadow" style={{
                backgroundColor: field.color || '#22c55e'
              }}>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{field.name}</p>
                    <p className="text-sm text-gray-600">{field.crop} • {field.size} ha • {field.parcelCode}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {taskStats.map((stat, index) => (
                    <div key={index} className={`${stat.color} ${stat.textColor} rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium`}>
                      {stat.count}
                    </div>
                  ))}
                  {getStatusBadge(field.status)}
                  <Button size="sm" variant="outline" onClick={() => navigate(`/field/${field.id}`)} className="text-xs">
                    Detalii
                  </Button>
                  <AlertDialog open={isDeleting === field.id} onOpenChange={open => setIsDeleting(open ? field.id : null)}>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ești sigur că vrei să ștergi terenul <strong>"{field.name}"</strong>?
                          Această acțiune nu poate fi anulată.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleting(null)}>
                          Anulează
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteField(field.id, field.name)} className="bg-red-600 hover:bg-red-700">
                          Șterge
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>;
        })}
        </CardContent>
      </Card>;
  }

  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Gestionarea Terenurilor</h2>
        {addFieldDialog}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(field => {
        const taskStats = getTodayTaskStats(field.name);
        return <Card key={field.id} className="bg-white border-green-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-green-800">{field.name}</CardTitle>
                    <p className="text-sm text-green-600 font-medium">{field.parcelCode}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {taskStats.map((stat, index) => (
                      <div key={index} className={`${stat.color} ${stat.textColor} rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium`}>
                        {stat.count}
                      </div>
                    ))}
                    {getStatusBadge(field.status)}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{field.size} ha</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sprout className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{field.crop}</span>
                  </div>
                  {field.plantingDate && <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Plantat: {field.plantingDate}</span>
                    </div>}
                  {field.coordinates && <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{field.coordinates.lat}, {field.coordinates.lng}</span>
                    </div>}
                </div>

                {field.costs && <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 mb-1">Costuri:</p>
                    <p className="text-sm font-medium">{field.costs.toLocaleString()} RON</p>
                    {field.roi && <>
                        <p className="text-xs text-gray-500 mt-2 mb-1">ROI:</p>
                        <p className="text-sm font-medium text-green-600">{field.roi}%</p>
                      </>}
                  </div>}

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate('/map')}>
                    Vezi pe hartă
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => navigate(`/field/${field.id}`)}>
                    Detalii
                  </Button>
                  <AlertDialog open={isDeleting === field.id} onOpenChange={open => setIsDeleting(open ? field.id : null)}>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ești sigur că vrei să ștergi terenul <strong>"{field.name}"</strong>?
                          Această acțiune nu poate fi anulată.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleting(null)}>
                          Anulează
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteField(field.id, field.name)} className="bg-red-600 hover:bg-red-700">
                          Șterge
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>
    </div>;
};

export default FieldsOverview;
