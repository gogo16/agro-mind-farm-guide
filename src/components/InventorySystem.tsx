
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Package, Wrench, Fuel, Droplets, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const InventorySystem = () => {
  const { 
    inventory, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem,
    addTransaction 
  } = useAppContext();
  const { toast } = useToast();

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('equipment');

  const [newItem, setNewItem] = useState({
    name: '',
    type: 'equipment' as 'equipment' | 'chemical' | 'seeds' | 'fuel' | 'other',
    quantity: '',
    unit: '',
    condition: 'good',
    location: '',
    expiration_date: '',
    purpose: '',
    stock_level: 'normal' as 'low' | 'normal' | 'high',
    purchase_cost: 0,
    current_value: 0
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'equipment':
        return <Wrench className="h-4 w-4 text-blue-600" />;
      case 'chemical':
        return <Droplets className="h-4 w-4 text-red-600" />;
      case 'seeds':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'fuel':
        return <Fuel className="h-4 w-4 text-orange-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStockLevelBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Stoc scăzut</Badge>;
      case 'high':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Stoc mare</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Stoc normal</Badge>;
    }
  };

  // Filter items by type
  const filteredItems = inventory.filter(item => item.type === activeTab);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi numele și cantitatea.",
        variant: "destructive"
      });
      return;
    }

    const itemData = {
      name: newItem.name,
      type: newItem.type,
      quantity: newItem.quantity,
      unit: newItem.unit || undefined,
      condition: newItem.condition || undefined,
      location: newItem.location || undefined,
      expiration_date: newItem.expiration_date || undefined,
      purpose: newItem.purpose || undefined,
      stock_level: newItem.stock_level,
      purchase_cost: newItem.purchase_cost || undefined,
      current_value: newItem.current_value || undefined
    };

    if (editingItem) {
      updateInventoryItem(editingItem, itemData);
      setEditingItem(null);
      toast({
        title: "Succes",
        description: "Articolul a fost actualizat cu succes."
      });
    } else {
      addInventoryItem(itemData);
      
      // Add transaction for purchase if cost is specified
      if (newItem.purchase_cost > 0) {
        addTransaction({
          type: 'expense',
          amount: newItem.purchase_cost,
          description: `Achiziție ${newItem.name}`,
          category: 'Inventar',
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      toast({
        title: "Succes",
        description: "Articolul a fost adăugat în inventar."
      });
    }

    setNewItem({
      name: '',
      type: 'equipment',
      quantity: '',
      unit: '',
      condition: 'good',
      location: '',
      expiration_date: '',
      purpose: '',
      stock_level: 'normal',
      purchase_cost: 0,
      current_value: 0
    });
    setIsAddingItem(false);
  };

  const handleEditItem = (item: any) => {
    setNewItem({
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      unit: item.unit || '',
      condition: item.condition || 'good',
      location: item.location || '',
      expiration_date: item.expiration_date || '',
      purpose: item.purpose || '',
      stock_level: item.stock_level || 'normal',
      purchase_cost: item.purchase_cost || 0,
      current_value: item.current_value || 0
    });
    setEditingItem(item.id);
    setIsAddingItem(true);
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    deleteInventoryItem(itemId);
    toast({
      title: "Articol șters",
      description: `"${itemName}" a fost șters din inventar.`
    });
  };

  const checkExpiringItems = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return inventory.filter(item => {
      if (!item.expiration_date) return false;
      const expirationDate = new Date(item.expiration_date);
      return expirationDate <= thirtyDaysFromNow;
    });
  };

  const expiringItems = checkExpiringItems();

  return (
    <div className="space-y-6">
      {expiringItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Articole care expiră în curând
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-orange-600">
                    Expiră: {item.expiration_date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Sistem Inventar</h2>
          <p className="text-green-600">Gestionarea echipamentelor, materialelor și resurselor</p>
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă articol
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editează articolul' : 'Adaugă articol nou'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nume articol *</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="ex: Tractor John Deere"
                />
              </div>
              <div>
                <Label htmlFor="type">Tip *</Label>
                <Select value={newItem.type} onValueChange={(value: 'equipment' | 'chemical' | 'seeds' | 'fuel' | 'other') => setNewItem({...newItem, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Echipament</SelectItem>
                    <SelectItem value="chemical">Chimicale</SelectItem>
                    <SelectItem value="seeds">Semințe</SelectItem>
                    <SelectItem value="fuel">Combustibil</SelectItem>
                    <SelectItem value="other">Altele</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Cantitate *</Label>
                  <Input
                    id="quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    placeholder="ex: 100"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unitate</Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="ex: litri, kg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="condition">Stare</Label>
                <Select value={newItem.condition} onValueChange={(value) => setNewItem({...newItem, condition: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excelentă</SelectItem>
                    <SelectItem value="good">Bună</SelectItem>
                    <SelectItem value="fair">Acceptabilă</SelectItem>
                    <SelectItem value="poor">Proastă</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Locație</Label>
                <Input
                  id="location"
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                  placeholder="ex: Depozit A, Șură"
                />
              </div>
              <div>
                <Label htmlFor="expiration">Data expirării</Label>
                <Input
                  id="expiration"
                  type="date"
                  value={newItem.expiration_date}
                  onChange={(e) => setNewItem({...newItem, expiration_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="purpose">Scop utilizare</Label>
                <Textarea
                  id="purpose"
                  value={newItem.purpose}
                  onChange={(e) => setNewItem({...newItem, purpose: e.target.value})}
                  placeholder="Pentru ce se folosește..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchase_cost">Cost achiziție (RON)</Label>
                  <Input
                    id="purchase_cost"
                    type="number"
                    value={newItem.purchase_cost}
                    onChange={(e) => setNewItem({...newItem, purchase_cost: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="current_value">Valoare curentă (RON)</Label>
                  <Input
                    id="current_value"
                    type="number"
                    value={newItem.current_value}
                    onChange={(e) => setNewItem({...newItem, current_value: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="stock_level">Nivel stoc</Label>
                <Select value={newItem.stock_level} onValueChange={(value: 'low' | 'normal' | 'high') => setNewItem({...newItem, stock_level: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Scăzut</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Mare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                    setNewItem({
                      name: '',
                      type: 'equipment',
                      quantity: '',
                      unit: '',
                      condition: 'good',
                      location: '',
                      expiration_date: '',
                      purpose: '',
                      stock_level: 'normal',
                      purchase_cost: 0,
                      current_value: 0
                    });
                  }} 
                  variant="outline" 
                  className="flex-1"
                >
                  Anulează
                </Button>
                <Button onClick={handleAddItem} className="flex-1 bg-green-600 hover:bg-green-700">
                  {editingItem ? 'Actualizează' : 'Adaugă articolul'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="equipment">Echipament</TabsTrigger>
          <TabsTrigger value="chemical">Chimicale</TabsTrigger>
          <TabsTrigger value="seeds">Semințe</TabsTrigger>
          <TabsTrigger value="fuel">Combustibil</TabsTrigger>
          <TabsTrigger value="other">Altele</TabsTrigger>
        </TabsList>
        
        {['equipment', 'chemical', 'seeds', 'fuel', 'other'].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.filter(item => item.type === type).map((item) => (
                <Card key={item.id} className="border-green-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getItemIcon(item.type)}
                        <div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
                        </div>
                      </div>
                      {getStockLevelBadge(item.stock_level || 'normal')}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {item.condition && (
                      <div className="text-sm">
                        <span className="font-medium">Stare:</span> {item.condition}
                      </div>
                    )}
                    {item.location && (
                      <div className="text-sm">
                        <span className="font-medium">Locație:</span> {item.location}
                      </div>
                    )}
                    {item.expiration_date && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>Expiră: {item.expiration_date}</span>
                      </div>
                    )}
                    {item.purpose && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{item.purpose}</p>
                    )}
                    {(item.purchase_cost || item.current_value) && (
                      <div className="border-t pt-2">
                        {item.purchase_cost && (
                          <div className="text-sm">
                            <span className="font-medium">Cost achiziție:</span> {item.purchase_cost} RON
                          </div>
                        )}
                        {item.current_value && (
                          <div className="text-sm">
                            <span className="font-medium">Valoare curentă:</span> {item.current_value} RON
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditItem(item)} className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Editează
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
                              Ești sigur că vrei să ștergi "{item.name}" din inventar? Această acțiune nu poate fi anulată.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Anulează</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteItem(item.id, item.name)} className="bg-red-600 hover:bg-red-700">
                              Șterge
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredItems.length === 0 && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  {getItemIcon(type)}
                  <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
                    Nu aveți articole în categoria "{type === 'equipment' ? 'Echipament' : type === 'chemical' ? 'Chimicale' : type === 'seeds' ? 'Semințe' : type === 'fuel' ? 'Combustibil' : 'Altele'}"
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    Începeți prin a adăuga primul articol din această categorie.
                  </p>
                  <Button onClick={() => {
                    setNewItem({...newItem, type: type as any});
                    setIsAddingItem(true);
                  }} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adaugă primul articol
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default InventorySystem;
