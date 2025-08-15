  import React, { useEffect, useState, useCallback } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Pressable,
    SafeAreaView,
    useWindowDimensions,
    TouchableOpacity,
    Alert
  } from 'react-native';
  import { MaterialCommunityIcons } from '@expo/vector-icons';
  import { obtenerVuelos, obtenerVueloPorId } from '../controllers/VueloController'; // ✅ CORRECCIÓN: Añadir import
  import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { ScrollView } from 'react-native';
  import FlightMapModal from '../components/FlightMapModal';
  import { prepareFlightDataForMap } from '../services/FlightMapService';

  export default function VuelosDisponiblesView() {
    const [vuelos, setVuelos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedFlightData, setSelectedFlightData] = useState(null);
    const [loadingMap, setLoadingMap] = useState(false);
    
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const router = useRouter();
    const { idUsuario: idParam, nombre: nombreParam } = useLocalSearchParams();
    const [idUsuario, setIdUsuario] = useState(null);
    const [nombre, setNombre] = useState(nombreParam || 'Viajero');

    useFocusEffect(
      useCallback(() => {
        const cargar = async () => {
          let id = idParam;
          if (!id) {
            id = await AsyncStorage.getItem('idUsuario');
          } else {
            await AsyncStorage.setItem('idUsuario', id);
          }
          setIdUsuario(id);
          setNombre(nombreParam || (await AsyncStorage.getItem('nombre')) || 'Viajero');
        };
        cargar();
      }, [idParam, nombreParam])
    );

    useEffect(() => {
      const cargarVuelosConCiudades = async () => {
        try {
          const vuelosRaw = await obtenerVuelos();
          console.log('✈️ Vuelos recibidos:', vuelosRaw);

          const vuelosCompletos = vuelosRaw.map((v) => {
            const ciudadOrigen = v.CiudadOrigen || {};
            const ciudadDestino = v.CiudadDestino || {};
            
            // ✅ CORRECCIÓN: Mostrar información de escalas
            const numEscalas = v.escalasCollection ? v.escalasCollection.length : 0;
            console.log(`🔍 Vuelo ${v.CodigoVuelo} tiene ${numEscalas} escalas`);
            
            return {
              ...v,
              nombreCiudadOrigen: ciudadOrigen.nombre || 'Ciudad no encontrada',
              nombreCiudadDestino: ciudadDestino.nombre || 'Ciudad no encontrada',
              codigoOrigen: ciudadOrigen.codigo,
              codigoDestino: ciudadDestino.codigo,
              numEscalas: numEscalas
            };
          });

          const ordenados = vuelosCompletos.sort(
            (a, b) => a.IdVuelo - b.IdVuelo
          );

          setVuelos(ordenados);
        } catch (err) {
          console.error('❌ Error al cargar vuelos:', err);
          setVuelos([]);
        } finally {
          setLoading(false);
        }
      };

      cargarVuelosConCiudades();
    }, []);

    const handleVerRuta = async (vuelo) => {
      try {
        setLoadingMap(true);
        console.log('📍 Preparando mapa para vuelo:', vuelo);
        
        // ✅ CORRECCIÓN: Obtener información completa del vuelo con escalas
        let vueloCompleto = vuelo;
        
        // Si el vuelo ya tiene escalas, usarlas directamente
        if (vuelo.escalasCollection && vuelo.escalasCollection.length > 0) {
          console.log('📋 Usando escalas del vuelo actual:', vuelo.escalasCollection);
          vueloCompleto = vuelo;
        } else {
          // Si no tiene escalas pero sabemos que debería tenerlas, obtener detalles
          try {
            console.log('🔍 Obteniendo detalles del vuelo ID:', vuelo.IdVuelo);
            const vueloDetallado = await obtenerVueloPorId(vuelo.IdVuelo);
            
            if (vueloDetallado) {
              console.log('✅ Vuelo detallado obtenido:', vueloDetallado);
              vueloCompleto = {
                ...vuelo,
                ...vueloDetallado,
                // Mantener los nombres de ciudades del vuelo original
                nombreCiudadOrigen: vuelo.nombreCiudadOrigen,
                nombreCiudadDestino: vuelo.nombreCiudadDestino,
                codigoOrigen: vuelo.codigoOrigen || vueloDetallado.CiudadOrigen?.codigo,
                codigoDestino: vuelo.codigoDestino || vueloDetallado.CiudadDestino?.codigo,
              };
            }
          } catch (error) {
            console.warn('⚠️ No se pudo obtener detalles del vuelo, usando datos básicos:', error);
            vueloCompleto = vuelo;
          }
        }
        
        // ✅ CORRECCIÓN: Preparar datos del vuelo para el mapa con mejor estructura
        const vueloData = {
          IdVuelo: vueloCompleto.IdVuelo || vueloCompleto.idVuelo,
          CodigoVuelo: vueloCompleto.CodigoVuelo || vueloCompleto.codigoVuelo,
          nombreCiudadOrigen: vueloCompleto.nombreCiudadOrigen,
          nombreCiudadDestino: vueloCompleto.nombreCiudadDestino,
          codigoOrigen: vueloCompleto.codigoOrigen || vueloCompleto.CiudadOrigen?.codigo || vueloCompleto.idCiudadOrigen?.codigoCiudad,
          codigoDestino: vueloCompleto.codigoDestino || vueloCompleto.CiudadDestino?.codigo || vueloCompleto.idCiudadDestino?.codigoCiudad,
          HoraSalida: vueloCompleto.HoraSalida || vueloCompleto.horaSalida,
          Valor: vueloCompleto.Valor || vueloCompleto.valor,
          CiudadOrigen: vueloCompleto.CiudadOrigen || vueloCompleto.idCiudadOrigen,
          CiudadDestino: vueloCompleto.CiudadDestino || vueloCompleto.idCiudadDestino,
          escalasCollection: vueloCompleto.escalasCollection || []
        };
        
        console.log('📊 Datos procesados para el mapa:', vueloData);
        console.log('🛑 Escalas a enviar al mapa:', vueloData.escalasCollection);
        
        const flightData = await prepareFlightDataForMap(vueloData);
        setSelectedFlightData(flightData);
        setMapVisible(true);
      } catch (error) {
        console.error('❌ Error al cargar datos del mapa:', error);
        Alert.alert(
          'Error',
          'No se pudo cargar la información del vuelo. Por favor, intente nuevamente.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoadingMap(false);
      }
    };

    const renderItem = ({ item }) => {
      if (!item || !item.CodigoVuelo) return null;

      return (
        <View style={styles.card}>
          <Text style={styles.title}>✈️ {item.CodigoVuelo}</Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Ruta:</Text> {item.nombreCiudadOrigen} ➡ {item.nombreCiudadDestino}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Hora salida:</Text> {new Date(item.HoraSalida).toLocaleString()}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Precio:</Text> ${item.Valor}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Capacidad:</Text> {item.Capacidad}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Disponibles:</Text> {item.Disponibles}
          </Text>
          
          {/* ✅ CORRECCIÓN: Mostrar información de escalas de forma descriptiva */}
          <Text style={styles.infoText}>
            <Text style={styles.label}>Tipo de vuelo:</Text>{' '}
            <Text style={[styles.flightTypeText, { 
              color: item.numEscalas === 0 ? '#27ae60' : '#e67e22' 
            }]}>
              {item.numEscalas === 0 
                ? 'Directo' 
                : item.numEscalas === 1 
                  ? '1 escala' 
                  : `${item.numEscalas} escalas`}
            </Text>
          </Text>
          
          {/* Botón Ver Ruta */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => handleVerRuta(item)}
            disabled={loadingMap}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="map-marker-path" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>Ver Ruta</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const renderTabla = () => (
      <View style={styles.tabla}>
        <View style={styles.filaHeader}>
          <Text style={styles.colHeader}>Código</Text>
          <Text style={styles.colHeader}>Ruta</Text>
          <Text style={styles.colHeader}>Salida</Text>
          <Text style={styles.colHeader}>Precio</Text>
          <Text style={styles.colHeader}>Tipo</Text>
          <Text style={styles.colHeader}>Disponibles</Text>
          <Text style={styles.colHeader}>Acciones</Text>
        </View>
        {vuelos.map((v, i) => (
          <View key={i} style={styles.fila}>
            <Text style={styles.col}>{v.CodigoVuelo}</Text>
            <Text style={styles.col}>{v.nombreCiudadOrigen} ➡ {v.nombreCiudadDestino}</Text>
            <Text style={styles.col}>{new Date(v.HoraSalida).toLocaleString()}</Text>
            <Text style={styles.col}>${v.Valor}</Text>
            <Text style={[styles.col, { 
              color: v.numEscalas === 0 ? '#27ae60' : '#e67e22',
              fontWeight: '600'
            }]}>
              {v.numEscalas === 0 
                ? 'Directo' 
                : v.numEscalas === 1 
                  ? '1 escala' 
                  : `${v.numEscalas} escalas`}
            </Text>
            <Text style={styles.col}>{v.Disponibles}</Text>
            <View style={styles.colActions}>
              <TouchableOpacity
                style={styles.tableMapButton}
                onPress={() => handleVerRuta(v)}
                disabled={loadingMap}
              >
                <MaterialCommunityIcons name="map-marker-path" size={18} color="#4e88a9" />
                <Text style={styles.tableMapButtonText}>Ver Ruta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>✈️ Vuelos Disponibles</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4e88a9" />
              <Text style={styles.loadingText}>Cargando vuelos...</Text>
            </View>
          ) : vuelos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="airplane-off" size={64} color="#6c757d" />
              <Text style={styles.vacio}>No hay vuelos disponibles en este momento.</Text>
            </View>
          ) : isMobile ? (
            <FlatList
              data={vuelos}
              renderItem={renderItem}
              keyExtractor={(item, index) =>
                item && item.IdVuelo ? `${item.IdVuelo}` : `vuelo-${index}`
              }
              contentContainerStyle={styles.flatListContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <ScrollView style={{ flex: 1, width: '100%' }}>
              {renderTabla()}
            </ScrollView>
          )}

          <Pressable
            onPress={() =>
              router.replace({
                pathname: '/views/MenuView',
                params: { idUsuario, nombre },
              })
            }
            style={styles.botonVolver}
          >
            <Text style={styles.botonTexto}>← Volver al Menú</Text>
          </Pressable>

          {/* Loading overlay para el mapa */}
          {loadingMap && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4e88a9" />
              <Text style={styles.loadingOverlayText}>Cargando mapa...</Text>
            </View>
          )}

          {/* Modal del mapa */}
          <FlightMapModal
            visible={mapVisible}
            onClose={() => {
              setMapVisible(false);
              setSelectedFlightData(null);
            }}
            flightData={selectedFlightData}
          />
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f9fa',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#35798e',
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#6c757d',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    vacio: {
      fontSize: 16,
      color: '#6c757d',
      textAlign: 'center',
      marginTop: 20,
    },
    card: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#e9ecef',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      color: '#35798e',
    },
    infoText: {
      fontSize: 15,
      color: '#212529',
      marginBottom: 8,
    },
    label: {
      fontWeight: '600',
      color: '#495057',
    },
    flightTypeText: {
      fontWeight: 'bold',
      fontSize: 15,
    },
    mapButton: {
      backgroundColor: '#4e88a9',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginTop: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    mapButtonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
      marginLeft: 8,
    },
    tabla: {
      borderWidth: 1,
      borderColor: '#dee2e6',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#fff',
      width: '100%',
      maxWidth: 1200,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    filaHeader: {
      flexDirection: 'row',
      backgroundColor: '#35798e',
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    fila: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderColor: '#dee2e6',
      paddingVertical: 10,
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    colHeader: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#fff',
      fontSize: 16,
    },
    col: {
      flex: 1,
      textAlign: 'center',
      color: '#212529',
      fontSize: 14,
      paddingHorizontal: 4,
    },
    colActions: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tableMapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e3f2fd',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#4e88a9',
    },
    tableMapButtonText: {
      color: '#4e88a9',
      fontSize: 13,
      fontWeight: '500',
      marginLeft: 4,
    },
    botonVolver: {
      marginTop: 20,
      backgroundColor: '#4e88a9',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      alignSelf: 'center',
      maxWidth: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    botonTexto: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    flatListContainer: {
      paddingBottom: 20,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    loadingOverlayText: {
      color: '#fff',
      marginTop: 12,
      fontSize: 16,
    },
  });