
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface InteractiveMapProps {
  mapType?: string;
  onFieldSelect?: (field: any) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

const InteractiveMap = ({ mapType = 'roadmap', onFieldSelect, onMapClick }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const { fields } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const GOOGLE_MAPS_API_KEY = "AIzaSyDloS4Jj3CMvgpmdrWUECSOKs12A8wX1io";

  // Parse coordinates from field data
  const parseCoordinates = (field: any) => {
    console.log('Parsing coordinates for field:', field.name);
    
    // Check if field has simple coordinates
    if (field.coordinates && typeof field.coordinates === 'object' && 
        field.coordinates.lat && field.coordinates.lng) {
      const coords = {
        lat: Number(field.coordinates.lat),
        lng: Number(field.coordinates.lng)
      };
      console.log('Found valid point coordinates for field:', field.name, coords);
      return [coords];
    }

    console.log('No valid coordinates found for field:', field.name);
    return null;
  };

  // Create polygon for a field
  const createFieldPolygon = (field: any, map: google.maps.Map) => {
    const coordinates = parseCoordinates(field);
    if (!coordinates) return null;

    let path: google.maps.LatLng[];

    // For a single point, create a small circular polygon
    const center = coordinates[0];
    const radius = 0.002; // approximately 200m
    path = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      path.push(new google.maps.LatLng(
        center.lat + radius * Math.cos(angle),
        center.lng + radius * Math.sin(angle)
      ));
    }

    const polygon = new google.maps.Polygon({
      paths: path,
      strokeColor: field.color || '#22c55e',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: field.color || '#22c55e',
      fillOpacity: 0.5,
      editable: false,
      draggable: false
    });

    polygon.setMap(map);

    // Add click listener
    polygon.addListener('click', () => {
      if (onFieldSelect) {
        onFieldSelect(field);
      }
      
      toast({
        title: field.name,
        description: `${field.crop} • ${field.size} ha • ${field.parcelCode}`,
      });
    });

    // Add hover tooltip
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-semibold text-green-800">${field.name}</h3>
          <p class="text-sm text-gray-600">${field.parcelCode}</p>
          <p class="text-sm">${field.crop} • ${field.size} ha</p>
        </div>
      `
    });

    polygon.addListener('mouseover', (event: google.maps.PolyMouseEvent) => {
      if (event.latLng) {
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      }
    });

    polygon.addListener('mouseout', () => {
      infoWindow.close();
    });

    return polygon;
  };

  // Calculate map bounds for all fields
  const calculateMapBounds = () => {
    const bounds = new google.maps.LatLngBounds();
    let hasCoordinates = false;

    fields.forEach(field => {
      const coordinates = parseCoordinates(field);
      if (coordinates) {
        coordinates.forEach(coord => {
          bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
          hasCoordinates = true;
        });
      }
    });

    if (!hasCoordinates) {
      // Default coordinates for Romania (center of Romania)
      return {
        center: { lat: 45.9432, lng: 24.9668 },
        zoom: 7
      };
    }

    return bounds;
  };

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

        const bounds = calculateMapBounds();
        const mapOptions: google.maps.MapOptions = {
          mapTypeId: mapType as google.maps.MapTypeId,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
          zoomControl: true
        };

        // Set center and zoom
        if (bounds instanceof google.maps.LatLngBounds) {
          mapOptions.center = bounds.getCenter().toJSON();
          mapOptions.zoom = 12;
        } else {
          mapOptions.center = bounds.center;
          mapOptions.zoom = bounds.zoom;
        }

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

        // Adjust view to include all fields
        if (bounds instanceof google.maps.LatLngBounds && fields.length > 0) {
          map.fitBounds(bounds);
          
          // Limit maximum zoom
          const listener = google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom()! > 16) map.setZoom(16);
            google.maps.event.removeListener(listener);
          });
        }

        // Create polygons for fields with coordinates
        const newPolygons: google.maps.Polygon[] = [];
        const fieldsWithCoordinates = fields.filter(field => {
          const coords = parseCoordinates(field);
          return coords !== null;
        });
        
        console.log(`Processing ${fieldsWithCoordinates.length} fields with coordinates out of ${fields.length} total fields`);
        
        fieldsWithCoordinates.forEach(field => {
          console.log('Processing field for map:', field.name);
          const polygon = createFieldPolygon(field, map);
          if (polygon) {
            newPolygons.push(polygon);
            console.log('Created polygon for field:', field.name);
          }
        });

        polygonsRef.current = newPolygons;
        setIsLoading(false);

        console.log(`Map loaded successfully with ${newPolygons.length} polygons`);

        // Show appropriate success message
        if (fields.length === 0) {
          toast({
            title: "Hartă încărcată",
            description: "Adăugați terenuri pentru a le vedea pe hartă.",
          });
        } else if (fieldsWithCoordinates.length === 0) {
          toast({
            title: "Hartă încărcată",
            description: `Aveți ${fields.length} terenuri, dar nu au coordonate GPS. Editați terenurile pentru a adăuga coordonate.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Hartă încărcată",
            description: `${newPolygons.length} din ${fieldsWithCoordinates.length} terenuri afișate pe hartă.`,
          });
        }

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

    // Cleanup
    return () => {
      polygonsRef.current.forEach(polygon => {
        polygon.setMap(null);
      });
      polygonsRef.current = [];
    };
  }, [fields, mapType, onMapClick]);

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
