
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketPrice } from '@/types/market';

interface AllProductsListProps {
  marketPrices: MarketPrice[];
  watchedProducts: string[];
  onToggleProductWatch: (productId: string) => void;
}

const AllProductsList = ({ marketPrices, watchedProducts, onToggleProductWatch }: AllProductsListProps) => {
  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">Produse Disponibile (Piața UE)</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3 pr-4">
            {marketPrices.map((price) => (
              <div key={price.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{price.name}</h4>
                      <Badge variant="secondary" className="text-xs">{price.symbol}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-semibold">{price.price.toLocaleString()} {price.currency}</span>
                      <div className={`flex items-center space-x-1 ${getTrendColor(price.change)}`}>
                        {getTrendIcon(price.change)}
                        <span className="text-sm">
                          {price.change > 0 ? '+' : ''}{price.change}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {price.marketName && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{price.marketName}</span>
                        </div>
                      )}
                      <span>{price.unit}</span>
                      {price.changePercent !== 0 && (
                        <span className={getTrendColor(price.change)}>
                          {price.changePercent > 0 ? '+' : ''}{price.changePercent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleProductWatch(price.id)}
                  className={watchedProducts.includes(price.id) ? 'bg-green-50 border-green-200' : ''}
                >
                  {watchedProducts.includes(price.id) ? (
                    <><Eye className="h-4 w-4 mr-1" /> Urmărește</>
                  ) : (
                    <><EyeOff className="h-4 w-4 mr-1" /> Adaugă</>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AllProductsList;
