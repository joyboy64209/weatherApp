import { useSearchParams } from 'react-router-dom';
import { useAirQuality } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Home, Users, Map, ArrowUpRight } from 'lucide-react';
import { AQIMapModal } from '@/components/maps/AQIMapModal';

export function AirQualityPage() {
  const [searchParams] = useSearchParams();
  const autoLocation = useSettingsStore((s) => s.settings.autoLocation);
  const geolocation = useGeolocation();

  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const latitude = latParam ? parseFloat(latParam) : geolocation.latitude;
  const longitude = lonParam ? parseFloat(lonParam) : geolocation.longitude;

  const { data: airQuality, isLoading } = useAirQuality(latitude, longitude);
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    if (autoLocation && !latParam) geolocation.requestLocation();
  }, [autoLocation, latParam, geolocation]);

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-primary" role="status">
          <span className="sr-only">Loading air quality data...</span>
        </div>
      </div>
    );
  }

  if (!airQuality) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-on-surface-variant">No air quality data available. Search for a city first.</p>
      </div>
    );
  }

  const aqi = airQuality.europeanAqi;
  const aqiLevel = aqi <= 20 ? { label: 'Excellent', color: '#34D399' }
    : aqi <= 40 ? { label: 'Fair', color: '#FBBF24' }
    : aqi <= 60 ? { label: 'Moderate', color: '#FB923C' }
    : aqi <= 80 ? { label: 'Poor', color: '#F87171' }
    : { label: 'Hazardous', color: '#A78BFA' };

  const aqiPercent = Math.min((aqi / 100) * 283, 283);
  const aqiOffset = 283 - aqiPercent;

  const pollutants = [
    { key: 'pm2_5' as const, label: 'PM2.5', value: airQuality.pm2_5, unit: 'µg/m³', level: 'Good', color: '#34D399', pct: 15 },
    { key: 'pm10' as const, label: 'PM10', value: airQuality.pm10, unit: 'µg/m³', level: 'Good', color: '#34D399', pct: 25 },
    { key: 'carbonMonoxide' as const, label: 'CO', value: airQuality.carbonMonoxide, unit: 'µg/m³', level: 'Good', color: '#34D399', pct: 10 },
    { key: 'nitrogenDioxide' as const, label: 'NO₂', value: airQuality.nitrogenDioxide, unit: 'µg/m³', level: 'Fair', color: '#FBBF24', pct: 45 },
    { key: 'sulphurDioxide' as const, label: 'SO₂', value: airQuality.sulphurDioxide, unit: 'µg/m³', level: 'Good', color: '#34D399', pct: 5 },
    { key: 'ozone' as const, label: 'O₃', value: airQuality.ozone, unit: 'µg/m³', level: 'Good', color: '#34D399', pct: 35 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Air Quality Index</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Real-time atmospheric composition</p>
      </div>

      <div className="grid grid-cols-12 gap-card-gap">
        {/* Main AQI Dial */}
        <div className="col-span-12 flex min-h-[500px] flex-col items-center justify-center rounded-[2.5rem] glass-panel p-10 lg:col-span-8">
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex h-72 w-72 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 288 288">
                <circle className="aqi-gauge-track" cx="144" cy="144" r="130" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="20" />
                <circle
                  className="aqi-gauge-value"
                  cx="144" cy="144" r="130" fill="none"
                  stroke={aqiLevel.color}
                  strokeWidth="20"
                  strokeDasharray="283"
                  strokeDashoffset={aqiOffset}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#A0CAFF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display-temp text-display-temp text-primary">{aqi}</span>
                <span className="font-headline-md text-headline-md tracking-widest uppercase" style={{ color: aqiLevel.color }}>{aqiLevel.label}</span>
              </div>
            </div>
            <div className="mt-8 max-w-md text-center">
              <p className="font-body-lg text-body-lg mb-2 text-on-surface">
                The air quality is {aqiLevel.label.toLowerCase()} for most individuals.
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Enjoy your outdoor activities without any health concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Health Advice */}
        <div className="col-span-12 flex flex-col gap-card-gap lg:col-span-4">
          <div className="flex-1 rounded-[2rem] glass-panel p-8">
            <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-2 text-on-surface">
              <Heart className="h-6 w-6 text-primary" />
              Health Advice
            </h3>
            <div className="space-y-6">
              {[
                { icon: Heart, title: 'Outdoor Activity', desc: 'Perfect conditions for running, cycling, or yoga in the park.', color: aqiLevel.color },
                { icon: Home, title: 'Ventilation', desc: 'Keep windows open to circulate fresh, clean air throughout your home.', color: aqiLevel.color },
                { icon: Users, title: 'Sensitive Groups', desc: 'No restrictions or precautions necessary for any age group.', color: aqiLevel.color },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${item.color}20` }}>
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface">{item.title}</h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AQI Forecast */}
          <div className="rounded-[2rem] glass-panel p-6" style={{ backgroundColor: `${aqiLevel.color}10`, borderColor: `${aqiLevel.color}20` }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-label-md text-label-md text-primary">AQI Forecast</span>
              <span className="rounded bg-primary/20 px-2 py-1 font-label-sm text-label-sm text-primary">Next 24h</span>
            </div>
            <div className="flex h-24 items-end gap-2">
              {[80, 85, 70, 60, 90, 95].map((h, i) => (
                <div key={i} className="w-full rounded-t-lg" style={{ height: `${h}%`, backgroundColor: `${aqiLevel.color}40` }}></div>
              ))}
            </div>
            <div className="mt-2 flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Now</span><span>6PM</span><span>12AM</span><span>6AM</span>
            </div>
          </div>
        </div>

        {/* Pollutant Cards */}
        <div className="col-span-12 grid grid-cols-1 gap-card-gap sm:grid-cols-2 lg:grid-cols-3">
          {pollutants.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl glass-panel p-6 transition-colors hover:bg-white/10"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">{p.label}</span>
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}99` }}></div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-headline-md text-on-surface">{p.value.toFixed(1)}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{p.unit}</span>
              </div>
              <p className="mt-2 font-label-sm text-label-sm" style={{ color: p.color }}>{p.level}</p>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full rounded-full" style={{ width: `${p.pct}%`, backgroundColor: p.color }}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <div className="col-span-12 relative h-[400px] overflow-hidden rounded-[2.5rem] glass-panel transition-colors group">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface/50 to-surface">
            <div className="flex h-full flex-col justify-end p-8">
              <div className="max-w-md">
                <div className="mb-2 flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Interactive Map</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-4 text-on-surface">Local Pollutant Dispersion</h3>
                <button
                  onClick={() => setMapOpen(true)}
                  className="glass-card inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-label-md text-label-md backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Open Interactive View
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AQI Map Modal */}
      <AQIMapModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        latitude={latitude ?? 0}
        longitude={longitude ?? 0}
        cityName={searchParams.get('city') || 'Current Location'}
      />
    </div>
  );
}