// Variables to store all CSV data
let allData = [];

// Fetch the CSV file from the local directory
fetch('extended_weather.csv') // Adjust the path to the CSV file as necessary
    .then(response => response.text())
    .then(csvData => {
        // Use Papa Parse to parse the CSV data
        Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                allData = results.data;
                initializeFilters(allData);
                updateCharts(allData); // Initially display all data
            }
        });
    })
    .catch(error => console.error('Error loading CSV file:', error));

// Initialize filters based on CSV data
function initializeFilters(data) {
    const yearFilter = document.getElementById('yearFilter');
    const monthFilter = document.getElementById('monthFilter');

    // Get unique years and months from the date
    const years = new Set();
    const months = new Set();

    data.forEach(row => {
        const date = new Date(row['Date']);
        years.add(date.getFullYear());
        months.add(date.getMonth() + 1); // JS months are 0-indexed
    });

    // Populate year filter and sort
    [...years].sort((a, b) => a - b).forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // Populate month filter and sort
    [...months].sort((a, b) => a - b).forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });

    // Add event listener to the "Go" button
    document.getElementById('filterButton').addEventListener('click', filterData);
}

// Function to filter data based on selected filters
function filterData() {
    const yearFilter = document.getElementById('yearFilter').value;
    const monthFilter = document.getElementById('monthFilter').value;

    const filteredData = allData.filter(row => {
        const date = new Date(row['Date']);
        const yearMatch = yearFilter === '' || date.getFullYear().toString() === yearFilter;
        const monthMatch = monthFilter === '' || (date.getMonth() + 1).toString() === monthFilter;
        return yearMatch && monthMatch;
    });

    updateCharts(filteredData); // Update charts with filtered data
}

// Update charts with filtered data
function updateCharts(data) {
    const labels = data.map(row => row['Date']);
    const temperatureData = data.map(row => row['Average Temperature (°C)']);
    const windSpeedData = data.map(row => row['Average Wind Speed (km/h)']);
    const windGustData = data.map(row => row['Average Wind Gusts (km/h)']);
    const windDirectionData = data.map(row => row['Wind Direction (°)']);
    const humidityData = data.map(row => row['Average Relative Humidity (%)']);

    updateTemperatureChart(labels, temperatureData);
    updateWindSpeedGustChart(labels, windSpeedData, windGustData);
    updateWindDirectionChart(labels, windDirectionData);
    updateHumidityChart(labels, humidityData);
}

// Chart for Average Temperature
function updateTemperatureChart(labels, temperatureData) {
    const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
    ctxTemp.clearRect(0, 0, ctxTemp.canvas.width, ctxTemp.canvas.height); // Clear previous chart
    new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Temperature (°C)',
                data: temperatureData,
                fill: true,
                borderColor: 'rgba(173, 216, 230, 1)', // Light Blue
                backgroundColor: 'rgba(173, 216, 230, 0.2)', // Light Blue transparent
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Chart for Wind Speed and Wind Gusts
function updateWindSpeedGustChart(labels, windSpeedData, windGustData) {
    const ctxWind = document.getElementById('windSpeedGustChart').getContext('2d');
    ctxWind.clearRect(0, 0, ctxWind.canvas.width, ctxWind.canvas.height); // Clear previous chart
    new Chart(ctxWind, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Wind Speed (km/h)',
                data: windSpeedData,
                backgroundColor: 'rgba(0, 0, 255, 0.2)', // Blue
                borderColor: 'rgba(0, 0, 255, 1)', // Blue solid
                borderWidth: 1
            }, {
                label: 'Average Wind Gusts (km/h)',
                data: windGustData,
                backgroundColor: 'rgba(64, 224, 208, 0.2)', // Turquoise
                borderColor: 'rgba(64, 224, 208, 1)', // Turquoise solid
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Chart for Wind Direction
function updateWindDirectionChart(labels, windDirectionData) {
    const ctxDirection = document.getElementById('windDirectionChart').getContext('2d');
    ctxDirection.clearRect(0, 0, ctxDirection.canvas.width, ctxDirection.canvas.height); // Clear previous chart
    new Chart(ctxDirection, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wind Direction (°)',
                data: windDirectionData,
                backgroundColor: 'rgba(0, 255, 255, 0.2)', // Lighter Turquoise
                borderColor: 'rgba(0, 255, 255, 1)', // Lighter Turquoise solid
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Chart for Relative Humidity
function updateHumidityChart(labels, humidityData) {
    const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
    ctxHumidity.clearRect(0, 0, ctxHumidity.canvas.width, ctxHumidity.canvas.height); // Clear previous chart
    new Chart(ctxHumidity, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Relative Humidity (%)',
                data: humidityData,
                fill: true,
                borderColor: 'rgba(0, 191, 255, 1)', // Deep Sky Blue
                backgroundColor: 'rgba(0, 191, 255, 0.2)', // Deep Sky Blue transparent
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
