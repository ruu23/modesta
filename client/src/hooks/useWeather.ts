import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  city: string;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        // Using Open-Meteo free API (no key required)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
        );
        const data = await response.json();
        
        const weatherCode = data.current.weather_code;
        const { condition, icon } = getWeatherInfo(weatherCode);
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          condition,
          icon,
          city: ''
        });
        setLoading(false);
      } catch (err) {
        setError('Unable to fetch weather');
        setLoading(false);
      }
    };

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default to a central location if geolocation fails
          fetchWeather(25.276987, 55.296249); // Dubai
        }
      );
    } else {
      fetchWeather(25.276987, 55.296249);
    }
  }, []);

  return { weather, loading, error };
}

// Map weather codes to conditions and icons
function getWeatherInfo(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Clear', icon: '☀️' };
  if (code === 1 || code === 2 || code === 3) return { condition: 'Partly Cloudy', icon: '⛅' };
  if (code >= 45 && code <= 48) return { condition: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 57) return { condition: 'Drizzle', icon: '🌦️' };
  if (code >= 61 && code <= 67) return { condition: 'Rainy', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { condition: 'Snowy', icon: '❄️' };
  if (code >= 80 && code <= 82) return { condition: 'Showers', icon: '🌧️' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Cloudy', icon: '☁️' };
}
