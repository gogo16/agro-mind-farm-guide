
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyConfigurationProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  showApiKeyInput: boolean;
  setShowApiKeyInput: (show: boolean) => void;
}

const ApiKeyConfiguration = ({ 
  apiKey, 
  setApiKey, 
  showApiKeyInput, 
  setShowApiKeyInput 
}: ApiKeyConfigurationProps) => {
  const { toast } = useToast();

  const saveApiKey = () => {
    localStorage.setItem('marketApiKey', apiKey);
    setShowApiKeyInput(false);
    toast({
      title: "Cheia API a fost salvată",
      description: "Datele vor fi actualizate cu informații reale din API.",
    });
  };

  return (
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
  );
};

export default ApiKeyConfiguration;
