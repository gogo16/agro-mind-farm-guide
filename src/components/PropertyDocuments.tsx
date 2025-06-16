import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface DocumentForm {
  type: string;
  name: string;
  fileName: string;
  uploadDate: Date | undefined;
  issueDate: Date | undefined;
  validUntil: Date | undefined;
  status: string;
  notes: string;
}

const PropertyDocuments = () => {
  const { fields, addPropertyDocument } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState<DocumentForm>({
    type: '',
    name: '',
    fileName: '',
    uploadDate: undefined,
    issueDate: undefined,
    validUntil: undefined,
    status: '',
    notes: '',
  });
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      fileName: '',
      uploadDate: undefined,
      issueDate: undefined,
      validUntil: undefined,
      status: '',
      notes: '',
    });
    setSelectedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField) return;

    try {
      const documentData = {
        field_id: selectedField,
        document_type: formData.type,
        name: formData.name,
        file_name: formData.fileName,
        upload_date: formData.uploadDate?.toISOString(),
        issue_date: formData.issueDate?.toISOString(),
        valid_until: formData.validUntil?.toISOString(),
        status: formData.status as "verified" | "missing" | "expired" | "complete",
        notes: formData.notes,
        created_at: new Date().toISOString(),
		file_url: '',
      };

      await addPropertyDocument(documentData);
      toast({
        title: "Document adăugat",
        description: "Documentul a fost adăugat cu succes."
      });
      resetForm();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea documentului.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800">Documente Proprietate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Field Selection */}
        <div>
          <Label htmlFor="field" className="text-sm font-medium text-gray-700">Selectează Terenul</Label>
          <Select onValueChange={setSelectedField}>
            <SelectTrigger>
              <SelectValue placeholder="Alege un teren..." />
            </SelectTrigger>
            <SelectContent>
              {fields.map(field => (
                <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Document Type */}
        <div>
          <Label htmlFor="type" className="text-sm font-medium text-gray-700">Tip Document</Label>
          <Input
            type="text"
            name="type"
            id="type"
            value={formData.type}
            onChange={handleInputChange}
            className="border-gray-300 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Document Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nume Document</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border-gray-300 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* File Name */}
        <div>
          <Label htmlFor="fileName" className="text-sm font-medium text-gray-700">Nume Fisiier</Label>
          <Input
            type="text"
            name="fileName"
            id="fileName"
            value={formData.fileName}
            onChange={handleInputChange}
            className="border-gray-300 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Upload Date */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Data Upload</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !formData.uploadDate && "text-muted-foreground"
                )}
              >
                {formData.uploadDate ? (
                  format(formData.uploadDate, "PPP")
                ) : (
                  <span>Alege o dată</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={formData.uploadDate}
                onSelect={(date) => setFormData(prev => ({ ...prev, uploadDate: date }))}
                disabled={(date) =>
                  date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Issue Date */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Data Emiterii</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !formData.issueDate && "text-muted-foreground"
                )}
              >
                {formData.issueDate ? (
                  format(formData.issueDate, "PPP")
                ) : (
                  <span>Alege o dată</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={formData.issueDate}
                onSelect={(date) => setFormData(prev => ({ ...prev, issueDate: date }))}
                disabled={(date) =>
                  date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Valid Until */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Valid Până la</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !formData.validUntil && "text-muted-foreground"
                )}
              >
                {formData.validUntil ? (
                  format(formData.validUntil, "PPP")
                ) : (
                  <span>Alege o dată</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={formData.validUntil}
                onSelect={(date) => setFormData(prev => ({ ...prev, validUntil: date }))}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
          <Select onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează un status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verificat</SelectItem>
              <SelectItem value="missing">Lipsă</SelectItem>
              <SelectItem value="expired">Expirat</SelectItem>
              <SelectItem value="complete">Complet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Note</Label>
          <Input
            type="text"
            name="notes"
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="border-gray-300 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">
          Adaugă Document
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyDocuments;
