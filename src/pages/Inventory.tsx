
import React from 'react';
import Navigation from '@/components/Navigation';
import InventorySystem from '@/components/InventorySystem';

const Inventory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Inventar AgroMind</h1>
          <p className="text-green-600">Gestionarea echipamentelor, materialelor și culturilor</p>
        </div>

        <InventorySystem />
      </div>
    </div>
  );
};

export default Inventory;
