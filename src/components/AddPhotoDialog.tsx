import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from "@/hooks/use-toast"

interface AddPhotoDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  fieldId: string;
}

const AddPhotoDialog = ({ open, onOpenChange, fieldId }: AddPhotoDialogProps) => {
  const { addFieldPhoto } = useAppContext();
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activity: '',
    cropStage: '',
    weather: '',
    notes: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prevData => ({
        ...prevData,
        date: date.toISOString().split('T')[0],
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      activity: '',
      cropStage: '',
      weather: '',
      notes: '',
      imageUrl: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const photoData = {
        field_id: fieldId,
        date: formData.date,
        activity: formData.activity,
        crop_stage: formData.cropStage,
        weather_conditions: formData.weather,
        notes: formData.notes,
        image_url: formData.imageUrl,
        created_at: new Date().toISOString(),
        user_id: '', // Will be set by the context
      };

      await addFieldPhoto(photoData);
      toast({
        title: "Fotografie adăugată",
        description: "Fotografia a fost adăugată cu succes."
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea fotografiei.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Adaugă Jurnal Vizual</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă o Fotografie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Data
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    {formData.date ? (
                      format(new Date(formData.date), "PPP")
                    ) : (
                      <span>Alege o dată</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={handleDateChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activity" className="text-right">
              Activitate
            </Label>
            <Input id="activity" name="activity" value={formData.activity} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cropStage" className="text-right">
              Stadiul Culturii
            </Label>
            <Select onValueChange={(value) => handleSelectChange('cropStage', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selectează stadiul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seeding">Semănare</SelectItem>
                <SelectItem value="growth">Creștere</SelectItem>
                <SelectItem value="flowering">Înflorire</SelectItem>
                <SelectItem value="harvest">Recoltare</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weather" className="text-right">
              Condiții Meteo
            </Label>
            <Input id="weather" name="weather" value={formData.weather} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              URL Imagine
            </Label>
            <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right mt-2">
              Note
            </Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="col-span-3" />
          </div>
          <Button type="submit">Adaugă Fotografie</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoDialog;
