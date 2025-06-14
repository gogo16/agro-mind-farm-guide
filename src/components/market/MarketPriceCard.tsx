
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, MapPin, Calendar } from 'lucide-react';
import type { MarketPrice } from '@/types/market';

interface MarketPriceCardProps {
  price: MarketPrice;
}

const MarketPriceCard = ({ price }: MarketPriceCardProps) => {
  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-semibold">{price.name}</h4>
          <Badge variant="secondary" className="text-xs">{price.symbol}</Badge>
        </div>
        {getTrendIcon(price.change)}
      </div>
      
      <div className="space-y-1">
        <div className="flex flex-col space-y-1">
          <p className="text-xl font-bold">
            {price.price.toLocaleString()} <span className="text-sm font-normal">{price.unit}</span>
          </p>
        </div>
        
        <p className={`text-sm ${getTrendColor(price.change)}`}>
          {price.change > 0 ? '+' : ''}{price.change} {price.currency} ({price.changePercent > 0 ? '+' : ''}{price.changePercent}%)
        </p>
        
        <div className="space-y-1 text-xs text-gray-500">
          <p>Volum: {price.volume.toLocaleString()} tone</p>
          <p className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Actualizat: {price.lastUpdate}
          </p>
          {price.marketName && (
            <p className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Piața: {price.marketName}
            </p>
          )}
          {price.stageName && (
            <p className="text-xs">
              Etapa: {price.stageName}
            </p>
          )}
          {price.memberStateName && (
            <p className="text-xs">
              Țara: {price.memberStateName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketPriceCard;
