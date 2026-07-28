import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { GeocodingResult } from '@/types/geocoding';

export function MainLayout() {
  const navigate = useNavigate();

  const handleCitySelect = (city: GeocodingResult) => {
    navigate(`/?lat=${city.latitude}&lon=${city.longitude}&city=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}`);
  };

  return (
    <div className="min-h-screen">
      <OfflineBanner />
      <Header onCitySelect={handleCitySelect} />
      <main className="mx-auto max-w-6xl px-4 pb-8">
        <Outlet />
      </main>
    </div>
  );
}