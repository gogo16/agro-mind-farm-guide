
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  filtered?: boolean;
}

const AIChatSystem = () => {
  const {
    fields,
    transactions,
    inventory
  } = useAppContext();
  
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    content: 'Bună! Sunt asistentul tău AI pentru ferma AgroMind. Îți pot oferi sfaturi despre managementul fermei, analize financiare și recomandări pentru culturile tale. Cum te pot ajuta astăzi?',
    sender: 'ai',
    timestamp: new Date().toISOString()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Keywords for filtering non-agricultural topics
  const agriculturalKeywords = ['fermă', 'cultură', 'teren', 'recoltă', 'semințe', 'îngrășământ', 'irigare', 'utilaje', 'tractor', 'plugul', 'meteorologie', 'sol', 'prețuri', 'vânzare', 'profit', 'costuri', 'buget', 'inventar', 'depozit', 'stoc', 'sarcini', 'planificare', 'sezon', 'primăvară', 'vară', 'toamnă', 'iarnă'];
  
  const isAgricultureRelated = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return agriculturalKeywords.some(keyword => lowerMessage.includes(keyword)) || lowerMessage.includes('agro') || lowerMessage.includes('agricul');
  };

  const generateAIResponse = (userMessage: string): string => {
    if (!isAgricultureRelated(userMessage)) {
      return 'Îmi pare rău, dar sunt specializat să te ajut doar cu aspecte legate de managementul fermei tale. Te rog să mă întrebi despre culturile tale, finanțele fermei, inventarul sau alte aspecte agricole.';
    }

    // Generate contextual responses based on farm data
    const totalFields = fields.length;
    const totalInventory = inventory.length;
    const totalTransactions = transactions.length;

    // Simple keyword-based responses (in a real implementation, this would use AI)
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('profit') || lowerMessage.includes('venit')) {
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return `Bazat pe datele tale, ai venituri totale de ${totalIncome.toLocaleString()} RON și cheltuieli de ${totalExpenses.toLocaleString()} RON. Pentru a îmbunătăți profitabilitatea, recomand să analizezi categoriile de cheltuieli și să identifici zonele de optimizare.`;
    }
    if (lowerMessage.includes('teren') || lowerMessage.includes('câmp')) {
      return `Ai în total ${totalFields} terenuri înregistrate în sistem. Pentru o gestionare optimă, recomand să monitorizezi regulat starea culturilor și să planifici rotația pentru menținerea fertilității solului.`;
    }
    if (lowerMessage.includes('inventar') || lowerMessage.includes('stoc')) {
      return `În inventarul tău sunt ${totalInventory} articole înregistrate. Este important să verifici periodic stocurile de semințe, îngrășăminte și combustibil pentru a evita întreruperile în activitate.`;
    }
    if (lowerMessage.includes('meteo') || lowerMessage.includes('timp')) {
      return 'Pentru predicții meteorologice precise, consultă widgetul meteo de pe pagina principală. Îți recomand să planifici activitățile în funcție de condițiile prognozate pentru următoarele 5 zile.';
    }

    // Default agricultural response
    return 'Îți mulțumesc pentru întrebare! Pentru a-ți oferi cele mai relevante sfaturi, poți fi mai specific despre aspectul care te interesează: financiar, tehnic, de planificare sau management al culturilor?';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toISOString(),
        filtered: !isAgricultureRelated(inputMessage)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chat AI Agricol
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64 w-full border rounded-lg p-3 bg-gray-50">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.filtered && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Răspuns filtrat
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">AI scrie...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Întreabă despre ferma ta..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isTyping}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatSystem;
