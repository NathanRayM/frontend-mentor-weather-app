/* ===== DOM ELEMENTS ===== */

// Header / unit dropdown elements
const headerDropdown = document.querySelector(".unit-menu");
const headerPanel = document.querySelector(".unit-panel");

// Hourly forecast dropdown elements
const dailyDropdown = document.querySelector(".weather__hourly--menu");
const hourlyPanel = document.querySelector(".hourly-panel");
const hourlyMenuLabel = document.querySelector(".weather__hourly--label");
const panelDay = document.querySelectorAll(".panel-day");

// Search elements
const searchInput = document.getElementById("search-input");
const searchButton = document.querySelector(".search__button");
const searchSuggestionPanel = document.querySelector(
  ".search-suggestions-panel"
);

// Current Weather elements
const weatherCurrentCity = document.querySelector(".weather__current--city");
const weatherCurrentCountry = document.querySelector(
  ".weather__current--country"
);
const weatherCurrentState = document.querySelector(".weather__current--state");
const weatherCurrentDate = document.querySelector(".weather__current--date");
const weatherCurrentWeatherIcon = document.querySelector(".forcast-image");
const weatherCurrentTemp = document.querySelector(".current-temp");
const weatherCurrentFeelsLike = document.getElementById("feels-like");
const weatherCurrentHumidity = document.getElementById("humidity");
const weatherCurrentWind = document.getElementById("wind");
const weatherCurrentPrecipitation = document.getElementById("precipitation");

// Daily Weather elements
const weatherDailyDay = document.querySelectorAll(".weather-day");
const weatherDailyIcon = document.querySelectorAll(".day-image");
const weatherDailyTempMax = document.querySelectorAll(".day-temp-max");
const weatherDailyTempMin = document.querySelectorAll(".day-temp-min");

// Hourly Weather elements
const weatherHourlyIcon = document.querySelectorAll(".hour-icon");
const weatherHourlyTime = document.querySelectorAll(".hour-time");
const weatherHourlyTemp = document.querySelectorAll(".hour-degrees");

// Unit conversion elements
const mainUnitButton = document.querySelector(".units-type-button");
const celsiusInput = document.querySelector(".celsius-input");
const fahrenheitInput = document.querySelector(".fahrenheit-input");
const kilometerInput = document.querySelector(".kilometer-input");
const milesperhourInput = document.querySelector(".milesperhour-input");
const millimetersInput = document.querySelector(".millimeters-input");
const inchesInput = document.querySelector(".inches-input");
const unitInputs = document.querySelectorAll(".unit-panel input[type='radio']");

// Error elements
const retryButton = document.querySelector(".api__retry--button");

/* ===== APP STATE ===== */

let currentWeatherData = null;
let currentSelectedDate = null;
let lastSearchedCity = null;
let selectedSuggestion = null;

/* ===== API ===== */

async function getWeather(city) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}`
    );

    if (!geoRes.ok) {
      throw new Error("Geocoding API request failed");
    }

    const geoData = await geoRes.json();

    if (!geoData.results) {
      return null;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,wind_speed_10m,apparent_temperature,relative_humidity_2m,precipitation&hourly=temperature_2m,weathercode,apparent_temperature,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`
    );

    if (!weatherRes.ok) {
      throw new Error("Weather API request failed");
    }

    const weatherData = await weatherRes.json();

    return {
      name,
      country,
      latitude,
      longitude,
      weatherData,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

async function getCitySuggestions(query) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      return [];
    }

    return geoData.results;
  } catch (error) {
    console.error("unable to get location");
  }
}

/* ===== HELPERS FUNCTIONS ===== */

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day);
}

function cToF(celsius) {
  return (celsius * 9) / 5 + 32;
}

function kmToMiles(kilometers) {
  return kilometers * 0.621371;
}

function mmToInches(mm) {
  return mm * 0.0393701;
}

function getSelectedTempUnit() {
  return document.querySelector('input[name="temp"]:checked').value;
}

function getSelectedWindUnit() {
  return document.querySelector('input[name="wind"]:checked').value;
}

function getSelectedPrecipitationUnit() {
  return document.querySelector('input[name="precipitation"]:checked').value;
}

