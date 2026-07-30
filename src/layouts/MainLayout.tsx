import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { GeocodingResult } from '@/types/geocoding';
import { Search, Bell } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchCitiesService } from '@/services/weatherService';
import { useSearchStore } from '@/store/searchStore';
import { DEBOUNCE_DELAY } from '@/constants/defaults';

export function MainLayout() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const { searchResults, setSearchResults, setIsSearching, isSearching, setSearchError } = useSearchStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCitySelect = (city: GeocodingResult) => {
    navigate(`/?lat=${city.latitude}&lon=${city.longitude}&city=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}`);
    setQuery('');
    setIsOpen(false);
  };

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchResults = async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await searchCitiesService(debouncedQuery);
        setSearchResults(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : 'Search failed');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResults();
  }, [debouncedQuery, setSearchResults, setIsSearching, setSearchError]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <OfflineBanner />
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-glass-stroke bg-transparent px-container-padding py-4 backdrop-blur-[20px]">
          <div ref={containerRef} className="relative flex-grow max-w-md">
            <div className="flex items-center rounded-full border border-glass-stroke bg-glass-fill px-6 py-2.5 transition-all duration-300 focus-within:border-white/25 focus-within:shadow-lg focus-within:shadow-primary/5 focus-within:backdrop-blur-[40px]">
              <Search className="mr-3 h-5 w-5 text-on-surface-variant" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setIsOpen(true)}
                placeholder="Search for a city or airport..."
                className="w-full bg-transparent text-body-md text-on-surface placeholder-on-surface-variant focus:ring-0"
                aria-label="Search for a city"
              />
            </div>
            {/* Autocomplete Dropdown */}
            {isOpen && (
              <div className="glass-card absolute left-0 top-full mt-2 w-full overflow-hidden rounded-2xl shadow-2xl">
                <div className="p-2">
                  {isSearching ? (
                    <div className="px-4 py-3 text-center text-label-md text-on-surface-variant">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="px-4 py-3 text-center text-label-md text-on-surface-variant">No cities found</div>
                  ) : (
                    searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleCitySelect(result)}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10"
                      >
                        <Search className="h-5 w-5 text-primary" />
                        <div className="flex-grow">
                          <p className="font-label-md text-label-md text-on-surface">{result.name}</p>
                          <p className="text-[12px] text-on-surface-variant">{result.country}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="ml-12 flex items-center gap-6">
            <nav className="hidden gap-6 md:flex">
              <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="#">Radar</a>
              <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="#">Maps</a>
              <a className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="#">History</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="relative rounded-full p-2 text-on-surface transition-colors hover:bg-glass-stroke">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"></span>
              </button>
              <button className="rounded-full p-2 text-on-surface transition-colors hover:bg-glass-stroke">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/20 bg-surface-container-highest text-sm font-medium">
                  A
                </div>
              </button>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="mx-auto max-w-[1400px] p-container-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
}