
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

interface AIAssistantProps {
  detailed?: boolean;
}

const AIAssistant = ({ detailed = false }: AIAssistantProps) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Bună ziua! Sunt asistentul tău AI pentru agricultură. Cum vă pot ajuta astăzi?',
      timestamp: '10:30'
    },
    {
      type: 'user',
      message: 'Ce trebui să fac cu parcela de grâu săptămâna aceasta?',
      timestamp: '10:32'
    },
    {
      type: 'ai',
      message: 'Pe baza analizei meteo și stadiului de dezvoltare, recomand irigarea în următoarele 2 zile. Condițiile sunt ideale: vânt scăzut și temperaturi moderate.',
      timestamp: '10:33'
    }
  ]);

  const recommendations = [
    {
      icon: TrendingUp,
      title: 'Optimizare randament',
      description: 'Parcela Nord poate produce cu 15% mai mult cu fertilizare suplimentară.',
      priority: 'medium'
    },
    {
      icon: AlertTriangle,
      title: 'Alertă dăunători',
      description: 'Risc crescut de afide pe porumb în următoarele 5 zile.',
      priority: 'high'
    },
    {
      icon: Lightbulb,
      title: 'Economie apă',
      description: 'Irigarea în orele 5-7 dimineața reduce consumul cu 20%.',
      priority: 'low'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, {
        type: 'user',
        message: message,
        timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          type: 'ai',
          message: 'Am analizat cererea dumneavoastră. Pe baza datelor meteorologice și stadiului culturilor, vă recomand...',
          timestamp: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  if (!detailed) {
    return (
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>AI Asistent</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm mb-2">💡 Recomandare zilnică</p>
            <p className="text-sm">
              Condițiile de astăzi sunt perfecte pentru tratamentul antifungic al grâului. 
              Aplicați între orele 6-9 dimineața.
            </p>
          </div>
          
          <div className="space-y-2">
            {recommendations.slice(0, 2).map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <div key={index} className="bg-white/10 rounded-lg p-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{rec.title}</span>
                  </div>
                  <p className="text-xs text-purple-100">{rec.description}</p>
                </div>
              );
            })}
          </div>

          <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
            <Bot className="h-4 w-4 mr-2" />
            Întreabă AI-ul
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Asistent AI Agricol</h2>
        <Badge className="bg-purple-100 text-purple-800">
          <Bot className="h-3 w-3 mr-1" />
          Activ 24/7
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card className="bg-white border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-600" />
              <span>Chat cu AI</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-80 overflow-y-auto space-y-3 bg-gray-50 rounded-lg p-4">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    chat.type === 'user' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className="text-sm">{chat.message}</p>
                    <p className={`text-xs mt-1 ${chat.type === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                      {chat.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Întreabă ceva despre fermă..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-white border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <span>Recomandări inteligente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              const priorityColors = {
                high: 'border-red-200 bg-red-50',
                medium: 'border-amber-200 bg-amber-50',
                low: 'border-green-200 bg-green-50'
              };
              
              return (
                <div key={index} className={`border rounded-lg p-4 ${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                  <div className="flex items-start space-x-3">
                    <div className="bg-white p-2 rounded-lg">
                      <IconComponent className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Vezi detalii
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
