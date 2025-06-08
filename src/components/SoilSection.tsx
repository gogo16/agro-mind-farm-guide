
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SoilSectionProps {
  fieldId: number;
}

const SoilSection = ({ fieldId }: SoilSectionProps) => {
  const { toast } = useToast();
  const [soilData, setSoilData] = useState({
    soilType: 'Cernoziom',
    pH: 7.2,
    nitrogen: 85,
    phosphorus: 45,
    potassium: 120,
    organicMatter: 3.8,
    lastAnalysis: '2024-03-15'
  });

  const [isAddingCustomSoil, setIsAddingCustomSoil] = useState(false);
  const [customSoilType, setCustomSoilType] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);

  const soilTypes = [
    'Cernoziom',
    'Luvosol',
    'Cambisol',
    'Fluvisol',
    'Regosol',
    'Gleysol',
    'Vertisol',
    'Podzol'
  ];

  const handleSoilTypeChange = (newSoilType: string) => {
    if (newSoilType === 'custom') {
      setIsAddingCustomSoil(true);
      return;
    }
    setSoilData({ ...soilData, soilType: newSoilType });
    toast({
      title: "Tip sol actualizat",
      description: `Tipul de sol a fost schimbat la: ${newSoilType}`,
    });
  };

  const handleCustomSoilAdd = () => {
    if (!customSoilType.trim()) {
      toast({
        title: "Eroare",
        description: "Te rugăm să introduci un nume pentru tipul de sol.",
        variant: "destructive"
      });
      return;
    }
    
    setSoilData({ ...soilData, soilType: customSoilType });
    toast({
      title: "Tip sol personalizat adăugat",
      description: `Tipul de sol "${customSoilType}" a fost adăugat cu succes.`,
    });
    setCustomSoilType('');
    setIsAddingCustomSoil(false);
  };

  const handleValueUpdate = (field: string, value: number) => {
    setSoilData({ ...soilData, [field]: value });
    setEditingField(null);
    toast({
      title: "Valoare actualizată",
      description: `${field} a fost actualizat cu succes.`,
    });
  };

  const renderEditableValue = (field: string, value: number, unit: string, label: string) => {
    if (editingField === field) {
      return (
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            step="0.1"
            defaultValue={value}
            className="w-20 h-8"
            onBlur={(e) => handleValueUpdate(field, parseFloat(e.target.value) || value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleValueUpdate(field, parseFloat((e.target as HTMLInputElement).value) || value);
              }
            }}
            autoFocus
          />
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      );
    }

    return (
      <div 
        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={() => setEditingField(field)}
      >
        <p className="text-2xl font-bold text-blue-600">{value}</p>
        <p className="text-xs text-gray-500">{unit}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Analiza Solului</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Tip de sol</Label>
              <Select value={soilData.soilType} onValueChange={handleSoilTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                  <SelectItem value="custom">+ Adaugă tip personalizat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ultima analiză</p>
              <p className="font-medium">{soilData.lastAnalysis}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">pH</p>
              {renderEditableValue('pH', soilData.pH, 'Neutru', 'pH')}
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Azot (N)</p>
              {renderEditableValue('nitrogen', soilData.nitrogen, 'mg/kg', 'Azot')}
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Fosfor (P)</p>
              {renderEditableValue('phosphorus', soilData.phosphorus, 'mg/kg', 'Fosfor')}
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Potasiu (K)</p>
              {renderEditableValue('potassium', soilData.potassium, 'mg/kg', 'Potasiu')}
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">Materie organică</p>
              {renderEditableValue('organicMatter', soilData.organicMatter, '%', 'Materie organică')}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Recomandări</h4>
            <div className="space-y-2">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ Nivelul de pH este optim pentru majoritatea culturilor</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">⚠ Nivelul de fosfor este moderat - consideră fertilizarea fosfatică</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">ℹ Conținutul de materie organică este bun</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddingCustomSoil} onOpenChange={setIsAddingCustomSoil}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adaugă tip de sol personalizat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customSoil">Nume tip de sol</Label>
              <Input
                id="customSoil"
                value={customSoilType}
                onChange={(e) => setCustomSoilType(e.target.value)}
                placeholder="ex: Sol argilos local"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setIsAddingCustomSoil(false)} variant="outline" className="flex-1">
                Anulează
              </Button>
              <Button onClick={handleCustomSoilAdd} className="flex-1 bg-green-600 hover:bg-green-700">
                Adaugă
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoilSection;
