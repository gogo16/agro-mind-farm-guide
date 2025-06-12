
import React from 'react';
import Navigation from '@/components/Navigation';
import APIADocumentGenerator from '@/components/APIADocumentGenerator';
import OblioIntegration from '@/components/OblioIntegration';

const Modules = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Module AgroMind</h1>
          <p className="text-green-600">Documente APIA/AFIR și Integrări Externe</p>
        </div>

        <div className="space-y-6">
          <APIADocumentGenerator />
          <OblioIntegration />
        </div>
      </div>
    </div>
  );
};

export default Modules;
