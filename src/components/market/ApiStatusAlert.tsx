
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ApiStatusAlertProps {
  hasApiKey: boolean;
}

const ApiStatusAlert = ({ hasApiKey }: ApiStatusAlertProps) => {
  if (hasApiKey) return null;

  return (
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
  );
};

export default ApiStatusAlert;
