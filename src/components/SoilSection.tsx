
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Beaker, Droplets, Thermometer, Leaf } from 'lucide-react';

interface SoilSectionProps {
  fieldId?: string;
}

const SoilSection = ({ fieldId }: SoilSectionProps) => {
  // Mock soil data - în viitor aceasta va fi obținută din baza de date
  const soilData = {
    ph: 6.8,
    nitrogen: 85,
    phosphorus: 42,
    potassium: 78,
    organicMatter: 3.2,
    moisture: 65,
    temperature: 18,
    type: 'Cernoziom',
    lastTested: '2024-05-15'
  };

  const getSoilHealthColor = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return 'bg-green-100 text-green-800';
    if (value < min * 0.8 || value > max * 1.2) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center space-x-2">
          <Beaker className="h-5 w-5" />
          <span>Analiza Solului</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Proprietăți chimice */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">Proprietăți Chimice</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{soilData.ph}</div>
              <div className="text-sm text-gray-600">pH</div>
              <Badge className={getSoilHealthColor(soilData.ph, 6.0, 7.5)}>
                {soilData.ph >= 6.0 && soilData.ph <= 7.5 ? 'Optim' : 'Atenție'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{soilData.nitrogen}%</div>
              <div className="text-sm text-gray-600">Azot</div>
              <Badge className={getSoilHealthColor(soilData.nitrogen, 70, 90)}>
                {soilData.nitrogen >= 70 && soilData.nitrogen <= 90 ? 'Bun' : 'Moderat'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{soilData.phosphorus}</div>
              <div className="text-sm text-gray-600">Fosfor (ppm)</div>
              <Badge className={getSoilHealthColor(soilData.phosphorus, 30, 50)}>
                {soilData.phosphorus >= 30 && soilData.phosphorus <= 50 ? 'Bun' : 'Scăzut'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{soilData.potassium}</div>
              <div className="text-sm text-gray-600">Potasiu (ppm)</div>
              <Badge className={getSoilHealthColor(soilData.potassium, 60, 80)}>
                {soilData.potassium >= 60 && soilData.potassium <= 80 ? 'Bun' : 'Moderat'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Proprietăți fizice */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">Proprietăți Fizice</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Droplets className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-lg font-semibold">{soilData.moisture}%</div>
                <div className="text-sm text-gray-600">Umiditate</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Thermometer className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-lg font-semibold">{soilData.temperature}°C</div>
                <div className="text-sm text-gray-600">Temperatură</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Leaf className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-lg font-semibold">{soilData.organicMatter}%</div>
                <div className="text-sm text-gray-600">Materie organică</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informații generale */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">Informații Generale</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Tip sol</div>
              <div className="font-medium">{soilData.type}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Ultima analiză</div>
              <div className="font-medium">{soilData.lastTested}</div>
            </div>
          </div>
        </div>

        {/* Recomandări */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">Recomandări</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Nivelul de fosfor este scăzut - considerați aplicarea unui îngrășământ cu fosfor</li>
            <li>• pH-ul este în intervalul optim pentru majoritatea culturilor</li>
            <li>• Umiditatea solului este bună pentru această perioadă</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilSection;
