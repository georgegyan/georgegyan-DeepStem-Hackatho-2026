/**
 * @fileoverview Weather data service for FloodWatch Ghana.
 * Fetches real-time weather data from the Open-Meteo Forecast API (no API key required).
 */

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Fetches current weather conditions and a short-range precipitation forecast
 * for the given coordinates using the Open-Meteo API.
 *
 * @async
 * @param {number} lat - Latitude of the location (decimal degrees).
 * @param {number} lng - Longitude of the location (decimal degrees).
 * @returns {Promise<{currentRainfall: number, temperature: number, windSpeed: number, forecast: number[]}|null>}
 *   A weather object containing the current hour's readings and the next 6 hours of
 *   precipitation values, or `null` if the request fails (NFR-04: stale data fallback).
 *
 * @example
 * const weather = await fetchWeather(5.6037, -0.1870); // Accra, Ghana
 * if (weather) {
 *   console.log(weather.currentRainfall); // mm/hr for the current hour
 *   console.log(weather.forecast);        // [mm, mm, mm, mm, mm, mm] — next 6 hours
 * }
 */
export async function fetchWeather(lat, lng) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    hourly: "precipitation,temperature_2m,wind_speed_10m",
    forecast_days: "1",
    timezone: "auto",
  });

  const url = `${OPEN_METEO_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Open-Meteo API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    const { hourly } = data;
    if (!hourly) {
      throw new Error("Unexpected API response: missing 'hourly' field.");
    }

    const { precipitation, temperature_2m, wind_speed_10m, time } = hourly;

    // Determine the index for the current hour by matching ISO timestamp
    const now = new Date();
    const currentHourISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:00`;

    let currentIndex = time.findIndex((t) => t === currentHourISO);

    // Fallback: use the last available index if current hour isn't in range
    if (currentIndex === -1) {
      currentIndex = time.length - 1;
    }

    // Extract current hour's readings
    const currentRainfall = precipitation[currentIndex] ?? 0;
    const temperature = temperature_2m[currentIndex] ?? 0;
    const windSpeed = wind_speed_10m[currentIndex] ?? 0;

    // Next 6 hours of precipitation (exclude current hour, pad with 0 if near end)
    const forecastStart = currentIndex + 1;
    const forecast = Array.from({ length: 6 }, (_, i) => {
      const idx = forecastStart + i;
      return idx < precipitation.length ? (precipitation[idx] ?? 0) : 0;
    });

    return {
      currentRainfall,
      temperature,
      windSpeed,
      forecast,
    };
  } catch (error) {
    // NFR-04: Log the error; callers should display a stale-data label on null
    console.error("[weatherService] fetchWeather failed:", error);
    return null;
  }
}
