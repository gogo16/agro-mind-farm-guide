
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import MarketPriceCard from './MarketPriceCard';

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

interface WatchedProductsListProps {
  watchedPrices: MarketPrice[];
}

const WatchedProductsList = ({ watchedPrices }: WatchedProductsListProps) => {
  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">Produsele Tale Urmărite</CardTitle>
      </CardHeader>
      <CardContent>
        {watchedPrices.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nu urmărești niciun produs. Selectează produse din lista de mai jos.
          </p>
        ) : (
          <ScrollArea className="h-80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {watchedPrices.map((price) => (
                <MarketPriceCard key={price.id} price={price} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchedProductsList;
