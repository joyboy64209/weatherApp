import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Plus, Minus } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';
import { useEffect } from 'react';

const savedCities = [
  { name: 'New York', country: 'USA', time: '08:42 PM', icon: '☁️', temp: 12, condition: 'Mostly Cloudy', high: 14, low: 9, lat: 40.7128, lon: -74.006 },
  { name: 'London', country: 'UK', time: '01:42 AM', icon: '🌧️', temp: 8, condition: 'Light Rain', high: 10, low: 6, lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', time: '10:42 AM', icon: '☀️', temp: 22, condition: 'Clear Sky', high: 24, low: 18, lat: 35.6762, lon: 139.6503 },
];

export function SearchPage() {
  const navigate = useNavigate();
  const { load: loadSearchStore, recentSearches } = useSearchStore();

  useEffect(() => {
    loadSearchStore();
  }, [loadSearchStore]);

  const handleCityClick = (name: string, lat: number, lon: number, country: string) => {
    navigate(`/?lat=${lat}&lon=${lon}&city=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
  };

  return (
    <div className="space-y-section-margin">
      <section>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">City Discovery</h2>
        <p className="font-body-lg text-body-lg max-w-2xl text-on-surface-variant">
          Manage your pinned locations and explore new horizons with atmospheric real-time data.
        </p>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h3 className="font-headline-md text-headline-md text-on-surface">Saved Cities</h3>
          <button className="font-label-md text-label-md text-primary hover:underline">Manage Grid</button>
        </div>
        <div className="grid grid-cols-1 gap-card-gap md:grid-cols-2 lg:grid-cols-3">
          {savedCities.map((city, i) => (
            <motion.button
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleCityClick(city.name, city.lat, city.lon, city.country)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl glass-card p-6 text-left transition-all duration-500"
            >
              <div className="relative z-10">
                <div className="mb-12 flex items-start justify-between">
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface">{city.name}</h4>
                    <p className="font-label-md text-label-md text-on-surface-variant">{city.time}</p>
                  </div>
                  <span className="text-[48px]">{city.icon}</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-display-temp text-[64px] leading-none text-on-surface">{city.temp}°</span>
                  <div className="text-right">
                    <p className="font-label-md text-label-md text-on-surface">{city.condition}</p>
                    <p className="font-label-sm text-label-sm uppercase tracking-tighter text-on-surface-variant">H: {city.high}° L: {city.low}°</p>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-12 gap-card-gap">
        <div className="col-span-12 flex h-full flex-col rounded-3xl glass-card p-8 lg:col-span-4">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recent Searches</h3>
            <Clock className="h-5 w-5 text-on-surface-variant" />
          </div>
          <div className="space-y-2">
            {recentSearches.length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant">No recent searches yet.</p>
            ) : (
              recentSearches.map((search) => {
                const name = search.split('|')[0];
                return (
                  <button
                    key={search}
                    onClick={() => {
                      const parts = search.split('|');
                      handleCityClick(parts[0], parseFloat(parts[1]), parseFloat(parts[2]), parts[3] || '');
                    }}
                    className="group flex w-full items-center justify-between rounded-xl p-4 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="font-body-md text-body-md text-on-surface">{name}</span>
                    <MapPin className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="col-span-12 relative min-h-[400px] overflow-hidden rounded-3xl glass-card lg:col-span-8">
          <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-surface">
            <div className="flex h-full flex-col p-8">
              <div className="mb-auto">
                <h3 className="font-headline-md text-headline-md mb-2 text-on-surface">Global Temperature Map</h3>
                <p className="font-label-md text-label-md text-on-surface-variant">Live visual tracking of atmospheric movements.</p>
              </div>
              <div className="mt-auto flex items-center gap-4">
                <div className="glass-card flex items-center gap-2 rounded-full px-4 py-2">
                  <div className="h-3 w-3 rounded-full bg-aqi-good"></div>
                  <span className="font-label-md text-label-md text-on-surface-variant">Europe: Stable</span>
                </div>
                <div className="glass-card flex items-center gap-2 rounded-full px-4 py-2">
                  <div className="h-3 w-3 rounded-full bg-aqi-moderate"></div>
                  <span className="font-label-md text-label-md text-on-surface-variant">Asia: Humid</span>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="glass-card flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/20"><Plus className="h-5 w-5" /></button>
                  <button className="glass-card flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/20"><Minus className="h-5 w-5" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-glass-stroke py-8 text-on-surface-variant">
        <p className="font-label-sm text-label-sm">© 2026 SkyGlass Atmospheric. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="font-label-sm text-label-sm transition-colors hover:text-primary" href="#">Data Sources</a>
          <a className="font-label-sm text-label-sm transition-colors hover:text-primary" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm transition-colors hover:text-primary" href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}