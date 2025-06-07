
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile.",
        variant: "destructive"
      });
      return;
    }

    // Simple mock login - in real app this would connect to authentication service
    toast({
      title: "Autentificare reușită",
      description: "Bun venit înapoi în AgroMind!",
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-green-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-600 text-white p-3 rounded-lg w-fit mb-4">
            <span className="font-bold text-2xl">🌱</span>
          </div>
          <CardTitle className="text-2xl text-green-800">AgroMind</CardTitle>
          <p className="text-green-600">Conectează-te la contul tău</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="numele@exemplu.com"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                placeholder="Introducețí parola"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Conectează-te
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Nu ai cont? <span className="text-green-600 cursor-pointer hover:underline">Înregistrează-te</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
