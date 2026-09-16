import { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, CloudSun, Sun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Gauge, SunDim, Cloud as CloudIcon, Sunrise, Sunset } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const getWeatherInfo = (code) => {
  if (code === 0) return { desc: 'Clear sky', Icon: Sun, color: 'text-yellow-500' };
  if (code <= 3) return { desc: 'Cloudy', Icon: Cloud, color: 'text-slate-400' };
  if (code <= 48) return { desc: 'Fog', Icon: CloudFog, color: 'text-slate-400' };
  if (code <= 55) return { desc: 'Drizzle', Icon: CloudDrizzle, color: 'text-blue-400' };
  if (code <= 65) return { desc: 'Rain', Icon: CloudRain, color: 'text-blue-500' };
  if (code <= 77) return { desc: 'Snow', Icon: CloudSnow, color: 'text-cyan-200' };
  if (code >= 95) return { desc: 'Thunderstorm', Icon: CloudLightning, color: 'text-purple-500' };
  return { desc: 'Unknown', Icon: CloudSun, color: 'text-blue-400' };
};

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = async (lat, lon, name, country) => {
    try {
      // Using Open-Meteo, a 100% free open-source API with no API key needed!
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl,cloud_cover,uv_index&daily=sunrise,sunset&timezone=auto`);
      if (!response.ok) throw new Error("Weather data not found");
      const data = await response.json();
      
      setWeatherData({
        ...data.current,
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0]
      });
      setLocationInfo({ name, country });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      let locName = "Your Location";
      let locCountry = "";
      try {
        // Free Reverse Geocoding using Nominatim (OpenStreetMap)
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const geoData = await geoRes.json();
        if (geoData.address) {
          locName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state || "Your Location";
          locCountry = geoData.address.country || "";
        }
      } catch (e) {
        console.error("Reverse geocoding failed", e);
      }
      
      await fetchWeather(lat, lon, locName, locCountry);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      // First, get coordinates for the city using Open-Meteo's Geocoding API (also free, no key)
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
      if (!geoRes.ok) throw new Error("Failed to search city");
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please try another city.");
      }
      
      const { latitude, longitude, name, country } = geoData.results[0];
      await fetchWeather(latitude, longitude, name, country);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeatherByCity("London"); // Fallback
        }
      );
    } else {
      fetchWeatherByCity("London");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherByCity(city);
      setCity('');
    }
  };

  let WeatherIcon = CloudSun;
  let weatherDesc = "Loading";
  let iconColor = "text-blue-500";

  if (weatherData) {
    const info = getWeatherInfo(weatherData.weather_code);
    WeatherIcon = info.Icon;
    weatherDesc = info.desc;
    iconColor = info.color;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <CloudSun className="text-blue-500" size={32} /> Weather Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Search for current weather conditions anywhere using Open-Meteo (Free & No API Key).</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search city (e.g., Hyderabad, London)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Content Area */}
      {loading ? (
        <Loading message="Fetching weather data..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : weatherData && locationInfo ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2 mb-2">
                <MapPin size={28} className="text-blue-500" />
                {locationInfo.name}
                {locationInfo.country ? `, ${locationInfo.country}` : ''}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                {weatherDesc}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <WeatherIcon size={96} className={`mb-2 ${iconColor}`} strokeWidth={1.5} />
              <div className="text-6xl font-bold text-slate-900 dark:text-white">
                {Math.round(weatherData.temperature_2m)}°C
              </div>
            </div>
          </div>

          {/* Extended Weather Data Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 relative z-10">
            
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Thermometer size={20} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Feels Like</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(weatherData.apparent_temperature)}°C</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Droplets size={20} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Humidity</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{weatherData.relative_humidity_2m}%</p>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Wind size={20} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Wind</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(weatherData.wind_speed_10m)} km/h</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Gauge size={20} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pressure</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(weatherData.pressure_msl)} hPa</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <CloudIcon size={20} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cloud Cover</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{weatherData.cloud_cover}%</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <SunDim size={20} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">UV Index</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{weatherData.uv_index || 0}</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 text-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                <Sunrise size={20} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sunrise</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {new Date(weatherData.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 text-center">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Sunset size={20} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sunset</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {new Date(weatherData.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weather;
