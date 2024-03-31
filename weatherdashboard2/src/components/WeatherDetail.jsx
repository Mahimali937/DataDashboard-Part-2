import React from 'react';
import './WeatherDetail.css';

const WeatherDetail = ({ weather }) => {
  const { city_name, temp, weather: weatherInfo, sunrise, sunset } = weather;

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  return (
    <div className='weather-detail-container'>
      <h2>{city_name}</h2>
      <img
        src={`https://source.unsplash.com/300x200/?${city_name}`}
        alt={city_name}
      />
      <div className='weather-detail-info'>
        <p>Temperature: {temp}°C</p>
        <p>Weather: {weatherInfo.description}</p>
        <p>Sunrise: {formatTime(sunrise)}</p>
        <p>Sunset: {formatTime(sunset)}</p>
      </div>
    </div>
  );
};

export default WeatherDetail;
