// main.js

const API_KEY = "a01e9cb54ccf2d50c3404c2db9ba74e1"; // Replace with OpenWeatherMap API key
const searchBtn = document.querySelector(".Search-btn");

const cityInput = document.getElementById("city");
const locationBtn = document.querySelector(".location");
const errorSection = document.getElementById("errorSection");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");
const pressureEl = document.getElementById("pressure");
const precipEl = document.getElementById("precip");
const forecastContainer = document.querySelector(".Days");
const toggleC = document.querySelectorAll(".btn")[0];
const toggleF = document.querySelectorAll(".btn")[1];

let isCelsius = true;
let currentTempC = null;


// Search button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city or village name.");
        return;
    }
    fetchWeather(city);
});

// Press Enter to search
cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (!city) {
            showError("Please enter a city or village name.");
            return;
        }
        fetchWeather(city);
    }
});



// ---- Fetch Weather by City ----
async function fetchWeather(city) {
    if (!city) {
        showError("Please enter a valid city name.");
        return;
    }

    try {
        hideError(); // hide previous errors

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!res.ok) throw new Error("City not found");

        const data = await res.json();
        updateUI(data); // display weather
        saveRecentSearch(city);
        loadForecast(data.coord.lat, data.coord.lon);

    } catch (err) {
        showError("Location Not Found. Please enter a valid city or village.");
    }
}


// ---- Fetch Weather by Current Location ----
function fetchByLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                    );
                    const data = await res.json();
                    updateUI(data);
                    loadForecast(latitude, longitude);
                } catch (err) {
                    showError("Unable to fetch weather for your location.");
                }
            },
            () => {
                showError("Location access denied.");
            }
        );
    } else {
        showError("Geolocation is not supported in your browser.");
    }
}



// ---- Update UI with Weather ----
function updateUI(data) {
    const temp = data.main.temp;
    currentTempC = temp;

    cityNameEl.textContent = data.name;
    tempEl.textContent = `${Math.round(temp)}°C`;
    conditionEl.textContent = data.weather[0].main;
    windEl.textContent = `${data.wind.speed} m/s`;
    humidityEl.textContent = `${data.main.humidity}%`;
    pressureEl.textContent = `${data.main.pressure} mm`;
    precipEl.textContent = data.clouds ? `${data.clouds.all}%` : "--";

    // ✅ Add today's date + weekday
    const today = new Date();
    document.getElementById("currentDate").textContent =
        today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

    // ✅ Add current weather icon
    const iconEl = document.querySelector(".Current-Weather .icon");
    iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon"/>`;

    // Weather Alert
    if (temp > 40) {
        errorSection.classList.remove("hidden");
        errorSection.innerHTML = `<h2 class="text-red-400 font-bold">⚠ Extreme Heat Alert!</h2>
    <p>Temperature above 40°C. Stay hydrated!</p>`;
    }

    // Dynamic background
    setBackground(data.weather[0].main);

    // ✅ Update current weather details
    document.querySelector(".wind").innerHTML = `Wind: <span>${data.wind.speed} m/s</span>`;
    document.querySelector(".humidity").innerHTML = `Humidity: <span>${data.main.humidity}%</span>`;
    document.querySelector(".pressure").innerHTML = `Pressure: <span>${data.main.pressure} mm</span>`;
    document.querySelector(".precip").innerHTML = `Precipitation: <span>${data.clouds ? data.clouds.all : "--"}%</span>`;


}

// ---- Background Image Switch ----
function setBackground(condition) {
    const body = document.body;
    const weather = condition.toLowerCase();

    if (weather.includes("rain")) {
        body.style.backgroundImage = "url('./assets/Rainy.jpg')";
    } else if (weather.includes("cloud")) {
        body.style.backgroundImage = "url('./assets/Cloudy.jpg')";
    } else if (weather.includes("snow")) {
        body.style.backgroundImage = "url('./assets/Snow.jpg')";
    } else if (weather.includes("mist") || weather.includes("haze") || weather.includes("fog")) {
        body.style.backgroundImage = "url('./assets/Haze.jpg')";
    } else if (weather.includes("clear") || weather.includes("sunny")) {
        body.style.backgroundImage = "url('./assets/Sunny.jpg')";
    } else {
        body.style.backgroundImage = "url('./assets/pexels-pixabay-164024.jpg')"; // default clear bg
    }
}

// ---- 5 Day Forecast ----
async function loadForecast(lat, lon) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();

        forecastContainer.innerHTML = "";

        let addedDays = 0;
        let lastDate = null;

        for (let i = 0; i < data.list.length && addedDays < 5; i++) {
            const day = data.list[i];
            const date = new Date(day.dt_txt);

            // Skip today
            const today = new Date();
            if (date.getDate() === today.getDate()) continue;

            // Only add one entry per new date
            const dateStr = date.toDateString();
            if (dateStr !== lastDate) {
                const div = document.createElement("div");
                div.classList.add("day", "p-2", "bg-black/20", "rounded-lg");

                div.innerHTML = `
                    <p>${date.toLocaleDateString("en-US", { weekday: "short" })}</p>
                    <div class="mx-auto w-10 h-10">
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"/>
                    </div>
                    <p class="font-bold">${Math.round(day.main.temp)}°C</p>
                    <p class="text-sm">${day.weather[0].main}</p>
                    <div class="description text-xs">
                        <p>Wind: ${day.wind.speed} m/s</p>
                        <p>Humidity: ${day.main.humidity}%</p>
                    </div>
                `;

                forecastContainer.appendChild(div);
                lastDate = dateStr;
                addedDays++;
            }
        }
    } catch (err) {
        showError("Error loading forecast.");
    }
}


// ---- Recent Searches ----
function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (!searches.includes(city)) {
        searches.unshift(city);
        if (searches.length > 5) searches.pop();
    }
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    renderDropdown();
}

function renderDropdown() {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    let dropdown = document.getElementById("recentDropdown");

    if (!dropdown) {
        dropdown = document.createElement("select");
        dropdown.id = "recentDropdown";
        document.querySelector(".Search-bar").appendChild(dropdown);

        dropdown.addEventListener("change", () => {
            if (dropdown.value !== "") {
                fetchWeather(dropdown.value);
            }
        });
    }

    dropdown.innerHTML = `<option value="">Recent</option>`;
    searches.forEach((city) => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        dropdown.appendChild(opt);
    });
}

// ---- Toggle °C / °F ----
toggleC.addEventListener("click", () => {
    isCelsius = true;
    if (currentTempC !== null) tempEl.textContent = `${Math.round(currentTempC)}°C`;
});

toggleF.addEventListener("click", () => {
    isCelsius = false;
    if (currentTempC !== null)
        tempEl.textContent = `${Math.round((currentTempC * 9) / 5 + 32)}°F`;
});

// ---- Error Handling ----
function showError(msg) {
    errorSection.classList.remove("hidden");
    errorSection.innerHTML = `
        <h2 class="text-lg font-semibold text-red-600">Error</h2>
        <p class="text-sm mt-2">${msg}</p>
    `;
}

function hideError() {
    errorSection.classList.add("hidden");
    errorSection.innerHTML = ""; // clear previous message
}

// ---- Event Listeners ----
searchBtn.addEventListener("click", () => fetchWeather(cityInput.value));
locationBtn.addEventListener("click", fetchByLocation);

// ---- On Load ----
renderDropdown();
