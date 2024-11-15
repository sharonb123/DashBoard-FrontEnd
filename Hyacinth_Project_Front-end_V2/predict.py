import json
import joblib
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors

def run_prediction():
        #Load the model
    model = joblib.load('./model/gb_model_7.joblib')

    # Load the JSON data from the file
    with open('./data/weather_today.json', 'r') as file:
        data = json.load(file)

    # Assign the variables
    temperature = data["Temperature"]
    wind_speed = data["Wind Speed"]
    wind_gust = data["Wind Gust"]
    wind_direction = data["Wind Direction"]
    season = data["Season"]
    precipitation = data["Precipitation"]
    humidity = data["Humidity"]
    sunshine = data["Sunshine"]

    #Prepare data
    #season
    if season == 'Spring':
        season_spring = 1
        season_summer = 0
    elif season == 'Summer':
        season_summer = 1
        season_spring = 0
    else:
        season_spring = 0
        season_summer = 0

    #create X df suitable for ml
    X = pd.DataFrame({
        'Wind Direction (°)': [wind_direction],
        'Average Temperature (°C)': [temperature],
        'Average Sunshine Duration (hours)': [sunshine],
        'Humidity_Temperature_Interaction': [humidity*temperature],
        'Average Relative Humidity (%)': [humidity],
        'Season_Summer': [season_summer],
        'Season_Spring': [season_spring]
        })

    #Predict

    predictions = model.predict(X)

    #replace every 0 with a 2: (2 to represent no hyacinth)
    predictions[predictions == 0] = 2

    #fetch pixel locations
    headers_df = pd.read_csv('./data/pixel_locations_as_headers.csv')

    headers_df.loc[0] = predictions[0]

    bool_mask_df = pd.read_csv("./data/boolean_water_mask.csv", header=None)

    flattened_mask = bool_mask_df.values.flatten()

    #reconstruct
    final_image = np.copy(flattened_mask) 

    for col in headers_df.columns:
        index = int(col)
        if 0 <= index < len(final_image):
            final_image[index] = predictions[0][headers_df.columns.get_loc(col)]
                
    def reshape_image_band(flat_img):
        original_height = 177
        original_width = 402

        # Reshape the flattened array back to 2D
        band_reshaped = flat_img.reshape((original_height, original_width))
        return band_reshaped

    final_image_reshaped = reshape_image_band(final_image)

    # Plotting
    colors = [(1, 1, 1, 0), (0, 0.85, 0.75), (0, 0, 0.25, 1)] 
    cmap = mcolors.ListedColormap(colors)

    bounds = [0, 1, 2, 3]
    norm = mcolors.BoundaryNorm(bounds, cmap.N)

    grey_colour = (0.08, 0.08, 0.08) #background

    plt.figure(figsize=(10, 10), facecolor=grey_colour) 
    ax = plt.gca()
    ax.set_facecolor(grey_colour)

    plt.imshow(final_image_reshaped, cmap=cmap, norm=norm, alpha=1)
    plt.axis('off')
    plt.title(f'Prediction for the day: {datetime.today().date()}', color=(0, 0.85, 0.75))
    plt.savefig('./data/latest_image_prediction.png', facecolor=grey_colour, bbox_inches='tight', pad_inches=0)
    #plt.show()
    
    # Save the current date and time to image_timestamp.txt
    with open('./data/image_timestamp.txt', 'w') as timestamp_file:
        timestamp_file.write(f'Prediction timestamp: {datetime.now()}')
    return

#run_prediction()