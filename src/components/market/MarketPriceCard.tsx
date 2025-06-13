
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceEur: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdate: string;
  unit: string;
}

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
            {price.price.toLocaleString()} <span className="text-sm font-normal">RON/tonă</span>
          </p>
          <p className="text-lg font-semibold text-blue-600">
            {price.priceEur.toLocaleString()} <span className="text-sm font-normal">EUR/tonă</span>
          </p>
        </div>
        <p className={`text-sm ${getTrendColor(price.change)}`}>
          {price.change > 0 ? '+' : ''}{price.change} RON ({price.changePercent > 0 ? '+' : ''}{price.changePercent}%)
        </p>
        <p className="text-xs text-gray-500">
          Volum: {price.volume.toLocaleString()} tone | Actualizat: {price.lastUpdate}
        </p>
      </div>
    </div>
  );
};

export default MarketPriceCard;
