// ComprarBoletoView.js - Actualizado con selector de asientos
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Controladores
import { obtenerCiudades } from '../controllers/CiudadController';
import { buscarVuelos } from '../controllers/VueloController';
import { registrarBoletos } from '../controllers/BoletoController';

// Servicios
import { 
  obtenerCoordenadas, 
  prepareFlightDataForMap 
} from '../services/FlightMapService';

// Componentes modularizados
import FormularioBusqueda from '../components/FormularioBusqueda';
import VueloItem from '../components/VueloItem';
import CarritoModal from '../components/CarritoModal';
import FlightMapModal from '../components/FlightMapModal';

// Estilos
import { styles } from '../styles/ComprarBoletoStyles';

// Configuración
const RESTRICCION_MISMO_DIA = true;
const TASA_ANUAL_FIJA = 16.5;

export default function ComprarBoletoView() {
  const router = useRouter();
  
  // Estados principales
  const [usuario, setUsuario] = useState(null);
  const [ciudades, setCiudades] = useState([]);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados del carrito
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [tipoPago, setTipoPago] = useState('contado');
  const [numeroCuotas, setNumeroCuotas] = useState(3);
  
  // Estado para el modal de ruta
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [mostrarRuta, setMostrarRuta] = useState(false);

  // Inicialización
  useFocusEffect(
    React.useCallback(() => {
      limpiarFormulario();
      cargarDatosIniciales();
      return () => limpiarFormulario();
    }, [])
  );

  const cargarDatosIniciales = async () => {
    try {
      // Cargar ciudades
      const data = await obtenerCiudades();
      setCiudades(Array.isArray(data) ? data.map(c => ({
        codigoCiudad: c.codigo,
        nombreCiudad: c.nombre,
        coords: c.coordenadas
      })) : []);

      // Verificar usuario y guardar datos para auto-llenado
      const storedId = await AsyncStorage.getItem('idUsuario');
      
      if (storedId) {
        setUsuario(parseInt(storedId));
        
        // Verificar si existen datos de nombre y cédula
        const storedNombre = await AsyncStorage.getItem('nombreUsuario');
        const storedCedula = await AsyncStorage.getItem('cedulaUsuario');
        
        // Si no existen, establecer valores por defecto temporales
        // En una app real, estos datos vendrían del backend al hacer login
        if (!storedNombre) {
          await AsyncStorage.setItem('nombreUsuario', 'Usuario Principal');
        }
        if (!storedCedula) {
          await AsyncStorage.setItem('cedulaUsuario', '1234567890');
        }
        
        console.log('✅ Datos de usuario configurados para auto-llenado');
      } else {
        router.replace('/');
      }
    } catch (e) {
      console.error('Error cargando datos:', e);
      Alert.alert('Error', 'No se pudieron cargar los datos iniciales');
    }
  };

  const limpiarFormulario = () => {
    setOrigen('');
    setDestino('');
    setFecha('');
    setVuelos([]);
    setCarrito([]);
    setMensaje('');
    setModalVisible(false);
    setMostrarCarrito(false);
    setTipoPago('contado');
    setNumeroCuotas(3);
    setVueloSeleccionado(null);
    setMostrarRuta(false);
  };

  const handleVolverMenu = async () => {
    limpiarFormulario();
    const idUsuarioActual = usuario || await AsyncStorage.getItem('idUsuario');
    if (idUsuarioActual) {
      router.replace({ pathname: '/views/MenuView', params: { idUsuario: idUsuarioActual } });
    } else {
      router.replace('/');
    }
  };

  const handleBuscarVuelos = async () => {
    if (!origen || !destino || origen === destino || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      Alert.alert('Error', 'Seleccione ciudades válidas y una fecha con formato correcto (YYYY-MM-DD).');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 Buscando vuelos:', { origen, destino, fecha });
      
      const resultados = await buscarVuelos(origen, destino, fecha);
      console.log('📥 Resultados recibidos:', resultados);
      
      const lista = Array.isArray(resultados) ? resultados : [];
      
      // Enriquecer datos de vuelos con información adicional
      const vuelosEnriquecidos = lista.map(vuelo => {
        try {
          const coordsOrigen = getCoordenadas(origen);
          const coordsDestino = getCoordenadas(destino);
          
          console.log('📍 Coordenadas obtenidas:', { 
            origen: coordsOrigen, 
            destino: coordsDestino 
          });
          
          return {
            ...vuelo,
            origen,
            destino,
            ciudadOrigen: getNombreCiudad(origen),
            ciudadDestino: getNombreCiudad(destino),
            originCoords: coordsOrigen,
            destinationCoords: coordsDestino,
            escalasCollection: vuelo.escalasCollection || [],
            numEscalas: vuelo.escalasCollection ? vuelo.escalasCollection.length : 0
          };
        } catch (error) {
          console.error('Error enriqueciendo vuelo:', error);
          return {
            ...vuelo,
            origen,
            destino,
            ciudadOrigen: getNombreCiudad(origen),
            ciudadDestino: getNombreCiudad(destino),
            originCoords: null,
            destinationCoords: null,
            escalasCollection: [],
            numEscalas: 0
          };
        }
      });
      
      console.log('✅ Vuelos enriquecidos:', vuelosEnriquecidos.length);
      
      setVuelos(vuelosEnriquecidos);
      if (lista.length === 0) {
        Alert.alert('Sin vuelos disponibles');
      }
    } catch (error) {
      console.error('❌ Error al buscar vuelos:', error);
      Alert.alert('Error', 'No se pudo buscar vuelos: ' + error.message);
      setVuelos([]);
    } finally {
      setLoading(false);
    }
  };

  const getNombreCiudad = (codigo) => {
    const ciudad = ciudades.find(c => c.codigoCiudad === codigo);
    return ciudad ? ciudad.nombreCiudad : codigo;
  };

  const getCoordenadas = (codigo) => {
    try {
      // Primero intentar obtener de los datos de ciudades cargadas
      const ciudad = ciudades.find(c => c.codigoCiudad === codigo);
      if (ciudad?.coords) {
        console.log('✅ Coordenadas desde ciudades cargadas:', ciudad.coords);
        return ciudad.coords;
      }
      
      // Si no, usar el servicio que tiene las coordenadas hardcodeadas
      const coordsFromService = obtenerCoordenadas(codigo);
      if (coordsFromService) {
        console.log('✅ Coordenadas desde servicio:', coordsFromService);
        return {
          latitude: coordsFromService.latitude,
          longitude: coordsFromService.longitude
        };
      }
      
      console.warn(`⚠️ No se encontraron coordenadas para: ${codigo}`);
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo coordenadas:', error);
      return null;
    }
  };

  const formatearFecha = (fechaISO) => {
    const [año, mes, dia] = fechaISO.split('-');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${año}`;
  };

  // Funciones del carrito
  const agregarAlCarrito = (vuelo, cantidad) => {
    const maxPermitido = Math.min(vuelo.Disponibles, 20);
    
    if (!cantidad || isNaN(cantidad) || cantidad <= 0 || cantidad > maxPermitido) {
      Alert.alert(
        'Cantidad inválida', 
        `Por favor ingrese una cantidad válida (1-${maxPermitido})`
      );
      return;
    }

    const fechaVueloActual = vuelo.HoraSalida.split('T')[0];
    
    if (RESTRICCION_MISMO_DIA) {
      const vueloMismoDia = carrito.find(item => {
        const fechaItemCarrito = item.vuelo.HoraSalida.split('T')[0];
        return fechaItemCarrito === fechaVueloActual && item.idVuelo !== vuelo.IdVuelo;
      });
      
      if (vueloMismoDia) {
        Alert.alert(
          '⚠️ Restricción de fecha',
          `No se pueden comprar múltiples vuelos en el mismo día.\n\nYa tienes un vuelo programado para el ${formatearFecha(fechaVueloActual)}:\n✈️ ${vueloMismoDia.vuelo.CodigoVuelo} (${getNombreCiudad(vueloMismoDia.vuelo.origen)} → ${getNombreCiudad(vueloMismoDia.vuelo.destino)})`,
          [{ text: 'Entendido', style: 'default' }]
        );
        return;
      }
    }

    const vueloEnCarrito = carrito.find(item => item.idVuelo === vuelo.IdVuelo);
    
    if (vueloEnCarrito) {
      const nuevaCantidad = vueloEnCarrito.cantidad + cantidad;
      if (nuevaCantidad > maxPermitido) {
        Alert.alert(
          'Límite excedido', 
          `Cantidad total excedería el límite permitido: ${maxPermitido}\nActualmente tienes: ${vueloEnCarrito.cantidad}`
        );
        return;
      }
      
      setCarrito(carrito.map(item => 
        item.idVuelo === vuelo.IdVuelo 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        idVuelo: vuelo.IdVuelo,
        cantidad: cantidad,
        vuelo: vuelo
      }]);
    }

    Alert.alert(
      '¡Agregado al carrito!', 
      `${cantidad} boleto${cantidad !== 1 ? 's' : ''} del vuelo ${vuelo.CodigoVuelo}\n\n💺 Deberás seleccionar los asientos al momento de comprar.`
    );
  };

  const actualizarCantidadCarrito = (idVuelo, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removerDelCarrito(idVuelo);
      return;
    }

    const item = carrito.find(c => c.idVuelo === idVuelo);
    if (!item) return;

    const maxPermitido = Math.min(item.vuelo.Disponibles, 20);
    
    if (nuevaCantidad > maxPermitido) {
      Alert.alert('Límite excedido', `Máximo permitido: ${maxPermitido} boletos`);
      return;
    }

    setCarrito(prevCarrito => prevCarrito.map(item => 
      item.idVuelo === idVuelo 
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  const removerDelCarrito = (idVuelo) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => 
      String(item.idVuelo) !== String(idVuelo)
    ));
  };

  const procesarCompraMultiple = async (vuelosConAsientos) => {
    // Esta función ahora recibe los vuelos con asientos seleccionados
    if (!vuelosConAsientos || vuelosConAsientos.length === 0) {
      Alert.alert('Error', 'No se han seleccionado asientos');
      return;
    }

    const idUsuarioActual = usuario || parseInt(await AsyncStorage.getItem('idUsuario'));
    
    if (!idUsuarioActual || isNaN(idUsuarioActual)) {
      setMensaje('❌ ID de usuario no disponible.');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    
    try {
      const resultado = await registrarBoletos({
        idUsuario: idUsuarioActual,
        vuelos: vuelosConAsientos,
        esCredito: tipoPago === 'diferido',
        numeroCuotas: tipoPago === 'diferido' ? numeroCuotas : 0,
        tasaInteresAnual: tipoPago === 'diferido' ? TASA_ANUAL_FIJA : 0
      });

      if (resultado) {
        const totalBoletos = vuelosConAsientos.reduce((sum, item) => 
          sum + item.asientos.length, 0
        );
        
        const detalleCompra = vuelosConAsientos.map(item => {
          const vueloInfo = carrito.find(c => c.idVuelo === item.idVuelo)?.vuelo;
          const asientosInfo = item.asientos.map(a => a.numeroVisual).join(', ');
          return `✈ ${vueloInfo?.CodigoVuelo || 'Vuelo'} - Asientos: ${asientosInfo}`;
        }).join('\n');

        setMensaje(`✅ Compra realizada con éxito\n\n${detalleCompra}\n\n🎟 Total: ${totalBoletos} boletos con asientos asignados`);
        setModalVisible(true);
        
        setTimeout(() => {
          limpiarFormulario();
          setModalVisible(false);
          router.replace({ pathname: '/views/MenuView', params: { idUsuario: usuario } });
        }, 4000);

      } else {
        setMensaje('❌ No se pudo completar la compra. Verifique la disponibilidad de los asientos.');
        setModalVisible(true);
      }
    } catch (e) {
      console.error('Error al comprar:', e);
      setMensaje('❌ Error inesperado en la compra.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar ruta del vuelo
  const handleVerRuta = async (vuelo) => {
    try {
      console.log('📍 Preparando mapa para vuelo:', vuelo);
      
      const vueloData = {
        IdVuelo: vuelo.IdVuelo || vuelo.idVuelo,
        CodigoVuelo: vuelo.CodigoVuelo || vuelo.codigoVuelo,
        nombreCiudadOrigen: vuelo.ciudadOrigen || getNombreCiudad(vuelo.origen),
        nombreCiudadDestino: vuelo.ciudadDestino || getNombreCiudad(vuelo.destino),
        codigoOrigen: vuelo.origen,
        codigoDestino: vuelo.destino,
        HoraSalida: vuelo.HoraSalida || vuelo.horaSalida,
        Valor: vuelo.Valor || vuelo.valor,
        originCoords: vuelo.originCoords,
        destinationCoords: vuelo.destinationCoords,
        escalasCollection: vuelo.escalasCollection || []
      };
      
      console.log('📊 Datos procesados para el mapa:', vueloData);
      
      const flightData = await prepareFlightDataForMap(vueloData);
      
      setVueloSeleccionado(flightData);
      setMostrarRuta(true);
    } catch (error) {
      console.error('❌ Error al cargar datos del mapa:', error);
      Alert.alert(
        'Error',
        'No se pudo cargar la información del vuelo. Por favor, intente nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const totalCarrito = carrito.reduce((sum, item) => 
    sum + (parseFloat(item.vuelo.Valor) * item.cantidad), 0
  ).toFixed(2);

  // Función para renderizar lista de vuelos
  const renderVuelosList = () => {
    const { width } = Dimensions.get('window');
    const isDesktop = width >= 1024;
    
    if (isDesktop) {
      // En desktop, mostrar en grid de 2 columnas
      const rows = [];
      for (let i = 0; i < vuelos.length; i += 2) {
        const vuelosEnFila = vuelos.slice(i, i + 2);
        rows.push(
          <View key={`row-${i}`} style={styles.vueloRow}>
            {vuelosEnFila.map((vuelo) => (
              <VueloItem
                key={vuelo.IdVuelo}
                vuelo={vuelo}
                carrito={carrito}
                onAgregar={agregarAlCarrito}
                onVerRuta={() => handleVerRuta(vuelo)}
                getNombreCiudad={getNombreCiudad}
                formatearFecha={formatearFecha}
                restriccionMismoDia={RESTRICCION_MISMO_DIA}
              />
            ))}
            {vuelosEnFila.length === 1 && <View style={{ flex: 1, marginHorizontal: 10 }} />}
          </View>
        );
      }
      return <View style={styles.vuelosContainer}>{rows}</View>;
    } else {
      // En móvil y tablet, mostrar en columna
      return (
        <View style={styles.vuelosContainer}>
          {vuelos.map((vuelo) => (
            <VueloItem
              key={vuelo.IdVuelo}
              vuelo={vuelo}
              carrito={carrito}
              onAgregar={agregarAlCarrito}
              onVerRuta={() => handleVerRuta(vuelo)}
              getNombreCiudad={getNombreCiudad}
              formatearFecha={formatearFecha}
              restriccionMismoDia={RESTRICCION_MISMO_DIA}
            />
          ))}
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.scroll}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Formulario de búsqueda */}
          <FormularioBusqueda
            ciudades={ciudades}
            origen={origen}
            setOrigen={setOrigen}
            destino={destino}
            setDestino={setDestino}
            fecha={fecha}
            setFecha={setFecha}
            onBuscar={handleBuscarVuelos}
          />

          {/* Botón del carrito flotante */}
          {carrito.length > 0 && (
            <TouchableOpacity
              style={styles.carritoFloating}
              onPress={() => setMostrarCarrito(true)}
            >
              <Text style={styles.carritoFloatingText}>
                🛒 {carrito.length} vuelo(s) - ${totalCarrito}
              </Text>
            </TouchableOpacity>
          )}

          {/* Lista de vuelos o loading */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#35798e" />
              <Text style={styles.loadingText}>
                {carrito.length > 0 ? 'Procesando compra...' : 'Buscando vuelos...'}
              </Text>
            </View>
          ) : vuelos.length > 0 ? (
            renderVuelosList()
          ) : (
            fecha && origen && destino && (
              <Text style={styles.noVuelos}>
                No hay vuelos disponibles para esta búsqueda.
              </Text>
            )
          )}
        </View>

        {/* Modal del carrito con selector de asientos */}
        <CarritoModal
          visible={mostrarCarrito}
          onClose={() => {
            setMostrarCarrito(false);
            setTipoPago('contado');
            setNumeroCuotas(3);
          }}
          carrito={carrito}
          onActualizarCantidad={actualizarCantidadCarrito}
          onRemover={removerDelCarrito}
          tipoPago={tipoPago}
          setTipoPago={setTipoPago}
          numeroCuotas={numeroCuotas}
          setNumeroCuotas={setNumeroCuotas}
          onComprar={procesarCompraMultiple}
          getNombreCiudad={getNombreCiudad}
          formatearFecha={formatearFecha}
          tasaAnual={TASA_ANUAL_FIJA}
        />

        {/* Modal de ruta del vuelo */}
        <FlightMapModal
          visible={mostrarRuta}
          onClose={() => {
            setMostrarRuta(false);
            setVueloSeleccionado(null);
          }}
          flightData={vueloSeleccionado}
        />

        {/* Modal de mensajes */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalMensajeContainer}>
            <View style={styles.modalMensajeContent}>
              <Text style={styles.modalMensajeText}>{mensaje}</Text>
              <TouchableOpacity
                style={styles.modalMensajeButton}
                onPress={() => {
                  setModalVisible(false);
                  if (mensaje.startsWith('✅')) {
                    limpiarFormulario();
                    router.replace({ pathname: '/views/MenuView', params: { idUsuario: usuario } });
                  }
                }}
              >
                <Text style={styles.modalMensajeButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Botón volver */}
        <View style={styles.volverContainer}>
          <TouchableOpacity
            onPress={handleVolverMenu}
            style={styles.volverBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.volverText}>← Volver al Menú</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}