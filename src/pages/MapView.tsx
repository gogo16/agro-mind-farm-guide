
import React from 'react';
import Navigation from '@/components/Navigation';
import InteractiveMap from '@/components/InteractiveMap';
import AddFieldDialog from '@/components/AddFieldDialog';

const MapView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Harta Parcelelor</h1>
            <p className="text-green-600">Vizualizează și gestionează parcelele din exploatație</p>
          </div>
          
          <AddFieldDialog />
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-green-200 overflow-hidden">
          <InteractiveMap />
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Folosește butonul "Adaugă teren" pentru a adăuga o parcelă nouă</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
