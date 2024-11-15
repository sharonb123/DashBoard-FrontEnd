// Function to show the loading spinner
function showSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    console.log("Pressed");
    spinner.style.display = 'block'; // Show the spinner
}

// Function to hide the loading spinner
function hideSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'none'; // Hide the spinner
}

// Function to read the timestamp from the text file
function readTimestamp() {
    return fetch('./data/image_timestamp.txt')  // Fetch the timestamp file
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the timestamp file');
            }
            return response.text(); // Read the content as text
        })
        .then(content => {
            return new Date(content.trim()); // Parse the timestamp
        });
}

async function makePrediction() {
    showSpinner();  // Show a loading spinner

    try {
        const lastPredictionTime = await readTimestamp();
        const currentTime = new Date();
        const timeDifference = (currentTime - lastPredictionTime) / (1000 * 60 * 60); // Time difference in hours

        if (timeDifference < 3) {
            console.log('Using the last prediction, as it is still relevant.');
            // Show the latest prediction image
            const predictionImage = document.getElementById('predictionImage');
            predictionImage.src = `./data/latest_image_prediction.png`;
            // Show a tag for 3 seconds
            showTag("Latest prediction is shown", 3000);
            hideSpinner();  // Hide the spinner after showing the image
            return;
        }

        // If the prediction is outdated, send a POST request to the prediction endpoint
        const response = await fetch('http://127.0.0.1:5000/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
            console.log('Prediction completed successfully!');
            // Update the image source with a timestamp to force reload
            const predictionImage = document.getElementById('predictionImage');
            predictionImage.src = `./data/latest_image_prediction.png`;
            // Show a tag for 3 seconds
            showTag("New prediction made", 3000);
        }
    } catch (error) {
        console.error('Error during prediction:', error);
    } finally {
        hideSpinner();  // Hide the spinner at the end
    }
}

// Function to show a message tag for a specified duration
function showTag(message, duration) {
    const tag = document.createElement('div');
    tag.innerText = message;
    tag.style.display = 'inline-block'; // Display as inline block
    tag.style.backgroundColor = '#FF7518';
    tag.style.color = '#fff';
    tag.style.padding = '0.0rem';
    tag.style.marginBottom = '2rem';
    tag.style.borderRadius = '0.1rem';
    tag.style.marginLeft = '1rem'; // Add some space between the button and the tag
    tag.style.zIndex = '1000';
    tag.style.fontSize = '1rem';
    
    const buttonContainer = document.querySelector('.button-container'); // Get the button container
    buttonContainer.appendChild(tag); // Append the tag to the button container

    setTimeout(() => {
        buttonContainer.removeChild(tag); // Remove the tag after the duration
    }, duration);
}

// Event listener for the prediction button
document.getElementById('PredictButton').addEventListener('click', makePrediction);
