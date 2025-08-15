// components/VueloItem.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { styles } from '../styles/VueloItemStyles';
import { obtenerAsientosDisponibles } from '../controllers/AsientoController';

export default function VueloItem({
  vuelo,
  carrito,
  onAgregar,
  onVerRuta,
  getNombreCiudad,
  formatearFecha,
  restriccionMismoDia,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Estados para manejar los asientos disponibles reales
  const [disponiblesReales, setDisponiblesReales] = useState(null);
  const [cargandoAsientos, setCargandoAsientos] = useState(true);
  const [errorAsientos, setErrorAsientos] = useState(false);

  // Constante para el total de asientos por vuelo
  const TOTAL_ASIENTOS = 100;

  // Efecto para obtener los asientos ocupados y calcular disponibles
  useEffect(() => {
    const obtenerDisponiblesReales = async () => {
      try {
        setCargandoAsientos(true);
        setErrorAsientos(false);
        
        const asientosOcupados = await obtenerAsientosDisponibles(vuelo.IdVuelo);
        const disponibles = TOTAL_ASIENTOS - asientosOcupados.length;
        
        setDisponiblesReales(disponibles);
      } catch (error) {
        console.error('Error obteniendo asientos disponibles para vuelo', vuelo.IdVuelo, ':', error);
        setErrorAsientos(true);
        // Fallback: usar el valor del campo original si hay error
        setDisponiblesReales(Number(
          vuelo?.Disponibles ??
          vuelo?.disponibles ??
          vuelo?.asientosDisponibles ??
          0
        ));
      } finally {
        setCargandoAsientos(false);
      }
    };

    obtenerDisponiblesReales();
  }, [vuelo.IdVuelo, vuelo.Disponibles, vuelo.disponibles, vuelo.asientosDisponibles]);

  // Usar los disponibles reales calculados o un fallback mientras carga
  const disponibles = disponiblesReales !== null ? disponiblesReales : 0;

  // Verificar si el vuelo ya está en el carrito
  const estaEnCarrito = carrito.some((item) => item.idVuelo === vuelo.IdVuelo);
  const cantidadEnCarrito =
    carrito.find((item) => item.idVuelo === vuelo.IdVuelo)?.cantidad || 0;

  // Verificar restricción por fecha
  const fechaVueloActual = vuelo.HoraSalida.split('T')[0];
  const tieneRestriccionFecha =
    restriccionMismoDia &&
    carrito.some((item) => {
      const fechaItemCarrito = item.vuelo.HoraSalida.split('T')[0];
      return fechaItemCarrito === fechaVueloActual && item.idVuelo !== vuelo.IdVuelo;
    });

  const manejarAgregar = () => {
    if (tieneRestriccionFecha) {
      const vueloConflicto = carrito.find((item) => {
        const fechaItemCarrito = item.vuelo.HoraSalida.split('T')[0];
        return fechaItemCarrito === fechaVueloActual && item.idVuelo !== vuelo.IdVuelo;
      });

      Alert.alert(
        '⚠️ Restricción de fecha',
        `No se pueden comprar múltiples vuelos en el mismo día.\n\nYa tienes un vuelo programado para el ${formatearFecha(
          fechaVueloActual
        )}:\n✈️ ${vueloConflicto.vuelo.CodigoVuelo} (${getNombreCiudad(
          vueloConflicto.vuelo.origen
        )} → ${getNombreCiudad(vueloConflicto.vuelo.destino)})`,
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }

    if (estaEnCarrito) {
      Alert.alert(
        'Vuelo en carrito',
        `Este vuelo ya está en tu carrito con ${cantidadEnCarrito} boleto(s).\n\nPuedes modificar la cantidad desde el carrito.`,
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }

    if (disponibles === 0) {
      Alert.alert('Agotado', 'Este vuelo ya no tiene asientos disponibles.');
      return;
    }

    if (cargandoAsientos) {
      Alert.alert('Cargando', 'Esperando información de disponibilidad...');
      return;
    }

    // Agregar con cantidad inicial de 1
    onAgregar(vuelo, 1);
  };

  const fechaVuelo = vuelo.HoraSalida.split('T')[0];
  const horaVuelo = vuelo.HoraSalida.split('T')[1].substring(0, 5);

  // Determinar escalas
  const tieneEscalas =
    Array.isArray(vuelo.escalasCollection) && vuelo.escalasCollection.length > 0;
  const numEscalas = Array.isArray(vuelo.escalasCollection)
    ? vuelo.escalasCollection.length
    : 0;

  return (
    <View
      style={[
        styles.card,
        isDesktop && styles.cardDesktop,
        tieneRestriccionFecha && styles.cardRestricted,
        estaEnCarrito && styles.cardEnCarrito,
      ]}
    >
      {/* Badge de "En carrito" si aplica */}
      {estaEnCarrito && (
        <View style={styles.badgeEnCarrito}>
          <Text style={styles.badgeEnCarritoText}>✓ En carrito ({cantidadEnCarrito})</Text>
        </View>
      )}

      <Text style={[styles.title, isDesktop && { fontSize: 22 }]}>✈️ {vuelo.CodigoVuelo}</Text>

      {/* Información del vuelo */}
      <View style={isDesktop ? styles.vueloInfoDesktop : styles.vueloInfo}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Origen:</Text>
          <Text style={[styles.infoValue, isDesktop && { fontSize: 17 }]}>
            {getNombreCiudad(vuelo.origen)}
          </Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Destino:</Text>
          <Text style={[styles.infoValue, isDesktop && { fontSize: 17 }]}>
            {getNombreCiudad(vuelo.destino)}
          </Text>
        </View>
      </View>

      <View style={isDesktop ? styles.vueloInfoDesktop : styles.vueloInfo}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Fecha:</Text>
          <Text style={[styles.infoValue, isDesktop && { fontSize: 17 }]}>
            {formatearFecha(fechaVuelo)}
          </Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Hora salida:</Text>
          <Text style={[styles.infoValue, isDesktop && { fontSize: 17 }]}>{horaVuelo}</Text>
        </View>
      </View>

      <View style={isDesktop ? styles.vueloInfoDesktop : styles.vueloInfo}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Precio:</Text>
          <Text style={[styles.infoValue, { color: '#28a745', fontSize: isDesktop ? 22 : 18 }]}>
            ${vuelo.Valor}
          </Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Disponibles:</Text>
          {cargandoAsientos ? (
            <Text style={[styles.infoValue, isDesktop && { fontSize: 17 }]}>
              ⏳ Cargando...
            </Text>
          ) : errorAsientos ? (
            <Text style={[styles.infoValue, isDesktop && { fontSize: 17 }, { color: '#ffc107' }]}>
              ⚠️ Error al cargar
            </Text>
          ) : (
            <Text
              style={[
                styles.infoValue,
                isDesktop && { fontSize: 17 },
                disponibles < 10 && { color: '#dc3545' },
              ]}
            >
              {disponibles} asientos
            </Text>
          )}
        </View>
      </View>

      {/* Información de escalas */}
      {tieneEscalas && (
        <View style={styles.escalasInfo}>
          <Text style={styles.escalasText}>🔄 {numEscalas} escala{numEscalas > 1 ? 's' : ''}</Text>
        </View>
      )}

      {/* Información de disponibilidad */}
      <View
        style={[
          styles.disponibilidadInfo,
          disponibles < 5 && styles.disponibilidadBaja,
        ]}
      >
        {cargandoAsientos ? (
          <Text style={styles.disponibilidadText}>
            ⏳ Verificando disponibilidad...
          </Text>
        ) : errorAsientos ? (
          <Text style={[styles.disponibilidadText, { color: '#ffc107' }]}>
            ⚠️ Error al verificar disponibilidad
          </Text>
        ) : (
          <Text
            style={[
              styles.disponibilidadText,
              disponibles < 5 && styles.disponibilidadTextBaja,
            ]}
          >
            {disponibles < 5
              ? `⚠️ Solo quedan ${disponibles} asientos`
              : `💺 ${disponibles} asientos disponibles`}
          </Text>
        )}
      </View>

      {/* Mostrar restricción de fecha si existe */}
      {tieneRestriccionFecha && (
        <View style={styles.restriccionFecha}>
          <Text style={styles.restriccionFechaText}>⚠️ Ya tienes un vuelo programado para esta fecha</Text>
        </View>
      )}

      {/* Info de como funciona */}
      {!estaEnCarrito && !tieneRestriccionFecha && (
        <View style={styles.infoCompra}>
          <Text style={styles.infoCompraText}>
            💡 Agrega al carrito y luego selecciona la cantidad de boletos y asientos
          </Text>
        </View>
      )}

      {/* Contenedor de botones de acción */}
      <View style={styles.botonesAccion}>
        {/* Botón Ver Ruta */}
        <TouchableOpacity
          style={[styles.btnVerRuta, isDesktop && { paddingVertical: 18 }]}
          onPress={onVerRuta}
        >
          <Text style={[styles.btnTextSecundario, isDesktop && { fontSize: 18 }]}>
            📍 Ver Ruta
          </Text>
        </TouchableOpacity>

        {/* Botón Agregar al Carrito */}
        {!estaEnCarrito ? (
          <TouchableOpacity
            style={[
              styles.btnAgregar,
              isDesktop && { paddingVertical: 18 },
              (tieneRestriccionFecha || disponibles === 0 || cargandoAsientos) && styles.btnAgregarDisabled,
            ]}
            onPress={manejarAgregar}
            disabled={tieneRestriccionFecha || disponibles === 0 || cargandoAsientos}
          >
            <Text style={[styles.btnText, isDesktop && { fontSize: 18 }]}>
              {cargandoAsientos
                ? '⏳ Verificando...'
                : tieneRestriccionFecha
                ? '🚫 No disponible'
                : disponibles === 0
                ? '❌ Agotado'
                : '🛒 Agregar al Carrito'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.btnEnCarrito, isDesktop && { paddingVertical: 18 }]}>
            <Text style={[styles.btnEnCarritoText, isDesktop && { fontSize: 18 }]}>
              ✅ En Carrito
            </Text>
            <Text style={styles.btnEnCarritoSubtext}>
              {cantidadEnCarrito} boleto{cantidadEnCarrito !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}