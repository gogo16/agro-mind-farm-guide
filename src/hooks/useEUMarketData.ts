
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

  const fetchEUMarketData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting EU market data fetch...');
      
      // Get product mappings
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

      // Get current date and date from 30 days ago for more data
      const endDate = new Date();
      const beginDate = new Date();
      beginDate.setDate(beginDate.getDate() - 30);

      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Get EU market data from our Edge Function using GET with query parameters
      const productCodes = mappings.map((m: ProductMapping) => m.eu_product_code).join(',');
      
      const queryParams = new URLSearchParams({
        action: 'prices',
        memberStateCodes: 'RO',
        productCodes: productCodes,
        beginDate: formatDate(beginDate),
        endDate: formatDate(endDate)
      });

      console.log('Calling Edge Function with params:', queryParams.toString());

      // Use fetch directly with GET request to the Edge Function
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/eu-cereals-api?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
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

      for (const mapping of mappings) {
        console.log('Processing mapping:', mapping.romanian_name, mapping.eu_product_code);
        
        // Find the most recent price for this product
        const productPrices = euData.filter(
          (item: EUCerealPrice) => 
            (item.productCode && item.productCode === mapping.eu_product_code) ||
            (item.productName && item.productName.toLowerCase().includes(mapping.eu_product_name.toLowerCase()))
        );

        if (productPrices.length === 0) {
          console.warn('No prices found for product:', mapping.romanian_name);
          continue;
        }

        console.log('Found', productPrices.length, 'prices for', mapping.romanian_name);

        // Sort by reference period to get the latest
        productPrices.sort((a, b) => new Date(b.referencePeriod || b.endDate || b.beginDate).getTime() - new Date(a.referencePeriod || a.endDate || a.beginDate).getTime());
        const latestPrice = productPrices[0];
        const previousPrice = productPrices[1];

        const currentPriceValue = parseFloat(String(latestPrice.price || '0').replace(',', '.'));
        const previousPriceValue = previousPrice ? parseFloat(String(previousPrice.price || '0').replace(',', '.')) : currentPriceValue;

        const { change, changePercent } = calculateChange(currentPriceValue, previousPriceValue);

        // Generate mock volume based on product type (will be replaced with real data when available)
        const mockVolumes: { [key: string]: number } = {
          'WHEAT': 15680,
          'CORN': 22340,
          'BARLEY': 8920,
          'RAPE': 6740,
          'OATS': 3890,
          'DUR_WHEAT': 4560,
          'RYE': 5230,
          'TRITICALE': 3450,
          'SUNFLOWER': 8920,
          'SOYBEANS': 7650
        };

        const referenceDate = latestPrice.referencePeriod || latestPrice.endDate || latestPrice.beginDate;

        transformedPrices.push({
          id: mapping.romanian_symbol.toLowerCase(),
          name: mapping.romanian_name,
          symbol: mapping.romanian_symbol,
          price: currentPriceValue,
          change: change,
          changePercent: changePercent,
          volume: mockVolumes[mapping.romanian_symbol] || 5000,
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

        // Store in price history for future AI analysis
        try {
          await supabase
            .from('price_history')
            .upsert({
              product_code: mapping.romanian_symbol,
              price: currentPriceValue,
              currency: 'EUR',
              date: referenceDate,
              change_amount: change,
              change_percent: changePercent,
              volume: mockVolumes[mapping.romanian_symbol] || 5000,
              data_source: 'eu_api'
            }, {
              onConflict: 'product_code,date,data_source'
            });
        } catch (historyError) {
          console.error('Error saving to price history:', historyError);
        }
      }

      setMarketPrices(transformedPrices);
      setLastUpdated(new Date());
      console.log('Successfully transformed', transformedPrices.length, 'market prices');

    } catch (err) {
      console.error('Error fetching EU market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      
      // Fallback to mock data for demonstration
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
        },
        {
          id: 'rye',
          name: 'Secară',
          symbol: 'RYE',
          price: 185,
          change: 1,
          changePercent: 0.54,
          volume: 5230,
          lastUpdate: new Date().toLocaleString('ro-RO'),
          unit: 'EUR/tonă',
          currency: 'EUR'
        },
        {
          id: 'sunflower',
          name: 'Floarea-soarelui',
          symbol: 'SUNFLOWER',
          price: 425,
          change: 8,
          changePercent: 1.92,
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
