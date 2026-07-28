import { motion } from 'framer-motion';
import { AirQualityData, AqiInfo } from '@/types/airQuality';

interface AirQualityProps {
  data: AirQualityData;
}

function getAqiInfo(aqi: number): AqiInfo {
  if (aqi <= 20) return { value: aqi, level: 'Good', color: '#22c55e', description: 'Air quality is satisfactory.' };
  if (aqi <= 40) return { value: aqi, level: 'Fair', color: '#eab308', description: 'Air quality is acceptable.' };
  if (aqi <= 60) return { value: aqi, level: 'Moderate', color: '#f97316', description: 'May cause minor discomfort.' };
  if (aqi <= 80) return { value: aqi, level: 'Poor', color: '#ef4444', description: 'May cause breathing discomfort.' };
  if (aqi <= 100) return { value: aqi, level: 'Very Poor', color: '#7c3aed', description: 'May cause respiratory illness.' };
  return { value: aqi, level: 'Extreme', color: '#991b1b', description: 'Health alert: serious risk.' };
}

const pollutants = [
  { key: 'pm2_5' as const, label: 'PM2.5', unit: 'µg/m³' },
  { key: 'pm10' as const, label: 'PM10', unit: 'µg/m³' },
  { key: 'carbonMonoxide' as const, label: 'CO', unit: 'µg/m³' },
  { key: 'nitrogenDioxide' as const, label: 'NO₂', unit: 'µg/m³' },
  { key: 'sulphurDioxide' as const, label: 'SO₂', unit: 'µg/m³' },
  { key: 'ozone' as const, label: 'O₃', unit: 'µg/m³' },
];

export function AirQuality({ data }: AirQualityProps) {
  const aqiInfo = getAqiInfo(data.europeanAqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-white">Air Quality</h2>

      {/* AQI Gauge */}
      <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-white/60">European AQI</span>
          <span className="text-sm font-semibold" style={{ color: aqiInfo.color }}>
            {aqiInfo.level}
          </span>
        </div>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((data.europeanAqi / 100) * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: aqiInfo.color }}
          />
        </div>
        <p className="text-xs text-white/50">{aqiInfo.description}</p>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {pollutants.map((pollutant, index) => (
          <motion.div
            key={pollutant.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="rounded-xl bg-white/10 p-3 backdrop-blur-md"
          >
            <p className="text-xs text-white/50">{pollutant.label}</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {data[pollutant.key].toFixed(1)}
            </p>
            <p className="text-xs text-white/40">{pollutant.unit}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}