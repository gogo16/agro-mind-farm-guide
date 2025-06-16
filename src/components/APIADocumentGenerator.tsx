
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Eye, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const APIADocumentGenerator = () => {
  const { toast } = useToast();
  const { fields, generateAPIADocument, user } = useAppContext();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatingDocs, setGeneratingDocs] = useState<Record<string, boolean>>({});
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const documentTemplates = [
    {
      id: 'apia-cereale',
      name: 'APIA - Cerere Cereale',
      description: 'Document pentru susținerea culturilor de cereale',
      format: 'PDF',
      estimatedTime: '3 min',
      icon: FileText
    },
    {
      id: 'apia-eco-scheme',
      name: 'APIA - Eco-scheme',
      description: 'Cerere pentru practici agricole ecologice',
      format: 'PDF',
      estimatedTime: '4 min',
      icon: FileText
    },
    {
      id: 'afir-modernizare',
      name: 'AFIR - Modernizare Exploatații',
      description: 'Cerere pentru investiții în modernizare',
      format: 'Excel + PDF',
      estimatedTime: '5 min',
      icon: FileSpreadsheet
    }
  ];

  const previewDocument = (templateId: string, templateName: string) => {
    const data = generateAPIADocument(templateId, {});
    setPreviewData(data);
    setSelectedTemplate(templateId);
    setShowPreview(true);
  };

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

  const renderPreviewContent = () => {
    if (!previewData) return null;

    return (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">{previewData.documentType}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Cod fermier:</strong> {previewData.farmerCode}</p>
              <p><strong>Nume fermă:</strong> {previewData.farmName}</p>
              <p><strong>Locația:</strong> {previewData.location}</p>
              <p><strong>Data generare:</strong> {previewData.generatedDate}</p>
            </div>
          </div>
        </div>

        {selectedTemplate === 'apia-cereale' && (
          <div className="space-y-3">
            <h5 className="font-medium">Parcele cereale:</h5>
            {previewData.parcels?.map((parcel: any, index: number) => (
              <div key={index} className="bg-blue-50 p-3 rounded border">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Nume:</strong> {parcel.name}</p>
                  <p><strong>Cod parcelă:</strong> {parcel.parcelCode}</p>
                  <p><strong>Cultură:</strong> {parcel.crop}</p>
                  <p><strong>Suprafață:</strong> {parcel.size} ha</p>
                  <p><strong>Data însămânțare:</strong> {parcel.plantingDate || 'N/A'}</p>
                  <p><strong>Costuri:</strong> {parcel.costs ? `${parcel.costs} RON` : 'N/A'}</p>
                </div>
              </div>
            ))}
            <div className="bg-green-50 p-3 rounded border">
              <p><strong>Suprafață totală:</strong> {previewData.totalArea?.toFixed(1)} ha</p>
              <p><strong>Producție estimată:</strong> {previewData.estimatedProduction?.toFixed(1)} tone</p>
            </div>
          </div>
        )}

        {selectedTemplate === 'apia-eco-scheme' && (
          <div className="space-y-3">
            <h5 className="font-medium">Măsuri eco-scheme:</h5>
            <div className="bg-green-50 p-3 rounded border">
              {previewData.ecoMeasures?.map((measure: string, index: number) => (
                <p key={index} className="text-sm">• {measure}</p>
              ))}
            </div>
            <h5 className="font-medium">Parcele incluse:</h5>
            {fields.map((parcel, index) => (
              <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                <p><strong>{parcel.name}</strong> ({parcel.parcelCode}) - {parcel.size} ha - {parcel.crop}</p>
              </div>
            ))}
            <div className="bg-green-50 p-3 rounded border">
              <p><strong>Suprafață totală eco:</strong> {previewData.totalEcoArea?.toFixed(1)} ha</p>
            </div>
          </div>
        )}

        {selectedTemplate === 'afir-modernizare' && (
          <div className="space-y-3">
            <div className="bg-purple-50 p-3 rounded border">
              <p><strong>Tip investiție:</strong> {previewData.investmentType}</p>
              <p><strong>Suma solicitată:</strong> {previewData.requestedAmount?.toLocaleString()} RON</p>
              <p><strong>Cofinanțare:</strong> {previewData.cofinancing?.toLocaleString()} RON</p>
              <p><strong>Durata implementare:</strong> {previewData.timeline}</p>
            </div>
            <h5 className="font-medium">Echipamente incluse:</h5>
            {previewData.equipment?.map((item: any, index: number) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                <p><strong>{item.name}</strong> - {item.condition}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
            const IconComponent = template.icon;
            return (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <IconComponent className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{template.format}</Badge>
                        <span className="text-xs text-gray-500">⏱️ {template.estimatedTime}</span>
                      </div>
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
                          onClick={() => previewDocument(template.id, template.name)}
                        >
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
            <li>• {fields.length} parcele cu coduri și suprafețe</li>
            <li>• Date complete pentru fiecare cultură</li>
            <li>• Informații despre costuri și investiții</li>
            <li>• Coordonate GPS și identificare precisă</li>
          </ul>
        </div>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview Document</DialogTitle>
            </DialogHeader>
            {renderPreviewContent()}
            <div className="flex space-x-2 mt-4">
              <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
                Închide
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setShowPreview(false);
                  generateDocument(selectedTemplate, documentTemplates.find(t => t.id === selectedTemplate)?.name || '');
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Generează document final
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default APIADocumentGenerator;
