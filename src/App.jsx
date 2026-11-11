import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import "./App.css";

function getWeather(code) {
  if (code === 0) return ["☀️", "Clear Sky"];
  if ([1, 2].includes(code)) return ["🌤️", "Partly Cloudy"];
  if (code === 3) return ["☁️", "Cloudy"];
  if ([45, 48].includes(code)) return ["🌫️", "Fog"];
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return ["🌧️", "Rainy"];
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return ["❄️", "Snow"];
  if ([95, 96, 99].includes(code)) return ["⛈️", "Thunderstorm"];

  return ["🌡️", "Weather"];
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchWeather(e) {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found!");
      }

      const location = geoData.results[0];

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
      );

      const data = await response.json();

      const current = data.current;
      const [icon, condition] = getWeather(current.weather_code);

      setWeather({
        city: `${location.name}, ${location.country}`,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        feelsLike: current.apparent_temperature,
        wind: current.wind_speed_10m,
        icon,
        condition
      });

      const days = data.daily.time.map((date, index) => {
        const [dayIcon, dayCondition] = getWeather(
          data.daily.weather_code[index]
        );

        return {
          date,
          day: new Date(date + "T12:00:00").toLocaleDateString("en", {
            weekday: "short"
          }),
          icon: dayIcon,
          condition: dayCondition,
          max: data.daily.temperature_2m_max[index],
          min: data.daily.temperature_2m_min[index]
        };
      });

      setForecast(days);
      setCity(location.name);
    } catch (err) {
      setError(err.message || "Unable to get weather data.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🌤️ Weather Reacts</h1>
        <p>Check the weather anywhere in the world</p>
      </header>

      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={searchWeather}
      />

      {loading && <h2 className="message">Loading weather...</h2>}

      {error && <h3 className="error">{error}</h3>}

      <WeatherCard weather={weather} />

      <Forecast forecast={forecast} />

      <footer>
        <p>Weather data by Open-Meteo</p>
      </footer>
    </div>
  );
}

export default App;