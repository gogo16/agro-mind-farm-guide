
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
      // Get product mappings
      const { data: mappings, error: mappingError } = await supabase
        .from('product_mapping')
        .select('*');

      if (mappingError) throw mappingError;

      if (!mappings || mappings.length === 0) {
        throw new Error('No product mappings found');
      }

      // Get current date and date from 2 weeks ago for comparison
      const endDate = new Date();
      const beginDate = new Date();
      beginDate.setDate(beginDate.getDate() - 14);

      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      };

      // Get EU market data from our Edge Function
      const productCodes = mappings.map((m: ProductMapping) => m.eu_product_code).join(',');
      
      const response = await supabase.functions.invoke('eu-cereals-api', {
        body: {
          action: 'prices',
          memberStateCodes: 'RO',
          productCodes: productCodes,
          beginDate: formatDate(beginDate),
          endDate: formatDate(endDate)
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const euData: EUCerealPrice[] = response.data || [];
      console.log('EU API Data:', euData);

      // Transform EU data to our MarketPrice format
      const transformedPrices: MarketPrice[] = [];

      for (const mapping of mappings) {
        // Find the most recent price for this product
        const productPrices = euData.filter(
          (item: EUCerealPrice) => 
            item.productCode === mapping.eu_product_code ||
            item.productName.toLowerCase().includes(mapping.eu_product_name.toLowerCase())
        );

        if (productPrices.length === 0) continue;

        // Sort by reference period to get the latest
        productPrices.sort((a, b) => new Date(b.referencePeriod).getTime() - new Date(a.referencePeriod).getTime());
        const latestPrice = productPrices[0];
        const previousPrice = productPrices[1];

        const currentPriceValue = parseFloat(latestPrice.price.replace(',', '.'));
        const previousPriceValue = previousPrice ? parseFloat(previousPrice.price.replace(',', '.')) : currentPriceValue;

        const { change, changePercent } = calculateChange(currentPriceValue, previousPriceValue);

        // Generate mock volume based on product type
        const mockVolumes: { [key: string]: number } = {
          'WHEAT': 15680,
          'CORN': 22340,
          'BARLEY': 8920,
          'RAPE': 6740,
          'OATS': 3890,
          'DUR_WHEAT': 4560
        };

        transformedPrices.push({
          id: mapping.romanian_symbol.toLowerCase(),
          name: mapping.romanian_name,
          symbol: mapping.romanian_symbol,
          price: currentPriceValue,
          change: change,
          changePercent: changePercent,
          volume: mockVolumes[mapping.romanian_symbol] || 5000,
          lastUpdate: new Date(latestPrice.referencePeriod).toLocaleString('ro-RO'),
          unit: `EUR/${latestPrice.unit.toLowerCase()}`,
          currency: 'EUR',
          memberStateCode: latestPrice.memberStateCode,
          memberStateName: latestPrice.memberStateName,
          marketName: latestPrice.marketName,
          stageName: latestPrice.stageName,
          weekNumber: latestPrice.weekNumber,
          referencePeriod: latestPrice.referencePeriod
        });

        // Store in price history for AI analysis
        await supabase
          .from('price_history')
          .upsert({
            product_code: mapping.romanian_symbol,
            price: currentPriceValue,
            currency: 'EUR',
            date: latestPrice.referencePeriod,
            change_amount: change,
            change_percent: changePercent,
            volume: mockVolumes[mapping.romanian_symbol] || 5000,
            data_source: 'eu_api'
          }, {
            onConflict: 'product_code,date,data_source'
          });
      }

      setMarketPrices(transformedPrices);
      setLastUpdated(new Date());
      console.log('Transformed market prices:', transformedPrices);

    } catch (err) {
      console.error('Error fetching EU market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      
      // Fallback to existing mock data if API fails
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
