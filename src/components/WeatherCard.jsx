function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <h2>{weather.city}</h2>
      <div className="weather-icon">{weather.icon}</div>
      <h1>{Math.round(weather.temperature)}°C</h1>
      <h3>{weather.condition}</h3>

      <div className="details">
        <div>
          <h3>{weather.humidity}%</h3>
          <p>Humidity</p>
        </div>

        <div>
          <h3>{weather.wind} km/h</h3>
          <p>Wind Speed</p>
        </div>

        <div>
          <h3>{Math.round(weather.feelsLike)}°C</h3>
          <p>Feels Like</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;