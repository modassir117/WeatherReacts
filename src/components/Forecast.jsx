function Forecast({ forecast }) {
  if (!forecast.length) return null;

  return (
    <div className="forecast">
      <h2>5 Day Forecast</h2>

      <div className="forecast-list">
        {forecast.map((day) => (
          <div className="forecast-card" key={day.date}>
            <h3>{day.day}</h3>
            <div>{day.icon}</div>
            <p>{day.condition}</p>
            <h3>
              {Math.round(day.max)}° / {Math.round(day.min)}°
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;