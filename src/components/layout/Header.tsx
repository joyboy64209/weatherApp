import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Home } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { GeocodingResult } from '@/types/geocoding';

interface HeaderProps {
  onCitySelect: (city: GeocodingResult) => void;
}

export function Header({ onCitySelect }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-white transition-opacity hover:opacity-80"
          aria-label="Home"
        >
          <Home className="h-5 w-5" />
          <span className="text-lg font-bold">Weather</span>
        </Link>
      </div>

      <SearchBar onSelectCity={onCitySelect} />

      <nav className="flex items-center gap-2">
        <Link
          to="/settings"
          className={`rounded-lg p-2 transition-colors ${
            location.pathname === '/settings'
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </nav>
    </header>
  );
}