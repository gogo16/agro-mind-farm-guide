
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface InteractiveMapProps {
  mapType: string;
  onFieldSelect?: (field: any) => void;
}

const InteractiveMap = ({ mapType, onFieldSelect }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const { fields } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const GOOGLE_MAPS_API_KEY = "AIzaSyDloS4Jj3CMvgpmdrWUECSOKs12A8wX1io";

  // Convertește coordonatele din string în format Google Maps
  const parseCoordinates = (field: any) => {
    if (!field.coordinates) return null;

    // Dacă sunt coordonate simple (un punct)
    if (field.coordinates.lat && field.coordinates.lng) {
      return [{
        lat: field.coordinates.lat,
        lng: field.coordinates.lng
      }];
    }

    // Dacă sunt coordonate pentru poligon (array)
    if (Array.isArray(field.coordinates)) {
      return field.coordinates.map((coord: any) => ({
        lat: coord.lat,
        lng: coord.lng
      }));
    }

    return null;
  };

  // Creează un poligon pentru teren
  const createFieldPolygon = (field: any, map: google.maps.Map) => {
    const coordinates = parseCoordinates(field);
    if (!coordinates) return null;

    let path: google.maps.LatLng[];

    if (coordinates.length === 1) {
      // Pentru un punct, creează un poligon mic circular
      const center = coordinates[0];
      const radius = 0.002; // aproximativ 200m
      path = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        path.push(new google.maps.LatLng(
          center.lat + radius * Math.cos(angle),
          center.lng + radius * Math.sin(angle)
        ));
      }
    } else {
      // Pentru coordonate multiple, folosește-le direct
      path = coordinates.map(coord => new google.maps.LatLng(coord.lat, coord.lng));
      // Închide poligonul dacă nu e deja închis
      if (coordinates.length > 2 && 
          (coordinates[0].lat !== coordinates[coordinates.length - 1].lat ||
           coordinates[0].lng !== coordinates[coordinates.length - 1].lng)) {
        path.push(path[0]);
      }
    }

    const polygon = new google.maps.Polygon({
      paths: path,
      strokeColor: field.color || '#22c55e',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: field.color || '#22c55e',
      fillOpacity: 0.5,
      editable: false, // Va fi activat ulterior pentru editare
      draggable: false
    });

    polygon.setMap(map);

    // Adaugă event listener pentru click
    polygon.addListener('click', () => {
      if (onFieldSelect) {
        onFieldSelect(field);
      }
      
      toast({
        title: field.name,
        description: `${field.crop} • ${field.size} ha • ${field.parcelCode}`,
      });
    });

    // Adaugă tooltip la hover
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-semibold text-green-800">${field.name}</h3>
          <p class="text-sm text-gray-600">${field.parcelCode}</p>
          <p class="text-sm">${field.crop} • ${field.size} ha</p>
        </div>
      `
    });

    polygon.addListener('mouseover', (event: any) => {
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });

    polygon.addListener('mouseout', () => {
      infoWindow.close();
    });

    return polygon;
  };

  // Calculează centrul și zoom pentru a include toate terenurile
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
      // Coordonate default pentru România (Buzău)
      return {
        center: { lat: 45.75, lng: 21.21 },
        zoom: 10
      };
    }

    return bounds;
  };

  useEffect(() => {
    if (!mapRef.current || !GOOGLE_MAPS_API_KEY) return;

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['geometry', 'drawing']
        });

        await loader.load();

        const bounds = calculateMapBounds();
        const mapOptions: google.maps.MapOptions = {
          mapTypeId: mapType as google.maps.MapTypeId,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
          zoomControl: true
        };

        // Setează centrul și zoom
        if (bounds instanceof google.maps.LatLngBounds) {
          mapOptions.center = bounds.getCenter().toJSON();
          mapOptions.zoom = 12;
        } else {
          mapOptions.center = bounds.center;
          mapOptions.zoom = bounds.zoom;
        }

        const map = new google.maps.Map(mapRef.current!, mapOptions);
        mapInstanceRef.current = map;

        // Ajustează view-ul pentru a include toate terenurile
        if (bounds instanceof google.maps.LatLngBounds && fields.length > 0) {
          map.fitBounds(bounds);
          
          // Limitează zoom-ul maxim pentru a nu fi prea aproape
          const listener = google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom()! > 16) map.setZoom(16);
            google.maps.event.removeListener(listener);
          });
        }

        // Creează poligoanele pentru terenuri
        const newPolygons: google.maps.Polygon[] = [];
        fields.forEach(field => {
          const polygon = createFieldPolygon(field, map);
          if (polygon) {
            newPolygons.push(polygon);
          }
        });

        polygonsRef.current = newPolygons;
        setIsLoading(false);

        console.log(`Harta încărcată cu ${newPolygons.length} poligoane pentru terenuri`);

      } catch (error) {
        console.error('Eroare la încărcarea Google Maps:', error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut încărca harta Google Maps",
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
  }, [fields, mapType]);

  // Actualizează tipul de hartă
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType as google.maps.MapTypeId);
    }
  }, [mapType]);

  // Funcție pentru centrarea pe un teren specific
  const centerOnField = (field: any) => {
    if (!mapInstanceRef.current) return;

    const coordinates = parseCoordinates(field);
    if (coordinates && coordinates.length > 0) {
      const center = coordinates[0];
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(16);
    }
  };

  // Expune funcția pentru a putea fi apelată din parent
  useEffect(() => {
    (window as any).centerMapOnField = centerOnField;
  }, []);

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
