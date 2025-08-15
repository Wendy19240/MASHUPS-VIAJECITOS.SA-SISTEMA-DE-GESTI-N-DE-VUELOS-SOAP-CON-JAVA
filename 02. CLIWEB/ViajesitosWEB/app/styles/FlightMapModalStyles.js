// FlightMapModalStyles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Definir breakpoints
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;
const isTinyScreen = width < 360;

const styles = StyleSheet.create({
  // Contenedores principales
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: isMobile ? 18 : 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginLeft: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#616161',
    marginLeft: 26,
  },
  closeButton: {
    padding: 4,
  },

  // Contenedor del mapa
  mapContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  mapContainerMobile: {
    margin: 10,
    padding: 12,
  },

  // Flight Info Header (mejorado)
  flightInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 5,
  },
  flightCodeBadge: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  flightCodeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  aircraftInfo: {
    alignItems: 'flex-end',
  },
  aircraftType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
  },
  aircraftSubtext: {
    fontSize: 11,
    color: '#757575',
  },

  // Route Container (actualizado)
  routeContainer: {
    paddingVertical: 10,
    alignItems: 'center', 
  },
  routeSummaryCard: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
    maxWidth: '90%',
  },
  routeWithStops: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
    borderWidth: 1,
  },
  directRoute: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  routeSummaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  routeSummaryDetail: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Route Visualization (nuevo diseño responsive)
  routeScrollView: {
    marginHorizontal: -10,
  },
  scrollContentContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center', // 📌 Centrado del contenido
    alignItems: 'center',
  },
  routeVisualizationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isMobile ? 10 : 20,
    paddingVertical: 20,
    minHeight: isMobile ? 120 : 140,
  },
  routeEndpoint: {
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? 70 : 90,
    zIndex: 2,
  },
  airportIcon: {
    width: isMobile ? 50 : 60,
    height: isMobile ? 50 : 60,
    borderRadius: isMobile ? 25 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
  },
  originIcon: {
    backgroundColor: '#E8F5E9',
    borderColor: '#27ae60',
    borderWidth: 2,
  },
  destinationIcon: {
    backgroundColor: '#FFEBEE',
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  cityLabel: {
    fontSize: isMobile ? 12 : 14,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: isMobile ? 70 : 90,
  },
  cityType: {
    fontSize: isMobile ? 10 : 11,
    color: '#757575',
    textAlign: 'center',
  },
  connectionLineContainer: {
    flex: 1,
    height: 60,
    marginHorizontal: isMobile ? -10 : -15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center', // 🔹 centra la línea con respecto a los iconos
    marginHorizontal: 0, // elimina margen negativo
  },
  connectionLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#E0E0E0',
    top: '50%',
    marginTop: -1.5,
  },
  progressLine: {
    position: 'absolute',
    left: 0,
    height: 3,
    backgroundColor: '#1976D2',
    top: '50%',
    marginTop: -1.5,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  animatedPlane: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
    marginLeft: -12, // Añadido para centrar mejor el avión
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 20,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  stopMarker: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
    zIndex: 5,
    marginTop: -20,
  },
  stopDot: {
    width: isMobile ? 24 : 28,
    height: isMobile ? 24 : 28,
    borderRadius: isMobile ? 12 : 14,
    backgroundColor: '#FF6F00',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  stopNumber: {
    color: '#fff',
    fontSize: isMobile ? 11 : 12,
    fontWeight: 'bold',
  },
  stopInfo: {
    position: 'absolute',
    top: 35,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minWidth: isMobile ? 80 : 100,
    maxWidth: isMobile ? 100 : 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stopName: {
    fontSize: isMobile ? 10 : 11,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center',
    lineHeight: isMobile ? 12 : 14,
  },
  stopLabel: {
    fontSize: isMobile ? 9 : 10,
    color: '#757575',
    marginTop: 1,
  },
  scrollIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  scrollIndicatorText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },

  // Mobile Vertical Route Styles
  mobileRouteContainer: {
    paddingVertical: 10,
  },
  mobileFlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  mobileFlightCode: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  mobileAircraftType: {
    fontSize: 12,
    color: '#666',
  },
  mobileSummaryCard: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  mobileSummaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  mobileRouteList: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  mobileRouteItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 60,
  },
  mobileRouteLineContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  mobileRouteLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E0E0E0',
  },
  mobileRouteDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  originDot: {
    backgroundColor: '#E8F5E9',
    borderColor: '#27ae60',
  },
  destinationDot: {
    backgroundColor: '#FFEBEE',
    borderColor: '#e74c3c',
  },
  mobileStopDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6F00',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  mobileStopNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mobileRouteInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  mobileLocationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  mobileLocationType: {
    fontSize: 11,
    color: '#757575',
  },
  mobileStats: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  mobileStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  mobileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  mobileStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 3,
  },
  mobileStatLabel: {
    fontSize: 10,
    color: '#757575',
    marginTop: 1,
  },

  // Route Stats
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: isMobile ? 5 : 10,
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: isMobile ? 60 : 80,
  },
  statValue: {
    fontSize: isMobile ? 13 : 15,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 4,
  },
  statLabel: {
    fontSize: isMobile ? 9 : 10,
    color: '#757575',
    marginTop: 2,
  },

  // Especificaciones
  specsContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  specsTitle: {
    fontSize: isMobile ? 15 : 17,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
    textAlign: 'center',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specsGridDesktop: {
    justifyContent: 'space-between',
  },
  specCard: {
    width: '48%',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  specCardDesktop: {
    width: '24%',
    padding: 12,
  },
  specLabel: {
    fontSize: 10,
    color: '#757575',
    marginTop: 3,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  specValue: {
    fontSize: isMobile ? 13 : 15,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  specSubtext: {
    fontSize: isMobile ? 10 : 11,
    color: '#757575',
    marginTop: 1,
    textAlign: 'center',
  },

  // Mapa
  mapPreview: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mapTitle: {
    fontSize: isMobile ? 15 : 17,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
    textAlign: 'center',
  },
  mapWrapper: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  staticMap: {
    width: '100%',
    height: isMobile ? 400 : isTablet ? 500 : 600,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  zoomControls: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 6,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  zoomButton: {
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  zoomButtonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  zoomLevel: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  zoomLevelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  mapInfoOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 6,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  routeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeSummaryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  stopsOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 8,
    borderRadius: 6,
    maxWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  stopsOverlayTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  stopOverlayItem: {
    fontSize: 10,
    color: '#666',
    marginBottom: 1,
  },
  mapAlternative: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    minHeight: 180,
  },
  mapAlternativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
    marginTop: 12,
    marginBottom: 6,
  },
  mapAlternativeText: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },

  // Botones
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleMapButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 140,
  },
  toggleMapButtonMobile: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 120,
  },
  toggleMapButtonText: {
    color: '#fff',
    fontSize: isMobile ? 13 : 15,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Información del vuelo
  infoContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  infoContainerMobile: {
    margin: 10,
    padding: 14,
  },
  sectionTitle: {
    fontSize: isMobile ? 15 : 17,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  infoGridDesktop: {
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '48%',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8, 
  },
  infoCardDesktop: {
    width: '34%',
    padding: 14,
  },
  infoLabel: {
    fontSize: 11,
    color: '#757575',
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: isMobile ? 13 : 15,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  infoSubtext: {
    fontSize: isMobile ? 10 : 11,
    color: '#757575',
    marginTop: 1,
    textAlign: 'center',
  },

  // Información de escalas
  stopsInfo: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  stopsTitle: {
    fontSize: isMobile ? 15 : 17,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 12,
    textAlign: 'center',
  },
  stopsGrid: {
    gap: 10,
  },
  stopsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stopItemDesktop: {
    width: '48%',
    marginBottom: 10,
  },
  stopItemText: {
    fontSize: isMobile ? 12 : 13,
    color: '#424242',
    fontWeight: '600',
  },
  stopCode: {
    fontSize: isMobile ? 10 : 11,
    color: '#757575',
    marginTop: 1,
  },
  stopDuration: {
    fontSize: 11,
    color: '#00897B',
    marginTop: 3,
    fontWeight: '500',
  },
  stopDetails: {
    flex: 1,
  },
  stopNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6F00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  stopNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Detalles de la aeronave
  aircraftDetails: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  aircraftDetailsTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
    textAlign: 'center',
  },
  aircraftDetailsList: {
    backgroundColor: '#fafafa',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aircraftDetailColumn: {
    flex: 1,
    gap: 8,
  },
  aircraftDetailItem: {
    paddingVertical: 4,
  },
  aircraftDetailLabel: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 1,
  },
  aircraftDetailValue: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '600',
  },

  // Estilos adicionales para pantallas muy pequeñas
  ...(isTinyScreen ? {
    routeSummaryCard: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    routeSummaryTitle: {
      fontSize: 12,
    },
    routeSummaryDetail: {
      fontSize: 10,
      paddingHorizontal: 5,
    },
    routeVisualizationContainer: {
      paddingHorizontal: 5,
    },
    routeEndpoint: {
      width: 60,
    },
    airportIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    cityLabel: {
      fontSize: isMobile ? 13 : 15,
      fontWeight: '600',
      color: '#212121',
      textAlign: 'center',
      marginBottom: 2,
    },

    cityType: {
      fontSize: isMobile ? 11 : 12,
      color: '#757575',
      textAlign: 'center',
    },

    connectionLineContainer: {
      marginHorizontal: -5,
    },
    statItem: {
      minWidth: 50,
    },
    statValue: {
      fontSize: 12,
    },
    statLabel: {
      fontSize: 8,
    },
    stopInfo: {
      paddingHorizontal: 6,
      paddingVertical: 4,
      minWidth: 70,
      maxWidth: 90,
    },
    stopName: {
      fontSize: 9,
      lineHeight: 11,
    },
    stopLabel: {
      fontSize: 8,
    },
    mobileRouteList: {
      paddingHorizontal: 15,
    },
    mobileRouteLineContainer: {
      width: 35,
      marginRight: 10,
    },
    mobileRouteDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    mobileStopDot: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    mobileStopNumber: {
      fontSize: 11,
    },
    mobileLocationName: {
      fontSize: 13,
    },
    mobileLocationType: {
      fontSize: 10,
    },
    mobileStatValue: {
      fontSize: 13,
    },
    mobileStatLabel: {
      fontSize: 9,
    },
  } : {}),

  // Eliminados (ya no usados en el nuevo diseño)
  // Mantenidos por compatibilidad si alguna parte del código los referencia
  routePoint: {
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: width < 360 ? 3 : 6,
    borderRadius: 8,
    minWidth: width < 360 ? 35 : (width < 768 ? 45 : 55),
    maxWidth: width < 360 ? 45 : (width < 768 ? 55 : 70),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexShrink: 0,
  },
  airportIconHorizontal: {
    width: isMobile ? 30 : 40,
    height: isMobile ? 30 : 40,
    borderRadius: isMobile ? 15 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  locationNameHorizontal: {
    fontSize: width < 360 ? 7 : (width < 768 ? 9 : 11),
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
    maxWidth: width < 360 ? 40 : 55,
    lineHeight: width < 360 ? 8 : (width < 768 ? 10 : 12),
  },
  locationLabelHorizontal: {
    fontSize: 8,
    color: '#757575',
    marginTop: 1,
  },
});

export default styles;