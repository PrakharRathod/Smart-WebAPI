import { Link } from 'react-router-dom';
import { CloudSun, Newspaper, CircleDollarSign, Image as ImageIcon, Users, MapPin, Droplets, Wind, Sun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import { useState, useEffect } from 'react';

const getWeatherInfo = (code) => {
  if (code === 0) return { desc: 'Clear sky', Icon: Sun };
  if (code <= 3) return { desc: 'Cloudy', Icon: Cloud };
  if (code <= 48) return { desc: 'Fog', Icon: CloudFog };
  if (code <= 55) return { desc: 'Drizzle', Icon: CloudDrizzle };
  if (code <= 65) return { desc: 'Rain', Icon: CloudRain };
  if (code <= 77) return { desc: 'Snow', Icon: CloudSnow };
  if (code >= 95) return { desc: 'Thunderstorm', Icon: CloudLightning };
  return { desc: 'Unknown', Icon: CloudSun };
};

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    // Try to get geolocation on load for hero preview
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Using Open-Meteo for free, no-key weather in the preview
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
            if (!res.ok) throw new Error("Weather fetch failed");
            const data = await res.json();
            setWeather(data.current);
          } catch (error) {
            console.error(error);
            setWeatherError(true);
          } finally {
            setWeatherLoading(false);
          }
        },
        () => {
          // Permission denied or error
          setWeatherError(true);
          setWeatherLoading(false);
        }
      );
    } else {
      setWeatherError(true);
      setWeatherLoading(false);
    }
  }, []);

  const features = [
    {
      title: 'Weather',
      description: 'Get current weather information including temperature, humidity, wind speed and weather conditions.',
      icon: <CloudSun size={24} />,
      linkTo: '/weather',
      buttonText: 'Explore Weather'
    },
    {
      title: 'News',
      description: 'Browse the latest news and search for news based on keywords.',
      icon: <Newspaper size={24} />,
      linkTo: '/news',
      buttonText: 'Explore News'
    },
    {
      title: 'Currency',
      description: 'Convert one currency into another using current exchange-rate data.',
      icon: <CircleDollarSign size={24} />,
      linkTo: '/currency',
      buttonText: 'Convert Currency'
    },
    {
      title: 'Unsplash',
      description: 'Search and explore beautiful images using an image API.',
      icon: <ImageIcon size={24} />,
      linkTo: '/unsplash',
      buttonText: 'Explore Images'
    },
    {
      title: 'Random User',
      description: 'Generate random user profiles with personal and location information.',
      icon: <Users size={24} />,
      linkTo: '/random-user',
      buttonText: 'Generate Users'
    }
  ];

  let WeatherIcon = CloudSun;
  let weatherDesc = "Loading";

  if (weather) {
    const info = getWeatherInfo(weather.weather_code);
    WeatherIcon = info.Icon;
    weatherDesc = info.desc;
  }

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 lg:p-16 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Hero Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Multiple Free APIs, One Platform
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Multiple <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">APIs</span> in One Place
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0">
            Smart WebAPI is a React-based application that integrates multiple external APIs to provide weather, news, currency information, images, and random user data in one modern platform. No API keys needed!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <a href="#features" className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-md shadow-blue-500/20 text-center">
              Explore Features
            </a>
            <Link to="/weather" className="px-8 py-3 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold transition-colors text-center">
              Check Weather
            </Link>
          </div>
        </div>

        {/* Hero Weather Preview */}
        <div className="flex-1 w-full max-w-md z-10">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl"></div>
            
            <h3 className="text-lg font-medium opacity-90 mb-4 flex items-center gap-2">
              <MapPin size={18} /> Current Location Weather
            </h3>

            {weatherLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-white/20 rounded w-1/2"></div>
                <div className="h-6 bg-white/20 rounded w-3/4"></div>
                <div className="h-20 bg-white/20 rounded w-full mt-6"></div>
              </div>
            ) : weatherError || !weather ? (
              <div className="text-center py-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <CloudSun size={48} className="mx-auto mb-3 opacity-80" />
                <p className="mb-4 text-white/90">Location access denied or unavailable.</p>
                <Link to="/weather" className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                  Search Manually
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <div className="text-5xl font-bold mb-1">{Math.round(weather.temperature_2m)}°C</div>
                    <div className="text-xl capitalize">{weatherDesc}</div>
                  </div>
                  <div className="text-right">
                    <WeatherIcon size={64} className="opacity-90" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Droplets size={18} className="opacity-80" />
                    <div>
                      <div className="text-xs opacity-80">Humidity</div>
                      <div className="font-semibold">{weather.relative_humidity_2m}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind size={18} className="opacity-80" />
                    <div>
                      <div className="text-xs opacity-80">Wind</div>
                      <div className="font-semibold">{Math.round(weather.wind_speed_10m)} km/h</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto space-y-8 bg-blue-50 dark:bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-blue-100 dark:border-slate-700">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">About Smart WebAPI</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Smart WebAPI is a beginner-friendly React project designed for college vivas and demonstrations. It showcases how to seamlessly integrate multiple free, open-source external APIs into a single responsive web application without needing backend servers or API keys.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">🚀</span> 
              Core Technologies
            </h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-2">
              <li>React & Vite (Frontend Framework)</li>
              <li>Tailwind CSS v4 (Styling)</li>
              <li>React Router DOM (Navigation)</li>
              <li>Lucide React (Icons)</li>
              <li>Native Fetch API (Data fetching)</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400">🌍</span> 
              Open Source APIs Used
            </h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-2">
              <li><strong>Open-Meteo</strong> (Weather data & Geocoding)</li>
              <li><strong>Spaceflight News API</strong> (Latest tech news)</li>
              <li><strong>ExchangeRate-API</strong> (Currency rates)</li>
              <li><strong>NASA API</strong> (Image galleries)</li>
              <li><strong>RandomUser.me</strong> (Profile generation)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="pt-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">Available Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              linkTo={feature.linkTo}
              buttonText={feature.buttonText}
            />
          ))}
        </div>
      </section>

      {/* CTA Sections */}
      <section className="space-y-4 pt-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100 dark:border-blue-900/30">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Want to explore {feature.title}?</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
            <Link
              to={feature.linkTo}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap border border-slate-200 dark:border-slate-700"
            >
              {feature.buttonText}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
