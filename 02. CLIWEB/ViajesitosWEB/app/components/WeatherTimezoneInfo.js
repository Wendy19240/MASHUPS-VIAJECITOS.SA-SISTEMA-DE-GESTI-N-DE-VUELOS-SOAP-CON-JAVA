import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getLocationInfo, getTimeDifference } from '../utils/timezoneWeatherUtils';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function WeatherTimezoneInfo({ 
  originCoords, 
  destinationCoords, 
  originName, 
  destinationName, 
    departureDate = null,
  arrivalDate = null   // 📌 ya estaba
}) {
  const [originInfo, setOriginInfo] = useState(null);
  const [destinationInfo, setDestinationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLocationInfo();
  }, [originCoords, destinationCoords, departureDate, arrivalDate]);

 const fetchLocationInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const [originData, destinationData] = await Promise.all([
        getLocationInfo(originCoords, originName, departureDate), // clima en hora de salida
        getLocationInfo(destinationCoords, destinationName, arrivalDate) // clima en hora de llegada
      ]);

      setOriginInfo(originData);
      setDestinationInfo(destinationData);
    } catch (err) {
      console.error('Error fetching location info:', err);
      setError('No se pudo obtener la información del clima');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Cargando información del clima...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="weather-cloudy-alert" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  const timeDifference = getTimeDifference(originInfo?.timezone, destinationInfo?.timezone);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        <MaterialCommunityIcons name="weather-partly-cloudy" size={18} color="#1976D2" />
        {' '}Clima y Zona Horaria
      </Text>

      <View style={[styles.locationsContainer, isMobile && styles.locationsContainerMobile]}>
        {/* Información de Origen */}
        <View style={[styles.locationCard, isMobile && styles.locationCardMobile]}>
          <View style={[styles.locationHeader, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="airplane-takeoff" size={20} color="#27ae60" />
            <Text style={styles.locationTitle}>Origen</Text>
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.cityName}>{originName}</Text>

            {originInfo?.weather && (
              <View style={styles.weatherContainer}>
                <View style={styles.weatherMain}>
                  <Text style={styles.temperature}>{originInfo.weather.temperature}°C</Text>
                  <Image
                    source={{ uri: originInfo.weather.iconUrl }}
                    style={styles.weatherIcon}
                  />
                </View>
                <Text style={styles.weatherDescription}>{originInfo.weather.description}</Text>

                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetailItem}>
                    <MaterialCommunityIcons name="water-percent" size={16} color="#6c757d" />
                    <Text style={styles.weatherDetailText}>{originInfo.weather.humidity}%</Text>
                  </View>
                  <View style={styles.weatherDetailItem}>
                    <MaterialCommunityIcons name="weather-windy" size={16} color="#6c757d" />
                    <Text style={styles.weatherDetailText}>{originInfo.weather.windSpeed} m/s</Text>
                  </View>
                  <View style={styles.weatherDetailItem}>
                    <MaterialCommunityIcons name="thermometer" size={16} color="#6c757d" />
                    <Text style={styles.weatherDetailText}>ST: {originInfo.weather.feelsLike}°C</Text>
                  </View>
                </View>
              </View>
            )}

            {originInfo?.timezone && (
              <View style={styles.timezoneContainer}>
                <View style={styles.timeDisplay}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#1976D2" />
                  <Text style={styles.localTime}>{originInfo.timezone.formattedTime}</Text>
                </View>
                <Text style={styles.timezoneName}>{originInfo.timezone.timeZoneId}</Text>
                {!isMobile && (
                  <Text style={styles.timezoneDate}>{originInfo.timezone.formattedDate}</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Indicador de diferencia horaria */}
        {timeDifference && (
          <View style={styles.timeDifferenceContainer}>
            <MaterialCommunityIcons name="clock-fast" size={24} color="#FF6F00" />
            <Text style={styles.timeDifferenceText}>{timeDifference}</Text>
          </View>
        )}

        {/* Información de Destino */}
        <View style={[styles.locationCard, isMobile && styles.locationCardMobile]}>
          <View style={[styles.locationHeader, { backgroundColor: '#FFEBEE' }]}>
            <MaterialCommunityIcons name="airplane-landing" size={20} color="#e74c3c" />
            <Text style={styles.locationTitle}>Destino</Text>
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.cityName}>{destinationName}</Text>

            {destinationInfo?.weather && (
              <View style={styles.weatherContainer}>
                <View style={styles.weatherMain}>
                  <Text style={styles.temperature}>{destinationInfo.weather.temperature}°C</Text>
                  <Image
                    source={{ uri: destinationInfo.weather.iconUrl }}
                    style={styles.weatherIcon}
                  />
                </View>
                <Text style={styles.weatherDescription}>{destinationInfo.weather.description}</Text>

                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetailItem}>
                    <MaterialCommunityIcons name="water-percent" size={16} color="#6c757d" />
                    <Text style={styles.weatherDetailText}>{destinationInfo.weather.humidity}%</Text>
                  </View>
                  <View style={styles.weatherDetailItem}>
                    <MaterialCommunityIcons name="weather-windy" size={16} color="#6c757d" />
                    <Text style={styles.weatherDetailText}>{destinationInfo.weather.windSpeed} m/s</Text>
                  </View>
                  <View style={styles.weatherDetailItem}>
                    <MaterialCommunityIcons name="thermometer" size={16} color="#6c757d" />
                    <Text style={styles.weatherDetailText}>ST: {destinationInfo.weather.feelsLike}°C</Text>
                  </View>
                </View>
              </View>
            )}

            {destinationInfo?.timezone && (
              <View style={styles.timezoneContainer}>
                <View style={styles.timeDisplay}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#1976D2" />
                  <Text style={styles.localTime}>{destinationInfo.timezone.formattedTime}</Text>
                </View>
                <Text style={styles.timezoneName}>{destinationInfo.timezone.timeZoneId}</Text>
                {!isMobile && (
                  <Text style={styles.timezoneDate}>{destinationInfo.timezone.formattedDate}</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Nota sobre la actualización */}
      <Text style={styles.updateNote}>
        <MaterialCommunityIcons name="information-outline" size={12} color="#6c757d" />
        {' '}Información actualizada en tiempo real
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1976D2', marginBottom: 16, textAlign: 'center' },
  locationsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  locationsContainerMobile: { flexDirection: 'column' },
  locationCard: { flex: 1, backgroundColor: '#fafafa', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#e0e0e0' },
  locationCardMobile: { marginBottom: 12 },
  locationHeader: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 6 },
  locationTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  locationContent: { padding: 12 },
  cityName: { fontSize: 16, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
  weatherContainer: { marginBottom: 12 },
  weatherMain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  temperature: { fontSize: 28, fontWeight: 'bold', color: '#1976D2' },
  weatherIcon: { width: 50, height: 50 },
  weatherDescription: { fontSize: 14, color: '#6c757d', textTransform: 'capitalize', marginBottom: 8 },
  weatherDetails: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  weatherDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weatherDetailText: { fontSize: 12, color: '#6c757d' },
  timezoneContainer: { paddingTop: 8, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  timeDisplay: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  localTime: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  timezoneName: { fontSize: 12, color: '#6c757d', marginBottom: 2 },
  timezoneDate: { fontSize: 11, color: '#6c757d', fontStyle: 'italic' },
  timeDifferenceContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 10, minWidth: 100 },
  timeDifferenceText: { fontSize: 13, fontWeight: '600', color: '#FF6F00', marginTop: 4, textAlign: 'center' },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 10, fontSize: 14, color: '#6c757d' },
  errorContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  errorText: { marginTop: 10, fontSize: 14, color: '#e74c3c', textAlign: 'center' },
  updateNote: { fontSize: 11, color: '#6c757d', textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
});
