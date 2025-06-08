
import React from 'react';
import Navigation from '@/components/Navigation';
import PropertyDocuments from '@/components/PropertyDocuments';

const Documents = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <PropertyDocuments />
      </div>
    </div>
  );
};

export default Documents;
