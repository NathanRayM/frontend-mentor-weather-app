![Weather app preview](desktop-design-metric.jpg)

<h1 align="center">Weather App</h1>

<div align="center">

[Live](https://nathanraym.github.io/frontend-mentor-weather-app/)
| [Solution](https://github.com/NathanRayM/frontend-mentor-weather-app.git)
| [Challenge](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49)

Solution for a challenge from [frontendmentor.io](https://www.frontendmentor.io/)

</div>

## About The Project

Your challenge is to build this weather app using the Open-Meteo API and make it look as close to the design as possible.

You can use any tools you like to help you complete the challenge. So, if you have something you'd like to practice, feel free to give it a try.

Your users should be able to:

- Search for weather information by entering a location in the search bar
- View current weather conditions, including temperature, weather icon, and location details
- See additional weather metrics like "feels like" temperature, humidity percentage, wind speed, and precipitation amounts
- Browse a 7-day weather forecast with daily high/low temperatures and weather icons
- View an hourly forecast showing temperature changes throughout the day
- Switch between different days of the week using the day selector in the hourly forecast section
- Toggle between Imperial and Metric measurement units via the units dropdown
- Switch between specific temperature units (Celsius and Fahrenheit) and measurement units for wind speed (km/h and mph) and precipitation (millimeters) via the units dropdown
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

## Built with

- Semantic HTML5 markup
- Modern CSS (custom properties, responsive design, and media queries)
- Mobile-first workflow
- Flexbox and CSS Grid for layout
- Vanilla JavaScript (ES6+) for application logic
- Fetch API for asynchronous data retrieval
- Open-Meteo API (Geocoding + Weather)
- Debounce technique for optimized API requests
- Dynamic DOM manipulation
- State management using plain JavaScript
- Accessible UI patterns (ARIA attributes, keyboard support)

## What I learned

This project helped reinforce how to manage application state using plain JavaScript and render the UI dynamically based on that state. I structured the app so that all weather data is stored in a central state and then used multiple render functions to update different parts of the interface (current weather, daily forecast, and hourly forecast).

I gained experience working with multiple API endpoints by combining the Open-Meteo geocoding API with the weather API. This required handling asynchronous data flows, validating responses, and managing different error states such as invalid user input and API failures.

One of the most valuable parts of this project was building a debounced autocomplete search feature. This improved performance by limiting API calls while typing and enhanced the user experience by allowing users to select specific locations instead of relying on ambiguous search results.

Additionally, I implemented real-time unit conversion without re-fetching data by re-rendering the UI based on user-selected preferences. This helped reinforce the concept of separating data from presentation logic.

Overall, this project strengthened my ability to build a fully interactive, responsive, and user-friendly application using vanilla JavaScript while keeping the code modular, maintainable, and scalable.

## Acknowledgments

A big thank you to anyone providing feedback on my [solution](https://www.frontendmentor.io/solutions/weather-app-with-autocomplete-units-and-api-vanilla-js-6bWoMM68WC). It definitely helps to find new ways to code and find easier solutions!
