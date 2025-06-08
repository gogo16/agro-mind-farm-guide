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
  const [editingDoc, setEditingDoc] = useState<number | null>(null);

  const [newDoc, setNewDoc] = useState({
    parcelId: '',
    type: '',
    name: '',
    fileName: '',
    issueDate: '',
    validUntil: '',
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

  const handleAddDocument = () => {
    if (!newDoc.type || !newDoc.name) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi tipul și numele documentului.",
        variant: "destructive"
      });
      return;
    }

    const docData = {
      parcelId: newDoc.parcelId && newDoc.parcelId !== 'general' ? parseInt(newDoc.parcelId) : undefined,
      type: newDoc.type,
      name: newDoc.name,
      fileName: newDoc.fileName || `${newDoc.name}.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      issueDate: newDoc.issueDate || undefined,
      validUntil: newDoc.validUntil || undefined,
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

    setNewDoc({ parcelId: '', type: '', name: '', fileName: '', issueDate: '', validUntil: '', status: 'complete', notes: '' });
    setIsAddingDoc(false);
  };

  const handleEditDocument = (doc: any) => {
    setNewDoc({
      parcelId: doc.parcelId?.toString() || '',
      type: doc.type,
      name: doc.name,
      fileName: doc.fileName,
      issueDate: doc.issueDate || '',
      validUntil: doc.validUntil || '',
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

  const getFieldName = (parcelId?: number) => {
    if (!parcelId) return 'General';
    const field = fields.find(f => f.id === parcelId);
    return field ? `${field.name} (${field.parcelCode})` : 'Teren necunoscut';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDoc({...newDoc, fileName: file.name});
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
                <Select onValueChange={(value) => setNewDoc({...newDoc, type: value})} value={newDoc.type}>
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
                <Select onValueChange={(value) => setNewDoc({...newDoc, parcelId: value})} value={newDoc.parcelId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează parcela (opțional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General (nu se aplică unei parcele)</SelectItem>
                    {fields.map(field => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.name} ({field.parcelCode})
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
                {newDoc.fileName && (
                  <p className="text-sm text-gray-600 mt-1">Fișier: {newDoc.fileName}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data emiterii</Label>
                  <Input
                    type="date"
                    value={newDoc.issueDate}
                    onChange={(e) => setNewDoc({...newDoc, issueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Valabil până la</Label>
                  <Input
                    type="date"
                    value={newDoc.validUntil}
                    onChange={(e) => setNewDoc({...newDoc, validUntil: e.target.value})}
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
                    setNewDoc({ parcelId: '', type: '', name: '', fileName: '', issueDate: '', validUntil: '', status: 'complete', notes: '' });
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
        {propertyDocuments.map((doc) => (
          <Card key={doc.id} className="bg-white border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{doc.name}</CardTitle>
                  <p className="text-sm text-gray-600">{doc.type}</p>
                  <p className="text-xs text-gray-500">{getFieldName(doc.parcelId)}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  {getStatusBadge(doc.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{doc.fileName}</span>
              </div>
              
              {doc.issueDate && (
                <div className="text-xs text-gray-500">
                  Emis: {doc.issueDate}
                </div>
              )}
              
              {doc.validUntil && (
                <div className="text-xs text-gray-500">
                  Valabil până: {doc.validUntil}
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
        ))}
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
