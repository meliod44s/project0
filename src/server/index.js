const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import required functions
const { getCityLoc } = require("./getCityLoc");
const { weatherTemp } = require("./weatherTemp");
const { getCityPic } = require("./getCityPic");

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

// Environment variables
const userstring = process.env.USERNAME;
const usernumber = process.env.USERNUMBER;
const WEATHER_KEY = process.env.WEATHER_KEY;
const pixabay_key = process.env.pixabay_key;
const username = userstring.concat(usernumber);

// Define port
const PORT = 8000;

// Root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html"); // Serve the static HTML file
});

// Route to get city location
app.post("/getCity", async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: "City name is required" });
    }
    const location = await getCityLoc(city, username);
    res.json(location);
  } catch (error) {
    console.error("Error fetching city location:", error.message);
    res.status(500).json({ error: "Failed to fetch city location" });
  }
});

// Route to get weather data
app.post("/getWeather", async (req, res) => {
  try {
    const { lng, lat, remainingDays } = req.body;
    if (!lng || !lat || !remainingDays) {
      return res.status(400).json({ error: "Longitude, latitude, and remaining days are required" });
    }
    const weatherData = await weatherTemp(lng, lat, remainingDays, WEATHER_KEY);
    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Route to get city picture
app.post("/getCityPic", async (req, res) => {
  try {
    const { city_name } = req.body;
    if (!city_name) {
      return res.status(400).json({ error: "City name is required" });
    }
    const cityPic = await getCityPic(city_name, pixabay_key);
    res.json(cityPic);
  } catch (error) {
    console.error("Error fetching city picture:", error.message);
    res.status(500).json({ error: "Failed to fetch city picture" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});