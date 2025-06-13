
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
          <p className="text-sm font-medium mb-1">Tendință Generală</p>
          <p className="text-xs">
            Prețurile cerealelor au crescut cu 1.8% în ultimele 7 zile datorită condițiilor meteorologice.
          </p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-sm font-medium mb-1">Recomandare</p>
          <p className="text-xs">
            Momentul favorabil pentru vânzarea grâului. Prețul floarea-soarelui în creștere constantă.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
