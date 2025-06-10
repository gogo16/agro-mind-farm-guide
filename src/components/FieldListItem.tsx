
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import TaskBadges from './TaskBadges';

interface FieldListItemProps {
  field: any;
}

const FieldListItem = ({ field }: FieldListItemProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteField, tasks } = useAppContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excelent</Badge>;
      case 'healthy':
        return null;
      case 'attention':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Atenție</Badge>;
      default:
        return null;
    }
  };

  const handleDeleteField = (fieldId: number, fieldName: string) => {
    deleteField(fieldId);
    toast({
      title: "Teren șters",
      description: `Terenul "${fieldName}" a fost șters cu succes.`
    });
    setIsDeleting(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
        <TaskBadges fieldName={field.name} tasks={tasks} />
        {getStatusBadge(field.status)}
        <Button size="sm" variant="outline" onClick={() => navigate(`/field/${field.id}`)} className="text-xs">
          Detalii
        </Button>
        <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
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
              <AlertDialogCancel onClick={() => setIsDeleting(false)}>
                Anulează
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteField(field.id, field.name)} className="bg-red-600 hover:bg-red-700">
                Șterge
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default FieldListItem;
