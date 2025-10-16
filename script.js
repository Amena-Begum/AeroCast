function showTime() {
  document.getElementById("currentTime").textContent = new Date().toLocaleString();
}
showTime();
setInterval(showTime, 1000);

const apiKey = "5a93ae286e25f285547457a91abe4cc1";

async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (data.cod != 200) {
      alert("❌ City not found!");
      return;
    }

    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("condition").textContent = data.weather[0].description;
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${Math.round(data.wind.speed)} km/h`;

    // Change background by condition
    const condition = data.weather[0].main.toLowerCase();
    document.body.classList.remove("sunny", "rainy", "cloudy");
    if (condition.includes("rain")) document.body.classList.add("rainy");
    else if (condition.includes("cloud")) document.body.classList.add("cloudy");
    else document.body.classList.add("sunny");

    // Forecast
    const { lat, lon } = data.coord;
    getForecast(lat, lon);
  } catch (err) {
    console.error("Error fetching weather:", err);
  }
}

async function getForecast(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    // Hourly Forecast
    const hourlyContainer = document.getElementById("hourlyForecast");
    hourlyContainer.innerHTML = "";
    data.list.slice(0, 6).forEach((item) => {
      const time = new Date(item.dt * 1000).getHours();
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].main.includes("Rain") ? "🌧️" :
                   item.weather[0].main.includes("Cloud") ? "☁️" :
                   item.weather[0].main.includes("Clear") ? "☀️" : "🌤️";
      const div = document.createElement("div");
      div.className = "hour";
      div.innerHTML = `<p>${time}:00</p><p>${temp}°C</p><p>${icon}</p>`;
      hourlyContainer.appendChild(div);
    });

    // Daily Forecast
    const dailyContainer = document.getElementById("dailyForecast");
    dailyContainer.innerHTML = "";
    for (let i = 0; i < data.list.length; i += 8) {
      const item = data.list[i];
      const date = new Date(item.dt * 1000);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const min = Math.round(item.main.temp_min);
      const max = Math.round(item.main.temp_max);
      const icon = item.weather[0].main.includes("Rain") ? "🌧️" :
                   item.weather[0].main.includes("Cloud") ? "☁️" :
                   item.weather[0].main.includes("Clear") ? "☀️" : "🌤️";
      const div = document.createElement("div");
      div.className = "day";
      div.innerHTML = `<p>${weekday}</p><p>${icon}</p><p>${min}° / ${max}°</p>`;
      dailyContainer.appendChild(div);
    }
  } catch (err) {
    console.error("Forecast fetch error:", err);
  }
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim() || "Dhaka";
  getWeather(city);
});

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "🌞" : "🌙";
});

getWeather("Dhaka");
