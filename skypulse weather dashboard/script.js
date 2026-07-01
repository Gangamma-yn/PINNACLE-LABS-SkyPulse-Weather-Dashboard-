const apiKey = "5ccdf994f4139cef916af579e902586c";

// Search weather
async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    try {

        // Current Weather
        const weatherUrl =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const weatherResponse = await fetch(weatherUrl);

        const weatherData = await weatherResponse.json();

        if (weatherData.cod != 200) {
            alert(weatherData.message);
            return;
        }

        // Update Current Weather

        document.getElementById("cityName").textContent =
            `${weatherData.name}, ${weatherData.sys.country}`;

        document.getElementById("temp").textContent =
            Math.round(weatherData.main.temp);

        document.getElementById("condition").textContent =
            weatherData.weather[0].description;

        document.getElementById("humidity").textContent =
            weatherData.main.humidity + "%";

        document.getElementById("wind").textContent =
            weatherData.wind.speed + " m/s";

        document.getElementById("pressure").textContent =
            weatherData.main.pressure + " hPa";

        document.getElementById("feelsLike").textContent =
            Math.round(weatherData.main.feels_like) + "°C";

        // Weather Icon

        document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;

        // Sunrise

        const sunrise = new Date(
            weatherData.sys.sunrise * 1000
        );

        document.getElementById("sunrise").textContent =
            sunrise.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        // Sunset

        const sunset = new Date(
            weatherData.sys.sunset * 1000
        );

        document.getElementById("sunset").textContent =
            sunset.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        // Get Forecast

        getForecast(
            weatherData.coord.lat,
            weatherData.coord.lon
        );

    }
    catch (error) {

        console.error(error);

        alert(
            "Unable to fetch weather data. Check API key and internet connection."
        );
    }
}


// 7 Day Forecast

async function getForecast(lat, lon) {

    try {

        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await fetch(forecastUrl);

        const data = await response.json();

        const forecastContainer =
            document.getElementById("forecastContainer");

        forecastContainer.innerHTML = "";

        const dailyForecasts = [];

        const usedDates = new Set();

        data.list.forEach(item => {

            const date =
                item.dt_txt.split(" ")[0];

            if (!usedDates.has(date)) {

                usedDates.add(date);

                dailyForecasts.push(item);
            }
        });

        dailyForecasts.slice(0, 7).forEach(day => {

            const card =
                document.createElement("div");

            card.classList.add(
                "forecast-card"
            );

            const dayName =
                new Date(day.dt * 1000)
                    .toLocaleDateString(
                        "en-US",
                        {
                            weekday: "short"
                        }
                    );

            card.innerHTML = `
                <h4>${dayName}</h4>

                <img
                src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                alt="weather">

                <p>${Math.round(day.main.temp)}°C</p>

                <p>${day.weather[0].main}</p>
            `;

            forecastContainer.appendChild(card);
        });

    }
    catch (error) {

        console.error(
            "Forecast Error:",
            error
        );
    }
}


// Press Enter Key

document
.getElementById("cityInput")
.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        getWeather();
    }
});


// Default City

window.onload = () => {

    document.getElementById("cityInput").value =
        "Bengaluru";

    getWeather();
};