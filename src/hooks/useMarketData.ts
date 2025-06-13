
import { useState, useEffect } from 'react';

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

export const useMarketData = () => {
  // Placeholder data - va fi înlocuit cu date reale din API
  const [marketPrices] = useState<MarketPrice[]>([
    {
      id: 'wheat',
      name: 'Grâu',
      symbol: 'WHEAT',
      price: 1250,
      priceEur: 252,
      change: 25,
      changePercent: 2.04,
      volume: 15680,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'corn',
      name: 'Porumb',
      symbol: 'CORN',
      price: 980,
      priceEur: 198,
      change: -15,
      changePercent: -1.51,
      volume: 22340,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'barley',
      name: 'Orz',
      symbol: 'BARLEY',
      price: 890,
      priceEur: 179,
      change: 8,
      changePercent: 0.91,
      volume: 8920,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'sunflower',
      name: 'Floarea-soarelui',
      symbol: 'SUNFL',
      price: 2150,
      priceEur: 433,
      change: 45,
      changePercent: 2.14,
      volume: 12560,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'soybean',
      name: 'Soia',
      symbol: 'SOY',
      price: 1890,
      priceEur: 381,
      change: -12,
      changePercent: -0.63,
      volume: 9840,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'rapeseed',
      name: 'Rapiță',
      symbol: 'RAPE',
      price: 2320,
      priceEur: 468,
      change: 18,
      changePercent: 0.78,
      volume: 6740,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'rice',
      name: 'Orez',
      symbol: 'RICE',
      price: 3200,
      priceEur: 645,
      change: 35,
      changePercent: 1.11,
      volume: 4560,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'oats',
      name: 'Ovăz',
      symbol: 'OATS',
      price: 1120,
      priceEur: 226,
      change: -8,
      changePercent: -0.71,
      volume: 3890,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'sugar_beet',
      name: 'Sfeclă de zahăr',
      symbol: 'SUGAR',
      price: 340,
      priceEur: 69,
      change: 5,
      changePercent: 1.49,
      volume: 28900,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'potatoes',
      name: 'Cartofi',
      symbol: 'POTATO',
      price: 890,
      priceEur: 179,
      change: 22,
      changePercent: 2.53,
      volume: 15600,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'canola',
      name: 'Canola',
      symbol: 'CANOLA',
      price: 2480,
      priceEur: 500,
      change: -18,
      changePercent: -0.72,
      volume: 7230,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'lentils',
      name: 'Linte',
      symbol: 'LENTIL',
      price: 4500,
      priceEur: 908,
      change: 67,
      changePercent: 1.51,
      volume: 2340,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    },
    {
      id: 'chickpeas',
      name: 'Năut',
      symbol: 'CHICK',
      price: 5200,
      priceEur: 1048,
      change: -45,
      changePercent: -0.86,
      volume: 1890,
      lastUpdate: '2024-06-13 09:15',
      unit: 'RON/tonă'
    }
  ]);

  return { marketPrices };
};
