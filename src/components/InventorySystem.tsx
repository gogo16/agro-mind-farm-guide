
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
import { Tractor, Sprout, AlertTriangle, Plus, Edit, Brain, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const InventorySystem = () => {
  const { toast } = useToast();
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, addTransaction } = useAppContext();
  const [activeTab, setActiveTab] = useState('equipment');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    quantity: '',
    condition: '',
    location: '',
    expiration: '',
    purpose: '',
    price: '',
    transactionType: ''
  });

  const equipmentItems = inventory.filter(item => item.type === 'equipment');
  const chemicalItems = inventory.filter(item => item.type === 'chemical');
  const cropItems = inventory.filter(item => item.type === 'crop');
  const materialItems = inventory.filter(item => item.type === 'material');

  const aiSuggestions = [
    {
      type: 'warning',
      message: 'NPK 16-16-16 este la nivel scăzut. Recomandăm reaprovizionarea pentru sezonul următor.',
      action: 'Comandă 1000kg'
    },
    {
      type: 'info',
      message: 'Tractorul Fendt nu a fost utilizat de 2 săptămâni. Este momentul ideal pentru revizia programată.',
      action: 'Programează revizie'
    },
    {
      type: 'suggestion',
      message: 'Pe baza suprafeței cu grâu, veți avea nevoie de ~75L glyphosate luna viitoare.',
      action: 'Pregătește stoc'
    }
  ];

  const getStockBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-red-100 text-red-800">Stoc scăzut</Badge>;
      case 'normal':
        return <Badge className="bg-green-100 text-green-800">În stoc</Badge>;
      case 'high':
        return <Badge className="bg-blue-100 text-blue-800">Stoc mare</Badge>;
      default:
        return <Badge variant="secondary">Necunoscut</Badge>;
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.type) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi numele și tipul elementului.",
        variant: "destructive"
      });
      return;
    }

    const itemToAdd = {
      name: newItem.name,
      type: newItem.type,
      quantity: newItem.quantity,
      condition: newItem.condition,
      location: newItem.location,
      expiration: newItem.expiration,
      purpose: newItem.purpose,
      stockLevel: 'normal' as const
    };

    addInventoryItem(itemToAdd);

    // If item has price, add transaction
    if (newItem.price && parseFloat(newItem.price) > 0) {
      const transactionType = newItem.transactionType || 'expense';
      addTransaction({
        type: transactionType as 'income' | 'expense',
        amount: parseFloat(newItem.price),
        description: `${transactionType === 'income' ? 'Vânzare' : 'Achiziție'} ${newItem.name}`,
        category: newItem.type === 'equipment' ? 'Utilaje' : 
                 newItem.type === 'chemical' ? 'Chimicale' : 
                 newItem.type === 'crop' ? 'Vânzări' : 'Materiale',
        field: 'General',
        date: new Date().toISOString().split('T')[0]
      });
    }

    toast({
      title: "Element adăugat",
      description: "Elementul a fost adăugat cu succes în inventar.",
    });

    setNewItem({ name: '', type: '', quantity: '', condition: '', location: '', expiration: '', purpose: '', price: '', transactionType: '' });
    setIsAddingItem(false);
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
  };

  const handleUpdateItem = () => {
    if (!editingItem.name || !editingItem.type) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi numele și tipul elementului.",
        variant: "destructive"
      });
      return;
    }

    updateInventoryItem(editingItem.id, editingItem);
    
    toast({
      title: "Element actualizat",
      description: "Elementul a fost actualizat cu succes.",
    });

    setEditingItem(null);
  };

  const handleDeleteItem = (id: number) => {
    deleteInventoryItem(id);
    toast({
      title: "Element șters",
      description: "Elementul a fost șters din inventar.",
    });
  };

  const renderInventoryItems = (items: any[], type: string) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Nu există elemente în această categorie.</p>
          <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă primul element
          </Button>
        </div>
      );
    }

    return items.map((item) => (
      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          <div className="flex items-center space-x-2">
            {item.stockLevel && getStockBadge(item.stockLevel)}
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
                    Această acțiune nu poate fi anulată. Elementul "{item.name}" va fi șters permanent din inventar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anulează</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-red-600 hover:bg-red-700">
                    Șterge definitiv
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Tip:</strong> {item.type}</p>
            {item.quantity && <p><strong>Cantitate:</strong> {item.quantity}</p>}
            {item.condition && <p><strong>Stare:</strong> {item.condition}</p>}
          </div>
          <div>
            {item.location && <p><strong>Locația:</strong> {item.location}</p>}
            {item.expiration && <p><strong>Expirare:</strong> {item.expiration}</p>}
            {item.purpose && <p><strong>Scop:</strong> {item.purpose}</p>}
            {item.lastUsed && <p><strong>Utilizat ultima dată:</strong> {item.lastUsed}</p>}
            {item.nextMaintenance && <p><strong>Următoarea revizie:</strong> {item.nextMaintenance}</p>}
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
              <Button size="sm" className="bg-white text-purple-600 hover:bg-gray-100">
                {suggestion.action}
              </Button>
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
                  <Select onValueChange={(value) => setNewItem({...newItem, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipment">🚜 Echipamente</SelectItem>
                      <SelectItem value="chemical">🌿 Chimicale</SelectItem>
                      <SelectItem value="crop">🌾 Culturi</SelectItem>
                      <SelectItem value="material">📦 Materiale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nume element *</Label>
                  <Input 
                    placeholder="ex: Tractor John Deere" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantitate/Status</Label>
                    <Input 
                      placeholder="ex: 500kg, Bună stare" 
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Locația</Label>
                    <Input 
                      placeholder="ex: Hangar Principal" 
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Preț (RON)</Label>
                    <Input 
                      type="number" 
                      placeholder="ex: 1500" 
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Tip tranzacție</Label>
                    <Select onValueChange={(value) => setNewItem({...newItem, transactionType: value})}>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="equipment">🚜 Echipamente</TabsTrigger>
              <TabsTrigger value="chemicals">🌿 Chimicale</TabsTrigger>
              <TabsTrigger value="crops">🌾 Culturi</TabsTrigger>
              <TabsTrigger value="materials">📦 Materiale</TabsTrigger>
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
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cantitate/Status</Label>
                  <Input 
                    value={editingItem.quantity || ''}
                    onChange={(e) => setEditingItem({...editingItem, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Locația</Label>
                  <Input 
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                  />
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
