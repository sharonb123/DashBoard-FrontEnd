// fetchWeather.js

async function fetchWeather() {
    
    try {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        const apiUrl = `${baseUrl}/api/weather`;  // Construct the full API URL
        console.log(`${apiUrl}`);
        const response = await fetch('http://127.0.0.1:5000/api/weather');  // Make GET request to Flask API
        if (!response.ok) {
            console.log("Inside Fetch");
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const weatherData = await response.json();  // Parse JSON data

        // Debug: Log the fetched weather data
        console.log('Weather Data:', weatherData);

        // Update HTML with weather data
       // document.getElementById('temperature').textContent = `Average Temperature: ${weatherData.Temperature} °C`;
        //document.getElementById('windSpeed').textContent = `Average Wind Speed: ${weatherData['Wind Speed']} km/h`;
        // Add similar lines for other weather data fields

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Call fetchWeather when the page loads
window.onload = fetchWeather;
