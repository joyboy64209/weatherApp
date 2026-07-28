import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchCitiesService } from '@/services/weatherService';
import { useSearchStore } from '@/store/searchStore';
import { GeocodingResult } from '@/types/geocoding';
import { DEBOUNCE_DELAY } from '@/constants/defaults';

interface SearchBarProps {
  onSelectCity: (city: GeocodingResult) => void;
}

export function SearchBar({ onSelectCity }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const { searchResults, setSearchResults, setIsSearching, isSearching, setSearchError } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = useCallback(
    (city: GeocodingResult) => {
      onSelectCity(city);
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelectCity],
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSearchResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, [setSearchResults]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setIsOpen(true)}
          placeholder="Search city..."
          className="w-full rounded-xl bg-white/10 py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/40 backdrop-blur-md transition-colors focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Search for a city"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full overflow-hidden rounded-xl bg-gray-900/95 backdrop-blur-xl"
            role="listbox"
          >
            {isSearching ? (
              <div className="p-4 text-center text-sm text-white/50">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-white/50">No cities found</div>
            ) : (
              searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                  role="option"
                  aria-selected={false}
                >
                  <div>
                    <span className="font-medium">{result.name}</span>
                    {result.admin1 && <span className="text-white/50">, {result.admin1}</span>}
                    <span className="text-white/40">, {result.country}</span>
                  </div>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}