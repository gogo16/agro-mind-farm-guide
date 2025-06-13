import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, AlertTriangle, Settings, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const MarketPricesTab = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [watchedProducts, setWatchedProducts] = useState<string[]>([]);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
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

  // Încarcă preferințele din localStorage
  useEffect(() => {
    const savedWatchedProducts = localStorage.getItem('watchedProducts');
    const savedApiKey = localStorage.getItem('marketApiKey');
    
    if (savedWatchedProducts) {
      setWatchedProducts(JSON.parse(savedWatchedProducts));
    } else {
      // Implicit să urmărească grâu și porumb
      setWatchedProducts(['wheat', 'corn']);
    }
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Salvează preferințele în localStorage
  const saveWatchedProducts = (products: string[]) => {
    setWatchedProducts(products);
    localStorage.setItem('watchedProducts', JSON.stringify(products));
  };

  const saveApiKey = () => {
    localStorage.setItem('marketApiKey', apiKey);
    setShowApiKeyInput(false);
    toast({
      title: "Cheia API a fost salvată",
      description: "Datele vor fi actualizate cu informații reale din API.",
    });
  };

  const toggleProductWatch = (productId: string) => {
    const newWatchedProducts = watchedProducts.includes(productId)
      ? watchedProducts.filter(id => id !== productId)
      : [...watchedProducts, productId];
    saveWatchedProducts(newWatchedProducts);
  };

  const getWatchedPrices = () => {
    return marketPrices.filter(price => watchedProducts.includes(price.id));
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header cu setări API */}
      <Card className="bg-white border-green-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Prețuri Piață Cereale</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {apiKey ? 'Actualizează API' : 'Configurează API'}
          </Button>
        </CardHeader>
        
        {showApiKeyInput && (
          <CardContent className="border-t pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">Cheia API pentru Bursa de Cereale</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Introdu cheia API..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Introdu cheia API pentru a avea acces la prețurile reale și actualizate
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={saveApiKey} className="bg-green-600 hover:bg-green-700">
                  Salvează
                </Button>
                <Button variant="outline" onClick={() => setShowApiKeyInput(false)}>
                  Anulează
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Status API */}
      {!apiKey && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">Date demo afișate</p>
                <p className="text-xs text-amber-600">
                  Configurează cheia API pentru a avea acces la prețurile reale
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prețuri urmărite */}
      <Card className="bg-white border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Produsele Tale Urmărite</CardTitle>
        </CardHeader>
        <CardContent>
          {getWatchedPrices().length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nu urmărești niciun produs. Selectează produse din lista de mai jos.
            </p>
          ) : (
            <ScrollArea className="h-80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                {getWatchedPrices().map((price) => (
                  <div key={price.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{price.name}</h4>
                        <Badge variant="secondary" className="text-xs">{price.symbol}</Badge>
                      </div>
                      {getTrendIcon(price.change)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xl font-bold">
                          {price.price.toLocaleString()} <span className="text-sm font-normal">RON/tonă</span>
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          {price.priceEur.toLocaleString()} <span className="text-sm font-normal">EUR/tonă</span>
                        </p>
                      </div>
                      <p className={`text-sm ${getTrendColor(price.change)}`}>
                        {price.change > 0 ? '+' : ''}{price.change} RON ({price.changePercent > 0 ? '+' : ''}{price.changePercent}%)
                      </p>
                      <p className="text-xs text-gray-500">
                        Volum: {price.volume.toLocaleString()} tone | Actualizat: {price.lastUpdate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Lista toate produsele disponibile */}
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
                      onClick={() => toggleProductWatch(price.id)}
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

      {/* Informații despre piață */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle>📈 Perspective Piață</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Tendință Generală</p>
            <p className="text-xs">
              Prețurile cerealelor au crescut cu 1.8% în ultimele 7 zile datorită condițiilor meteorologice.
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Recomandare</p>
            <p className="text-xs">
              Momentul favorabil pentru vânzarea grâului. Prețul floarea-soarelui în creștere constantă.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketPricesTab;