function showNoResultsError() {
  const errorState = document.querySelector(".error-state");
  const errorMessage = document.querySelector(".error-message");
  const weatherSection = document.querySelector(".weather");

  errorMessage.innerText = "No search result found!";
  errorState.classList.remove("hidden");
  weatherSection.classList.add("hidden");
}

function hideNoResultsError() {
  const errorState = document.querySelector(".error-state");
  const weatherSection = document.querySelector(".weather");
  errorState.classList.add("hidden");
  weatherSection.classList.remove("hidden");
}

function showApiError() {
  const apiError = document.querySelector(".api-error");
  const mainSection = document.querySelector(".main");

  apiError.classList.remove("hidden");
  mainSection.classList.add("hidden");
}

function hideApiError() {
  const apiError = document.querySelector(".api-error");
  const mainSection = document.querySelector(".main");

  apiError.classList.add("hidden");
  mainSection.classList.remove("hidden");
}

// debounce function
function debounce(fn, delay) {
  let timeoutId;

  return function (e) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(e);
    }, delay);
  };
}

async function handleSearchInput(e) {
  const query = e.target.value.trim();

  if (query.length < 3) {
    renderSuggestions([]);
    return;
  }

  const results = await getCitySuggestions(query);
  renderSuggestions(results);
}

function getWeatherCodeName(code) {
  const weatherCodes = {
    0: "sunny",
    1: "partly-cloudy",
    2: "partly-cloudy",
    3: "overcast",
    45: "fog",
    48: "fog",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "drizzle",
    57: "drizzle",
    61: "rain",
    63: "rain",
    65: "rain",
    66: "rain",
    67: "rain",
    80: "rain",
    81: "rain",
    82: "rain",
    71: "snow",
    73: "snow",
    75: "snow",
    77: "snow",
    85: "snow",
    86: "snow",
    95: "storm",
    96: "storm",
    99: "storm",
  };

  return weatherCodes[code] || "sunny";
}

function getWeatherIcon(type) {
  return `images/icon-${type}.webp`;
}

/* ===== RENDER FUNCTIONS ===== */

// Render suggestions
function renderSuggestions(results) {
  searchSuggestionPanel.innerHTML = "";

  if (!results || results.length === 0) {
    searchSuggestionPanel.classList.add("hidden");
    return;
  }

  searchSuggestionPanel.classList.remove("hidden");

  let suggestionData = results;

  for (let i = 0; i < suggestionData.length; i++) {
    let suggestedCity = suggestionData[i].name;
    let suggestedState = suggestionData[i].admin1;
    let suggestedCountry = suggestionData[i].country;

    const listItem = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add("search-suggestion");
    button.textContent = `${suggestedCity}, ${suggestedState}, ${suggestedCountry}`;

    listItem.appendChild(button);
    searchSuggestionPanel.appendChild(listItem);

    button.addEventListener("click", () => {
      selectedSuggestion = suggestionData[i];

      searchInput.value = `${suggestedCity}, ${suggestedState}, ${suggestedCountry}`;
      searchSuggestionPanel.innerHTML = "";
      searchSuggestionPanel.classList.add("hidden");
    });
  }
}

