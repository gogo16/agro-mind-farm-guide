
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Eye, Printer, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const APIADocumentGenerator = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatingDocs, setGeneratingDocs] = useState<Record<string, boolean>>({});

  const documentTemplates = [
    {
      id: 'apia-cereale',
      name: 'APIA - Cerere Cereale',
      description: 'Document pentru susținerea culturilor de cereale',
      format: 'PDF',
      estimatedTime: '3 min'
    },
    {
      id: 'afir-modernizare',
      name: 'AFIR - Modernizare Exploatații',
      description: 'Cerere pentru investiții în modernizare',
      format: 'Excel + PDF',
      estimatedTime: '5 min'
    },
    {
      id: 'apia-eco-scheme',
      name: 'APIA - Eco-scheme',
      description: 'Document pentru practici agricole ecologice',
      format: 'PDF',
      estimatedTime: '4 min'
    }
  ];

  const generateDocument = (templateId: string, templateName: string) => {
    setGeneratingDocs(prev => ({ ...prev, [templateId]: true }));
    
    setTimeout(() => {
      setGeneratingDocs(prev => ({ ...prev, [templateId]: false }));
      toast({
        title: "Document generat cu succes",
        description: `${templateName} este gata pentru descărcare.`,
      });
    }, 3000);
  };

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Generator Documente APIA/AFIR</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {documentTemplates.map((template) => {
            const isGenerating = generatingDocs[template.id];
            return (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">{template.format}</Badge>
                      <span className="text-xs text-gray-500">⏱️ {template.estimatedTime}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isGenerating ? (
                      <Badge className="bg-amber-100 text-amber-800">Se generează...</Badge>
                    ) : (
                      <>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => generateDocument(template.id, template.name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Generează
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
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Date disponibile pentru generare:</span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 12 parcele cu suprafețe și culturi</li>
            <li>• Calendar activități pentru anul curent</li>
            <li>• Estimări productivitate și costuri</li>
            <li>• Tratamente și fertilizări aplicate</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIADocumentGenerator;
