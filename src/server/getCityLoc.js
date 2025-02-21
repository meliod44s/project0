const axios = require("axios");

/**
 * Fetches the location data for a given city using the GeoNames API.
 * @param {string} city - Name of the city to search for.
 * @param {string} username - GeoNames username for API access.
 * @returns {Object} - Location data or an error message if no results are found.
 */
const getCityLoc = async (city, username) => {
  try {
    // Validate input
    if (!city || typeof city !== "string") {
      return {
        message: "Invalid city name",
        error: true,
      };
    }

    // Make API request to GeoNames
    const { data } = await axios.get(`https://secure.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=${username}`);

    // Check if geonames array is empty
    if (!data.geonames || data.geonames.length === 0) {
      return {
        message: "No city with that name. Please make sure of your spelling",
        error: true,
      };
    }

    // Return the first result from geonames
    return data.geonames[0];
  } catch (error) {
    console.error("Error fetching city location:", error.message);
    return {
      message: "Failed to fetch city location",
      error: true,
    };
  }
};

module.exports = { getCityLoc };