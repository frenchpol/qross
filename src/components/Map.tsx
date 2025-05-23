import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocation } from '@/context/LocationContext';
import { MAP_DEFAULTS, MAP_STYLES } from '@/constants/map';
import { toast } from 'sonner';

const TERRAIN_STYLE = {
  version: 8,
  sources: {
    terrain: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
    }
  },
  layers: [
    {
      id: 'terrain',
      type: 'raster',
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
  const map = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const poiMarkersRef = useRef<maplibregl.Marker[]>([]);
  const { currentLocation, currentPath, isTracking, isPaused, pois, isPoiOnlyMode } = useLocation();
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation: [number, number] = [position.coords.longitude, position.coords.latitude];
        
        const mapInstance = new maplibregl.Map({
          container: mapContainer.current!,
          style: TERRAIN_STYLE,
          center: userLocation,
          zoom: MAP_DEFAULTS.ZOOM,
          maxZoom: MAP_DEFAULTS.MAX_ZOOM,
          minZoom: MAP_DEFAULTS.MIN_ZOOM,
          attributionControl: true,
          dragRotate: false,
          pitchWithRotate: false,
          touchZoomRotate: true
        });

        mapInstance.addControl(
          new maplibregl.NavigationControl({
            showCompass: false,
            showZoom: true,
            visualizePitch: false
          })
        );

        mapInstance.on('load', () => {
          if (!isPoiOnlyMode) {
            mapInstance.addSource('route', {
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

            mapInstance.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': MAP_STYLES.line.color,
                'line-width': MAP_STYLES.line.width,
                'line-opacity': MAP_STYLES.line.opacity,
              },
            });
          }

          markerRef.current = new maplibregl.Marker({ color: MAP_STYLES.marker.color })
            .setLngLat(userLocation)
            .addTo(mapInstance);

          setIsMapInitialized(true);
        });

        map.current = mapInstance;
      },
      (error) => {
        console.error('Error getting initial location:', error);
        toast.error('Impossible d\'accéder à votre position');
        
        const mapInstance = new maplibregl.Map({
          container: mapContainer.current!,
          style: TERRAIN_STYLE,
          center: MAP_DEFAULTS.INITIAL_LOCATION,
          zoom: MAP_DEFAULTS.ZOOM,
          maxZoom: MAP_DEFAULTS.MAX_ZOOM,
          minZoom: MAP_DEFAULTS.MIN_ZOOM,
          attributionControl: true,
          dragRotate: false,
          pitchWithRotate: false,
          touchZoomRotate: true
        });

        map.current = mapInstance;
        setIsMapInitialized(true);
      }
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !isMapInitialized) return;

    poiMarkersRef.current.forEach(marker => marker.remove());
    poiMarkersRef.current = [];

    pois.forEach(poi => {
      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
        className: 'custom-popup'
      })
      .setHTML(createPopupHTML(poi.name, poi.comment));

      const marker = new maplibregl.Marker({ color: MAP_STYLES.marker.color })
        .setLngLat(poi.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
      poiMarkersRef.current.push(marker);
    });
  }, [pois, isMapInitialized]);

  useEffect(() => {
    if (!map.current || !isMapInitialized) return;

    if (currentLocation) {
      if (markerRef.current) {
        markerRef.current.setLngLat(currentLocation);
      } else {
        markerRef.current = new maplibregl.Marker({ color: MAP_STYLES.marker.color })
          .setLngLat(currentLocation)
          .addTo(map.current);
      }

      if (isTracking && !isPaused) {
        map.current.easeTo({
          center: currentLocation,
          duration: 1000,
        });
      }
    }

    if (!isPoiOnlyMode) {
      const source = map.current.getSource('route') as maplibregl.GeoJSONSource;
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
    }
  }, [currentLocation, currentPath, isTracking, isPaused, isMapInitialized, isPoiOnlyMode]);

  return (
    <div className="absolute inset-0 bg-background">
      <div 
        ref={mapContainer} 
        className="h-full w-full brightness-90 contrast-120"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/10 to-transparent" />
      {isPaused && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none backdrop-blur-[2px] transition-opacity duration-200" />
      )}
    </div>
  );
};