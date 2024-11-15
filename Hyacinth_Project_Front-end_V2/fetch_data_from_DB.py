import pyodbc
import pandas as pd

def data_for_plot_one():
    # Establish database connection
    conn = pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=NOSIPHO;'
        'DATABASE=Hyacinth_Hartbeespoort_Dam_Database;'
        'Trusted_Connection=yes;'
    )

    # Define the SQL query to join tables and aggregate data by month
    query = """
    SELECT 
        MONTH(dbo.Weather.image_date) AS month,
        SUM(dbo.Weather.Average_Temperature_C) AS sum_avg_temperature,
        SUM(dbo.Hyacinth.Hyacinth_Percentage) AS sum_hyacinth_percentage
    FROM 
        dbo.Weather
    INNER JOIN 
        dbo.Hyacinth ON dbo.Weather.image_date = dbo.Hyacinth.image_date
    GROUP BY 
        MONTH(dbo.Weather.image_date)
    ORDER BY 
        month;
    """

    # Execute the query and fetch data into a DataFrame
    df = pd.read_sql_query(query, conn)
    conn.close()

    # Convert DataFrame to a dictionary
    data = df.to_dict(orient='records')
    return data


def data_for_plot_two():
    # Establish database connection
    conn = pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=NOSIPHO;'
        'DATABASE=Hyacinth_Hartbeespoort_Dam_Database;'
        'Trusted_Connection=yes;'
    )

    # Define the SQL query to join tables and aggregate data by year
    query = """
    SELECT 
        YEAR(dbo.Weather.image_date) AS year,
        SUM(dbo.Weather.Average_Wind_Gusts_kmh) AS sum_avg_wind_gust,
        SUM(dbo.Weather.Average_Wind_Speed_kmh) AS sum_avg_wind_speed,
        SUM(dbo.Hyacinth.Hyacinth_Percentage) AS sum_hyacinth_percentage
    FROM 
        dbo.Weather
    INNER JOIN 
        dbo.Hyacinth ON dbo.Weather.image_date = dbo.Hyacinth.image_date
    GROUP BY 
        YEAR(dbo.Weather.image_date)
    ORDER BY 
        year;
    """

    # Execute the query and fetch data into a DataFrame
    df = pd.read_sql_query(query, conn)
    conn.close()

    # Convert DataFrame to a dictionary
    data = df.to_dict(orient='records')
    return data



def data_for_plot_three():
    # Establish database connection
    conn = pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=NOSIPHO;'
        'DATABASE=Hyacinth_Hartbeespoort_Dam_Database;'
        'Trusted_Connection=yes;'
    )

    # Define the SQL query to join tables and aggregate data by year
    query = """
    SELECT 
    YEAR(image_date) AS year,
    SUM(Hyacinth_percentage) AS total_hyacinth_percentage,
    ROUND((SUM(Hyacinth_percentage) / 
          (SELECT SUM(Hyacinth_percentage)
           FROM Hyacinth
           WHERE YEAR(image_date) IN (2020, 2021, 2022, 2023)
          ) * 100), 2) AS percentage_of_total
    FROM 
        Hyacinth
    WHERE 
        YEAR(image_date) IN (2020, 2021, 2022, 2023)
    GROUP BY 
        YEAR(image_date);
    """

    # Execute the query and fetch data into a DataFrame
    df = pd.read_sql_query(query, conn)
    conn.close()

    # Convert DataFrame to a dictionary
    data = df.to_dict(orient='records')
    return data

