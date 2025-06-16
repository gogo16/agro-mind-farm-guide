
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
import { Plus, Edit, Trash2, FileText, Upload, Eye, Download, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PropertyDocuments = () => {
  const { 
    fields, 
    propertyDocuments, 
    addPropertyDocument, 
    updatePropertyDocument, 
    deletePropertyDocument 
  } = useAppContext();
  const { toast } = useToast();

  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);

  const [newDoc, setNewDoc] = useState({
    field_id: '',
    document_type: '',
    name: '',
    file_name: '',
    issue_date: '',
    valid_until: '',
    status: 'complete' as 'verified' | 'missing' | 'expired' | 'complete',
    notes: ''
  });

  const documentTypes = [
    'Certificat de Atestare Fiscală',
    'Contract închiriere',
    'Act de proprietate',
    'Extras CF',
    'Autorizație construire',
    'Certificat agricol',
    'Document APIA',
    'Document AFIR',
    'Asigurare agricolă',
    'Altul'
  ];

  // Funcție pentru verificarea stării de expirare
  const getExpirationStatus = (validUntil?: string) => {
    if (!validUntil) return null;
    
    const today = new Date();
    const expirationDate = new Date(validUntil);
    const daysDifference = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 0) {
      return { type: 'expired', message: 'Expirat', color: 'bg-red-100 text-red-800 border-red-200' };
    } else if (daysDifference <= 7) {
      return { type: 'expiring', message: 'Expiră curând', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    }
    
    return null;
  };

  // Funcție pentru obținerea culorii terenului cu transparență
  const getFieldColor = (fieldId?: string) => {
    if (!fieldId) return 'rgba(0, 0, 0, 0)'; // Transparent pentru documente generale
    
    const field = fields.find(f => f.id === fieldId);
    if (!field?.color) return 'rgba(0, 0, 0, 0)';
    
    // Convertim culoarea hex la rgba cu 60% transparență
    const hex = field.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  const handleAddDocument = () => {
    if (!newDoc.document_type || !newDoc.name) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi tipul și numele documentului.",
        variant: "destructive"
      });
      return;
    }

    const docData = {
      field_id: newDoc.field_id && newDoc.field_id !== 'general' ? newDoc.field_id : undefined,
      document_type: newDoc.document_type,
      name: newDoc.name,
      file_name: newDoc.file_name || `${newDoc.name}.pdf`,
      upload_date: new Date().toISOString().split('T')[0],
      issue_date: newDoc.issue_date || undefined,
      valid_until: newDoc.valid_until || undefined,
      status: newDoc.status,
      notes: newDoc.notes || undefined
    };

    if (editingDoc) {
      updatePropertyDocument(editingDoc, docData);
      setEditingDoc(null);
      toast({
        title: "Succes",
        description: "Documentul a fost actualizat cu succes."
      });
    } else {
      addPropertyDocument(docData);
      toast({
        title: "Succes",
        description: "Documentul a fost adăugat cu succes."
      });
    }

    setNewDoc({ field_id: '', document_type: '', name: '', file_name: '', issue_date: '', valid_until: '', status: 'complete', notes: '' });
    setIsAddingDoc(false);
  };

  const handleEditDocument = (doc: any) => {
    setNewDoc({
      field_id: doc.field_id || '',
      document_type: doc.document_type,
      name: doc.name,
      file_name: doc.file_name,
      issue_date: doc.issue_date || '',
      valid_until: doc.valid_until || '',
      status: doc.status,
      notes: doc.notes || ''
    });
    setEditingDoc(doc.id);
    setIsAddingDoc(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verificat</Badge>;
      case 'missing':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Lipsă</Badge>;
      case 'expired':
        return <Badge className="bg-orange-100 text-orange-800"><AlertTriangle className="h-3 w-3 mr-1" />Expirat</Badge>;
      case 'complete':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Complet</Badge>;
      default:
        return <Badge variant="secondary">Necunoscut</Badge>;
    }
  };

  const getFieldName = (fieldId?: string) => {
    if (!fieldId) return 'General';
    const field = fields.find(f => f.id === fieldId);
    return field ? `${field.name} (${field.parcel_code})` : 'Teren necunoscut';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDoc({...newDoc, file_name: file.name});
      toast({
        title: "Fișier selectat",
        description: `Fișierul ${file.name} a fost selectat pentru încărcare.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Acte și Proprietate</h2>
          <p className="text-green-600">Gestionează documentele de proprietate și actele oficiale</p>
        </div>
        <Dialog open={isAddingDoc} onOpenChange={setIsAddingDoc}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDoc ? 'Editează documentul' : 'Adaugă document nou'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tip document *</Label>
                <Select onValueChange={(value) => setNewDoc({...newDoc, document_type: value})} value={newDoc.document_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tipul documentului" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nume document *</Label>
                <Input
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                  placeholder="ex: CF Parcela Nord"
                />
              </div>
              <div>
                <Label>Parcelă asociată</Label>
                <Select onValueChange={(value) => setNewDoc({...newDoc, field_id: value})} value={newDoc.field_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează parcela (opțional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General (nu se aplică unei parcele)</SelectItem>
                    {fields.map(field => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name} ({field.parcel_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Încarcă fișier</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
                {newDoc.file_name && (
                  <p className="text-sm text-gray-600 mt-1">Fișier: {newDoc.file_name}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data emiterii</Label>
                  <Input
                    type="date"
                    value={newDoc.issue_date}
                    onChange={(e) => setNewDoc({...newDoc, issue_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Valabil până la</Label>
                  <Input
                    type="date"
                    value={newDoc.valid_until}
                    onChange={(e) => setNewDoc({...newDoc, valid_until: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select onValueChange={(value) => setNewDoc({...newDoc, status: value as any})} value={newDoc.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complet</SelectItem>
                    <SelectItem value="verified">Verificat</SelectItem>
                    <SelectItem value="missing">Lipsă</SelectItem>
                    <SelectItem value="expired">Expirat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Observații</Label>
                <Textarea
                  value={newDoc.notes}
                  onChange={(e) => setNewDoc({...newDoc, notes: e.target.value})}
                  placeholder="Detalii despre document..."
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    setIsAddingDoc(false);
                    setEditingDoc(null);
                    setNewDoc({ field_id: '', document_type: '', name: '', file_name: '', issue_date: '', valid_until: '', status: 'complete', notes: '' });
                  }} 
                  variant="outline" 
                  className="flex-1"
                >
                  Anulează
                </Button>
                <Button onClick={handleAddDocument} className="flex-1 bg-green-600 hover:bg-green-700">
                  {editingDoc ? 'Actualizează' : 'Adaugă documentul'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyDocuments.map((doc) => {
          const expirationStatus = getExpirationStatus(doc.valid_until);
          const fieldColor = getFieldColor(doc.field_id);
          
          return (
            <Card 
              key={doc.id} 
              className="border-green-200 hover:shadow-lg transition-shadow"
              style={{
                borderLeft: expirationStatus ? `4px solid ${expirationStatus.type === 'expired' ? '#dc2626' : '#ea580c'}` : undefined,
                backgroundColor: fieldColor
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <p className="text-sm text-gray-600">{doc.document_type}</p>
                    <p className="text-xs text-gray-500">{getFieldName(doc.field_id)}</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {getStatusBadge(doc.status)}
                    {expirationStatus && (
                      <Badge className={expirationStatus.color}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {expirationStatus.message}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{doc.file_name}</span>
                </div>
                
                {doc.issue_date && (
                  <div className="text-xs text-gray-500">
                    Emis: {doc.issue_date}
                  </div>
                )}
                
                {doc.valid_until && (
                  <div className="text-xs text-gray-500">
                    Valabil până: {doc.valid_until}
                  </div>
                )}

                {doc.notes && (
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{doc.notes}</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Vezi
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Descarcă
                    </Button>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditDocument(doc)}>
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
                            Ești sigur că vrei să ștergi documentul "{doc.name}"? Această acțiune nu poate fi anulată.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anulează</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePropertyDocument(doc.id)} className="bg-red-600 hover:bg-red-700">
                            Șterge
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {propertyDocuments.length === 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nu aveți documente încărcate</h3>
            <p className="text-gray-600 text-center mb-4">
              Începeți prin a adăuga primul document de proprietate sau act oficial.
            </p>
            <Button onClick={() => setIsAddingDoc(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă primul document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyDocuments;
