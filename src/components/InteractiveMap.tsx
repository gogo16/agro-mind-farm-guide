
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useToast } from '@/hooks/use-toast';

interface InteractiveMapProps {
  mapType?: string;
  onFieldSelect?: (field: any) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

const InteractiveMap = ({ mapType = 'roadmap', onFieldSelect, onMapClick }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const GOOGLE_MAPS_API_KEY = "AIzaSyDloS4Jj3CMvgpmdrWUECSOKs12A8wX1io";

  // Romanian coordinates - center of Romania
  const ROMANIA_CENTER = { lat: 45.9432, lng: 24.9668 };

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setInitError(null);

        if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.includes("YOUR_GOOGLE_MAPS_API_KEY")) {
          throw new Error("API key not configured");
        }

        console.log('Initializing Google Maps with API key...');

        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['geometry', 'drawing']
        });

        await loader.load();
        console.log('Google Maps API loaded successfully');

        const mapOptions: google.maps.MapOptions = {
          center: ROMANIA_CENTER,
          zoom: 7,
          mapTypeId: mapType as google.maps.MapTypeId,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ weight: "2.00" }]
            },
            {
              featureType: "all",
              elementType: "geometry.stroke",
              stylers: [{ color: "#9c9c9c" }]
            },
            {
              featureType: "all",
              elementType: "labels.text",
              stylers: [{ visibility: "on" }]
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#f2f2f2" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "landscape.man_made",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "poi",
              elementType: "all",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "road",
              elementType: "all",
              stylers: [{ saturation: -100 }, { lightness: 45 }]
            },
            {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [{ color: "#eeeeee" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#7b7b7b" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "road.highway",
              elementType: "all",
              stylers: [{ visibility: "simplified" }]
            },
            {
              featureType: "road.arterial",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#46bcec" }, { visibility: "on" }]
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#c8d7d4" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#070707" }]
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }]
            }
          ]
        };

        console.log('Creating map with options:', mapOptions);
        const map = new google.maps.Map(mapRef.current!, mapOptions);
        mapInstanceRef.current = map;

        // Add map click listener for adding new fields
        if (onMapClick) {
          map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              onMapClick(event.latLng.lat(), event.latLng.lng());
            }
          });
        }

        setIsLoading(false);
        console.log(`Beautiful map loaded successfully, centered on Romania`);

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
        
        toast({
          title: "Eroare hartă",
          description: "Nu s-a putut încărca harta Google Maps. Verificați conexiunea la internet.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    initMap();
  }, [mapType, onMapClick]);

  // Update map type
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType as google.maps.MapTypeId);
    }
  }, [mapType]);

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.includes("YOUR_GOOGLE_MAPS_API_KEY")) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-green-800 mb-2">Google Maps nu este configurat</div>
          <p className="text-gray-600">Pentru a activa harta, înlocuiește YOUR_GOOGLE_MAPS_API_KEY cu cheia ta API Google Maps</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-800 mb-2">Eroare încărcare hartă</div>
          <p className="text-gray-600 mb-4">Detalii: {initError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reîncarcă pagina
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Se încarcă harta...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default InteractiveMap;
