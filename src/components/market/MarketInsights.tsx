
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MarketInsights = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
      <CardHeader>
        <CardTitle>📈 Perspective Piață</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-sm font-medium mb-1">Tendințe Prețuri Cereale</p>
          <p className="text-xs">Monitorizarea prețurilor va fi activă după configurarea conexiunii la API-ul de piață.</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-sm font-medium mb-1">Oportunități Piață</p>
          <p className="text-xs">Analizele de piață vor fi disponibile după conectarea la surse de date.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
