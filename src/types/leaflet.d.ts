declare module 'leaflet';

interface Window {
  L?: typeof import('leaflet');
}

interface LeafletMap {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  addLayer: (layer: LeafletLayer) => LeafletMap;
  removeLayer: (layer: LeafletLayer) => LeafletMap;
  remove: () => void;
  invalidateSize: () => void;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
}

interface LeafletLayer {
  setOpacity: (opacity: number) => void;
  addTo: (map: LeafletMap) => LeafletLayer;
  remove: () => void;
}

interface LeafletTileLayer extends LeafletLayer {
  setUrl: (url: string) => void;
}

interface LeafletControl {
  addTo: (map: LeafletMap) => LeafletControl;
  remove: () => void;
}