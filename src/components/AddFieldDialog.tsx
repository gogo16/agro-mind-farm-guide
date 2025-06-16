import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from '@/contexts/AppContext';
import { Plus } from 'lucide-react';

interface AddFieldDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddFieldDialog = ({ open, onOpenChange }: AddFieldDialogProps) => {
  const { addField } = useAppContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    parcelCode: '',
    size: '',
    crop: '',
    variety: '',
    status: 'active',
    location: '',
    coordinates: '',
    coordinatesType: 'gps',
    plantingDate: undefined,
    harvestDate: undefined,
    workType: '',
    color: '#22c55e',
    costs: '',
    productivity: '',
    inputs: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      parcelCode: '',
      size: '',
      crop: '',
      variety: '',
      status: 'active',
      location: '',
      coordinates: '',
      coordinatesType: 'gps',
      plantingDate: undefined,
      harvestDate: undefined,
      workType: '',
      color: '#22c55e',
      costs: '',
      productivity: '',
      inputs: '',
      notes: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: date
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fieldData = {
        name: formData.name,
        parcel_code: formData.parcelCode,
        size: parseFloat(formData.size) || 0,
        crop: formData.crop,
        status: formData.status,
        location: formData.location,
        coordinates: formData.coordinates ? JSON.parse(`{"lat": 0, "lng": 0}`) : null,
        planting_date: formData.plantingDate ? formData.plantingDate.toISOString().split('T')[0] : null,
        harvest_date: formData.harvestDate ? formData.harvestDate.toISOString().split('T')[0] : null,
        work_type: formData.workType,
        color: formData.color,
        costs: parseFloat(formData.costs) || 0,
        inputs: formData.inputs,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: '', // Will be set by the addField function
        roi: 0,
        soil_data: {}
      };

      await addField(fieldData);
      toast({
        title: "Teren adăugat",
        description: "Terenul a fost adăugat cu succes."
      });
      onOpenChange?.(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea terenului.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă Teren
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă un teren nou</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nume
            </Label>
            <Input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parcelCode" className="text-right">
              Cod Parcelă
            </Label>
            <Input type="text" id="parcelCode" name="parcelCode" value={formData.parcelCode} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Suprafață (ha)
            </Label>
            <Input type="number" id="size" name="size" value={formData.size} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="crop" className="text-right">
              Cultură
            </Label>
            <Input type="text" id="crop" name="crop" value={formData.crop} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="variety" className="text-right">
              Varietate
            </Label>
            <Input type="text" id="variety" name="variety" value={formData.variety} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selectează status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activ">Activ</SelectItem>
                <SelectItem value="inactiv">Inactiv</SelectItem>
                <SelectItem value="pregatire">Pregătire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Locație
            </Label>
            <Input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coordinates" className="text-right">
              Coordonate
            </Label>
            <Input type="text" id="coordinates" name="coordinates" value={formData.coordinates} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coordinatesType" className="text-right">
              Tip Coordonate
            </Label>
            <Select onValueChange={(value) => handleSelectChange('coordinatesType', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selectează tipul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gps">GPS</SelectItem>
                <SelectItem value="utm">UTM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plantingDate" className="text-right">
              Data Plantării
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !formData.plantingDate && "text-muted-foreground"
                  )}
                >
                  {formData.plantingDate ? (
                    format(formData.plantingDate, "PPP")
                  ) : (
                    <span>Alege o dată</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.plantingDate}
                  onSelect={(date) => handleDateChange('plantingDate', date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("01-01-2020")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="harvestDate" className="text-right">
              Data Recoltării
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !formData.harvestDate && "text-muted-foreground"
                  )}
                >
                  {formData.harvestDate ? (
                    format(formData.harvestDate, "PPP")
                  ) : (
                    <span>Alege o dată</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.harvestDate}
                  onSelect={(date) => handleDateChange('harvestDate', date)}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="workType" className="text-right">
              Tip Lucrare
            </Label>
            <Input type="text" id="workType" name="workType" value={formData.workType} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Culoare
            </Label>
            <Input type="color" id="color" name="color" value={formData.color} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="costs" className="text-right">
              Costuri
            </Label>
            <Input type="text" id="costs" name="costs" value={formData.costs} onChange={handleInputChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productivity" className="text-right">
              Productivitate
            </Label>
            <Input type="text" id="productivity" name="productivity" value={formData.productivity} onChange={handleInputChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inputs" className="text-right">
              Intrări
            </Label>
            <Input type="text" id="inputs" name="inputs" value={formData.inputs} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right mt-2">
              Note
            </Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} className="col-span-3" />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Anulează
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Adaugă</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldDialog;
