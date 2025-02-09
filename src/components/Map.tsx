import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation } from '@/context/LocationContext';

// Set MapTiler Terrain style
const MAPTILER_STYLE: mapboxgl.Style = {
  version: 8,
  sources: {
    terrain: {
      type: 'raster' as const,
      tiles: ['https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.maptiler.com">MapTiler</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  layers: [
    {
      id: 'terrain',
      type: 'raster' as const,
      source: 'terrain',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const createPopupHTML = (name: string, comment: string) => `
  <div class="p-3 min-w-[200px]">
    <h3 class="text-black text-lg font-semibold mb-1" style="color: black !important;">
      ${name}
    </h3>
    ${comment ? `<p class="text-black text-base" style="color: black !important;">${comment}</p>` : ''}
  </div>
`;

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const poiMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const { currentLocation, currentPath, isTracking, pois } = useLocation();
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = 'not-needed-for-maptiler';
      
      const initialLocation = currentLocation || [2.3488, 48.8534]; // Default to Paris if no location
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPTILER_STYLE,
        center: initialLocation,
        zoom: 15,
        maxZoom: 19,
        minZoom: 3,
        attributionControl: true,
        failIfMajorPerformanceCaveat: true,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        if (!map.current) return;

        try {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: currentPath.map(point => point.coordinates),
              },
            },
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#00ff00',
              'line-width': 3,
              'line-opacity': 0.8,
            },
          });

          setIsMapInitialized(true);
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error adding map layers:', error.message);
          }
        }
      });

      map.current.on('error', (e) => {
        if (e.error instanceof Error) {
          console.error('Map error:', e.error.message);
        }
      });

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error initializing map:', error.message);
      }
    }

    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error removing map:', error.message);
          }
        }
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !isMapInitialized) return;

    try {
      poiMarkersRef.current.forEach(marker => marker.remove());
      poiMarkersRef.current = [];

      pois.forEach(poi => {
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px',
          className: 'custom-popup'
        })
        .setHTML(createPopupHTML(poi.name, poi.comment));

        const marker = new mapboxgl.Marker({ color: '#ff4444' })
          .setLngLat(poi.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
        poiMarkersRef.current.push(marker);
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating POI markers:', error.message);
      }
    }
  }, [pois, isMapInitialized]);

  useEffect(() => {
    if (!map.current || !isMapInitialized) return;

    try {
      if (currentLocation) {
        if (markerRef.current) {
          markerRef.current.setLngLat(currentLocation);
        } else {
          markerRef.current = new mapboxgl.Marker({ color: '#4338ca' })
            .setLngLat(currentLocation)
            .addTo(map.current);
        }

        if (isTracking) {
          map.current.easeTo({
            center: currentLocation,
            duration: 1000,
          });
        }
      }

      const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: currentPath.map(point => point.coordinates),
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating map:', error.message);
      }
    }
  }, [currentLocation, currentPath, isTracking, isMapInitialized]);

  return (
    <div className="absolute inset-0 bg-background">
      <style>
        {`
          .mapboxgl-popup-content {
            padding: 0 !important;
            border-radius: 1rem !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          }
          .mapboxgl-popup-close-button {
            padding: 4px 8px !important;
            color: black !important;
            font-size: 16px !important;
          }
          .mapboxgl-popup {
            z-index: 1000;
          }
          .mapboxgl-ctrl-group {
            border-radius: 1rem !important;
            overflow: hidden;
          }
          .mapboxgl-ctrl-group button {
            width: 36px !important;
            height: 36px !important;
          }
        `}
      </style>
      <div ref={mapContainer} className="h-full w-full brightness-90 contrast-120 grayscale" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/10 to-transparent" />
    </div>
  );
};