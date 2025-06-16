import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Package, Wrench, Beaker, Fuel, Settings, List } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const InventorySystem = () => {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, addTransaction } = useAppContext();
  const { toast } = useToast();

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [newItem, setNewItem] = useState({
    name: '',
    type: 'equipment' as 'equipment' | 'chemical' | 'seeds' | 'fuel' | 'other',
    quantity: '',
    unit: '',
    condition: '',
    location: '',
    expiration_date: '',
    purpose: '',
    stock_level: 'normal' as 'low' | 'normal' | 'high',
    purchase_cost: '',
    current_value: '',
    notes: '',
    purchase_date: '',
    expiry_date: '',
    cost_per_unit: ''
  });

  const categories = [
    { id: 'all', name: 'Toate', icon: List },
    { id: 'equipment', name: 'Echipamente', icon: Wrench },
    { id: 'chemical', name: 'Produse chimice', icon: Beaker },
    { id: 'seeds', name: 'Semințe', icon: Package },
    { id: 'fuel', name: 'Combustibili', icon: Fuel },
    { id: 'other', name: 'Altele', icon: Settings }
  ];

  const filteredInventory = selectedCategory === 'all' 
    ? inventory 
    : inventory.filter(item => item.type === selectedCategory);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.type || !newItem.quantity) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    const itemData = {
      name: newItem.name,
      type: newItem.type,
      quantity: newItem.quantity,
      unit: newItem.unit || '',
      condition: newItem.condition || '',
      location: newItem.location || '',
      last_used: '',
      next_maintenance: '',
      expiration_date: newItem.expiration_date || '',
      purpose: newItem.purpose || '',
      stock_level: newItem.stock_level,
      purchase_cost: newItem.purchase_cost ? parseFloat(newItem.purchase_cost) : 0,
      current_value: newItem.current_value ? parseFloat(newItem.current_value) : 0,
      notes: newItem.notes || '',
      purchase_date: newItem.purchase_date || '',
      expiry_date: newItem.expiry_date || newItem.expiration_date || '',
      cost_per_unit: newItem.cost_per_unit ? parseFloat(newItem.cost_per_unit) : 0
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
      
      // Add purchase transaction if cost is provided
      if (newItem.purchase_cost && parseFloat(newItem.purchase_cost) > 0) {
        addTransaction({
          type: 'expense' as const,
          amount: parseFloat(newItem.purchase_cost),
          description: `Achiziție: ${newItem.name}`,
          category: 'inventory',
          date: new Date().toISOString().split('T')[0],
          field_id: ''
        });
      }

      toast({
        title: "Succes",
        description: "Articolul a fost adăugat cu succes în inventar."
      });
    }

    resetForm();
    setIsAddingItem(false);
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      type: 'equipment',
      quantity: '',
      unit: '',
      condition: '',
      location: '',
      expiration_date: '',
      purpose: '',
      stock_level: 'normal',
      purchase_cost: '',
      current_value: '',
      notes: '',
      purchase_date: '',
      expiry_date: '',
      cost_per_unit: ''
    });
  };

  const handleEditItem = (item: any) => {
    setNewItem({
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      unit: item.unit || '',
      condition: item.condition || '',
      location: item.location || '',
      expiration_date: item.expiration_date || '',
      purpose: item.purpose || '',
      stock_level: item.stock_level,
      purchase_cost: item.purchase_cost?.toString() || '',
      current_value: item.current_value?.toString() || '',
      notes: item.notes || '',
      purchase_date: item.purchase_date || '',
      expiry_date: item.expiry_date || '',
      cost_per_unit: item.cost_per_unit?.toString() || ''
    });
    setEditingItem(item.id);
    setIsAddingItem(true);
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    deleteInventoryItem(itemId);
    toast({
      title: "Succes",
      description: `"${itemName}" a fost șters din inventar.`
    });
  };

  const getStockLevelBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-red-100 text-red-800">Stoc redus</Badge>;
      case 'high':
        return <Badge className="bg-blue-100 text-blue-800">Stoc mare</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Stoc normal</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment':
        return <Wrench className="h-4 w-4" />;
      case 'chemical':
        return <Beaker className="h-4 w-4" />;
      case 'seeds':
        return <Package className="h-4 w-4" />;
      case 'fuel':
        return <Fuel className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'equipment':
        return 'Echipament';
      case 'chemical':
        return 'Produs chimic';
      case 'seeds':
        return 'Semințe';
      case 'fuel':
        return 'Combustibil';
      default:
        return 'Altele';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Sistem de Inventar</h2>
          <p className="text-green-600">Gestionează echipamentele, consumabilele și materialele</p>
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
                <Label>Nume articol *</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="ex: Tractor John Deere"
                />
              </div>
              <div>
                <Label>Tip *</Label>
                <Select value={newItem.type} onValueChange={(value: 'equipment' | 'chemical' | 'seeds' | 'fuel' | 'other') => setNewItem({...newItem, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Echipament</SelectItem>
                    <SelectItem value="chemical">Produs chimic</SelectItem>
                    <SelectItem value="seeds">Semințe</SelectItem>
                    <SelectItem value="fuel">Combustibil</SelectItem>
                    <SelectItem value="other">Altele</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cantitate *</Label>
                  <Input
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    placeholder="ex: 100"
                  />
                </div>
                <div>
                  <Label>Unitate</Label>
                  <Input
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="ex: kg, l, buc"
                  />
                </div>
              </div>
              <div>
                <Label>Condiție</Label>
                <Select value={newItem.condition} onValueChange={(value) => setNewItem({...newItem, condition: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează condiția" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excelentă</SelectItem>
                    <SelectItem value="good">Bună</SelectItem>
                    <SelectItem value="fair">Acceptabilă</SelectItem>
                    <SelectItem value="poor">Proastă</SelectItem>
                    <SelectItem value="broken">Defect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Locație</Label>
                <Input
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                  placeholder="ex: Depozit principal"
                />
              </div>
              <div>
                <Label>Data expirării</Label>
                <Input
                  type="date"
                  value={newItem.expiration_date}
                  onChange={(e) => setNewItem({...newItem, expiration_date: e.target.value})}
                />
              </div>
              <div>
                <Label>Scop utilizare</Label>
                <Textarea
                  value={newItem.purpose}
                  onChange={(e) => setNewItem({...newItem, purpose: e.target.value})}
                  placeholder="Descriere utilizare..."
                />
              </div>
              <div>
                <Label>Nivel stoc</Label>
                <Select value={newItem.stock_level} onValueChange={(value: 'low' | 'normal' | 'high') => setNewItem({...newItem, stock_level: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Stoc redus</SelectItem>
                    <SelectItem value="normal">Stoc normal</SelectItem>
                    <SelectItem value="high">Stoc mare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cost achiziție (RON)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.purchase_cost}
                    onChange={(e) => setNewItem({...newItem, purchase_cost: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Valoare actuală (RON)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.current_value}
                    onChange={(e) => setNewItem({...newItem, current_value: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label>Notă</Label>
                <Textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                  placeholder="Descriere notă..."
                />
              </div>
              <div>
                <Label>Data achiziției</Label>
                <Input
                  type="date"
                  value={newItem.purchase_date}
                  onChange={(e) => setNewItem({...newItem, purchase_date: e.target.value})}
                />
              </div>
              <div>
                <Label>Data expirării</Label>
                <Input
                  type="date"
                  value={newItem.expiry_date}
                  onChange={(e) => setNewItem({...newItem, expiry_date: e.target.value})}
                />
              </div>
              <div>
                <Label>Cost per unitate (RON)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.cost_per_unit}
                  onChange={(e) => setNewItem({...newItem, cost_per_unit: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                    resetForm();
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

      {/* Categories Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <Card key={item.id} className="border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <p className="text-sm text-gray-600">{getTypeName(item.type)}</p>
                      </div>
                    </div>
                    {getStockLevelBadge(item.stock_level)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cantitate:</span>
                    <span className="font-medium">{item.quantity} {item.unit}</span>
                  </div>
                  
                  {item.condition && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Condiție:</span>
                      <span className="font-medium capitalize">{item.condition}</span>
                    </div>
                  )}
                  
                  {item.location && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Locație:</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                  )}
                  
                  {item.expiration_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expiră:</span>
                      <span className="font-medium">{item.expiration_date}</span>
                    </div>
                  )}
                  
                  {item.current_value && item.current_value > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valoare:</span>
                      <span className="font-medium">{item.current_value} RON</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInventory.length === 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nu există articole în această categorie</h3>
                <p className="text-gray-600 text-center mb-4">
                  {selectedCategory === 'all' 
                    ? 'Începeți prin a adăuga primul articol în inventar.'
                    : `Nu aveți încă articole de tipul "${categories.find(c => c.id === selectedCategory)?.name}".`
                  }
                </p>
                <Button onClick={() => setIsAddingItem(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă primul articol
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventorySystem;
