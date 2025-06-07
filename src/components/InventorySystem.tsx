
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tractor, Sprout, AlertTriangle, Plus, Edit, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InventorySystem = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('equipment');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const equipment = [
    {
      id: 1,
      name: 'Tractor Fendt 724',
      type: 'Tractor',
      condition: 'Bună',
      location: 'Hangar Principal',
      lastUsed: '2024-06-05',
      nextMaintenance: '2024-07-01'
    },
    {
      id: 2,
      name: 'Plugul 5 trupite',
      type: 'Echipament arare',
      condition: 'Foarte bună',
      location: 'Hangar Principal', 
      lastUsed: '2024-05-20',
      nextMaintenance: '2024-08-15'
    }
  ];

  const chemicals = [
    {
      id: 1,
      name: 'Glyphosate 360',
      type: 'Erbicid',
      quantity: '25L',
      expiration: '2025-03-15',
      purpose: 'Combaterea buruienilor',
      stockLevel: 'normal'
    },
    {
      id: 2,
      name: 'NPK 16-16-16',
      type: 'Îngrășământ',
      quantity: '500kg',
      expiration: '2025-12-31',
      purpose: 'Fertilizare de bază',
      stockLevel: 'low'
    }
  ];

  const crops = [
    {
      id: 1,
      name: 'Grâu de toamnă',
      field: 'Parcela Nord',
      quantity: '12.5 tone',
      harvestDate: '2024-07-15',
      quality: 'Premium',
      storageLocation: 'Siloz 1'
    },
    {
      id: 2,
      name: 'Porumb boabe',
      field: 'Câmp Sud',
      quantity: '8.2 tone',
      harvestDate: '2024-09-20',
      quality: 'Standard',
      storageLocation: 'Siloz 2'
    }
  ];

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
    toast({
      title: "Element adăugat",
      description: "Elementul a fost adăugat cu succes în inventar.",
    });
    setIsAddingItem(false);
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
                  <Label>Categorie</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipment">🚜 Echipamente</SelectItem>
                      <SelectItem value="chemicals">🌿 Chimicale</SelectItem>
                      <SelectItem value="crops">🌾 Culturi</SelectItem>
                      <SelectItem value="materials">📦 Materiale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nume element</Label>
                  <Input placeholder="ex: Tractor John Deere" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantitate/Status</Label>
                    <Input placeholder="ex: 500kg, Bună stare" />
                  </div>
                  <div>
                    <Label>Locația</Label>
                    <Input placeholder="ex: Hangar Principal" />
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
              {equipment.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Editează
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Tip:</strong> {item.type}</p>
                      <p><strong>Stare:</strong> {item.condition}</p>
                    </div>
                    <div>
                      <p><strong>Locația:</strong> {item.location}</p>
                      <p><strong>Utilizat ultima dată:</strong> {item.lastUsed}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="chemicals" className="space-y-4">
              {chemicals.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <div className="flex items-center space-x-2">
                      {getStockBadge(item.stockLevel)}
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Editează
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Tip:</strong> {item.type}</p>
                      <p><strong>Cantitate:</strong> {item.quantity}</p>
                    </div>
                    <div>
                      <p><strong>Expirare:</strong> {item.expiration}</p>
                      <p><strong>Scop:</strong> {item.purpose}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="crops" className="space-y-4">
              {crops.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Editează
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Teren:</strong> {item.field}</p>
                      <p><strong>Cantitate:</strong> {item.quantity}</p>
                    </div>
                    <div>
                      <p><strong>Recoltare:</strong> {item.harvestDate}</p>
                      <p><strong>Depozitare:</strong> {item.storageLocation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <p>Secțiunea materiale va fi implementată în curând.</p>
                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă primul material
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventorySystem;
