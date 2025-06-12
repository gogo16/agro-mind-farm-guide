
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Eye, Plus, Receipt, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OblioIntegration = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const invoiceTypes = [
    {
      id: 'standard',
      name: 'Factură Standard',
      description: 'Facturi pentru servicii agricole și produse',
      icon: FileText
    },
    {
      id: 'proforma',
      name: 'Factură Proformă',
      description: 'Facturi preliminare pentru oferte',
      icon: Receipt
    }
  ];

  const generateInvoice = (type: string, typeName: string) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockInvoiceData = {
        invoiceNumber: `FAC-${Date.now()}`,
        type: typeName,
        date: new Date().toLocaleDateString('ro-RO'),
        client: 'Client Demo SRL',
        amount: 2500.00,
        items: [
          { description: 'Servicii agricole consultanță', quantity: 1, price: 1500.00 },
          { description: 'Produse chimice agricole', quantity: 10, price: 100.00 }
        ]
      };
      
      setPreviewData(mockInvoiceData);
      setIsGenerating(false);
      toast({
        title: "Factură generată",
        description: `${typeName} a fost generată cu succes.`,
      });
    }, 2000);
  };

  const previewInvoice = (type: string, typeName: string) => {
    const mockPreviewData = {
      invoiceNumber: `PREV-${Date.now()}`,
      type: typeName,
      date: new Date().toLocaleDateString('ro-RO'),
      client: 'Preview Client SRL',
      amount: 1250.00,
      items: [
        { description: 'Servicii de consultanță agricolă', quantity: 1, price: 750.00 },
        { description: 'Materiale agricole', quantity: 5, price: 100.00 }
      ]
    };
    
    setPreviewData(mockPreviewData);
    setShowPreview(true);
  };

  const renderInvoicePreview = () => {
    if (!previewData) return null;

    return (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-lg mb-2 text-blue-800">{previewData.type}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Număr:</strong> {previewData.invoiceNumber}</p>
              <p><strong>Data:</strong> {previewData.date}</p>
            </div>
            <div>
              <p><strong>Client:</strong> {previewData.client}</p>
              <p><strong>Total:</strong> {previewData.amount.toLocaleString()} RON</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium">Articole factură:</h5>
          {previewData.items?.map((item: any, index: number) => (
            <div key={index} className="bg-gray-50 p-3 rounded border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-gray-600">Cantitate: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.price.toLocaleString()} RON</p>
                  <p className="text-sm text-gray-600">per bucată</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 p-3 rounded border">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total factură:</span>
            <span className="text-lg font-bold text-green-700">{previewData.amount.toLocaleString()} RON</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-800 flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <span>Oblio.eu - Gestionare Facturi</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">Integrare API</Badge>
            <span className="text-sm text-purple-700">Conectare cu platforma Oblio.eu</span>
          </div>
          <p className="text-xs text-purple-600">
            Generați și gestionați facturi direct din AgroMind folosind serviciile Oblio.eu
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {invoiceTypes.map((invoiceType) => {
            const IconComponent = invoiceType.icon;
            return (
              <div key={invoiceType.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <IconComponent className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{invoiceType.name}</h4>
                      <p className="text-sm text-gray-600">{invoiceType.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isGenerating ? (
                      <Badge className="bg-amber-100 text-amber-800">Se generează...</Badge>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => previewInvoice(invoiceType.id, invoiceType.name)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Previzualizare
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => generateInvoice(invoiceType.id, invoiceType.name)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Emite Factură
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Funcționalități disponibile:</span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Emitere facturi standard și proformă</li>
            <li>• Previzualizare factură înainte de emitere</li>
            <li>• Integrare automată cu datele fermei</li>
            <li>• Export și sincronizare cu Oblio.eu</li>
          </ul>
        </div>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Previzualizare Factură</DialogTitle>
            </DialogHeader>
            {renderInvoicePreview()}
            <div className="flex space-x-2 mt-4">
              <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
                Închide
              </Button>
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setShowPreview(false);
                  if (previewData) {
                    generateInvoice('preview', previewData.type);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Emite această factură
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default OblioIntegration;