// Current Weather
function showCurrentWeather(data) {
  const currentCity = data?.name;
  const currentCountry = data?.country;

  const date = new Date(data.weatherData.current.time);
  const currentDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  let currentTemp = data.weatherData.current.temperature_2m;
  let weatherCode = data.weatherData.current.weathercode;
  let weatherType = getWeatherCodeName(weatherCode);
  let weatherIcon = getWeatherIcon(weatherType);
  let feelsLike = data.weatherData.current.apparent_temperature;
  let humidity = data.weatherData.current.relative_humidity_2m;
  let windSpeed = data.weatherData.current.wind_speed_10m;
  let windUnit = "km/h";
  let precipitation = data.weatherData.current.precipitation;
  let precipitationUnits = "mm";

  const tempUnitInputValue = getSelectedTempUnit();
  const windUnitInputValue = getSelectedWindUnit();
  const precipitationUnitInputValue = getSelectedPrecipitationUnit();

  if (tempUnitInputValue === "fahrenheit") {
    currentTemp = cToF(currentTemp);
    feelsLike = cToF(feelsLike);
  }

  if (windUnitInputValue === "milesperhour") {
    windSpeed = kmToMiles(windSpeed);
    windUnit = "mph";
  }

  if (precipitationUnitInputValue === "inches") {
    precipitation = mmToInches(precipitation);
    precipitationUnits = "in";
  }

  weatherCurrentCity.innerHTML = `${currentCity},`;
  weatherCurrentCountry.innerText = currentCountry;
  weatherCurrentDate.innerText = currentDate;
  weatherCurrentWeatherIcon.alt = weatherType;
  weatherCurrentWeatherIcon.src = weatherIcon;
  weatherCurrentTemp.innerHTML = `${Math.round(currentTemp)}<span>&deg;</span>`;
  weatherCurrentFeelsLike.innerHTML = `${Math.round(
    feelsLike
  )}<span>&deg;</span>`;
  weatherCurrentHumidity.innerHTML = `${humidity}%`;
  weatherCurrentWind.innerHTML = `${Math.round(windSpeed)} ${windUnit}`;
  weatherCurrentPrecipitation.innerHTML = `${precipitation} ${precipitationUnits}`;
}

// Daily Weather
function showDailyWeather(data) {
  const dailyData = data.weatherData.daily;

  for (let i = 0; i < 7; i++) {
    const date = parseLocalDate(dailyData.time[i]);
    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(date);

    const weatherCode = dailyData.weathercode;
    const weatherType = getWeatherCodeName(weatherCode[i]);
    const weatherIcon = getWeatherIcon(weatherType);

    let tempMax = dailyData.temperature_2m_max[i];
    let tempMin = dailyData.temperature_2m_min[i];

    const tempUnitInputValue = getSelectedTempUnit();

    if (tempUnitInputValue === "fahrenheit") {
      tempMax = cToF(tempMax);
      tempMin = cToF(tempMin);
    }

    weatherDailyDay[i].innerText = dayOfWeek;
    weatherDailyIcon[i].src = weatherIcon;
    weatherDailyIcon[i].alt = weatherType;
    weatherDailyTempMax[i].innerHTML = `${Math.round(
      tempMax
    )}<span>&deg;</span>`;
    weatherDailyTempMin[i].innerHTML = `${Math.round(
      tempMin
    )}<span>&deg;</span>`;
  }
}

// Hourly Menu
function showHourlyMenu(data) {
  const dailyData = data.weatherData.daily;

  for (let i = 0; i < 7; i++) {
    const date = parseLocalDate(dailyData.time[i]);
    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(date);

    panelDay[i].innerText = dayOfWeek;
  }

  const hourlyMenuDate = parseLocalDate(dailyData.time[0]);
  const hourlyMenuDay = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(hourlyMenuDate);

  hourlyMenuLabel.innerText = hourlyMenuDay;
  showHourlyWeather(data, dailyData.time[0]);

  panelDay.forEach((item, i) => {
    item.onclick = () => {
      const selectedDate = dailyData.time[i];
      currentSelectedDate = selectedDate;

      dailyDropdown.innerHTML = `${item.textContent}
        <img class="hourly-dropdown-icon"
        src="images/icon-dropdown.svg"
        alt=""/>`;

      showHourlyWeather(data, selectedDate);
    };
  });
}

// Hourly Weather
function showHourlyWeather(data, selectedDate) {
  const hourlyData = data.weatherData.hourly;
  let rowIndex = 0;

  for (let i = 0; i < hourlyData.time.length; i++) {
    const datePart = hourlyData.time[i].split("T")[0];

    if (datePart === selectedDate) {
      const time = hourlyData.time[i];
      const weatherCode = hourlyData.weathercode[i];
      const weatherType = getWeatherCodeName(weatherCode);
      const weatherIcon = getWeatherIcon(weatherType);
      let hourlyTemperature = hourlyData.temperature_2m[i];

      const tempUnitInputValue = getSelectedTempUnit();

      if (tempUnitInputValue === "fahrenheit") {
        hourlyTemperature = cToF(hourlyTemperature);
      }

      const timeOfDay = new Date(time).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });

      weatherHourlyTime[rowIndex].innerText = timeOfDay;
      weatherHourlyIcon[rowIndex].src = weatherIcon;
      weatherHourlyIcon[rowIndex].alt = weatherType;
      weatherHourlyTemp[rowIndex].innerHTML = `${Math.round(
        hourlyTemperature
      )}<span>&deg;</span>`;

      rowIndex++;
    }
  }
}

