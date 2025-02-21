import axios from "axios";

// DOM Elements
const formElement = document.querySelector("form");
const cityField = document.querySelector("#city");
const dateField = document.querySelector("#flightDate");
const cityErrorMessage = document.querySelector("#city_error");
const dateErrorMessage = document.querySelector("#date_error");

// Handles form submission
const processFormSubmission = async (event) => {
  event.preventDefault();
  console.log("Form submission triggered.");

  clearErrorMessages();
  if (!validateFormInputs()) return;

  try {
    const locationData = await retrieveData("/getCity", { city: cityField.value }, cityErrorMessage);
    if (!locationData) return;

    const { lng, lat, name } = locationData;
    const daysUntilTrip = computeDaysRemaining(dateField.value);
    if (daysUntilTrip < 0) return displayError("Date cannot be in the past.", dateErrorMessage);

    const weatherData = await retrieveData("/getWeather", { lng, lat, remainingDays: daysUntilTrip }, dateErrorMessage);
    if (!weatherData) return;

    const cityImage = await retrieveData("/getCityPic", { city_name: name });
    updateDisplay(daysUntilTrip, name, cityImage, weatherData);
  } catch (error) {
    console.error("Unexpected error:", error);
    displayError("An unexpected error occurred. Please try again.", dateErrorMessage);
  }
};

// Validates user inputs
const validateFormInputs = () => {
  if (!cityField.value.trim()) return displayError("City field cannot be empty.", cityErrorMessage);
  if (!dateField.value) return displayError("Please enter a valid date.", dateErrorMessage);
  return true;
};

// Fetches data from API
const retrieveData = async (endpoint, requestData, errorElement) => {
  try {
    const response = await axios.post(`http://localhost:8000${endpoint}`, requestData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    if (errorElement) displayError("Failed to fetch data. Please try again.", errorElement);
    return null;
  }
};

// Calculates remaining days until flight date
const computeDaysRemaining = (dateInput) => {
  const currentDate = new Date();
  const targetDate = new Date(dateInput);
  return Math.ceil((targetDate - currentDate) / (1000 * 3600 * 24));
};

// Updates the UI with fetched data
const updateDisplay = (daysUntilTrip, cityName, cityImage, weatherData) => {
  document.querySelector("#Rdays").textContent = `Your trip starts in ${daysUntilTrip} days.`;
  document.querySelector(".cityName").textContent = `Location: ${cityName}`;
  document.querySelector(".weather").textContent = `Weather: ${weatherData.description}`;
  document.querySelector(".temp").innerHTML = `Temperature: ${weatherData.temp}&degC`;
  document.querySelector(".max-temp").innerHTML = weatherData.app_max_temp ? `Max Temp: ${weatherData.app_max_temp}&degC` : "";
  document.querySelector(".min-temp").innerHTML = weatherData.app_min_temp ? `Min Temp: ${weatherData.app_min_temp}&degC` : "";
  document.querySelector(".cityPic").innerHTML = `<img src="${cityImage}" alt="City view" class="img-fluid">`;
  document.querySelector(".flight_data").style.display = "block";
};

// Handles error messages
const displayError = (message, errorElement) => {
  errorElement.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${message}`;
  errorElement.style.display = "block";
};

// Resets error messages
const clearErrorMessages = () => {
  cityErrorMessage.style.display = "none";
  dateErrorMessage.style.display = "none";
};

// Attach event listener to form submission
formElement.addEventListener("submit", processFormSubmission);

// Export function
export { processFormSubmission };
