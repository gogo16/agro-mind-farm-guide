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
  const {
    toast
  } = useToast();
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
    setNewWork({
      parcelId: '',
      workType: '',
      date: '',
      description: '',
      worker: '',
      cost: ''
    });
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
    setNewOwner({
      parcelId: '',
      ownerName: '',
      startDate: '',
      endDate: '',
      ownershipType: '',
      notes: ''
    });
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
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work History */}
        

        {/* Owner History */}
        
      </div>
    </div>;
};
export default WorkHistory;