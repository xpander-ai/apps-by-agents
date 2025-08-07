const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

async function getWeather() {
  const city = document.getElementById('city').value.trim();
  const resultDiv = document.getElementById('weather-result');
  if (!city) {
    resultDiv.innerHTML = '<p>Please enter a city name.</p>';
    return;
  }
  resultDiv.textContent = 'Loading...';
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    resultDiv.innerHTML = `
      <p><strong>Location:</strong> ${data.name}, ${data.sys.country}</p>
      <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
      <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

document.getElementById('get-weather').addEventListener('click', getWeather);