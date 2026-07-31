import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface AQIMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  cityName: string;
}

const CARTODB_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTODB_ATTR = '&copy; OpenStreetMap &copy; CARTO';
const WAQI_TILE = 'https://tiles.waqi.info/tiles/aqi/{z}/{x}/{y}.png';

type PollutantLayer = 'aqi' | 'pm25' | 'pm10' | 'no2' | 'o3';

export function AQIMapModal({ isOpen, onClose, latitude, longitude, cityName }: AQIMapModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<PollutantLayer>('aqi');

  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseLayerRef = useRef<LeafletTileLayer | null>(null);
  const pollutantLayerRef = useRef<LeafletTileLayer | null>(null);

  const loadLeaflet = useCallback(() => {
    if (window.L) {
      setIsLoaded(true);
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(cssLink);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => { setIsLoaded(true); resolve(); };
      script.onerror = () => reject(new Error('Failed to load Leaflet'));
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    loadLeaflet().catch((err) => setError(err instanceof Error ? err.message : 'Map load failed'));
  }, [isOpen, loadLeaflet]);

  useEffect(() => {
    if (!isOpen || !isLoaded || !containerRef.current || !window.L) return;

    const L = window.L;
    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
    });

    mapRef.current = map;

    baseLayerRef.current = L.tileLayer(CARTODB_DARK, {
      attribution: CARTODB_ATTR,
      maxZoom: 19,
    }).addTo(map);

    pollutantLayerRef.current = L.tileLayer(WAQI_TILE, {
      opacity: 0.6,
      zIndex: 200,
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen, isLoaded, latitude, longitude]);

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.setZoom(mapRef.current.getZoom() + 1);
  };
  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.setZoom(mapRef.current.getZoom() - 1);
  };

  const layerButtons: { type: PollutantLayer; label: string; color: string }[] = [
    { type: 'aqi', label: 'AQI', color: '#a0caff' },
    { type: 'pm25', label: 'PM2.5', color: '#34D399' },
    { type: 'pm10', label: 'PM10', color: '#FBBF24' },
    { type: 'no2', label: 'NO₂', color: '#FB923C' },
    { type: 'o3', label: 'O₃', color: '#A78BFA' },
  ];

  const aqiLegend = [
    { color: '#00e400', label: '0-50', desc: 'Good' },
    { color: '#ffff00', label: '51-100', desc: 'Moderate' },
    { color: '#ff7e00', label: '101-150', desc: 'Unhealthy for Sensitive' },
    { color: '#ff0000', label: '151-200', desc: 'Unhealthy' },
    { color: '#8f3f97', label: '201-300', desc: 'Very Unhealthy' },
    { color: '#7e0023', label: '300+', desc: 'Hazardous' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative h-[90vh] w-[90vw] max-w-6xl overflow-hidden rounded-[2rem] border border-glass-stroke bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute left-0 right-0 top-0 z-[500] flex items-center justify-between border-b border-glass-stroke bg-surface/80 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Wind className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Local Pollutant Dispersion</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{cityName} • Air quality map</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-glass-stroke hover:text-on-surface"
                aria-label="Close map"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Map Container */}
            <div ref={containerRef} className="h-full w-full" style={{ background: '#0b1326', zIndex: 1 }} />

            {/* Loading */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface/50">
                <div className="text-center">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-primary mx-auto" />
                  <p className="text-on-surface-variant">Loading map...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
                <p className="text-aqi-poor">{error}</p>
              </div>
            )}

            {/* Layer Selector */}
            <div className="absolute left-4 top-20 z-[500] flex flex-col gap-2">
              <div className="mb-1 flex items-center gap-2 px-2">
                <Layers className="h-4 w-4 text-on-surface-variant" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">Layers</span>
              </div>
              {layerButtons.map((btn) => {
                const isActive = activeLayer === btn.type;
                return (
                  <button
                    key={btn.type}
                    onClick={() => setActiveLayer(btn.type)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 font-label-md text-label-md backdrop-blur-xl transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary'
                        : 'border border-glass-stroke bg-surface/80 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="h-3 w-3 rounded-full" style={{ background: btn.color }}></div>
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* Zoom Controls */}
            <div className="absolute right-4 top-20 z-[500] flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-stroke bg-surface/80 text-on-surface backdrop-blur-xl transition-colors hover:bg-glass-stroke"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-stroke bg-surface/80 text-on-surface backdrop-blur-xl transition-colors hover:bg-glass-stroke"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
            </div>

            {/* AQI Legend */}
            <div className="absolute bottom-4 right-4 z-[500] rounded-xl border border-glass-stroke bg-surface/80 p-3 backdrop-blur-xl">
              <p className="mb-2 font-label-sm text-label-sm text-on-surface-variant">AQI Scale</p>
              <div className="space-y-1">
                {aqiLegend.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="h-3 w-6 rounded-sm" style={{ background: item.color }}></div>
                    <span className="text-[10px] text-on-surface-variant">{item.label}</span>
                    <span className="text-[10px] text-on-surface">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}