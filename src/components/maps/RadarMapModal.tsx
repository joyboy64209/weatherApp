import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, CloudRain, Thermometer, Satellite, ZoomIn, ZoomOut } from 'lucide-react';

interface RadarMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  cityName: string;
}

interface RadarFrame {
  time: number;
  path: string;
}

const CARTODB_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTODB_ATTR = '&copy; OpenStreetMap &copy; CARTO';
const RAINVIEWER_API = 'https://api.rainviewer.com/weather/v2/maps/radar/nowcast';
const TEMPERATURE_TILE = 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=0';
const SATELLITE_TILE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

type LayerType = 'radar' | 'temperature' | 'satellite';

export function RadarMapModal({ isOpen, onClose, latitude, longitude, cityName }: RadarMapModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerType>('radar');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]);
  const [loadingFrames, setLoadingFrames] = useState(true);

  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseLayerRef = useRef<LeafletTileLayer | null>(null);
  const overlayLayerRef = useRef<LeafletTileLayer | null>(null);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const fetchRadarFrames = useCallback(async () => {
    try {
      const response = await fetch(RAINVIEWER_API);
      const data = await response.json();
      const past: RadarFrame[] = (data.radar?.past || []).map((f: { time: number; path: string }) => ({
        time: f.time,
        path: f.path,
      }));
      const nowcast: RadarFrame[] = (data.radar?.nowcast || []).map((f: { time: number; path: string }) => ({
        time: f.time,
        path: f.path,
      }));
      const allFrames = [...past, ...nowcast];
      setRadarFrames(allFrames);
      if (allFrames.length > 0) setCurrentFrame(allFrames.length - 1);
    } catch {
      setError('Failed to load radar data');
    } finally {
      setLoadingFrames(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setLoadingFrames(true);
    loadLeaflet().catch((err) => setError(err instanceof Error ? err.message : 'Map load failed'));
    fetchRadarFrames();
  }, [isOpen, loadLeaflet, fetchRadarFrames]);

  useEffect(() => {
    if (!isOpen || !isLoaded || !containerRef.current || !window.L) return;

    const L = window.L;
    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 8,
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

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen, isLoaded, latitude, longitude]);

  // Handle layer switching
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;

    // Remove existing overlay
    if (overlayLayerRef.current) {
      overlayLayerRef.current.remove();
      overlayLayerRef.current = null;
    }

    if (activeLayer === 'radar') {
      // Radar overlay will be handled by the frame effect below
      if (radarFrames.length > 0) {
        const frame = radarFrames[currentFrame];
        if (frame) {
          const url = `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/1/color_1.png`;
          overlayLayerRef.current = L.tileLayer(url, {
            opacity: 0.7,
            zIndex: 200,
          }).addTo(map);
        }
      }
    } else if (activeLayer === 'temperature') {
      overlayLayerRef.current = L.tileLayer(TEMPERATURE_TILE, {
        opacity: 0.5,
        zIndex: 200,
      }).addTo(map);
    } else if (activeLayer === 'satellite') {
      // Swap base layer to satellite
      if (baseLayerRef.current) {
        baseLayerRef.current.setUrl(SATELLITE_TILE);
      }
      return;
    }

    // Restore dark base if not satellite
    if (activeLayer === 'radar' || activeLayer === 'temperature') {
      if (baseLayerRef.current) {
        baseLayerRef.current.setUrl(CARTODB_DARK);
      }
    }
  }, [activeLayer, radarFrames, currentFrame]);

  // Handle radar frame animation
  useEffect(() => {
    if (!mapRef.current || !window.L || activeLayer !== 'radar' || radarFrames.length === 0) return;
    const L = window.L;
    const map = mapRef.current;
    const frame = radarFrames[currentFrame];
    if (!frame) return;

    if (overlayLayerRef.current) {
      overlayLayerRef.current.remove();
    }

    const url = `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/1/color_1.png`;
    overlayLayerRef.current = L.tileLayer(url, {
      opacity: 0.7,
      zIndex: 200,
    }).addTo(map);
  }, [currentFrame, radarFrames, activeLayer]);

  // Playback animation
  useEffect(() => {
    if (isPlaying && radarFrames.length > 0) {
      animationRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % radarFrames.length);
      }, 600);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [isPlaying, radarFrames.length]);

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.setZoom(mapRef.current.getZoom() + 1);
  };
  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.setZoom(mapRef.current.getZoom() - 1);
  };

  const layerButtons: { type: LayerType; label: string; icon: typeof CloudRain }[] = [
    { type: 'radar', label: 'Radar', icon: CloudRain },
    { type: 'temperature', label: 'Temperature', icon: Thermometer },
    { type: 'satellite', label: 'Satellite', icon: Satellite },
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
                <CloudRain className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Interactive Radar</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{cityName} • Real-time precipitation</p>
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
            {(!isLoaded || loadingFrames) && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface/50">
                <div className="text-center">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-primary mx-auto" />
                  <p className="text-on-surface-variant">Loading radar data...</p>
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
              {layerButtons.map((btn) => {
                const Icon = btn.icon;
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
                    <Icon className="h-4 w-4" />
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

            {/* Playback Controls */}
            {activeLayer === 'radar' && radarFrames.length > 0 && (
              <div className="absolute bottom-4 left-1/2 z-[500] flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-glass-stroke bg-surface/80 px-6 py-3 backdrop-blur-xl">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-all hover:brightness-110"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {currentFrame + 1} / {radarFrames.length}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={radarFrames.length - 1}
                    value={currentFrame}
                    onChange={(e) => setCurrentFrame(Number(e.target.value))}
                    className="w-48 accent-primary"
                    aria-label="Timeline"
                  />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {radarFrames[currentFrame] ? new Date(radarFrames[currentFrame].time * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-[500] rounded-xl border border-glass-stroke bg-surface/80 p-3 backdrop-blur-xl">
              <p className="mb-2 font-label-sm text-label-sm text-on-surface-variant">Precipitation (mm/h)</p>
              <div className="flex items-center gap-1">
                {[
                  { color: '#000000', label: '0' },
                  { color: '#00ffff', label: '0.1' },
                  { color: '#00ccff', label: '0.5' },
                  { color: '#0099ff', label: '1' },
                  { color: '#0066ff', label: '2' },
                  { color: '#00ff00', label: '5' },
                  { color: '#ffff00', label: '10' },
                  { color: '#ff9900', label: '20' },
                  { color: '#ff0000', label: '50' },
                  { color: '#ff00ff', label: '100' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="h-4 w-6" style={{ background: item.color }}></div>
                    <span className="text-[8px] text-on-surface-variant">{item.label}</span>
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