const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'e9b08b0edfd25583d29d6d1dbc92957f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const getCurrentWeather = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch weather data`);
    }
  
    const data = await response.json();
  
    return {
      name: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch weather data');
  }
};

export const getForecast = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch forecast data`);
    }
  
    const data = await response.json();
  
    // Group forecast by day and take the first entry for each day
    const dailyForecasts = data.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 5);
  
    return dailyForecasts.map((item: any) => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      temperature: {
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max),
      },
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));
  } catch (error) {
    console.error('Forecast API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch forecast data');
  }
};

export const searchLocations = async (query: string) => {
  if (query.length < 2) return [];
  
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to search locations`);
    }
  
    const data = await response.json();
  
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Location Search API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to search locations');
  }
};

export const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error('Failed to get current location: ' + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};