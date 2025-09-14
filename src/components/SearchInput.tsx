import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchLocations } from '../utils/weatherApi';
import { LocationSuggestion } from '../types/weather';

interface SearchInputProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setQuery(`${suggestion.name}, ${suggestion.country}`);
    setShowSuggestions(false);
    onLocationSelect(suggestion.lat, suggestion.lon);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-10 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-white/60">
              <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full mx-auto"></div>
              <span className="ml-2">Searching...</span>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(suggestion)}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/20 transition-colors duration-150 flex items-center space-x-2 first:rounded-t-xl last:rounded-b-xl"
              >
                <MapPin className="w-4 h-4 text-white/60" />
                <div>
                  <div className="font-medium">
                    {suggestion.name}
                    {suggestion.state && `, ${suggestion.state}`}
                  </div>
                  <div className="text-sm text-white/60">{suggestion.country}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};