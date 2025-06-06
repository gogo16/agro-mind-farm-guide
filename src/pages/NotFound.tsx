
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-green-200">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-green-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagina nu a fost găsită</h1>
          <p className="text-gray-600 mb-6">
            Ne pare rău, dar pagina pe care o căutați nu există sau a fost mutată.
          </p>
          <div className="flex space-x-3">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Acasă
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
