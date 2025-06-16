
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const APIADocumentGenerator = () => {
  const { generateAPIADocument, user, fields } = useAppContext();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [documentType, setDocumentType] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Prepare data for API call
      const data = {
        user_id: user?.id,
        fields: selectedFields,
        documentType: documentType,
        year: year,
      };

      // Call the generateAPIADocument function
      await generateAPIADocument(data);

      toast({
        title: "Document generat",
        description: "Documentul APIA a fost generat cu succes."
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la generarea documentului.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Generator Documente APIA</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Type Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Tip document</Label>
          <Select onValueChange={setDocumentType} value={documentType}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează tipul documentului..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cerere_plata">Cerere de plată</SelectItem>
              <SelectItem value="declaratie_suprafata">Declarație de suprafață</SelectItem>
              <SelectItem value="schema_plati">Schema de plăți</SelectItem>
              <SelectItem value="eco_scheme">Eco-scheme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Year Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Anul campaniei</Label>
          <Select onValueChange={(value) => setYear(parseInt(value))} value={year.toString()}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Field Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Selectează parcelele</Label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded p-3">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFields([...selectedFields, field.id]);
                    } else {
                      setSelectedFields(selectedFields.filter(id => id !== field.id));
                    }
                  }}
                />
                <Label htmlFor={field.id} className="text-sm">
                  {field.name} ({field.parcel_code}) - {field.size} ha
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={!documentType || selectedFields.length === 0 || isGenerating}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Se generează...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generează Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default APIADocumentGenerator;
