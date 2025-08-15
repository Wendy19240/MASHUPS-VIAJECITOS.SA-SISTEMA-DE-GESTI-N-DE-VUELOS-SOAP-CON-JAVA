import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Animated
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WeatherTimezoneInfo from './WeatherTimezoneInfo'; // IMPORTANTE: Asegúrate de que esta importación esté presente
import styles from '../styles/FlightMapModalStyles'; // Importar estilos externos

const { width, height } = Dimensions.get('window');

// Configuración de API Key - REEMPLAZA CON TU API KEY
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

// Definir breakpoints consistentes
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;
const isTinyScreen = width < 360;

export default function FlightMapModal({ visible, onClose, flightData }) {
  const [showMapFrame, setShowMapFrame] = useState(false);
  const [progressAnim] = useState(new Animated.Value(0));
  const [mapZoom, setMapZoom] = useState(4);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [simpleWeatherData, setSimpleWeatherData] = useState({
  origin: null,
  destination: null
});

  // Animar barra de progreso
  useEffect(() => {
    const animateProgress = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
          }),
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    if (visible) {
      animateProgress();
    }

    return () => {
      progressAnim.stopAnimation();
    };
  }, [visible, progressAnim]);

  // Obtener datos simples del clima con predicción
// Obtener datos simples del clima con predicción
useEffect(() => {
  const fetchSimpleWeather = async () => {
    if (visible && flightData?.originCoords && flightData?.destinationCoords) {
      try {
        const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
        
        // Intentar obtener clima actual primero
        const [currentOriginRes, currentDestRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${flightData.originCoords.latitude}&lon=${flightData.originCoords.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`),
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${flightData.destinationCoords.latitude}&lon=${flightData.destinationCoords.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`)
        ]);
        
        const currentOriginData = await currentOriginRes.json();
        const currentDestData = await currentDestRes.json();
        
        // Establecer clima actual como base
        if (currentOriginRes.ok && currentDestRes.ok) {
          setSimpleWeatherData({
            origin: {
              temp: Math.round(currentOriginData.main.temp),
              icon: currentOriginData.weather[0].icon,
              isPrediction: false
            },
            destination: {
              temp: Math.round(currentDestData.main.temp),
              icon: currentDestData.weather[0].icon,
              isPrediction: false
            }
          });
        }
        
        // Si hay fechas válidas, intentar obtener pronóstico
        if (flightData.horaSalida && flightData.horaLlegada) {
          try {
            const departureDate = new Date(flightData.horaSalida);
            const arrivalDate = new Date(flightData.horaLlegada);
            const now = new Date();
            
            // Solo buscar pronóstico si las fechas son futuras y dentro de 5 días
            const daysDiffDeparture = (departureDate - now) / (1000 * 60 * 60 * 24);
            const daysDiffArrival = (arrivalDate - now) / (1000 * 60 * 60 * 24);
            
            if (daysDiffDeparture > 0 && daysDiffDeparture <= 5) {
              const forecastRes = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${flightData.originCoords.latitude}&lon=${flightData.originCoords.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
              );
              
              if (forecastRes.ok) {
                const forecastData = await forecastRes.json();
                const departureTime = departureDate.getTime();
                
                // Buscar pronóstico más cercano
                let closestForecast = forecastData.list.reduce((prev, curr) => {
                  const prevDiff = Math.abs(prev.dt * 1000 - departureTime);
                  const currDiff = Math.abs(curr.dt * 1000 - departureTime);
                  return currDiff < prevDiff ? curr : prev;
                });
                
                setSimpleWeatherData(prev => ({
                  ...prev,
                  origin: {
                    temp: Math.round(closestForecast.main.temp),
                    icon: closestForecast.weather[0].icon,
                    isPrediction: true
                  }
                }));
              }
            }
            
            if (daysDiffArrival > 0 && daysDiffArrival <= 5) {
              const forecastRes = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${flightData.destinationCoords.latitude}&lon=${flightData.destinationCoords.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
              );
              
              if (forecastRes.ok) {
                const forecastData = await forecastRes.json();
                const arrivalTime = arrivalDate.getTime();
                
                // Buscar pronóstico más cercano
                let closestForecast = forecastData.list.reduce((prev, curr) => {
                  const prevDiff = Math.abs(prev.dt * 1000 - arrivalTime);
                  const currDiff = Math.abs(curr.dt * 1000 - arrivalTime);
                  return currDiff < prevDiff ? curr : prev;
                });
                
                setSimpleWeatherData(prev => ({
                  ...prev,
                  destination: {
                    temp: Math.round(closestForecast.main.temp),
                    icon: closestForecast.weather[0].icon,
                    isPrediction: true
                  }
                }));
              }
            }
          } catch (dateError) {
            console.log('Error procesando fechas, usando clima actual');
          }
        }
      } catch (error) {
        console.error('Error obteniendo clima:', error);
      }
    }
  };

  fetchSimpleWeather();
}, [visible, flightData]);
  const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) return 0;
    const R = 6371;
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const getTotalDistance = () => {
    if (!flightData || !flightData.originCoords || !flightData.destinationCoords) return 0;
    
    let totalDistance = 0;
    const points = [
      flightData.originCoords,
      ...(flightData.stops || []).map(stop => stop.coords).filter(Boolean),
      flightData.destinationCoords
    ];
    
    for (let i = 0; i < points.length - 1; i++) {
      if (points[i] && points[i+1]) {
        totalDistance += calculateDistance(points[i], points[i + 1]);
      }
    }
    
    return totalDistance;
  };

  const handleZoomIn = () => {
    if (mapZoom < 10) {
      setMapZoom(mapZoom + 1);
      setMapRefreshKey(prev => prev + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapZoom > 1) {
      setMapZoom(mapZoom - 1);
      setMapRefreshKey(prev => prev + 1);
    }
  };

  const getGoogleStaticMapUrl = () => {
    if (!flightData || !flightData.originCoords || !flightData.destinationCoords) {
      console.error('🗺️ Datos de vuelo incompletos:', flightData);
      return '';
    }
    
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'TU_API_KEY_AQUI') {
      console.warn('⚠️ Google Maps API Key no configurada');
      return '';
    }
    
    const origin = `${flightData.originCoords.latitude},${flightData.originCoords.longitude}`;
    const destination = `${flightData.destinationCoords.latitude},${flightData.destinationCoords.longitude}`;
    
    let validStops = [];
    if (flightData.stops && flightData.stops.length > 0) {
      validStops = flightData.stops
        .filter(stop => {
          const isValid = stop && stop.coords && 
                         typeof stop.coords.latitude === 'number' && 
                         typeof stop.coords.longitude === 'number' &&
                         !isNaN(stop.coords.latitude) && 
                         !isNaN(stop.coords.longitude) &&
                         Math.abs(stop.coords.latitude) <= 90 &&
                         Math.abs(stop.coords.longitude) <= 180;
          return isValid;
        })
        .sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
    
    const size = isMobile ? '600x400' : isTablet ? '800x500' : '1000x600';
    
    let url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&zoom=${mapZoom}`;
    
    let currentPoint = origin;
    
    if (validStops.length > 0) {
      const firstStop = `${validStops[0].coords.latitude},${validStops[0].coords.longitude}`;
      url += `&path=color:0x0066CC|weight:4|geodesic:true|${currentPoint}|${firstStop}`;
      currentPoint = firstStop;
      
      for (let i = 1; i < validStops.length; i++) {
        const nextStop = `${validStops[i].coords.latitude},${validStops[i].coords.longitude}`;
        url += `&path=color:0x0066CC|weight:4|geodesic:true|${currentPoint}|${nextStop}`;
        currentPoint = nextStop;
      }
      
      url += `&path=color:0x0066CC|weight:4|geodesic:true|${currentPoint}|${destination}`;
    } else {
      url += `&path=color:0x0066CC|weight:4|geodesic:true|${origin}|${destination}`;
    }
    
    const originLabel = encodeURIComponent(flightData.ciudadOrigen || 'Origen');
    url += `&markers=color:green|label:A|${origin}`;
    
    validStops.forEach((stop, index) => {
      const label = (index + 1).toString();
      url += `&markers=color:orange|label:${label}|${stop.coords.latitude},${stop.coords.longitude}`;
    });
    
    const destinationLabel = encodeURIComponent(flightData.ciudadDestino || 'Destino');
    url += `&markers=color:red|label:B|${destination}`;
    
    url += `&maptype=terrain`;
    url += `&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (url.length > 8192) {
      console.warn('⚠️ URL demasiado larga, simplificando...');
      return getSimplifiedMapUrl();
    }
    
    return url;
  };

  const getSimplifiedMapUrl = () => {
    if (!flightData || !flightData.originCoords || !flightData.destinationCoords) {
      return '';
    }
    
    const origin = `${flightData.originCoords.latitude},${flightData.originCoords.longitude}`;
    const destination = `${flightData.destinationCoords.latitude},${flightData.destinationCoords.longitude}`;
    const size = isMobile ? '600x400' : isTablet ? '800x500' : '1000x600';
    
    let url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&zoom=${mapZoom}`;
    
    if (flightData.stops && flightData.stops.length > 0) {
      const keyStops = [];
      if (flightData.stops[0]) keyStops.push(flightData.stops[0]);
      if (flightData.stops.length > 2) {
        const middleIndex = Math.floor(flightData.stops.length / 2);
        keyStops.push(flightData.stops[middleIndex]);
      }
      if (flightData.stops.length > 1) {
        keyStops.push(flightData.stops[flightData.stops.length - 1]);
      }
      
      let pathPoints = [origin];
      keyStops.forEach(stop => {
        if (stop.coords) {
          pathPoints.push(`${stop.coords.latitude},${stop.coords.longitude}`);
        }
      });
      pathPoints.push(destination);
      
      url += `&path=color:0x0066CC|weight:4|geodesic:true|${pathPoints.join('|')}`;
    } else {
      url += `&path=color:0x0066CC|weight:4|geodesic:true|${origin}|${destination}`;
    }
    
    url += `&markers=color:green|label:A|${origin}`;
    url += `&markers=color:red|label:B|${destination}`;
    url += `&maptype=terrain&key=${GOOGLE_MAPS_API_KEY}`;
    
    return url;
  };

  const renderMapAlternative = () => {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'TU_API_KEY_AQUI') {
      return (
        <View style={styles.mapAlternative}>
          <MaterialCommunityIcons name="map-outline" size={64} color="#6c757d" />
          <Text style={styles.mapAlternativeTitle}>Mapa no disponible</Text>
          <Text style={styles.mapAlternativeText}>
            Para ver el mapa, necesitas configurar tu Google Maps API Key en el código
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.mapWrapper}>
        <Image
          key={mapRefreshKey}
          source={{ uri: getGoogleStaticMapUrl() }}
          style={styles.staticMap}
          resizeMode="cover"
          onError={(error) => {
            console.error('❌ Error cargando mapa estático:', error);
          }}
          onLoad={() => {
            console.log('✅ Mapa estático cargado correctamente');
          }}
        />
        
        <View style={styles.zoomControls}>
          <TouchableOpacity 
            style={[styles.zoomButton, mapZoom >= 10 && styles.zoomButtonDisabled]} 
            onPress={handleZoomIn}
            disabled={mapZoom >= 10}
          >
            <MaterialCommunityIcons name="plus" size={24} color={mapZoom >= 10 ? "#ccc" : "#333"} />
          </TouchableOpacity>
          <View style={styles.zoomLevel}>
            <Text style={styles.zoomLevelText}>{mapZoom}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.zoomButton, mapZoom <= 1 && styles.zoomButtonDisabled]} 
            onPress={handleZoomOut}
            disabled={mapZoom <= 1}
          >
            <MaterialCommunityIcons name="minus" size={24} color={mapZoom <= 1 ? "#ccc" : "#333"} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.mapInfoOverlay}>
          <View style={styles.routeSummary}>
            <MaterialCommunityIcons name="airplane-takeoff" size={16} color="#27ae60" />
            <Text style={styles.routeSummaryText}>{flightData.ciudadOrigen}</Text>
            {flightData.stops && flightData.stops.length > 0 && (
              <>
                <MaterialCommunityIcons name="chevron-right" size={16} color="#666" />
                <Text style={styles.routeSummaryText}>{flightData.stops.length} escalas</Text>
              </>
            )}
            <MaterialCommunityIcons name="chevron-right" size={16} color="#666" />
            <MaterialCommunityIcons name="airplane-landing" size={16} color="#e74c3c" />
            <Text style={styles.routeSummaryText}>{flightData.ciudadDestino}</Text>
          </View>
        </View>
        
        {flightData.stops && flightData.stops.length > 0 && (
          <View style={styles.stopsOverlay}>
            <Text style={styles.stopsOverlayTitle}>Escalas:</Text>
            {flightData.stops.map((stop, index) => (
              <Text key={index} style={styles.stopOverlayItem}>
                {index + 1}. {stop.nombre}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getFlightSpecs = () => {
    const distance = getTotalDistance();
    const cruiseSpeed = 850;
    const cruiseAltitude = 11000;
    const fuelConsumption = Math.round(distance * 3.5);
    
    return {
      cruiseSpeed,
      cruiseAltitude,
      fuelConsumption,
      aircraftType: 'Boeing 737-800',
      maxSpeed: 945,
      wingspan: '35.8m',
      length: '39.5m',
      capacity: '189 pasajeros',
      range: '5,765 km'
    };
  };

  const specs = getFlightSpecs();

  // Función para renderizar visualización vertical móvil
  const renderMobileRouteVisualization = () => {
    const stops = flightData?.stops || [];
    
    return (
      <View style={styles.mobileRouteContainer}>
        {/* Header del vuelo */}
        <View style={styles.mobileFlightHeader}>
          <View style={styles.flightCodeBadge}>
            <MaterialCommunityIcons name="airplane" size={14} color="#fff" />
            <Text style={styles.mobileFlightCode}>{flightData.codigoVuelo}</Text>
          </View>
          <Text style={styles.mobileAircraftType}>{specs.aircraftType}</Text>
        </View>

        {/* Resumen de ruta */}
        <View style={[
          styles.mobileSummaryCard,
          stops.length > 0 ? styles.routeWithStops : styles.directRoute
        ]}>
          <Text style={styles.mobileSummaryTitle}>
            {stops.length > 0 ? '✈️ Vuelo con escalas' : '✈️ Vuelo directo'}
          </Text>
        </View>

        {/* Lista vertical de puntos */}
        <View style={styles.mobileRouteList}>
          {/* Origen */}
          <View style={styles.mobileRouteItem}>
            <View style={styles.mobileRouteLineContainer}>
              <View style={[styles.mobileRouteDot, styles.originDot]}>
                <MaterialCommunityIcons name="airplane-takeoff" size={16} color="#27ae60" />
              </View>
              <View style={styles.mobileRouteLine} />
            </View>
            <View style={styles.mobileRouteInfo}>
              <Text style={styles.mobileLocationName}>{flightData.ciudadOrigen}</Text>
              <Text style={styles.mobileLocationType}>Origen</Text>
            </View>
          </View>

          {/* Escalas */}
          {stops.map((stop, index) => (
            <View key={index} style={styles.mobileRouteItem}>
              <View style={styles.mobileRouteLineContainer}>
                <View style={styles.mobileRouteLine} />
                <View style={styles.mobileStopDot}>
                  <Text style={styles.mobileStopNumber}>{index + 1}</Text>
                </View>
                <View style={styles.mobileRouteLine} />
              </View>
              <View style={styles.mobileRouteInfo}>
                <Text style={styles.mobileLocationName}>{stop.nombre}</Text>
                <Text style={styles.mobileLocationType}>Escala {index + 1}</Text>
              </View>
            </View>
          ))}

          {/* Destino */}
          <View style={styles.mobileRouteItem}>
            <View style={styles.mobileRouteLineContainer}>
              <View style={styles.mobileRouteLine} />
              <View style={[styles.mobileRouteDot, styles.destinationDot]}>
                <MaterialCommunityIcons name="airplane-landing" size={16} color="#e74c3c" />
              </View>
            </View>
            <View style={styles.mobileRouteInfo}>
              <Text style={styles.mobileLocationName}>{flightData.ciudadDestino}</Text>
              <Text style={styles.mobileLocationType}>Destino</Text>
            </View>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.mobileStats}>
          <View style={styles.mobileStatRow}>
            <View style={styles.mobileStatItem}>
              <MaterialCommunityIcons name="map-marker-distance" size={14} color="#1976D2" />
              <Text style={styles.mobileStatValue}>{getTotalDistance()} km</Text>
              <Text style={styles.mobileStatLabel}>Distancia</Text>
            </View>
            <View style={styles.mobileStatItem}>
              <MaterialCommunityIcons name="transit-connection-variant" size={14} color="#FF6F00" />
              <Text style={styles.mobileStatValue}>{stops.length}</Text>
              <Text style={styles.mobileStatLabel}>Escalas</Text>
            </View>
          </View>
          <View style={styles.mobileStatRow}>
            <View style={styles.mobileStatItem}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#00897B" />
              <Text style={styles.mobileStatValue}>{flightData.duracion || 'N/A'}</Text>
              <Text style={styles.mobileStatLabel}>Duración</Text>
            </View>
            <View style={styles.mobileStatItem}>
              <MaterialCommunityIcons name="speedometer" size={14} color="#5E35B1" />
              <Text style={styles.mobileStatValue}>{specs.cruiseSpeed} km/h</Text>
              <Text style={styles.mobileStatLabel}>Crucero</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Función principal de visualización de ruta (mejorada)
  const renderRouteVisualization = () => {
    const stops = flightData?.stops || [];
    const totalStops = stops.length;
    
    // Debug para verificar condiciones
    console.log('🔍 Debug vista móvil:', { isMobile, totalStops, width });
    
    // CAMBIO IMPORTANTE: Usar vista vertical en móviles cuando hay 2 o más escalas
    if (isMobile) {
      console.log('📱 Mostrando vista vertical móvil');
      return renderMobileRouteVisualization();
    }

    // Calcular ancho dinámico basado en número de escalas
    const baseWidth = isMobile ? 300 : 500;
    const stopWidth = isMobile ? 100 : 150;
    const dynamicWidth = baseWidth + (totalStops * stopWidth);

    return (
      <View style={styles.routeContainer}>
        {/* Información del vuelo */}
        <View style={styles.flightInfoHeader}>
          <View style={styles.flightCodeBadge}>
            <MaterialCommunityIcons name="airplane" size={16} color="#fff" />
            <Text style={styles.flightCodeText}>{flightData.codigoVuelo}</Text>
          </View>
          {!isMobile && (
            <View style={styles.aircraftInfo}>
              <Text style={styles.aircraftType}>{specs.aircraftType}</Text>
              <Text style={styles.aircraftSubtext}>Aeronave asignada</Text>
            </View>
          )}
        </View>

        {/* Info de ruta resumida */}
        <View style={[
          styles.routeSummaryCard,
          stops.length > 0 ? styles.routeWithStops : styles.directRoute
        ]}>
          <Text style={styles.routeSummaryTitle}>
            {stops.length > 0 ? '✈️ Vuelo con escalas' : '✈️ Vuelo directo'}
          </Text>
          <Text style={styles.routeSummaryDetail} numberOfLines={2}>
            {flightData.ciudadOrigen} → {stops.length > 0 && stops.map(s => s.nombre).join(' → ') + ' → '}{flightData.ciudadDestino}
          </Text>
        </View>

        {/* Contenedor con scroll horizontal si es necesario */}
        <ScrollView 
          horizontal={dynamicWidth > width}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContentContainer,
            dynamicWidth > width && { width: dynamicWidth }
          ]}
          style={styles.routeScrollView}
        >

          <View style={[
            styles.routeVisualizationContainer,
            totalStops > 1 && { width: dynamicWidth }
          ]}>
            {/* Origen */}
            <View style={styles.routeEndpoint}>
              <View style={[styles.airportIcon, styles.originIcon]}>
                <MaterialCommunityIcons 
                  name="airplane-takeoff" 
                  size={isMobile ? 20 : 24} 
                  color="#27ae60" 
                />
              </View>
              <Text style={styles.cityLabel} numberOfLines={2}>
                {flightData.ciudadOrigen}
              </Text>
              <Text style={styles.cityType}>Origen</Text>
            </View>

            {/* Línea de conexión con escalas */}
            <View style={[
              styles.connectionLineContainer,
              { width: dynamicWidth - (isMobile ? 140 : 180) }
            ]}>
              <View style={styles.connectionLine} />
              
              {/* Línea de progreso animada */}
              <Animated.View 
                style={[
                  styles.progressLine,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]} 
              />
              
              {/* Avión animado */}
              <Animated.View 
                style={[
                  styles.animatedPlane,
                  {
                    left: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '95%']
                    })
                  }
                ]}
              >
                <MaterialCommunityIcons 
                  name="airplane" 
                  size={isMobile ? 16 : 20} 
                  color="#1976D2" 
                />
              </Animated.View>

              {/* Escalas distribuidas uniformemente */}
              {stops.map((stop, index) => {
                const position = ((index + 1) / (totalStops + 1)) * 100;
                return (
                  <View 
                    key={index} 
                    style={[
                      styles.stopMarker,
                      { 
                        left: `${position}%`,
                        transform: [{ translateX: -40 }]
                      }
                    ]}
                  >
                    <View style={styles.stopDot}>
                      <Text style={styles.stopNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.stopInfo}>
                      <Text style={styles.stopName} numberOfLines={2}>
                        {stop.nombre}
                      </Text>
                      <Text style={styles.stopLabel}>Escala {index + 1}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Destino */}
            <View style={styles.routeEndpoint}>
              <View style={[styles.airportIcon, styles.destinationIcon]}>
                <MaterialCommunityIcons 
                  name="airplane-landing" 
                  size={isMobile ? 20 : 24} 
                  color="#e74c3c" 
                />
              </View>
              <Text style={styles.cityLabel} numberOfLines={2}>
                {flightData.ciudadDestino}
              </Text>
              <Text style={styles.cityType}>Destino</Text>
            </View>
          </View>
        </ScrollView>

        {/* Indicador de scroll si hay muchas escalas */}
        {totalStops > 1 && !isMobile && (
          <View style={styles.scrollIndicator}>
            <MaterialCommunityIcons name="gesture-swipe-horizontal" size={20} color="#666" />
            <Text style={styles.scrollIndicatorText}>Desliza para ver más</Text>
          </View>
        )}

        {/* Información adicional de la ruta */}
        <View style={styles.routeStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="map-marker-distance" size={16} color="#1976D2" />
            <Text style={styles.statValue}>{getTotalDistance()} km</Text>
            <Text style={styles.statLabel}>Distancia</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="transit-connection-variant" size={16} color="#FF6F00" />
            <Text style={styles.statValue}>{stops.length}</Text>
            <Text style={styles.statLabel}>Escalas</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#00897B" />
            <Text style={styles.statValue}>{flightData.duracion || 'N/A'}</Text>
            <Text style={styles.statLabel}>Duración</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="speedometer" size={16} color="#5E35B1" />
            <Text style={styles.statValue}>{specs.cruiseSpeed} km/h</Text>
            <Text style={styles.statLabel}>Crucero</Text>
          </View>
        </View>
      </View>
    );
  };

  if (!flightData) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <MaterialCommunityIcons name="routes" size={isMobile ? 20 : 24} color="#1976D2" />
              <Text style={styles.headerTitle}>
                Información del Vuelo
              </Text>
            </View>
            <Text style={styles.headerSubtitle}>
              {flightData.codigoVuelo} • {flightData.origen} → {flightData.destino}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close-circle" size={isMobile ? 22 : 24} color="#1976D2" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Visualización de la ruta */}
          <View style={[styles.mapContainer, isMobile && styles.mapContainerMobile]}>
            {renderRouteVisualization()}

            {/* Especificaciones del vuelo */}
            <View style={styles.specsContainer}>
              <Text style={styles.specsTitle}>
                <MaterialCommunityIcons name="airplane-cog" size={16} color="#1976D2" />
                {' '}Especificaciones del Vuelo
              </Text>
              <View style={[
                styles.specsGrid,
                !isMobile && styles.specsGridDesktop
              ]}>
                <View style={[styles.specCard, !isMobile && styles.specCardDesktop]}>
                  <MaterialCommunityIcons name="speedometer" size={20} color="#FF6F00" />
                  <Text style={styles.specLabel}>Velocidad Crucero</Text>
                  <Text style={styles.specValue}>
                    {specs.cruiseSpeed} km/h
                  </Text>
                  <Text style={styles.specSubtext}>
                    Rendimiento
                  </Text>
                </View>

                <View style={[styles.specCard, !isMobile && styles.specCardDesktop]}>
                  <MaterialCommunityIcons name="speedometer-medium" size={20} color="#D32F2F" />
                  <Text style={styles.specLabel}>Velocidad Máxima</Text>
                  <Text style={styles.specValue}>
                    {specs.maxSpeed} km/h
                  </Text>
                  <Text style={styles.specSubtext}>
                    Rendimiento
                  </Text>
                </View>

                <View style={[styles.specCard, !isMobile && styles.specCardDesktop]}>
                  <MaterialCommunityIcons name="airplane-marker" size={20} color="#00897B" />
                  <Text style={styles.specLabel}>Altitud Crucero</Text>
                  <Text style={styles.specValue}>
                    {specs.cruiseAltitude.toLocaleString()} m
                  </Text>
                  <Text style={styles.specSubtext}>
                    Operación
                  </Text>
                </View>

                <View style={[styles.specCard, !isMobile && styles.specCardDesktop]}>
                  <MaterialCommunityIcons name="fuel" size={20} color="#5E35B1" />
                  <Text style={styles.specLabel}>Combustible Est.</Text>
                  <Text style={styles.specValue}>
                    {specs.fuelConsumption.toLocaleString()} L
                  </Text>
                  <Text style={styles.specSubtext}>
                    Operación
                  </Text>
                </View>

                {!isMobile && (
                  <>
                    <View style={[styles.specCard, styles.specCardDesktop]}>
                      <MaterialCommunityIcons name="seat-passenger" size={20} color="#1976D2" />
                      <Text style={styles.specLabel}>Capacidad</Text>
                      <Text style={styles.specValue}>{specs.capacity}</Text>
                      <Text style={styles.specSubtext}>Aeronave</Text>
                    </View>

                    <View style={[styles.specCard, styles.specCardDesktop]}>
                      <MaterialCommunityIcons name="map-marker-radius" size={20} color="#009688" />
                      <Text style={styles.specLabel}>Alcance</Text>
                      <Text style={styles.specValue}>{specs.range}</Text>
                      <Text style={styles.specSubtext}>Aeronave</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* IMPORTANTE: Información de Clima y Zona Horaria */}
            <WeatherTimezoneInfo 
              originCoords={flightData.originCoords}
              destinationCoords={flightData.destinationCoords}
              originName={flightData.ciudadOrigen}
              destinationName={flightData.ciudadDestino}
              departureDate={flightData.horaSalida}   // 📌 NUEVO
              arrivalDate={flightData.horaLlegada} //
            />

            {/* Mapa */}
            {showMapFrame && (
              <View style={styles.mapPreview}>
                <Text style={styles.mapTitle}>
                  <MaterialCommunityIcons name="map" size={16} color="#1976D2" />
                  {' '}Vista del Mapa Satelital
                </Text>
                {renderMapAlternative()}
              </View>
            )}

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.toggleMapButton,
                  isMobile && styles.toggleMapButtonMobile
                ]}
                onPress={() => setShowMapFrame(!showMapFrame)}
              >
                <MaterialCommunityIcons 
                  name={showMapFrame ? "eye-off" : "map-search"} 
                  size={16} 
                  color="#fff" 
                />
                <Text style={styles.toggleMapButtonText}>
                  {showMapFrame ? 'Ocultar Mapa' : 'Ver Mapa'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Información detallada del vuelo */}
          <View style={[styles.infoContainer, isMobile && styles.infoContainerMobile]}>
            <Text style={styles.sectionTitle}>
              <MaterialCommunityIcons name="information" size={16} color="#1976D2" />
              {' '}Detalles del Vuelo
            </Text>
                        
            <View style={[
              styles.infoGrid,
              !isMobile && styles.infoGridDesktop
            ]}>
              <View style={[styles.infoCard, !isMobile && styles.infoCardDesktop]}>
                <MaterialCommunityIcons name="airplane-takeoff" size={20} color="#27ae60" />
                <Text style={styles.infoLabel}>Salida</Text>
                <Text style={styles.infoValue}>
                  {flightData.horaSalida || 'N/A'}
                </Text>
                <Text style={styles.infoSubtext}>
                  {flightData.ciudadOrigen}
                </Text>
              </View>

              <View style={[styles.infoCard, !isMobile && styles.infoCardDesktop]}>
                <MaterialCommunityIcons name="airplane-landing" size={20} color="#e74c3c" />
                <Text style={styles.infoLabel}>Llegada</Text>
                <Text style={styles.infoValue}>
                  {flightData.horaLlegada || 'N/A'}
                </Text>
                <Text style={styles.infoSubtext}>
                  {flightData.ciudadDestino}
                </Text>
              </View>

              <View style={[styles.infoCard, !isMobile && styles.infoCardDesktop]}>
                <MaterialCommunityIcons name="map-marker-distance" size={20} color="#FF6F00" />
                <Text style={styles.infoLabel}>Distancia</Text>
                <Text style={styles.infoValue}>
                  {getTotalDistance()} km
                </Text>
                <Text style={styles.infoSubtext}>
                  Ruta geodésica
                </Text>
              </View>

              <View style={[styles.infoCard, !isMobile && styles.infoCardDesktop]}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#00897B" />
                <Text style={styles.infoLabel}>Duración</Text>
                <Text style={styles.infoValue}>
                  {flightData.duracion || 'N/A'}
                </Text>
                <Text style={styles.infoSubtext}>
                  Incluye escalas
                </Text>
              </View>
            </View>

             {/* Tarjetas de clima */}
            {simpleWeatherData.origin && (
              <View style={[styles.infoCard, !isMobile && styles.infoCardDesktop]}>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${simpleWeatherData.origin.icon}@2x.png` }}
                  style={{ width: 36, height: 36, marginBottom: -4 }}
                />
                <Text style={styles.infoLabel}>Clima Salida</Text>
                <Text style={styles.infoValue}>
                  {simpleWeatherData.origin.temp}°C
                </Text>
                <Text style={styles.infoSubtext}>
                  {simpleWeatherData.origin.date}
                </Text>
              </View>
            )}

            {simpleWeatherData.destination && (
              <View style={[styles.infoCard, !isMobile && styles.infoCardDesktop]}>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${simpleWeatherData.destination.icon}@2x.png` }}
                  style={{ width: 36, height: 36, marginBottom: -4 }}
                />
                <Text style={styles.infoLabel}>Clima Llegada</Text>
                <Text style={styles.infoValue}>
                  {simpleWeatherData.destination.temp}°C
                </Text>
                <Text style={styles.infoSubtext}>
                  {simpleWeatherData.destination.date}
                </Text>
              </View>
            )}

            {/* Información de escalas */}
            {flightData.stops && flightData.stops.length > 0 && (
              <View style={styles.stopsInfo}>
                <Text style={styles.stopsTitle}>
                  <MaterialCommunityIcons name="transit-connection-variant" size={18} color="#FF6F00" />
                  {' '}Escalas del Vuelo ({flightData.stops.length})
                </Text>
                <View style={[
                  styles.stopsGrid,
                  !isMobile && styles.stopsGridDesktop
                ]}>
                  {flightData.stops.map((stop, index) => (
                    <View key={index} style={[
                      styles.stopItem,
                      !isMobile && styles.stopItemDesktop
                    ]}>
                      <View style={styles.stopNumber}>
                        <Text style={styles.stopNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.stopDetails}>
                        <Text style={styles.stopItemText}>
                          {stop.nombre}
                        </Text>
                        {stop.codigo && (
                          <Text style={styles.stopCode}>
                            Código: {stop.codigo}
                          </Text>
                        )}
                        {!isMobile && (
                          <Text style={styles.stopDuration}>
                            <MaterialCommunityIcons name="clock" size={10} color="#6c757d" />
                            {' '}Tiempo estimado: 1h 30min
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Información adicional de la aeronave */}
            {!isMobile && (
              <View style={styles.aircraftDetails}>
                <Text style={styles.aircraftDetailsTitle}>
                  <MaterialCommunityIcons name="airplane" size={16} color="#1976D2" />
                  {' '}Detalles de la Aeronave
                </Text>
                <View style={styles.aircraftDetailsList}>
                  <View style={styles.aircraftDetailColumn}>
                    <View style={styles.aircraftDetailItem}>
                      <Text style={styles.aircraftDetailLabel}>Modelo:</Text>
                      <Text style={styles.aircraftDetailValue}>{specs.aircraftType}</Text>
                    </View>
                    <View style={styles.aircraftDetailItem}>
                      <Text style={styles.aircraftDetailLabel}>Capacidad:</Text>
                      <Text style={styles.aircraftDetailValue}>{specs.capacity}</Text>
                    </View>
                  </View>
                  <View style={styles.aircraftDetailColumn}>
                    <View style={styles.aircraftDetailItem}>
                      <Text style={styles.aircraftDetailLabel}>Envergadura:</Text>
                      <Text style={styles.aircraftDetailValue}>{specs.wingspan}</Text>
                    </View>
                    <View style={styles.aircraftDetailItem}>
                      <Text style={styles.aircraftDetailLabel}>Longitud:</Text>
                      <Text style={styles.aircraftDetailValue}>{specs.length}</Text>
                    </View>
                  </View>
                  <View style={styles.aircraftDetailColumn}>
                    <View style={styles.aircraftDetailItem}>
                      <Text style={styles.aircraftDetailLabel}>Alcance:</Text>
                      <Text style={styles.aircraftDetailValue}>{specs.range}</Text>
                    </View>
                    <View style={styles.aircraftDetailItem}>
                      <Text style={styles.aircraftDetailLabel}>Velocidad máx:</Text>
                      <Text style={styles.aircraftDetailValue}>{specs.maxSpeed} km/h</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}