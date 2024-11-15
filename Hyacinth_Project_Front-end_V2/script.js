//Plot 1: Temperature and hyacinth plot
// Fetch the aggregated data from the Flask API
fetch('http://127.0.0.1:5000/api/aggregated_data')
    .then(response => response.json())
    .then(data => {
        //console.log('Fetched Data:', data);
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        const labels = data.map(item => monthNames[parseInt(item.month) - 1]);
        const temperatureData = data.map(item => parseFloat(item.sum_avg_temperature)); // Ensure it's a number
        const hyacinthData = data.map(item => parseFloat(item.sum_hyacinth_percentage));
        
        updateStackedBarLineChart(labels, temperatureData, hyacinthData);
        
       
    })
    .catch(error => console.error('Error fetching data:', error));

    function updateStackedBarLineChart(labels, temperatureData, hyacinthData) {
        const ctx = document.getElementById('stackedBarLineChart').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear previous chart
    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,  // Use the months as labels
                datasets: [
                    {
                        label: 'Hyacinth Data',  // Example stacked bar data (hyacinth)
                        data: hyacinthData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green color for Hyacinth
                        stack: 'stack1',
                    },
                    {
                        label: 'Average Temperature (°C)',  // Temperature as line on top of the bar chart
                        data: temperatureData,
                        type: 'line',  // Line plot for temperature
                        fill: false,   // No fill for the line
                        borderColor: 'rgba(173, 216, 230, 1)', // Light Blue color for the temperature line
                        tension: 0.1,  // Slight curve for the line
                        yAxisID: 'y2', // Use a second y-axis for the line plot
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            // Change to a darker color for visibility
                            font: {
                                size: 12, // Adjust the font size if necessary
                                weight: 'bold' // Make the text bold
                            }
                        }
                    },
                    y: {
                        beginAtZero: true, // Start y-axis from zero for the bar chart
                        stacked: true,     // Enable stacking for bars
                    },
                    y2: {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        stacked: false,   // Do not stack the line plot
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });
    }
//Plot 2: 
// Plot 2: Wind Gust vs. Wind Speed Scatter Plot (Bubble Chart)
// Fetch the aggregated data for Plot 2
function plot2(){
    fetch('http://127.0.0.1:5000/api/wind_hyacinth_scatter')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // Extracting data for plotting
        const xValues = data.map(item => parseFloat(item.sum_avg_wind_gust)); // X-axis: wind gust
        const yValues = data.map(item => parseFloat(item.sum_avg_wind_speed)); // Y-axis: wind speed
        const bubbleSizes = data.map(item => parseFloat(item.sum_hyacinth_percentage)); // Bubble size
        const labels = data.map(item => item.year); // Labels for tooltips (year)


        updateScatterBubbleChart(xValues, yValues, bubbleSizes, labels);
    })
    .catch(error => console.error('Error fetching data for plot 2:', error));

    // Function to create a scatter plot with bubbles
    function updateScatterBubbleChart(xValues, yValues, bubbleSizes, labels) {
        const ctx = document.getElementById('scatterBubbleChart').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear previous chart
        
        const vibrantColors = [
            'rgba(255, 99, 132, 0.6)', // Bright Pink
            'rgba(54, 162, 235, 0.6)', // Bright Blue
            'rgba(255, 206, 86, 0.6)', // Bright Yellow
            'rgba(75, 192, 192, 0.6)', // Bright Teal
            'rgba(153, 102, 255, 0.6)', // Bright Purple
            'rgba(255, 159, 64, 0.6)'  // Bright Orange
        ];

        new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: labels.map((year, index) => ({
                    label: `Year ${year}`,
                    data: [{
                        x: xValues[index],
                        y: yValues[index],
                        r: bubbleSizes[index] / 700 // Adjust bubble size scaling factor as needed
                    }],
                    backgroundColor: vibrantColors[index], // Color variation
                    borderColor: vibrantColors[index].replace('0.6', '1'),
                    borderWidth: 1
                }))
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Sum of Average Wind Gust (km/h)',
                            color: '#333'
                        },
                        font: {
                            size: 12, // Adjust the font size if necessary
                            weight: 'bold' // Make the text bold
                        },
                        min: 0, // Add padding to the left of the x-axis
                        max: Math.max(...xValues) + 1000, // Add padding to the right of the x-axis
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Sum of Average Wind Speed (km/h)',
                            color: '#333'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top' // Move legend to the right of the plot
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Year: ${context.raw.label}, Wind Gust: ${context.raw.x} km/h, Wind Speed: ${context.raw.y} km/h, Hyacinth: ${context.raw.r * 5}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    
}
plot2()

//Pie chart:
async function plotHyacinthPieChart() {
    try {
        // Fetch data from the API endpoint
        const response = await fetch('http://127.0.0.1:5000/api/hyacinth-pie');
        const data = await response.json();
        
        // Log data to check output
        console.log(data);

        // Extract the labels (years) and data (percentages)
        const labels = data.map(entry => `Year ${entry.year}`);
        const percentages = data.map(entry => entry.percentage_of_total);

        // Define vibrant colors for each section of the pie chart
        const colors = [
            'rgba(255, 99, 132, 0.6)', // Bright red
            'rgba(54, 162, 235, 0.6)', // Bright blue
            'rgba(255, 206, 86, 0.6)', // Bright yellow
            'rgba(75, 192, 192, 0.6)'  // Bright teal
        ];

        // Get the context of the canvas element
        const ctx = document.getElementById('hyacinthPieChart').getContext('2d');

        // Create a new pie chart
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: percentages,
                    backgroundColor: colors,
                    borderColor: colors.map(color => color.replace('0.6', '1')), // Solid color border
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching data for the pie chart:', error);
    }
}

// Call the function to plot the pie chart when the page loads
plotHyacinthPieChart();


//---------END OF PIE CHART




// Animation
// Function to animate the gauge fill
function animateGauge(targetValue) {
    const gaugeFill = document.getElementById('gaugeFill');
    const accuracyValue = document.getElementById('accuracyValue');

    let currentValue = 0;

    // Function to fill the gauge
    function fillGauge() {
        currentValue = 0; // Reset the current value
        gaugeFill.style.height = '0%'; // Reset the gauge fill height
        accuracyValue.textContent = '0'; // Reset displayed value

        // Fill the gauge
        const fillInterval = setInterval(() => {
            if (currentValue < targetValue) {
                currentValue++;
                gaugeFill.style.height = currentValue + '%'; // Set the height to current value
            } else {
                clearInterval(fillInterval); // Stop when the fill is complete
                // Start updating the accuracy number after filling
                updateAccuracyNumber(targetValue);
            }
        }, 20); // Faster fill speed (adjust as needed)
    }

    // Function to update the accuracy number after the fill
    function updateAccuracyNumber(targetValue) {
        let currentAccuracy = 0;

        // Update the accuracy number during the waiting time
        const updateInterval = setInterval(() => {
            if (currentAccuracy < targetValue) {
                currentAccuracy++;
                accuracyValue.textContent = currentAccuracy; // Update displayed value
            } else {
                clearInterval(updateInterval); // Stop when the target is reached
            }
        }, 330); // Slower increment speed (adjust as needed)
    }

    // Set an interval to fill the gauge every minute
    setInterval(() => {
        fillGauge(); // Start filling the gauge
    }, 60000); // 60000 ms = 1 minute

    // Start the first filling process
    fillGauge(); // Call this initially to start the first fill
}

// Call the animateGauge function with the desired accuracy (e.g., 83)
animateGauge(83);
