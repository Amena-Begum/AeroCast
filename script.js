// 🕒 Show current time
function showTime() {
  document.getElementById("currentTime").innerHTML = new Date().toUTCString();
}
showTime();
setInterval(showTime, 1000);

const apiKey = "5a93ae286e25f285547457a91abe4cc1"; // API key

async function getWeather(city) {
  try {
    // 1️⃣ Current Weather
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (data.cod == "404" || data.cod == "400") {
      alert("❌ City not found!");
      return;
    }

    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("condition").textContent = data.weather[0].description;
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${Math.round(data.wind.speed)} km/h`;

    // 2️⃣ Coordinates for forecast
    const { lat, lon } = data.coord;
    getForecast(lat, lon);
  } catch (err) {
    console.error("Error fetching weather:", err);
  }
}

async function getForecast(lat, lon) {
  try {
    // Use updated forecast API (works on free plan)
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    // 🌤️ Hourly (next 6 intervals = 18 hours)
    const hourlyContainer = document.getElementById("hourlyForecast");
    hourlyContainer.innerHTML = "";

    data.list.slice(0, 6).forEach((item) => {
      const time = new Date(item.dt * 1000).getHours();
      const temp = Math.round(item.main.temp);
      const condition = item.weather[0].main.toLowerCase();
      const icon =
        condition.includes("rain") ? "🌧️" :
        condition.includes("cloud") ? "☁️" :
        condition.includes("clear") ? "☀️" : "🌤️";

      const div = document.createElement("div");
      div.className = "hour";
      div.innerHTML = `<p>${time}:00</p><p>${temp}°C</p><p>${icon}</p>`;
      hourlyContainer.appendChild(div);
    });

    // 📅 7-Day Forecast (approx. next 7 × 8 = 56 entries)
    const dailyContainer = document.getElementById("dailyForecast");
    dailyContainer.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
      const item = data.list[i];
      const date = new Date(item.dt * 1000);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const min = Math.round(item.main.temp_min);
      const max = Math.round(item.main.temp_max);
      const condition = item.weather[0].main.toLowerCase();
      const icon =
        condition.includes("rain") ? "🌧️" :
        condition.includes("cloud") ? "☁️" :
        condition.includes("clear") ? "☀️" : "🌤️";

      const div = document.createElement("div");
      div.className = "day";
      div.innerHTML = `<p>${weekday}</p><p>${icon}</p><p>${min}° / ${max}°</p>`;
      dailyContainer.appendChild(div);
    }
  } catch (err) {
    console.error("Forecast fetch error:", err);
  }
}

// 🔍 Search
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim() || "Dhaka";
  getWeather(city);
});

// 🌍 Default
getWeather("Dhaka");

// 🌙 Theme Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "🌞" : "🌙";
});
