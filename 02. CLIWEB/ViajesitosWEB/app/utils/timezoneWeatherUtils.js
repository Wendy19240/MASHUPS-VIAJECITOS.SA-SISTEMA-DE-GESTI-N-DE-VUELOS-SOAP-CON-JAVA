// utils/timezoneWeatherUtils.js

// Tu Google Maps API Key (la misma que usas para los mapas)
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

// API Key para el clima (necesitarás obtener una de OpenWeatherMap)
const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;// Reemplaza con tu API key

/**
 * Obtener zona horaria usando Google Time Zone API
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Información de zona horaria
 */
export const getTimezone = async (latitude, longitude, targetDate = null) => {
  try {
    // Si hay fecha objetivo, usamos su timestamp. Si no, usamos actual
    const timestamp = targetDate 
      ? Math.floor(new Date(targetDate).getTime() / 1000) 
      : Math.floor(Date.now() / 1000);

    const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      // Calcular la hora local en base a targetDate si existe
      const baseDate = targetDate ? new Date(targetDate) : new Date();
      const utcTime = baseDate.getTime() + (baseDate.getTimezoneOffset() * 60000);
      const localTime = new Date(utcTime + (data.rawOffset * 1000) + (data.dstOffset * 1000));
      
      return {
        timeZoneId: data.timeZoneId,
        timeZoneName: data.timeZoneName,
        rawOffset: data.rawOffset,
        dstOffset: data.dstOffset,
        localTime,
        formattedTime: localTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
        formattedDate: localTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      };
    } else {
      console.error('Error obteniendo zona horaria:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Error en getTimezone:', error);
    return null;
  }
};

/**
 * Obtener clima actual usando OpenWeatherMap API
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Información del clima
 */
export const getWeather = async (latitude, longitude) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convertir a km
        clouds: data.clouds.all,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      };
    } else {
      console.error('Error obteniendo clima:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error en getWeather:', error);
    return null;
  }
};

/**
 * Obtener pronóstico del clima para las próximas horas
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Pronóstico del clima
 */
export const getWeatherForecast = async (latitude, longitude) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es&cnt=8`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      return data.list.map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        temperature: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`
      }));
    } else {
      console.error('Error obteniendo pronóstico:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error en getWeatherForecast:', error);
    return null;
  }
};

/**
 * Obtener información completa de ubicación (zona horaria + clima)
 * @param {Object} coordinates { latitude, longitude }
 * @param {string} cityName Nombre de la ciudad
 * @returns {Promise<Object>} Información completa
 */
export const getLocationInfo = async (coordinates, cityName, targetDate = null) => {
  if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
    console.error('Coordenadas inválidas:', coordinates);
    return null;
  }

  try {
    let weatherData;

    if (targetDate) {
      // 📌 Pronóstico para una fecha/hora específica
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
      const forecastRes = await fetch(forecastUrl);
      const forecastJson = await forecastRes.json();

      if (forecastRes.ok) {
        const targetTime = new Date(targetDate).getTime();
        let closest = forecastJson.list[0];
        let minDiff = Math.abs(closest.dt * 1000 - targetTime);

        forecastJson.list.forEach(item => {
          const diff = Math.abs(item.dt * 1000 - targetTime);
          if (diff < minDiff) {
            minDiff = diff;
            closest = item;
          }
        });

        weatherData = {
          temperature: Math.round(closest.main.temp),
          feelsLike: Math.round(closest.main.feels_like),
          humidity: closest.main.humidity,
          description: closest.weather[0].description,
          icon: closest.weather[0].icon,
          windSpeed: closest.wind.speed,
          pressure: closest.main.pressure,
          clouds: closest.clouds.all,
          iconUrl: `https://openweathermap.org/img/wn/${closest.weather[0].icon}@2x.png`
        };
      }
    } else {
      // 📌 Clima actual
      weatherData = await getWeather(coordinates.latitude, coordinates.longitude);
    }

    const timezone = await getTimezone(coordinates.latitude, coordinates.longitude);

    return {
      cityName,
      coordinates,
      timezone,
      weather: weatherData,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error obteniendo información de ubicación:', error);
    return null;
  }
};



// Función auxiliar para obtener el ícono del clima según la hora del día
export const getWeatherIconByTime = (iconCode, timezone) => {
  if (!iconCode || !timezone) return '☁️';
  
  const hour = new Date(timezone.localTime).getHours();
  const isNight = hour < 6 || hour > 20;
  
  const iconMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  
  return iconMap[iconCode] || '☁️';
};

// Función para formatear la diferencia horaria
export const getTimeDifference = (timezone1, timezone2) => {
  if (!timezone1 || !timezone2) return '';
  
  const offset1 = (timezone1.rawOffset + timezone1.dstOffset) / 3600;
  const offset2 = (timezone2.rawOffset + timezone2.dstOffset) / 3600;
  const difference = offset2 - offset1;
  
  if (difference === 0) {
    return 'Misma zona horaria';
  } else if (difference > 0) {
    return `+${difference}h adelante`;
  } else {
    return `${difference}h atrás`;
  }
};