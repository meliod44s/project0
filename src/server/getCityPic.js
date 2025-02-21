const axios = require("axios");

/**
 * Fetches an image URL for a given city using the Pixabay API.
 * @param {string} city - Name of the city to search for.
 * @param {string} key - API key for Pixabay.
 * @returns {Object} - An object containing the image URL.
 */
const getCityPic = async (city, key) => {
  try {
    // Validate input
    if (!city || typeof city !== "string") {
      return {
        message: "Invalid city name",
        error: true,
      };
    }

    // Make API request to Pixabay
    const { data } = await axios.get(`https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(city)}&image_type=photo`);

    // Extract the first image URL if available
    const imageUrl = data.hits && data.hits.length > 0 ? data.hits[0].webformatURL : "https://source.unsplash.com/random/640x480?city,morning,night?sig=1";

    // Return the image URL
    return { image: imageUrl };
  } catch (error) {
    console.error("Error fetching city picture:", error.message);
    return {
      message: "Failed to fetch city picture",
      error: true,
    };
  }
};

module.exports = {
  getCityPic,
};