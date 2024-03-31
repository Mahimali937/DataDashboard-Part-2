import React from 'react';
import { Link } from 'react-router-dom';

const WeatherList = ({ weatherData }) => {
  return (
    <div className='weather-list-container'>
      {weatherData && weatherData.length > 0 ? (
        <div className='weather-card-grid'>
          {weatherData.map((weather, index) => (
            <div key={index} className='weather-card'>
              <h3>{weather.city_name}</h3>
              <Link to={`/weather/${encodeURIComponent(weather.city_name)}`}>
                <img
                  src={`https://source.unsplash.com/300x200/?${weather.city_name}`}
                  alt={weather.city_name}
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  );
};

export default WeatherList;


