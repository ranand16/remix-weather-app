import 'dotenv/config'
import axios from "axios";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const API_ENDPOINT = 'https://api.weatherapi.com/v1';
const DAYS_FORECAST = 7;

export async function getWeather(city) {
    const API_ROUTE = "/forecast.json"; // endpoint for weather search
    let url = `${API_ENDPOINT}${API_ROUTE}`;

    try {
        const response = await axios.get(url, {
            params: {
                key: WEATHER_API_KEY,
                q: city,
                days: DAYS_FORECAST,
                aqi: 'yes'
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
}