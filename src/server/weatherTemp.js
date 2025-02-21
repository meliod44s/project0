const axios = require("axios");

/**
 * Fetches weather data based on latitude, longitude, and remaining days.
 * @param {number} lo - Longitude of the location.
 * @param {number} la - Latitude of the location.
 * @param {number} Rdays - Remaining days until the target date.
 * @param {string} key - API key for Weatherbit.
 * @returns {Object} - Weather data including description and temperature.
 */
const weatherTemp = async (lo, la, Rdays, key) => {
  try {
    // Validate inputs
    if (Rdays < 0) {
      return {
        message: "Date cannot be in the past",
        error: true,
      };
    }

    let apiUrl;
    if (Rdays > 0 && Rdays <= 7) {
      // Fetch current weather data
      apiUrl = `https://api.weatherbit.io/v2.0/current?lat=${la}&lon=${lo}&units=M&key=${key}`;
    } else if (Rdays > 7) {
      // Fetch forecasted weather data
      apiUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${la}&lon=${lo}&units=M&days=${Rdays}&key=${key}`;
    } else {
      return {
        message: "Invalid number of remaining days",
        error: true,
      };
    }

    // Make API request
    const { data } = await axios.get(apiUrl);

    // Validate API response
    if (!data || !data.data || data.data.length === 0) {
      return {
        message: "No weather data available for the given location",
        error: true,
      };
    }

    // Extract relevant data
    const weatherInfo = data.data[data.data.length - 1];
    const { weather, temp, app_max_temp, app_min_temp } = weatherInfo;
    const { description } = weather;

    // Prepare response
    const weatherData = {
      description,
      temp,
      ...(Rdays > 7 && { app_max_temp, app_min_temp }), // Include additional fields for forecasted weather
    };

    console.log("******************************************************");
    console.log(weatherData);
    console.log("******************************************************");

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return {
      message: "Failed to fetch weather data",
      error: true,
    };
  }
};

module.exports = {
  weatherTemp,
};