
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import AddFieldDialog from './AddFieldDialog';
import FieldListItem from './FieldListItem';
import FieldCard from './FieldCard';

interface FieldsOverviewProps {
  detailed?: boolean;
}

const FieldsOverview = ({ detailed = false }: FieldsOverviewProps) => {
  const { fields } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!detailed) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800">Terenurile tale</CardTitle>
          <AddFieldDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map(field => (
            <FieldListItem key={field.id} field={field} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Gestionarea Terenurilor</h2>
        <AddFieldDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(field => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
};

export default FieldsOverview;
