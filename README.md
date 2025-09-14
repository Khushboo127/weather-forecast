Weather Forecast Web App

A responsive and interactive weather web application built with HTML, CSS, Tailwind CSS, and JavaScript. The app provides current weather conditions, a 5-day forecast, recent searches, geolocation support, and error handling for invalid or empty inputs.


Technologies Used

HTML5 – Semantic markup and page structure.

CSS3 & Tailwind CSS – Styling, responsive layouts, and transitions.

JavaScript (ES6) – DOM manipulation, API requests, error handling, local storage.

OpenWeatherMap API – Current weather and 5-day forecast.

LocalStorage – Store and render recent searches.


Simply type the name of any city or village, and get the current weather instantly. The app handles most common locations worldwide.

The last five searches are saved for quick access. You can easily select a previously searched city without typing it again.

Click the “Current Location” button to automatically fetch weather for where you are. Your browser will ask for permission before using location.

View a clear 5-day forecast with daily temperatures, weather conditions, and icons to visualize the upcoming weather at a glance.

The app changes the background image based on current weather conditions, like sunny, cloudy, rainy, or snowy, making it visually appealing.

Switch easily between Celsius and Fahrenheit to see temperatures in the unit you prefer.

If you enter an invalid city or leave the search empty, a friendly error message appears. Geolocation issues are also handled gracefully.

Get notified about extreme conditions like high heat, so you can stay safe and prepared.

The app is designed to look good on desktops, tablets .

A custom SVG favicon and Tailwind CSS styling make the interface neat, modern, and easy to use.

Usage Instructions:- 

Enter a city or village name in the search bar and click Search or press Enter.

If the input is empty, a styled error message appears.

If the city is invalid, the “Location Not Found” section is displayed.

Click Current Location to get weather for your current location (allow browser geolocation).

Use °C / °F buttons to toggle temperature units.

Recent searches dropdown allows quick access to previously searched cities.

The background image changes based on weather conditions.

Extreme weather alerts (e.g., temperature >40°C) are displayed dynamically.


weather-app/
│
├── index.html             # Main HTML file with sections for search, weather display, and forecast
├── main.js                # JavaScript logic (fetch weather, UI updates, error handling)
├── output.css             # Tailwind CSS compiled file
├── assets/
│   ├── images.svg         # Favicon
│   ├── Rainy.jpg          # Rain background
│   ├── Cloudy.jpg         # Cloud background
│   ├── Sunny.jpg          # Sunny background
│   ├── Snow.jpg           # Snow background
│   ├── Haze.jpg           # Haze/mist background
│   └── loaction (2).png   # Location icon for current location button
└── README.md              # This documentation file


Github Profile :- https://github.com/Khushboo127