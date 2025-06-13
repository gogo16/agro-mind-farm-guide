
import React, { useState, useEffect } from 'react';
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
  
  const { marketPrices } = useMarketData();
  const { watchedProducts, toggleProductWatch } = useWatchedProducts();

  // Încarcă cheia API din localStorage
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
      <ApiKeyConfiguration 
        apiKey={apiKey}
        setApiKey={setApiKey}
        showApiKeyInput={showApiKeyInput}
        setShowApiKeyInput={setShowApiKeyInput}
      />

      <ApiStatusAlert hasApiKey={!!apiKey} />

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
