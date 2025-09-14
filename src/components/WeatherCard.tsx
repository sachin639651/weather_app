import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  Navigation,
  Compass
} from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
      {/* Main Weather Info */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            className="w-24 h-24"
          />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {weather.name}, {weather.country}
        </h2>
        <div className="text-5xl font-bold text-white mb-2">
          {weather.temperature}°C
        </div>
        <div className="text-white/80 capitalize text-lg">
          {weather.description}
        </div>
        <div className="text-white/60 text-sm mt-1">
          Feels like {weather.feelsLike}°C
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Droplets className="w-6 h-6 text-blue-300 mx-auto mb-2" />
          <div className="text-white/60 text-sm">Humidity</div>
          <div className="text-white font-semibold">{weather.humidity}%</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Wind className="w-6 h-6 text-blue-300 mx-auto mb-2" />
          <div className="text-white/60 text-sm">Wind</div>
          <div className="text-white font-semibold">
            {weather.windSpeed} m/s
          </div>
          <div className="text-white/60 text-xs">
            {getWindDirection(weather.windDirection)}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Gauge className="w-6 h-6 text-blue-300 mx-auto mb-2" />
          <div className="text-white/60 text-sm">Pressure</div>
          <div className="text-white font-semibold">{weather.pressure} hPa</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Eye className="w-6 h-6 text-blue-300 mx-auto mb-2" />
          <div className="text-white/60 text-sm">Visibility</div>
          <div className="text-white font-semibold">
            {Math.round(weather.visibility / 1000)} km
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Sunrise className="w-6 h-6 text-orange-300 mx-auto mb-2" />
          <div className="text-white/60 text-sm">Sunrise</div>
          <div className="text-white font-semibold">
            {formatTime(weather.sunrise)}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 text-center">
          <Sunset className="w-6 h-6 text-orange-300 mx-auto mb-2" />
          <div className="text-white/60 text-sm">Sunset</div>
          <div className="text-white font-semibold">
            {formatTime(weather.sunset)}
          </div>
        </div>
      </div>
    </div>
  );
};