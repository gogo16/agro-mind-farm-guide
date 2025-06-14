import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle, CheckCircle, Globe } from 'lucide-react';
import ApiKeyConfiguration from './market/ApiKeyConfiguration';
import ApiStatusAlert from './market/ApiStatusAlert';
import WatchedProductsList from './market/WatchedProductsList';
import AllProductsList from './market/AllProductsList';
import MarketInsights from './market/MarketInsights';
import { useMarketData } from '@/hooks/useMarketData';
import { useWatchedProducts } from '@/hooks/useWatchedProducts';

const MarketPricesTab = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  const { marketPrices, isLoading, error, lastUpdated, refreshData } = useMarketData();
  const { watchedProducts, toggleProductWatch } = useWatchedProducts();

  // Încarcă cheia API din localStorage (păstrăm pentru compatibilitate)
  useEffect(() => {
    const savedApiKey = localStorage.getItem('marketApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const getWatchedPrices = () => {
    return marketPrices.filter(price => watchedProducts.includes(price.id));
  };

  return (
    <div className="space-y-6">
      {/* EU Market Status */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Prețuri Piața UE - Date în Timp Real</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {error ? (
                <AlertCircle className="h-5 w-5 text-red-200" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-200" />
              )}
              <span className="text-sm">
                {error ? 'Eroare la încărcarea datelor' : 'Date încărcate cu succes'}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshData}
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Actualizare...' : 'Actualizează'}
            </Button>
          </div>
          
          {lastUpdated && (
            <p className="text-xs text-white/80">
              Ultima actualizare: {lastUpdated.toLocaleString('ro-RO')}
            </p>
          )}
          
          {error && (
            <div className="bg-red-500/20 rounded-lg p-3 mt-2">
              <p className="text-sm">
                <strong>Eroare:</strong> {error}
              </p>
              <p className="text-xs mt-1">
                Se afișează datele din cache sau date mock pentru demonstrație.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold">{marketPrices.length}</p>
              <p className="text-xs">Produse disponibile</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">România</p>
              <p className="text-xs">Sursa de date</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">EUR</p>
              <p className="text-xs">Moneda</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keep old API configuration for backwards compatibility */}
      <ApiKeyConfiguration 
        apiKey={apiKey}
        setApiKey={setApiKey}
        showApiKeyInput={showApiKeyInput}
        setShowApiKeyInput={setShowApiKeyInput}
      />

      {/* Loading state */}
      {isLoading && (
        <Card className="bg-white border-green-200">
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Se încarcă datele de pe piețele UE...</p>
          </CardContent>
        </Card>
      )}

      <WatchedProductsList watchedPrices={getWatchedPrices()} />

      <AllProductsList 
        marketPrices={marketPrices}
        watchedProducts={watchedProducts}
        onToggleProductWatch={toggleProductWatch}
      />

      <MarketInsights />
    </div>
  );
};

export default MarketPricesTab;
