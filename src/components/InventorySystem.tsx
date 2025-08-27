
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tractor, Sprout, AlertTriangle, Plus, Edit, Brain, Trash2, Fuel, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/hooks/useInventory';

const InventorySystem = () => {
  const { toast } = useToast();
  const { inventory, loading, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useInventory();
  
  const [activeTab, setActiveTab] = useState('equipment');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    nume_element: '',
    categorie_element: '',
    cantitate_status: '',
    locatia: '',
    pret: '',
    tip_tranzactie: '',
    // Fuel-specific fields (vor fi ignorate pentru celelalte tipuri)
    fuelType: '',
    octaneRating: '',
    density: '',
    supplier: '',
    tankCapacity: '',
    currentLevel: ''
  });

  // Filtrează elementele pe categorii
  const equipmentItems = inventory.filter(item => item.categorie_element === 'equipment');
  const chemicalItems = inventory.filter(item => item.categorie_element === 'chemical');
  const cropItems = inventory.filter(item => item.categorie_element === 'crop');
  const materialItems = inventory.filter(item => item.categorie_element === 'material');
  const fuelItems = inventory.filter(item => item.categorie_element === 'fuel');

  const aiSuggestions = [
    {
      type: 'warning',
      message: 'Verifică stocul de îngrășăminte pentru sezonul următor.',
      action: 'Comandă stoc'
    },
    {
      type: 'info',
      message: 'Este momentul ideal pentru revizia echipamentelor agricole.',
      action: 'Programează revizie'
    },
    {
      type: 'suggestion',
      message: 'Monitorizează nivelul combustibilului pentru activitățile de primăvară.',
      action: 'Verifică stoc'
    }
  ];

  const getStockBadge = (item: any) => {
    // Logică simplă pentru determinarea nivelului de stoc
    if (item.cantitate_status && item.cantitate_status.toLowerCase().includes('scăzut')) {
      return <Badge className="bg-red-100 text-red-800">Stoc scăzut</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">În stoc</Badge>;
  };

  const handleAddItem = async () => {
    if (!newItem.nume_element || !newItem.categorie_element) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi numele și categoria elementului.",
        variant: "destructive"
      });
      return;
    }

    const itemToAdd = {
      nume_element: newItem.nume_element,
      categorie_element: newItem.categorie_element as any,
      cantitate_status: newItem.cantitate_status || undefined,
      locatia: newItem.locatia || undefined,
      pret: newItem.pret ? parseFloat(newItem.pret) : undefined,
      tip_tranzactie: newItem.tip_tranzactie as any || undefined
    };

    const success = await addInventoryItem(itemToAdd);
    
    if (success) {
      toast({
        title: "Element adăugat",
        description: "Elementul a fost adăugat cu succes în inventar."
      });
      
      // Reset form
      setNewItem({
        nume_element: '',
        categorie_element: '',
        cantitate_status: '',
        locatia: '',
        pret: '',
        tip_tranzactie: '',
        fuelType: '',
        octaneRating: '',
        density: '',
        supplier: '',
        tankCapacity: '',
        currentLevel: ''
      });
      setIsAddingItem(false);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
  };

  const handleUpdateItem = async () => {
    if (!editingItem.nume_element || !editingItem.categorie_element) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi numele și categoria elementului.",
        variant: "destructive"
      });
      return;
    }

    const success = await updateInventoryItem(editingItem.id, editingItem);
    
    if (success) {
      toast({
        title: "Element actualizat",
        description: "Elementul a fost actualizat cu succes."
      });
      setEditingItem(null);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const success = await deleteInventoryItem(id);
    
    if (success) {
      toast({
        title: "Element șters",
        description: "Elementul a fost șters din inventar."
      });
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Se încarcă inventarul...</span>
      </div>
    );
  }

  const renderInventoryItems = (items: any[], type: string) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Nu există elemente în această categorie.</p>
          <Button 
            className="mt-4 bg-green-600 hover:bg-green-700" 
            onClick={() => setIsAddingItem(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adaugă primul element
          </Button>
        </div>
      );
    }

    return items.map(item => (
      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">{item.nume_element}</h4>
          <div className="flex items-center space-x-2">
            {getStockBadge(item)}
            <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
              <Edit className="h-4 w-4 mr-1" />
              Editează
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ești sigur că vrei să ștergi acest element?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Această acțiune nu poate fi anulată. Elementul "{item.nume_element}" va fi șters permanent din inventar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anulează</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteItem(item.id)} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Șterge definitiv
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Categorie:</strong> {item.categorie_element}</p>
            {item.cantitate_status && <p><strong>Cantitate/Status:</strong> {item.cantitate_status}</p>}
            {item.pret && <p><strong>Preț:</strong> {item.pret} RON</p>}
          </div>
          <div>
            {item.locatia && <p><strong>Locația:</strong> {item.locatia}</p>}
            {item.tip_tranzactie && <p><strong>Tip tranzacție:</strong> {item.tip_tranzactie}</p>}
            <p><strong>Adăugat:</strong> {new Date(item.created_at).toLocaleDateString('ro-RO')}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* AI Suggestions Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Recomandări Inventar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiSuggestions.map((suggestion, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3">
              <p className="text-sm mb-2">{suggestion.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Main Inventory Tabs */}
      <Card className="bg-white border-green-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Sistem Inventar Avansat</CardTitle>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Element
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adaugă element nou în inventar</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Categorie *</Label>
                  <Select onValueChange={value => setNewItem({ ...newItem, categorie_element: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipment">🚜 Echipamente</SelectItem>
                      <SelectItem value="chemical">🌿 Chimicale</SelectItem>
                      <SelectItem value="crop">🌾 Culturi</SelectItem>
                      <SelectItem value="material">📦 Materiale</SelectItem>
                      <SelectItem value="fuel">⛽ Combustibil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Nume element *</Label>
                  <Input 
                    placeholder="ex: Tractor John Deere" 
                    value={newItem.nume_element} 
                    onChange={e => setNewItem({ ...newItem, nume_element: e.target.value })} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantitate/Status</Label>
                    <Input 
                      placeholder="ex: 500kg, Bună stare" 
                      value={newItem.cantitate_status} 
                      onChange={e => setNewItem({ ...newItem, cantitate_status: e.target.value })} 
                    />
                  </div>
                  <div>
                    <Label>Locația</Label>
                    <Input 
                      placeholder="ex: Hangar Principal" 
                      value={newItem.locatia} 
                      onChange={e => setNewItem({ ...newItem, locatia: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preț (RON)</Label>
                    <Input 
                      type="number" 
                      placeholder="ex: 1500" 
                      value={newItem.pret} 
                      onChange={e => setNewItem({ ...newItem, pret: e.target.value })} 
                    />
                  </div>
                  <div>
                    <Label>Tip tranzacție</Label>
                    <Select onValueChange={value => setNewItem({ ...newItem, tip_tranzactie: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează tipul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Cheltuială</SelectItem>
                        <SelectItem value="income">Venit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => setIsAddingItem(false)} variant="outline" className="flex-1">
                    Anulează
                  </Button>
                  <Button onClick={handleAddItem} className="flex-1 bg-green-600 hover:bg-green-700">
                    Adaugă în inventar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="equipment">🚜 Echipamente</TabsTrigger>
              <TabsTrigger value="chemicals">🌿 Chimicale</TabsTrigger>
              <TabsTrigger value="crops">🌾 Culturi</TabsTrigger>
              <TabsTrigger value="materials">📦 Materiale</TabsTrigger>
              <TabsTrigger value="fuel">⛽ Combustibil</TabsTrigger>
            </TabsList>

            <TabsContent value="equipment" className="space-y-4">
              {renderInventoryItems(equipmentItems, 'equipment')}
            </TabsContent>

            <TabsContent value="chemicals" className="space-y-4">
              {renderInventoryItems(chemicalItems, 'chemical')}
            </TabsContent>

            <TabsContent value="crops" className="space-y-4">
              {renderInventoryItems(cropItems, 'crop')}
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              {renderInventoryItems(materialItems, 'material')}
            </TabsContent>

            <TabsContent value="fuel" className="space-y-4">
              {renderInventoryItems(fuelItems, 'fuel')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      {editingItem && (
        <Dialog open={true} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editează element inventar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nume element</Label>
                <Input 
                  value={editingItem.nume_element} 
                  onChange={e => setEditingItem({ ...editingItem, nume_element: e.target.value })} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cantitate/Status</Label>
                  <Input 
                    value={editingItem.cantitate_status || ''} 
                    onChange={e => setEditingItem({ ...editingItem, cantitate_status: e.target.value })} 
                  />
                </div>
                <div>
                  <Label>Locația</Label>
                  <Input 
                    value={editingItem.locatia || ''} 
                    onChange={e => setEditingItem({ ...editingItem, locatia: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preț (RON)</Label>
                  <Input 
                    type="number"
                    value={editingItem.pret || ''} 
                    onChange={e => setEditingItem({ ...editingItem, pret: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div>
                  <Label>Tip tranzacție</Label>
                  <Select 
                    value={editingItem.tip_tranzactie || ''} 
                    onValueChange={value => setEditingItem({ ...editingItem, tip_tranzactie: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează tipul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Cheltuială</SelectItem>
                      <SelectItem value="income">Venit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => setEditingItem(null)} variant="outline" className="flex-1">
                  Anulează
                </Button>
                <Button onClick={handleUpdateItem} className="flex-1 bg-green-600 hover:bg-green-700">
                  Salvează modificările
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InventorySystem;