// Re-Render Function For Realtime Unit Conversion
function rerenderWeather() {
  if (!currentWeatherData) return;

  showCurrentWeather(currentWeatherData);
  showDailyWeather(currentWeatherData);
  showHourlyWeather(currentWeatherData, currentSelectedDate);
}

/* ===== MAIN APP FUNCTIONS ===== */

async function showWeather(city) {
  lastSearchedCity = city;
  try {
    const data = await getWeather(city);

    if (!data) {
      showNoResultsError();
      return;
    }
    hideNoResultsError();
    hideApiError();

    currentWeatherData = data;
    currentSelectedDate = data.weatherData.daily.time[0];

    showCurrentWeather(data);
    showDailyWeather(data);
    showHourlyMenu(data);
  } catch (error) {
    showApiError();
  }
}

async function showWeatherByLocation(location) {
  // use location.latitude, location.longitude, location.name, location.country
  try {
    const { latitude, longitude, name, country } = location;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,wind_speed_10m,apparent_temperature,relative_humidity_2m,precipitation&hourly=temperature_2m,weathercode,apparent_temperature,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`
    );

    if (!weatherRes.ok) {
      throw new Error("Weather API request failed");
    }

    const weatherData = await weatherRes.json();

    const data = {
      name,
      country,
      latitude,
      longitude,
      weatherData,
    };

    currentWeatherData = data;
    currentSelectedDate = data.weatherData.daily.time[0];

    hideNoResultsError();

    showCurrentWeather(data);
    showDailyWeather(data);
    showHourlyMenu(data);
  } catch (error) {
    showApiError();
  }
}

/* ===== EVENT LISTENERS ===== */

// Search Suggestion Drop Down
const debouncedSearch = debounce(handleSearchInput, 300);
searchInput.addEventListener("input", debouncedSearch);

// Header unit dropdown
headerDropdown.addEventListener("click", () => {
  headerPanel.classList.toggle("hidden");

  /*accessibility*/
  const isOpen = !headerPanel.classList.contains("hidden");
  headerDropdown.setAttribute("aria-expanded", isOpen);
});

// Hourly forecast dropdown
dailyDropdown.addEventListener("click", () => {
  hourlyPanel.classList.toggle("hidden");

  /*accessibility*/
  const isOpen = !hourlyPanel.classList.contains("hidden");
  dailyDropdown.setAttribute("aria-expanded", isOpen);
});

// Main unit toggle button
mainUnitButton.addEventListener("click", () => {
  const isMetric = celsiusInput.checked;

  if (isMetric) {
    fahrenheitInput.checked = true;
    milesperhourInput.checked = true;
    inchesInput.checked = true;
    mainUnitButton.textContent = "Switch to Metric";
  } else {
    celsiusInput.checked = true;
    kilometerInput.checked = true;
    millimetersInput.checked = true;
    mainUnitButton.textContent = "Switch to Imperial";
  }

  rerenderWeather();
});

// Individual unit radio changes
unitInputs.forEach((input) => {
  input.addEventListener("change", () => {
    rerenderWeather();
  });
});

// Search button
searchButton.addEventListener("click", () => {
  let city = searchInput.value.trim().toLowerCase();

  if (!city) {
    showNoResultsError();
    return;
  }

  if (selectedSuggestion) {
    showWeatherByLocation(selectedSuggestion);
    return;
  }

  showWeather(city);
});

// Search enter key
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let city = searchInput.value.trim().toLowerCase();

    if (!city) {
      showNoResultsError();
      return;
    }

    if (selectedSuggestion) {
      showWeatherByLocation(selectedSuggestion);
      selectedSuggestion = null;
      return;
    }

    showWeather(city);
  }
});

// Retry button
retryButton.addEventListener("click", () => {
  if (lastSearchedCity) {
    showWeather(lastSearchedCity);
  }
});

/* ===== Load Default Weather ===== */

showWeather("Berlin");
