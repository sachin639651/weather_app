import React from 'react';
import { ForecastDay } from '../types/weather';

interface ForecastCardProps {
  forecast: ForecastDay[];
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4">5-Day Forecast</h3>
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-4">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="w-12 h-12"
              />
              <div>
                <div className="text-white font-medium">{day.date}</div>
                <div className="text-white/60 text-sm capitalize">{day.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">
                {day.temperature.max}° / {day.temperature.min}°
              </div>
              <div className="text-white/60 text-sm">
                {Math.round(day.windSpeed)} m/s
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};