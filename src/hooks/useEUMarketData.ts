
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MarketPrice, EUCerealPrice, ProductMapping } from '@/types/market';

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

  const fetchAvailableProducts = async () => {
    try {
      console.log('Fetching available products from EU API...');
      
      const response = await fetch(`https://jpwweizjcmkjzilautjh.supabase.co/functions/v1/eu-cereals-api?action=products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwd3dlaXpqY21ranppbGF1dGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDI5MzAsImV4cCI6MjA2NDk3ODkzMH0.-gIjWS8THojoItrUC1PAi5LurlU3SHDjJxBTgygeVH4`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const products = await response.json();
        console.log('Available products:', products);
        return products;
      } else {
        console.error('Failed to fetch products:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return null;
    }
  };

  const testSingleProduct = async (productCode: string) => {
    try {
      console.log(`Testing single product: ${productCode}`);
      
      const queryParams = new URLSearchParams({
        action: 'test-single-product',
        productCode: productCode,
        beginDate: '01/01/2024',
        endDate: '14/06/2025'
      });

      const response = await fetch(`https://jpwweizjcmkjzilautjh.supabase.co/functions/v1/eu-cereals-api?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwd3dlaXpqY21ranppbGF1dGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDI5MzAsImV4cCI6MjA2NDk3ODkzMH0.-gIjWS8THojoItrUC1PAi5LurlU3SHDjJxBTgygeVH4`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      console.log(`Test result for ${productCode}:`, result);
      return { productCode, success: response.ok, data: result };
    } catch (error) {
      console.error(`Error testing ${productCode}:`, error);
      return { productCode, success: false, error: error.message };
    }
  };

  const fetchEUMarketData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting EU market data fetch...');
      
      // Step 1: Test connectivity and get available products
      const availableProducts = await fetchAvailableProducts();
      
      // Step 2: Test known product codes individually
      const testProducts = ['commonWheat', 'maize', 'barley', 'BLT', 'MAI', 'ORG'];
      const testResults = [];
      
      for (const productCode of testProducts) {
        const result = await testSingleProduct(productCode);
        testResults.push(result);
        
        // If we find a working product, break early for now
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          console.log(`Found working product code: ${productCode}`);
          break;
        }
      }
      
      console.log('Test results:', testResults);
      
      // Get product mappings from database
      const { data: mappings, error: mappingError } = await supabase
        .from('product_mapping')
        .select('*');

      if (mappingError) {
        console.error('Mapping error:', mappingError);
        throw mappingError;
      }

      if (!mappings || mappings.length === 0) {
        throw new Error('No product mappings found');
      }

      console.log('Found product mappings:', mappings.length);

      // Step 3: Try to fetch data with updated approach
      // Use more conservative date range
      const endDate = new Date();
      const beginDate = new Date();
      beginDate.setDate(beginDate.getDate() - 7); // Only last 7 days for testing

      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Try with known working product codes or fallback to original
      const workingProduct = testResults.find(r => r.success && Array.isArray(r.data) && r.data.length > 0);
      let productCodesToTry;
      
      if (workingProduct) {
        productCodesToTry = workingProduct.productCode;
      } else {
        // Fallback to trying common product names
        productCodesToTry = 'commonWheat,maize,barley';
      }

      const queryParams = new URLSearchParams({
        action: 'prices',
        memberStateCodes: 'RO',
        productCodes: productCodesToTry,
        beginDate: formatDate(beginDate),
        endDate: formatDate(endDate)
      });

      console.log('Calling Edge Function with params:', queryParams.toString());

      const response = await fetch(`https://jpwweizjcmkjzilautjh.supabase.co/functions/v1/eu-cereals-api?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwd3dlaXpqY21ranppbGF1dGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDI5MzAsImV4cCI6MjA2NDk3ODkzMH0.-gIjWS8THojoItrUC1PAi5LurlU3SHDjJxBTgygeVH4`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function error:', response.status, errorText);
        throw new Error(`Edge Function error: ${response.status} - ${errorText}`);
      }

      const euData: EUCerealPrice[] = await response.json();
      console.log('EU API Data received:', euData?.length || 0, 'records');

      if (!Array.isArray(euData) || euData.length === 0) {
        console.warn('No data received from EU API');
        throw new Error('No data received from EU API');
      }

      // Transform EU data to our MarketPrice format
      const transformedPrices: MarketPrice[] = [];

      // Process available data
      const processedData = new Map();
      
      euData.forEach((item: EUCerealPrice) => {
        const productKey = item.productCode || item.productName || 'unknown';
        if (!processedData.has(productKey)) {
          processedData.set(productKey, []);
        }
        processedData.get(productKey).push(item);
      });

      console.log('Processed products:', Array.from(processedData.keys()));

      // Create market prices from available data
      let productIndex = 0;
      for (const [productKey, productPrices] of processedData.entries()) {
        if (productPrices.length === 0) continue;

        // Sort by date to get latest
        productPrices.sort((a: any, b: any) => 
          new Date(b.referencePeriod || b.endDate || b.beginDate).getTime() - 
          new Date(a.referencePeriod || a.endDate || a.beginDate).getTime()
        );

        const latestPrice = productPrices[0];
        const previousPrice = productPrices[1];

        const currentPriceValue = parseFloat(String(latestPrice.price || '0').replace(',', '.'));
        const previousPriceValue = previousPrice ? parseFloat(String(previousPrice.price || '0').replace(',', '.')) : currentPriceValue;

        const { change, changePercent } = calculateChange(currentPriceValue, previousPriceValue);

        // Map to Romanian names or use default
        const productMapping = mappings.find(m => 
          m.eu_product_code === productKey || 
          m.eu_product_name.toLowerCase().includes(productKey.toLowerCase())
        );

        const romanianName = productMapping?.romanian_name || latestPrice.productName || productKey;
        const romanianSymbol = productMapping?.romanian_symbol || productKey.toUpperCase();

        const referenceDate = latestPrice.referencePeriod || latestPrice.endDate || latestPrice.beginDate;

        transformedPrices.push({
          id: `product_${productIndex}`,
          name: romanianName,
          symbol: romanianSymbol,
          price: currentPriceValue,
          change: change,
          changePercent: changePercent,
          volume: 5000 + Math.floor(Math.random() * 15000), // Mock volume
          lastUpdate: new Date(referenceDate).toLocaleString('ro-RO'),
          unit: `EUR/${(latestPrice.unit || 'tonă').toLowerCase()}`,
          currency: 'EUR',
          memberStateCode: latestPrice.memberStateCode || 'RO',
          memberStateName: latestPrice.memberStateName || 'Romania',
          marketName: latestPrice.marketName,
          stageName: latestPrice.stageName,
          weekNumber: latestPrice.weekNumber,
          referencePeriod: referenceDate
        });

        productIndex++;
      }

      setMarketPrices(transformedPrices);
      setLastUpdated(new Date());
      console.log('Successfully transformed', transformedPrices.length, 'market prices');

    } catch (err) {
      console.error('Error fetching EU market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      
      // Fallback to mock data
      console.log('Using fallback mock data');
      setMarketPrices([
        {
          id: 'wheat',
          name: 'Grâu',
          symbol: 'WHEAT',
          price: 252,
          change: 5,
          changePercent: 2.02,
          volume: 15680,
          lastUpdate: new Date().toLocaleString('ro-RO'),
          unit: 'EUR/tonă',
          currency: 'EUR'
        },
        {
          id: 'corn',
          name: 'Porumb',
          symbol: 'CORN',
          price: 198,
          change: -3,
          changePercent: -1.49,
          volume: 22340,
          lastUpdate: new Date().toLocaleString('ro-RO'),
          unit: 'EUR/tonă',
          currency: 'EUR'
        },
        {
          id: 'barley',
          name: 'Orz',
          symbol: 'BARLEY',
          price: 179,
          change: 2,
          changePercent: 1.13,
          volume: 8920,
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
