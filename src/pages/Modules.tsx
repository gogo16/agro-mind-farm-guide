
import React from 'react';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import APIADocumentGenerator from '@/components/APIADocumentGenerator';
import VisualCropJournal from '@/components/VisualCropJournal';
import InventorySystem from '@/components/InventorySystem';
import SeasonalGuidanceAI from '@/components/SeasonalGuidanceAI';

const Modules = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Module Avansate AgroMind</h1>
          <p className="text-green-600">Instrumente profesionale pentru gestionarea fermei</p>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="documents">📁 Documente APIA</TabsTrigger>
            <TabsTrigger value="journal">📸 Jurnal Vizual</TabsTrigger>
            <TabsTrigger value="inventory">🧮 Inventar</TabsTrigger>
            <TabsTrigger value="ai-guidance">🧠 AI Ghid</TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <APIADocumentGenerator />
          </TabsContent>

          <TabsContent value="journal">
            <VisualCropJournal />
          </TabsContent>

          <TabsContent value="inventory">
            <InventorySystem />
          </TabsContent>

          <TabsContent value="ai-guidance">
            <SeasonalGuidanceAI />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Modules;
