
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff } from 'lucide-react';

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

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">Toate Produsele Disponibile</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3 pr-4">
            {marketPrices.map((price) => (
              <div key={price.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium">{price.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">{price.symbol}</Badge>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600">{price.price.toLocaleString()} RON</span>
                        <span className="text-sm text-blue-600">{price.priceEur.toLocaleString()} EUR</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getTrendColor(price.change)}`}>
                      {price.change > 0 ? '+' : ''}{price.change} RON
                    </p>
                    <p className={`text-xs ${getTrendColor(price.change)}`}>
                      {price.changePercent > 0 ? '+' : ''}{price.changePercent}%
                    </p>
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
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AllProductsList;
