import React, { useEffect, useState } from 'react';
import './Weather.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Import weather icons from react-icons
import { FaCloudSun, FaCloudRain, FaSnowflake, FaWind, FaWater, FaCloud } from 'react-icons/fa';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          condition: data.weather[0].main.toLowerCase(),
        });
        setError(null);
      } else if (data.cod === 404) {
        setError('City not found');
        setWeatherData(null);
      } else {
        setError('Error fetching weather data');
        setWeatherData(null);
      }
    } catch (error) {
      setError('Error fetching weather data');
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    search(city);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Weather icon and color mapping
  const iconMapping = {
    snow: { icon: <FaSnowflake size={100} color="#00d2ff" /> },  // Light blue for snow
    rain: { icon: <FaCloudRain size={100} color="#0096c7" /> },  // Dark blue for rain
    wind: { icon: <FaWind size={100} color="#6c757d" /> },      // Gray for wind
    clear: { icon: <FaCloudSun size={100} color="#f4a261" /> }, // Yellow-orange for sun
    default: { icon: <FaCloudSun size={100} color="#e9c46a" /> } // Fallback yellowish sun
  };

  const weatherCondition = weatherData?.condition || "default";
  const { icon } = iconMapping[weatherCondition] || iconMapping.default;

  return (
    <div className="weather">
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={city}
            onChange={handleCityChange}
          />
          <button type="submit">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Weather Icon */}
      {weatherData && (
        <div className="weather-icon">
          {icon}
        </div>
      )}

      {weatherData ? (
        <>
          <p className="temperature">{`${weatherData.temperature}°C`}</p>
          <p className="location">{weatherData.location}</p>

          {/* Additional Weather Data */}
          <div className="weather-data">
            <div className="col">
              <FaWater size={40} color="#00b4d8" />
              <p>{`${weatherData.humidity}%`}</p>
              <span>Humidity</span>
            </div>
            <div className="col">
              <FaWind size={40} color="#6c757d" />
              <p>{`${weatherData.windSpeed} km/h`}</p>
              <span>Wind Speed</span>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Weather;