import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { SearchInput } from './components/SearchInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getCurrentWeather, getForecast, getCurrentLocation } from './utils/weatherApi';
import { WeatherData, ForecastDay } from './types/weather';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching weather data for coordinates:', { lat, lon });
      
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon),
        getForecast(lat, lon),
      ]);
      
      console.log('Weather data received:', weatherData);
      
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = async () => {
    try {
      setLocationLoading(true);
      setError(null);
      console.log('Getting current location...');
      const location = await getCurrentLocation();
      console.log('Current location received:', location);
      await fetchWeatherData(location.lat, location.lon);
    } catch (err) {
      console.error('Error getting current location:', err);
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationSelect = async (lat: number, lon: number) => {
    await fetchWeatherData(lat, lon);
  };

  const handleRefresh = async () => {
    if (weather) {
      // Use last known coordinates or get current location
      try {
        console.log('Refreshing weather data...');
        const location = await getCurrentLocation();
        await fetchWeatherData(location.lat, location.lon);
      } catch (err) {
        console.error('Error refreshing weather data:', err);
        setError('Failed to refresh weather data');
      }
    }
  };

  useEffect(() => {
    // Load weather for current location on initial load
    console.log('App mounted, loading initial weather data...');
    handleLocationClick();
  }, []);

  const getBackgroundGradient = () => {
    if (!weather) return 'from-blue-600 to-purple-700';
    
    const icon = weather.icon;
    
    if (icon.includes('01')) return 'from-yellow-400 to-orange-500'; // Clear sky
    if (icon.includes('02') || icon.includes('03')) return 'from-blue-400 to-blue-600'; // Few/scattered clouds
    if (icon.includes('04')) return 'from-gray-500 to-gray-700'; // Broken clouds
    if (icon.includes('09') || icon.includes('10')) return 'from-gray-600 to-blue-800'; // Rain
    if (icon.includes('11')) return 'from-gray-800 to-purple-900'; // Thunderstorm
    if (icon.includes('13')) return 'from-blue-200 to-blue-400'; // Snow
    if (icon.includes('50')) return 'from-gray-400 to-gray-600'; // Mist
    
    return 'from-blue-600 to-purple-700';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Weather Dashboard
          </h1>
          <p className="text-white/80 text-lg mb-6">
            Get detailed weather information for any location
          </p>
          
          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <SearchInput onLocationSelect={handleLocationSelect} />
            <div className="flex space-x-2">
              <button
                onClick={handleLocationClick}
                disabled={locationLoading}
                className="flex items-center space-x-2 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
              >
                <MapPin className={`w-5 h-5 ${locationLoading ? 'animate-pulse' : ''}`} />
                <span>Current Location</span>
              </button>
              
              {weather && (
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Refresh</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
              <AlertCircle className="w-6 h-6 text-red-300 mx-auto mb-2" />
              <div className="text-red-200 font-medium mb-1">Error</div>
              <div className="text-red-300 text-sm">{error}</div>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-200 hover:text-white transition-colors text-sm underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Weather Content */}
        {!loading && weather && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Weather Card */}
              <div className="lg:col-span-2">
                <WeatherCard weather={weather} />
              </div>
              
              {/* Forecast Card */}
              <div className="lg:col-span-1">
                {forecast.length > 0 && <ForecastCard forecast={forecast} />}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-white/60 text-sm">
          <p>Weather data provided by OpenWeatherMap</p>
          <p className="mt-2">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default App;