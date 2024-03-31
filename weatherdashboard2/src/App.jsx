import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import axios from 'axios';
import './App.css';
import './components/graphs.css';
import Dashboard from './components/Dashboard.jsx';
import WeatherDetail from './components/WeatherDetail.jsx';
import CommonWeatherConditionBarChart from './components/CommonWeatherConditionBarChart.jsx';
import WeatherList from './components/WeatherList.jsx';

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredWeatherData, setFilteredWeatherData] = useState([]);
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [sunTime, setSunTime] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [MaxTemp, setMaxTemp] = useState('');
  const [mostCommonWeatherCondition, setMostCommonWeatherCondition] = useState('');
  const [AvgTemperature, setAvgTemperature] = useState('');

  const CommonConditionData = useMemo(() => {
    const conditionCount = {};
  
    weatherData.forEach((weather) => {
      const condition = weather.weather.description;
  
      if (condition) {
        conditionCount[weather.city_name] = conditionCount[weather.city_name] || {};
        conditionCount[weather.city_name][condition] = (conditionCount[weather.city_name][condition] || 0) + 1;
      }
    });
  
    const CommonConditionData = Object.keys(conditionCount).map((city_name) => {
      const conditions = conditionCount[city_name];
      let mostCommonCondition = '';
      let maxCount = 0;
  
      Object.entries(conditions).forEach(([condition, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommonCondition = condition;
        }
      });
  
      return {
        city_name,
        mostCommonWeatherCondition: mostCommonCondition,
        count: maxCount
      };
    });
  
    return CommonConditionData;
  }, [weatherData]); 

  const fetchWeather = async () => {
    const locations = [
      { lat: 40.7128, lon: -74.0060 },
      { lat: 34.052235, lon: -118.243683 },
      { lat: 55.7558, lon: 37.6173 },
      { lat: 48.8566, lon: 2.3522 },
      { lat: 41.390205, lon: 2.154007 },
      { lat: 45.2859, lon: 6.5848 },
      { lat: 13.7563, lon: 100.5018 },
      { lat: -37.8136, lon: 144.9631 },
      { lat: 18.50012, lon: -69.98857 },
      { lat: 51.5072, lon: -0.1276},
      { lat: 24.7136, lon: 46.6753},
      { lat: 37.9838, lon: 23.7275},
    ];
    try {
      const responses = await Promise.all(
        locations.map(location =>
          axios.get('https://api.weatherbit.io/v2.0/current', {
            params: {
              lat: location.lat,
              lon: location.lon,
              key: '0b47a96e0245412ca8461b96990df829',
            },
          })
        )
      );
      const weatherData = responses.map(response => response.data.data).flat();
      setWeatherData(weatherData);
      setFilteredWeatherData(weatherData);
      calculateAttributes(weatherData);
    } catch (error) {
      console.error(error);
    }
  };
  
  const WeatherDetailWrapper = ({ weatherData }) => {
    const { city_name } = useParams();
    const weather = weatherData.find((data) => data.city_name.toLowerCase() === city_name.toLowerCase());
  
    return weather ? (
      <div className='weather-card'>
        <img src={`https://source.unsplash.com/300x200/?${weather.city_name}`} alt={weather.city_name} />
        <h2>{weather.city_name}</h2>
        <p>Temperature: {formatTemperature(weather.temp)}</p>
        <p>Sunrise: {formatTime12Hour(weather.sunrise)}</p>
        <p>Sunset: {formatTime12Hour(weather.sunset)}</p>
        <p>Condition: {weather.weather.description}</p>
      </div>
    ) : (
      <h2>Weather data not found for {city_name}</h2>
    );
  };  

  const calculateAttributes = (weatherData) => {
    if (!weatherData || weatherData.length === 0) {
      return;
    }
  
    let sumTemperature = 0;
    let maxTemperature = -Infinity;
    const conditionCount = {};
  
    weatherData.forEach(weather => {
      const temperature = parseFloat(weather.temp);
      sumTemperature += temperature;
      maxTemperature = Math.max(maxTemperature, temperature);
      conditionCount[weather.weather.description] = (conditionCount[weather.weather.description] || 0) + 1;
    });
  
    const avgTemperature = sumTemperature / weatherData.length;
    const roundedAvgTemperature = `${avgTemperature.toFixed(2)}°C / ${celsiusToFahrenheit(avgTemperature)}`;
    const mostCommonWeatherCondition = Object.keys(conditionCount).reduce((a, b) => (conditionCount[a] > conditionCount[b] ? a : b), '');
  
    setMaxTemp(`${maxTemperature.toFixed(2)}°C / ${celsiusToFahrenheit(maxTemperature)}`);
    setAvgTemperature(roundedAvgTemperature);
    setMostCommonWeatherCondition(mostCommonWeatherCondition);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const findMaxTemp = (data) => {
    let max = -Infinity;
    data.forEach(item => {
      const temp = parseFloat(item.temp);
      if (!isNaN(temp)) {
        max = Math.max(max, temp);
      }
    });
    return max;
  };

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearch(searchText); 
    const filteredData = weatherData.filter(item =>
      item.city_name.toLowerCase().includes(searchText)
    );
    setFilteredWeatherData(filteredData);
  };

  const handleUnitChange = (event) => {
    setTemperatureUnit(event.target.value);
  };

  const handleSunTimeChange = (event) => {
    setSunTime(event.target.value);
  };

  const handleWeatherConditionChange = (event) => {
    setWeatherCondition(event.target.value);
  };

  const handleClick = (item) => {
    alert(`Location: ${item.city_name}\nTemperature: ${temperatureUnit === 'Celsius' ? `${item.temp.toFixed(2)}°C` : celsiusToFahrenheit(item.temp)}\nSunrise: ${formatTime12Hour(item.sunrise)}\nSunset: ${formatTime12Hour(item.sunset)}\nCondition: ${item.weather.description}`);
  };

  const formatTime12Hour = (time24Hour) => {
    const [hours, minutes] = time24Hour.split(':');
    let period = 'AM';
    let hours12 = parseInt(hours, 10);
    
    hours12 -= 4;
    
    if (hours12 < 0) {
        hours12 += 12;
        period = 'PM';
    } else if (hours12 >= 12) {
        period = 'PM';
        hours12 = hours12 === 12 ? 12 : hours12 - 12;
    } else if (hours12 === 0) {
        hours12 = 12;
    }
  
    return `${hours12}:${minutes} ${period}`;
  };

  const formatTemperature = (celsius) => {
      const fahrenheit = celsiusToFahrenheit(celsius);
      return `${celsius.toFixed(2)}°C / ${fahrenheit}`;
  };
  
  const celsiusToFahrenheit = (celsius) => {
    const fahrenheit = (celsius * 9/5) + 32;
    return `${fahrenheit.toFixed(2)}°F`;
  };

  const renderWeatherData = () => {
    return filteredWeatherData.map(item => {
      const condition = item.weather.description.toLowerCase();
      if ((weatherCondition === '' || condition.includes(weatherCondition.toLowerCase())) &&
          (sunTime === '' || sunTime === 'Sunrise' || sunTime === 'Sunset')) {
        return (
          <div className='weather-card' key={item.city_name} onClick={() => handleClick(item)}>
            <img src={`https://source.unsplash.com/300x200/?${item.city_name}`} alt={item.city_name} />
            <h3>{item.city_name}</h3>
          </div>
        );
      } else {
        return null;
      }
    });
  };  
  
  return (
    <BrowserRouter>
      <div className='App'>
        <h1>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            Weather Platform
          </Link>
        </h1>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <Dashboard
                  weatherData={weatherData}
                  MaxTemp={MaxTemp}
                  mostCommonWeatherCondition={mostCommonWeatherCondition}
                  AvgTemperature={AvgTemperature}
                  temperatureUnit={temperatureUnit}
                />
                 <div className='graph-container'>
                 <CommonWeatherConditionBarChart data={CommonConditionData} />
                </div>
                <WeatherList weatherData={filteredWeatherData} />
              </>
            }
          />
          <Route
            path='/weather/:city_name'
            element={<WeatherDetailWrapper weatherData={weatherData} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;