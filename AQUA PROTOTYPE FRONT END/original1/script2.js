
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







// Chart.js example initialization
const ctx1 = document.getElementById('windGustSpeedChart').getContext('2d');
const windGustSpeedChart = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['12 Oct', '13 Oct', '14 Oct', '15 Oct', '16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct', '23 Oct', '24 Oct'],
        datasets: [{
            label: 'Average Wind Gust',
            data: [30, 35, 50, 60, 45, 55, 65, 55, 50, 40, 45, 50, 55],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }, {
            label: 'Average Wind Speed',
            data: [20, 25, 30, 35, 40, 30, 40, 50, 30, 40, 45, 35, 40],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
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

// Wind Direction Average (Bar Chart)
const ctx2 = document.getElementById('windDirectionChart').getContext('2d');
const windDirectionChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['12 Oct', '13 Oct', '14 Oct', '15 Oct', '16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct', '23 Oct', '24 Oct'],
        datasets: [{
            label: 'Average Wind Direction',
            data: [100, 120, 110, 130, 140, 150, 160, 150, 140, 130, 120, 110, 100],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
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


// Average Temperature (Line Chart)
const ctx3 = document.getElementById('temperatureChart').getContext('2d');
const temperatureChart = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: ['12 Oct', '13 Oct', '14 Oct', '15 Oct', '16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct', '23 Oct', '24 Oct'],
        datasets: [{
            label: 'Average Temperature',
            data: [15, 16, 18, 20, 19, 21, 23, 22, 20, 18, 17, 16, 15],
            fill: true,
            borderColor: 'rgba(255, 159, 64, 1)',
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
