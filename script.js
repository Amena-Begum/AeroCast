// 🕒 Show current time
function showTime() {
  document.getElementById("currentTime").innerHTML = new Date().toUTCString();
}
showTime();
setInterval(showTime, 1000);

const apiKey = 5a93ae286e25f285547457a91abe4cc1; // ← API Key

async function getWeather(city) {
  try {
    // 1️⃣ Current Weather
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    if (data.cod === "404") {
      alert("❌ City not found!");
      return;
    }

    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("condition").textContent = data.weather[0].description;
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${Math.round(data.wind.speed)} km/h`;

    // 2️⃣ Get coordinates for forecast
    const { lat, lon } = data.coord;
    getForecast(lat, lon);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getForecast(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}&units=metric`
    );
    const forecast = await res.json();

    // Hourly Forecast (next 6 hours)
    const hourlyContainer = document.getElementById("hourlyForecast");
    hourlyContainer.innerHTML = "";
    forecast.hourly.slice(0, 6).forEach((hour) => {
      const time = new Date(hour.dt * 1000).getHours();
      const temp = Math.round(hour.temp);
      const icon = hour.weather[0].main.toLowerCase().includes("rain") ? "🌧️" :
                   hour.weather[0].main.toLowerCase().includes("cloud") ? "☁️" :
                   hour.weather[0].main.toLowerCase().includes("clear") ? "☀️" : "🌤️";
      const div = document.createElement("div");
      div.className = "hour";
      div.innerHTML = `<p>${time}:00</p><p>${temp}°C</p><p>${icon}</p>`;
      hourlyContainer.appendChild(div);
    });

    // 7-Day Forecast
    const dailyContainer = document.getElementById("dailyForecast");
    dailyContainer.innerHTML = "";
    forecast.daily.slice(0, 7).forEach((day) => {
      const date = new Date(day.dt * 1000);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const min = Math.round(day.temp.min);
      const max = Math.round(day.temp.max);
      const icon = day.weather[0].main.toLowerCase().includes("rain") ? "🌧️" :
                   day.weather[0].main.toLowerCase().includes("cloud") ? "☁️" :
                   day.weather[0].main.toLowerCase().includes("clear") ? "☀️" : "🌤️";
      const div = document.createElement("div");
      div.className = "day";
      div.innerHTML = `<p>${weekday}</p><p>${icon}</p><p>${min}° / ${max}°</p>`;
      dailyContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Forecast error:", err);
  }
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim() || "Dhaka";
  getWeather(city);
});

getWeather("Dhaka");

// 🌙 Theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "🌞" : "🌙";
});
