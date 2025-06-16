import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, Plus, PackagePlus } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  type: "equipment" | "chemical" | "seeds" | "fuel" | "other";
  quantity: number;
  unit: string;
  condition: string;
  location: string;
  expiration_date: string | null;
  purpose: string;
  stock_level: "high" | "low" | "normal";
  purchase_cost: number;
  current_value: number;
  created_at: string;
  updated_at: string;
  last_used: string | null;
  next_maintenance: string | null;
}

const InventorySystem = () => {
  const { inventory, addInventoryItem, addTransaction } = useAppContext();
  const { toast } = useToast();
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    quantity: '',
    unit: '',
    condition: 'nou',
    location: '',
    expiration_date: '',
    purpose: '',
    stock_level: 'normal',
    purchase_cost: '',
    current_value: ''
  });

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.type) return;
    
    try {
      const itemData = {
        name: newItem.name,
        type: newItem.type as "equipment" | "chemical" | "seeds" | "fuel" | "other",
        quantity: newItem.quantity,
        unit: newItem.unit,
        condition: newItem.condition,
        location: newItem.location,
        expiration_date: newItem.expiration_date || null,
        purpose: newItem.purpose,
        stock_level: newItem.stock_level as "high" | "low" | "normal",
        purchase_cost: parseFloat(newItem.purchase_cost) || 0,
        current_value: parseFloat(newItem.current_value) || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_used: null,
        next_maintenance: null,
      };

      await addInventoryItem(itemData);

      const transactionData = {
        type: "expense" as const,
        amount: parseFloat(newItem.purchase_cost) || 0,
        description: `Achiziție ${newItem.name}`,
        category: 'inventar',
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        field_id: '',
        budget_category: 'equipment',
        roi_impact: 0,
      };

      await addTransaction(transactionData);
      
      toast({
        title: "Element adăugat",
        description: "Elementul a fost adăugat cu succes în inventar."
      });
      
      setNewItem({
        name: '',
        type: '',
        quantity: '',
        unit: '',
        condition: 'nou',
        location: '',
        expiration_date: '',
        purpose: '',
        stock_level: 'normal',
        purchase_cost: '',
        current_value: ''
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea elementului.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-white border-green-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-800 flex items-center space-x-2">
          <PackagePlus className="h-5 w-5" />
          <span>Sistem de Inventar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Item Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nume</Label>
            <Input 
              type="text" 
              id="name" 
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">Tip</Label>
            <Select onValueChange={(value) => setNewItem({ ...newItem, type: value })} value={newItem.type}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează tipul..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment">Echipament</SelectItem>
                <SelectItem value="chemical">Substanță chimică</SelectItem>
                <SelectItem value="seeds">Semințe</SelectItem>
                <SelectItem value="fuel">Combustibil</SelectItem>
                <SelectItem value="other">Altele</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Cantitate</Label>
            <Input 
              type="number" 
              id="quantity" 
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="unit" className="text-sm font-medium text-gray-700">Unitate</Label>
            <Input 
              type="text" 
              id="unit" 
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="condition" className="text-sm font-medium text-gray-700">Condiție</Label>
            <Select onValueChange={(value) => setNewItem({ ...newItem, condition: value })} value={newItem.condition}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează condiția..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nou">Nou</SelectItem>
                <SelectItem value="folosit">Folosit</SelectItem>
                <SelectItem value="recondiționat">Recondiționat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Locație</Label>
            <Input 
              type="text" 
              id="location" 
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="expiration_date" className="text-sm font-medium text-gray-700">Data Expirării</Label>
            <Input 
              type="date" 
              id="expiration_date" 
              value={newItem.expiration_date}
              onChange={(e) => setNewItem({ ...newItem, expiration_date: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">Scop</Label>
            <Input 
              type="text" 
              id="purpose" 
              value={newItem.purpose}
              onChange={(e) => setNewItem({ ...newItem, purpose: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="stock_level" className="text-sm font-medium text-gray-700">Nivel Stoc</Label>
            <Select onValueChange={(value) => setNewItem({ ...newItem, stock_level: value })} value={newItem.stock_level}>
              <SelectTrigger>
                <SelectValue placeholder="Selectează nivelul..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Ridicat</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Scăzut</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="purchase_cost" className="text-sm font-medium text-gray-700">Cost Achiziție</Label>
            <Input 
              type="number" 
              id="purchase_cost" 
              value={newItem.purchase_cost}
              onChange={(e) => setNewItem({ ...newItem, purchase_cost: e.target.value })}
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="current_value" className="text-sm font-medium text-gray-700">Valoare Curentă</Label>
            <Input 
              type="number" 
              id="current_value" 
              value={newItem.current_value}
              onChange={(e) => setNewItem({ ...newItem, current_value: e.target.value })}
              className="mt-1" 
            />
          </div>
        </div>

        <Button onClick={handleAddItem} className="w-full bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Adaugă Element
        </Button>

        {/* Inventory List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <List className="h-5 w-5 text-gray-600" />
            <span>Inventar</span>
          </h3>
          <div className="mt-2 space-y-2">
            {inventory.map((item) => (
              <Card key={item.id} className="bg-green-50 border border-green-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} {item.unit} - {item.condition}</p>
                    </div>
                    <span className="text-sm text-gray-500">Locație: {item.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventorySystem;
