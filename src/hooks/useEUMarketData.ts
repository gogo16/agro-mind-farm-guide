
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MarketPrice, EUCerealPrice, ProductMapping } from '@/types/market';

// Correct EU product codes from the working API
const EU_PRODUCT_CODES = ['ORGFOUR', 'MAI', 'BLTPAN', 'BLTFOUR', 'AVO', 'ORGBRAS'];

export const useEUMarketData = () => {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const calculateChange = (currentPrice: number, previousPrice: number) => {
    if (!previousPrice) return { change: 0, changePercent: 0 };
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;
    return { change: parseFloat(change.toFixed(2)), changePercent: parseFloat(changePercent.toFixed(2)) };
  };

  const formatDateForAPI = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchEUMarketData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting EU market data fetch with correct API...');
      
      // Get product mappings from database
      const { data: mappings, error: mappingError } = await supabase
        .from('product_mapping')
        .select('*');

      if (mappingError) {
        console.error('Mapping error:', mappingError);
        throw mappingError;
      }

      console.log('Found product mappings:', mappings?.length || 0);

      // Set date range for last 365 days as specified
      const endDate = new Date();
      const beginDate = new Date();
      beginDate.setDate(beginDate.getDate() - 365);

      const allPrices: MarketPrice[] = [];

      // Fetch data for each product separately to ensure we get all available data
      for (const productCode of EU_PRODUCT_CODES) {
        try {
          console.log(`Fetching data for product: ${productCode}`);
          
          const queryParams = new URLSearchParams({
            action: 'prices',
            memberStateCodes: 'RO',
            productCodes: productCode,
            beginDate: formatDateForAPI(beginDate),
            endDate: formatDateForAPI(endDate)
          });

          const response = await fetch(`https://jpwweizjcmkjzilautjh.supabase.co/functions/v1/eu-cereals-api?${queryParams}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwd3dlaXpqY21ranppbGF1dGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDI5MzAsImV4cCI6MjA2NDk3ODkzMH0.-gIjWS8THojoItrUC1PAi5LurlU3SHDjJxBTgygeVH4`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error for ${productCode}:`, response.status, errorText);
            continue; // Skip this product and continue with others
          }

          const euData: EUCerealPrice[] = await response.json();
          console.log(`Data received for ${productCode}:`, euData?.length || 0, 'records');

          if (Array.isArray(euData) && euData.length > 0) {
            // Sort by reference period to get latest first
            euData.sort((a, b) => 
              new Date(b.referencePeriod).getTime() - new Date(a.referencePeriod).getTime()
            );

            // Group by market/stage combination to get the most recent price for each
            const latestPrices = new Map();
            euData.forEach(item => {
              const key = `${item.marketCode}_${item.stageCode}`;
              if (!latestPrices.has(key)) {
                latestPrices.set(key, item);
              }
            });

            // Find Romanian mapping for this product
            const productMapping = mappings?.find(m => m.eu_product_code === productCode);
            const romanianName = productMapping?.romanian_name || productCode;
            const romanianSymbol = productMapping?.romanian_symbol || productCode;

            // Create market price entries for each market/stage combination
            latestPrices.forEach((latestPrice, key) => {
              // Find previous price for trend calculation
              const previousPrice = euData.find(item => 
                item.marketCode === latestPrice.marketCode &&
                item.stageCode === latestPrice.stageCode &&
                item.referencePeriod !== latestPrice.referencePeriod
              );

              const currentPriceValue = parseFloat(String(latestPrice.price || '0').replace(',', '.'));
              const previousPriceValue = previousPrice ? parseFloat(String(previousPrice.price || '0').replace(',', '.')) : currentPriceValue;

              const { change, changePercent } = calculateChange(currentPriceValue, previousPriceValue);

              allPrices.push({
                id: `${productCode}_${key}`,
                name: `${romanianName} - ${latestPrice.stageName}`,
                symbol: romanianSymbol,
                price: currentPriceValue,
                change: change,
                changePercent: changePercent,
                volume: 0, // Will be calculated from actual data if available
                lastUpdate: new Date(latestPrice.referencePeriod).toLocaleString('ro-RO'),
                unit: `EUR/${latestPrice.unit?.toLowerCase() || 'tonă'}`,
                currency: 'EUR',
                memberStateCode: latestPrice.memberStateCode,
                memberStateName: latestPrice.memberStateName,
                marketName: latestPrice.marketName,
                stageName: latestPrice.stageName,
                weekNumber: latestPrice.weekNumber,
                referencePeriod: latestPrice.referencePeriod
              });
            });
          }
        } catch (productError) {
          console.error(`Error fetching ${productCode}:`, productError);
          // Continue with other products
        }
      }

      if (allPrices.length > 0) {
        setMarketPrices(allPrices);
        setLastUpdated(new Date());
        console.log('Successfully loaded', allPrices.length, 'market prices from EU API');
      } else {
        throw new Error('No data received from EU API for any products');
      }

    } catch (err) {
      console.error('Error fetching EU market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      
      // Fallback to mock data
      console.log('Using fallback mock data');
      setMarketPrices([
        {
          id: 'feed_barley',
          name: 'Orz furajere',
          symbol: 'FEED_BARLEY',
          price: 185,
          change: 3,
          changePercent: 1.65,
          volume: 12500,
          lastUpdate: new Date().toLocaleString('ro-RO'),
          unit: 'EUR/tonă',
          currency: 'EUR'
        },
        {
          id: 'feed_maize',
          name: 'Porumb furajere',
          symbol: 'FEED_MAIZE',
          price: 198,
          change: -2,
          changePercent: -1.00,
          volume: 18750,
          lastUpdate: new Date().toLocaleString('ro-RO'),
          unit: 'EUR/tonă',
          currency: 'EUR'
        },
        {
          id: 'milling_wheat',
          name: 'Grâu panificație',
          symbol: 'MILLING_WHEAT',
          price: 235,
          change: 5,
          changePercent: 2.17,
          volume: 15600,
          lastUpdate: new Date().toLocaleString('ro-RO'),
          unit: 'EUR/tonă',
          currency: 'EUR'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEUMarketData();
  }, []);

  return {
    marketPrices,
    isLoading,
    error,
    lastUpdated,
    refreshData: fetchEUMarketData
  };
};
