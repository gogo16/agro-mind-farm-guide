import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface InteractiveMapProps {
  mapType: string;
  onFieldSelect?: (field: any) => void;
  fields?: any[];
}

const InteractiveMap = ({ mapType, onFieldSelect, fields = [] }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const GOOGLE_MAPS_API_KEY = "AIzaSyDloS4Jj3CMvgpmdrWUECSOKs12A8wX1io";

  // Enhanced coordinate parsing with support for multiple GPS points
  const parseCoordinates = (field: any) => {
    console.log('Parsing coordinates for field:', field.name, 'coordinates:', field.coordinates);
    
    if (!field.coordinates) {
      console.log('No coordinates found for field:', field.name);
      return null;
    }

    // Handle single point coordinates {lat: number, lng: number}
    if (field.coordinates.lat && field.coordinates.lng) {
      console.log('Single point coordinates found:', field.coordinates);
      return [{
        lat: parseFloat(field.coordinates.lat),
        lng: parseFloat(field.coordinates.lng)
      }];
    }

    // Handle array of coordinates [{lat: number, lng: number}, ...]
    if (Array.isArray(field.coordinates)) {
      console.log('Array coordinates found, length:', field.coordinates.length);
      const parsedCoords = field.coordinates.map((coord: any) => ({
        lat: parseFloat(coord.lat),
        lng: parseFloat(coord.lng)
      }));
      console.log('Parsed array coordinates:', parsedCoords);
      return parsedCoords;
    }

    console.log('Invalid coordinate format for field:', field.name, 'type:', typeof field.coordinates);
    return null;
  };

  // Enhanced polygon creation for multiple GPS points
  const createFieldPolygon = (field: any, map: google.maps.Map) => {
    const coordinates = parseCoordinates(field);
    if (!coordinates || coordinates.length === 0) {
      console.log('No valid coordinates for field:', field.name);
      return null;
    }

    let path: google.maps.LatLng[];
    const color = field.color || '#22c55e';

    if (coordinates.length === 1) {
      // For a single point, create a small circular polygon
      const center = coordinates[0];
      const radius = 0.002; // approximately 200m
      path = [];
      for (let i = 0; i < 12; i++) {
        const angle = (i * 2 * Math.PI) / 12;
        path.push(new google.maps.LatLng(
          center.lat + radius * Math.cos(angle),
          center.lng + radius * Math.sin(angle)
        ));
      }
      console.log('Created circle for single point:', field.name);
    } else if (coordinates.length === 2) {
      // For exactly 2 points, create a circle at the midpoint
      const center = {
        lat: (coordinates[0].lat + coordinates[1].lat) / 2,
        lng: (coordinates[0].lng + coordinates[1].lng) / 2
      };
      const radius = 0.003; // slightly larger for 2-point fields
      path = [];
      for (let i = 0; i < 16; i++) {
        const angle = (i * 2 * Math.PI) / 16;
        path.push(new google.maps.LatLng(
          center.lat + radius * Math.cos(angle),
          center.lng + radius * Math.sin(angle)
        ));
      }
      console.log('Created circle for 2 points at midpoint:', field.name, center);
    } else {
      // For 3+ points, create a polygon
      path = coordinates.map(coord => new google.maps.LatLng(coord.lat, coord.lng));
      // Close the polygon if it's not already closed
      if (coordinates.length > 2 && 
          (coordinates[0].lat !== coordinates[coordinates.length - 1].lat ||
           coordinates[0].lng !== coordinates[coordinates.length - 1].lng)) {
        path.push(path[0]);
      }
      console.log('Created polygon for field:', field.name, 'with', coordinates.length, 'points');
    }

    const polygon = new google.maps.Polygon({
      paths: path,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      editable: false,
      draggable: false
    });

    polygon.setMap(map);
    console.log('Polygon created and added to map for field:', field.name);

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

    // Add hover info window
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

  // Enhanced bounds calculation with fallback
  const calculateMapBounds = () => {
    const bounds = new google.maps.LatLngBounds();
    let hasCoordinates = false;

    console.log('Calculating bounds for', fields.length, 'fields');

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
      console.log('No coordinates found, using default center for Romania');
      return {
        center: { lat: 45.75, lng: 26.21 },
        zoom: 7
      };
    }

    console.log('Bounds calculated successfully');
    return bounds;
  };

  useEffect(() => {
    if (!mapRef.current || !GOOGLE_MAPS_API_KEY) {
      console.log('Map container or API key not available');
      return;
    }

    console.log('Initializing map with', fields.length, 'fields');
    console.log('Fields data:', fields.map(f => ({
      name: f.name,
      coordinates: f.coordinates,
      type: Array.isArray(f.coordinates) ? 'array' : typeof f.coordinates
    })));

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['geometry', 'drawing']
        });

        await loader.load();
        console.log('Google Maps loaded successfully');

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

        const map = new google.maps.Map(mapRef.current!, mapOptions);
        mapInstanceRef.current = map;
        console.log('Map instance created');

        // Fit bounds to show all fields
        if (bounds instanceof google.maps.LatLngBounds && fields.length > 0) {
          map.fitBounds(bounds);
          
          // Limit maximum zoom
          const listener = google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom()! > 16) map.setZoom(16);
            google.maps.event.removeListener(listener);
          });
        }

        // Clear existing polygons
        polygonsRef.current.forEach(polygon => {
          polygon.setMap(null);
        });
        polygonsRef.current = [];

        // Create polygons for all fields
        const newPolygons: google.maps.Polygon[] = [];
        console.log('Creating polygons for fields...');
        
        fields.forEach((field, index) => {
          console.log(`Processing field ${index + 1}/${fields.length}:`, field.name, 'coordinates:', field.coordinates);
          const polygon = createFieldPolygon(field, map);
          if (polygon) {
            newPolygons.push(polygon);
            console.log(`✓ Polygon created for field: ${field.name}`);
          } else {
            console.log(`✗ Failed to create polygon for field: ${field.name}`);
          }
        });

        polygonsRef.current = newPolygons;
        setIsLoading(false);

        console.log(`Map initialization complete. Created ${newPolygons.length} polygons for ${fields.length} fields`);

      } catch (error) {
        console.error('Error loading Google Maps:', error);
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

  // Update map type when changed
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType as google.maps.MapTypeId);
    }
  }, [mapType]);

  // Function to center on a specific field
  const centerOnField = (field: any) => {
    if (!mapInstanceRef.current) return;

    const coordinates = parseCoordinates(field);
    if (coordinates && coordinates.length > 0) {
      let center;
      if (coordinates.length === 1) {
        center = coordinates[0];
      } else if (coordinates.length === 2) {
        center = {
          lat: (coordinates[0].lat + coordinates[1].lat) / 2,
          lng: (coordinates[0].lng + coordinates[1].lng) / 2
        };
      } else {
        // Calculate centroid for polygon
        const sumLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
        const sumLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0);
        center = {
          lat: sumLat / coordinates.length,
          lng: sumLng / coordinates.length
        };
      }
      
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(16);
    }
  };

  // Expose function globally
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
