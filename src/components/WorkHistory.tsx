
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAppContext } from '@/contexts/AppContext';
import { Plus, Edit, Trash2, Calendar, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WorkHistory = () => {
  const { 
    fields, 
    workHistory, 
    ownerHistory, 
    addWorkHistory, 
    updateWorkHistory, 
    deleteWorkHistory,
    addOwnerHistory,
    updateOwnerHistory,
    deleteOwnerHistory
  } = useAppContext();
  const { toast } = useToast();

  const [isAddingWork, setIsAddingWork] = useState(false);
  const [isAddingOwner, setIsAddingOwner] = useState(false);
  const [editingWork, setEditingWork] = useState<number | null>(null);
  const [editingOwner, setEditingOwner] = useState<number | null>(null);

  const [newWork, setNewWork] = useState({
    parcelId: '',
    workType: '',
    date: '',
    description: '',
    worker: '',
    cost: ''
  });

  const [newOwner, setNewOwner] = useState({
    parcelId: '',
    ownerName: '',
    startDate: '',
    endDate: '',
    ownershipType: '',
    notes: ''
  });

  const handleAddWork = () => {
    if (!newWork.parcelId || !newWork.workType || !newWork.date || !newWork.worker) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const workData = {
      parcelId: parseInt(newWork.parcelId),
      workType: newWork.workType,
      date: newWork.date,
      description: newWork.description,
      worker: newWork.worker,
      cost: newWork.cost ? parseFloat(newWork.cost) : undefined
    };

    if (editingWork) {
      updateWorkHistory(editingWork, workData);
      setEditingWork(null);
      toast({
        title: "Succes",
        description: "Lucrarea a fost actualizată cu succes."
      });
    } else {
      addWorkHistory(workData);
      toast({
        title: "Succes",
        description: "Lucrarea a fost adăugată cu succes."
      });
    }

    setNewWork({ parcelId: '', workType: '', date: '', description: '', worker: '', cost: '' });
    setIsAddingWork(false);
  };

  const handleAddOwner = () => {
    if (!newOwner.parcelId || !newOwner.ownerName || !newOwner.startDate || !newOwner.ownershipType) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const ownerData = {
      parcelId: parseInt(newOwner.parcelId),
      ownerName: newOwner.ownerName,
      startDate: newOwner.startDate,
      endDate: newOwner.endDate || undefined,
      ownershipType: newOwner.ownershipType,
      notes: newOwner.notes || undefined
    };

    if (editingOwner) {
      updateOwnerHistory(editingOwner, ownerData);
      setEditingOwner(null);
      toast({
        title: "Succes",
        description: "Proprietarul a fost actualizat cu succes."
      });
    } else {
      addOwnerHistory(ownerData);
      toast({
        title: "Succes",
        description: "Proprietarul a fost adăugat cu succes."
      });
    }

    setNewOwner({ parcelId: '', ownerName: '', startDate: '', endDate: '', ownershipType: '', notes: '' });
    setIsAddingOwner(false);
  };

  const handleEditWork = (work: any) => {
    setNewWork({
      parcelId: work.parcelId.toString(),
      workType: work.workType,
      date: work.date,
      description: work.description,
      worker: work.worker,
      cost: work.cost?.toString() || ''
    });
    setEditingWork(work.id);
    setIsAddingWork(true);
  };

  const handleEditOwner = (owner: any) => {
    setNewOwner({
      parcelId: owner.parcelId.toString(),
      ownerName: owner.ownerName,
      startDate: owner.startDate,
      endDate: owner.endDate || '',
      ownershipType: owner.ownershipType,
      notes: owner.notes || ''
    });
    setEditingOwner(owner.id);
    setIsAddingOwner(true);
  };

  const getFieldName = (parcelId: number) => {
    const field = fields.find(f => f.id === parcelId);
    return field ? `${field.name} (${field.parcelCode})` : 'Teren necunoscut';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Istoric lucrări și proprietari</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work History */}
        <Card className="bg-white border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Istoric lucrări</span>
            </CardTitle>
            <Dialog open={isAddingWork} onOpenChange={setIsAddingWork}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Adaugă lucrare
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingWork ? 'Editează lucrarea' : 'Adaugă lucrare nouă'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Parcelă *</Label>
                    <Select onValueChange={(value) => setNewWork({...newWork, parcelId: value})} value={newWork.parcelId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează parcela" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map(field => (
                          <SelectItem key={field.id} value={field.id.toString()}>
                            {field.name} ({field.parcelCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tip lucrare *</Label>
                    <Select onValueChange={(value) => setNewWork({...newWork, workType: value})} value={newWork.workType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează tipul lucrării" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arătură">Arătură</SelectItem>
                        <SelectItem value="Însămânțare">Însămânțare</SelectItem>
                        <SelectItem value="Fertilizare">Fertilizare</SelectItem>
                        <SelectItem value="Irigare">Irigare</SelectItem>
                        <SelectItem value="Recoltare">Recoltare</SelectItem>
                        <SelectItem value="Tratament fitosanitar">Tratament fitosanitar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Data *</Label>
                      <Input
                        type="date"
                        value={newWork.date}
                        onChange={(e) => setNewWork({...newWork, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Cost (RON)</Label>
                      <Input
                        type="number"
                        value={newWork.cost}
                        onChange={(e) => setNewWork({...newWork, cost: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Executant *</Label>
                    <Input
                      value={newWork.worker}
                      onChange={(e) => setNewWork({...newWork, worker: e.target.value})}
                      placeholder="Numele persoanei care a executat lucrarea"
                    />
                  </div>
                  <div>
                    <Label>Observații</Label>
                    <Textarea
                      value={newWork.description}
                      onChange={(e) => setNewWork({...newWork, description: e.target.value})}
                      placeholder="Detalii despre lucrarea efectuată..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => {
                        setIsAddingWork(false);
                        setEditingWork(null);
                        setNewWork({ parcelId: '', workType: '', date: '', description: '', worker: '', cost: '' });
                      }} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Anulează
                    </Button>
                    <Button onClick={handleAddWork} className="flex-1 bg-green-600 hover:bg-green-700">
                      {editingWork ? 'Actualizează' : 'Adaugă lucrarea'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-3">
            {workHistory.map((work) => (
              <div key={work.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{work.workType}</h4>
                    <p className="text-sm text-gray-600">{getFieldName(work.parcelId)}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditWork(work)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ești sigur că vrei să ștergi această lucrare? Această acțiune nu poate fi anulată.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anulează</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteWorkHistory(work.id)} className="bg-red-600 hover:bg-red-700">
                            Șterge
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{work.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{work.worker}</span>
                  </div>
                  {work.cost && (
                    <Badge variant="secondary">{work.cost} RON</Badge>
                  )}
                </div>
                {work.description && (
                  <p className="text-sm text-gray-700">{work.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Owner History */}
        <Card className="bg-white border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <span>Istoric proprietari</span>
            </CardTitle>
            <Dialog open={isAddingOwner} onOpenChange={setIsAddingOwner}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Adaugă proprietar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingOwner ? 'Editează proprietarul' : 'Adaugă proprietar nou'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Parcelă *</Label>
                    <Select onValueChange={(value) => setNewOwner({...newOwner, parcelId: value})} value={newOwner.parcelId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează parcela" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map(field => (
                          <SelectItem key={field.id} value={field.id.toString()}>
                            {field.name} ({field.parcelCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nume proprietar *</Label>
                    <Input
                      value={newOwner.ownerName}
                      onChange={(e) => setNewOwner({...newOwner, ownerName: e.target.value})}
                      placeholder="Numele proprietarului"
                    />
                  </div>
                  <div>
                    <Label>Tip proprietate *</Label>
                    <Select onValueChange={(value) => setNewOwner({...newOwner, ownershipType: value})} value={newOwner.ownershipType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează tipul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Proprietar">Proprietar</SelectItem>
                        <SelectItem value="Închiriere">Închiriere</SelectItem>
                        <SelectItem value="Arendă">Arendă</SelectItem>
                        <SelectItem value="Uzufruct">Uzufruct</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Data început *</Label>
                      <Input
                        type="date"
                        value={newOwner.startDate}
                        onChange={(e) => setNewOwner({...newOwner, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Data sfârșit</Label>
                      <Input
                        type="date"
                        value={newOwner.endDate}
                        onChange={(e) => setNewOwner({...newOwner, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Observații</Label>
                    <Textarea
                      value={newOwner.notes}
                      onChange={(e) => setNewOwner({...newOwner, notes: e.target.value})}
                      placeholder="Detalii despre proprietate..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => {
                        setIsAddingOwner(false);
                        setEditingOwner(null);
                        setNewOwner({ parcelId: '', ownerName: '', startDate: '', endDate: '', ownershipType: '', notes: '' });
                      }} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Anulează
                    </Button>
                    <Button onClick={handleAddOwner} className="flex-1 bg-green-600 hover:bg-green-700">
                      {editingOwner ? 'Actualizează' : 'Adaugă proprietarul'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-3">
            {ownerHistory.map((owner) => (
              <div key={owner.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{owner.ownerName}</h4>
                    <p className="text-sm text-gray-600">{getFieldName(owner.parcelId)}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditOwner(owner)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ești sigur că vrei să ștergi acest proprietar? Această acțiune nu poate fi anulată.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anulează</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteOwnerHistory(owner.id)} className="bg-red-600 hover:bg-red-700">
                            Șterge
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <Badge className="bg-blue-100 text-blue-800">{owner.ownershipType}</Badge>
                  <span>{owner.startDate} {owner.endDate ? `- ${owner.endDate}` : '- prezent'}</span>
                </div>
                {owner.notes && (
                  <p className="text-sm text-gray-700">{owner.notes}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkHistory;
