from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
from fetch_weather_data.latest_weather import fetch_weather_today
from predict import run_prediction
from fetch_data_from_DB import data_for_plot_one, data_for_plot_two, data_for_plot_three
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Endpoint to fetch today's weather data."""
    try:
        weather_data = fetch_weather_today()
        return jsonify(weather_data), 200  # Return the data as JSON with a 200 status code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict_route():
    try:
        
        run_prediction() 
        return jsonify({"success": True}), 200  
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/aggregated_data', methods=['GET'])
def get_data_for_plot1():
    """Endpoint to fetch aggregated weather and hyacinth data."""
    try:
        data = data_for_plot_one()
        return jsonify(data), 200  
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/wind_hyacinth_scatter', methods=['GET'])
def get_data_for_plot2():
    """Endpoint to fetch bubble 1 chart."""
    try:
        data = data_for_plot_two()
        return jsonify(data), 200  
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/api/hyacinth-pie', methods=['GET'])
def get_data_for_plot3():
    """Endpoint to fetch bubble 1 chart."""
    try:
        data = data_for_plot_three()
        return jsonify(data), 200  
    except Exception as e:
        return jsonify({"error": str(e)}), 500    
    
if __name__ == '__main__':
    app.run(debug=True)
