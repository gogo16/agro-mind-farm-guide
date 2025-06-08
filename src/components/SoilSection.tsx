
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
    setSoilData({ ...soilData, soilType: newSoilType });
    toast({
      title: "Tip sol actualizat",
      description: `Tipul de sol a fost schimbat la: ${newSoilType}`,
    });
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
              <p className="text-2xl font-bold text-blue-600">{soilData.pH}</p>
              <p className="text-xs text-gray-500">Neutru</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Azot (N)</p>
              <p className="text-2xl font-bold text-green-600">{soilData.nitrogen}</p>
              <p className="text-xs text-gray-500">mg/kg</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Fosfor (P)</p>
              <p className="text-2xl font-bold text-purple-600">{soilData.phosphorus}</p>
              <p className="text-xs text-gray-500">mg/kg</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Potasiu (K)</p>
              <p className="text-2xl font-bold text-orange-600">{soilData.potassium}</p>
              <p className="text-xs text-gray-500">mg/kg</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">Materie organică</p>
              <p className="text-2xl font-bold text-amber-600">{soilData.organicMatter}%</p>
              <p className="text-xs text-gray-500">Bun</p>
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

          <Button className="w-full bg-green-600 hover:bg-green-700">
            Programează analiză nouă
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilSection;
