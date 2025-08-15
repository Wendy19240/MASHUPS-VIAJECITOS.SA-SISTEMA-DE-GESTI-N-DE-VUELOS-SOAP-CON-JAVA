// components/CarritoModal.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import SelectorAsientos from './SelectorAsientos';
import { styles } from '../styles/CarritoModalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CarritoModal({
  visible,
  onClose,
  carrito,
  onActualizarCantidad,
  onRemover,
  tipoPago,
  setTipoPago,
  numeroCuotas,
  setNumeroCuotas,
  onComprar,
  getNombreCiudad,
  formatearFecha,
  tasaAnual
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Selector de asientos
  const [mostrarSelectorAsientos, setMostrarSelectorAsientos] = useState(false);
  const [vueloActualAsientos, setVueloActualAsientos] = useState(null);
  const [cantidadAsientosActual, setCantidadAsientosActual] = useState(0);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState({});
  const [procesoSeleccionIndex, setProcesoSeleccionIndex] = useState(0);
  const [datosAutoLlenado, setDatosAutoLlenado] = useState(null);

  // Totales
  const totalCarrito = useMemo(
    () => carrito.reduce((sum, item) => sum + (parseFloat(item.vuelo.Valor) * item.cantidad), 0).toFixed(2),
    [carrito]
  );
  const totalBoletos = useMemo(
    () => carrito.reduce((sum, item) => sum + item.cantidad, 0),
    [carrito]
  );

  // ¿Todos los vuelos tienen asientos completos?
  const todosAsientosCompletos =
    carrito.length > 0 &&
    carrito.every(item => {
      const sel = asientosSeleccionados[item.idVuelo];
      return Array.isArray(sel) && sel.length === item.cantidad;
    });

  // Lista de vuelos con asientos pendientes (para aviso)
  const vuelosPendientes = useMemo(() => {
    return carrito
      .map(item => {
        const sel = asientosSeleccionados[item.idVuelo] || [];
        const faltan = Math.max(item.cantidad - sel.length, 0);
        return faltan > 0 ? { idVuelo: item.idVuelo, vuelo: item.vuelo, faltan } : null;
      })
      .filter(Boolean);
  }, [carrito, asientosSeleccionados]);

  // Amortización (inline, responsive)
  const calcularAmortizacion = (monto, cuotas, tasaAnualParam) => {
    const tasaMensual = tasaAnualParam / 12 / 100;
    if (!tasaMensual || !cuotas || cuotas <= 0) {
      return { tabla: [], interesTotal: '0.00', cuotaMensual: '0.00' };
    }
    const cuotaFija = monto * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -cuotas)));
    let saldo = monto;
    let interesTotal = 0;
    const tabla = [];
    for (let i = 1; i <= cuotas; i++) {
      const interes = saldo * tasaMensual;
      const capital = cuotaFija - interes;
      saldo -= capital;
      interesTotal += interes;
      tabla.push({
        cuota: i,
        valorCuota: cuotaFija.toFixed(2),
        interes: interes.toFixed(2),
        capital: capital.toFixed(2),
        saldo: Math.max(saldo, 0).toFixed(2),
      });
    }
    return { tabla, interesTotal: interesTotal.toFixed(2), cuotaMensual: cuotaFija.toFixed(2) };
  };

  // Cargar datos del usuario logueado para auto-llenado
  const cargarDatosUsuario = async () => {
    try {
      // Preferimos un objeto "usuario" completo si tu login lo guarda
      const raw = await AsyncStorage.getItem('usuario');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.nombre && u?.cedula) {
          setDatosAutoLlenado({ nombre: u.nombre, cedula: u.cedula });
          return;
        }
      }
      // Fallback a llaves individuales
      const nombreUsuario = await AsyncStorage.getItem('nombreUsuario');
      const cedulaUsuario = await AsyncStorage.getItem('cedulaUsuario');
      if (nombreUsuario && cedulaUsuario) {
        setDatosAutoLlenado({ nombre: nombreUsuario, cedula: cedulaUsuario });
      }
    } catch {
      // noop
    }
  };

  // Iniciar o continuar proceso de selección de asientos
  const handleIniciarCompra = async () => {
    if (carrito.length === 0) {
      Alert.alert('Error', 'El carrito está vacío');
      return;
    }
    await cargarDatosUsuario();

    // Buscar el primer vuelo que NO tenga todos sus asientos completos
    const idx = carrito.findIndex(item => {
      const sel = asientosSeleccionados[item.idVuelo];
      return !(Array.isArray(sel) && sel.length === item.cantidad);
    });

    if (idx === -1) {
      // Todo listo → finalizar compra
      procesarCompraConAsientos();
      return;
    }

    // Abrir selector en el siguiente vuelo pendiente
    setProcesoSeleccionIndex(idx);
    setVueloActualAsientos(carrito[idx].vuelo);
    setCantidadAsientosActual(carrito[idx].cantidad);
    setMostrarSelectorAsientos(true);
  };

  // Confirmación de asientos por vuelo
  const handleConfirmarAsientos = (asientos) => {
    const itemActual = carrito[procesoSeleccionIndex];
    setAsientosSeleccionados(prev => ({ ...prev, [itemActual.idVuelo]: asientos }));

    const siguienteIndex = procesoSeleccionIndex + 1;
    if (siguienteIndex < carrito.length) {
      const siguienteItem = carrito[siguienteIndex];
      setProcesoSeleccionIndex(siguienteIndex);
      setVueloActualAsientos(siguienteItem.vuelo);
      setCantidadAsientosActual(siguienteItem.cantidad);
      setMostrarSelectorAsientos(false);
      setTimeout(() => {
        Alert.alert(
          '✅ Asientos seleccionados',
          `Asientos del vuelo ${itemActual.vuelo.CodigoVuelo} confirmados.\nAhora seleccione asientos para el vuelo ${siguienteItem.vuelo.CodigoVuelo}`,
          [{ text: 'Continuar', onPress: () => setMostrarSelectorAsientos(true) }]
        );
      }, 250);
    } else {
      setMostrarSelectorAsientos(false);
      setTimeout(() => procesarCompraConAsientos(), 250);
    }
  };

  // Cambiar cantidad de un vuelo (respetando selección existente)
  const handleCambiarCantidad = (item, nuevaCantidad) => {
    const maxPermitido = Math.min(item.vuelo.Disponibles, 20);
    if (!nuevaCantidad || nuevaCantidad < 1 || nuevaCantidad > maxPermitido) {
      Alert.alert('Cantidad inválida', `Debe ser entre 1 y ${maxPermitido}`);
      return;
    }
    if (nuevaCantidad === item.cantidad) return;

    const tieneSeleccion = Array.isArray(asientosSeleccionados[item.idVuelo]) &&
                           asientosSeleccionados[item.idVuelo].length > 0;

    if (tieneSeleccion) {
      Alert.alert(
        'Cambiar cantidad',
        'Este vuelo ya tiene asientos seleccionados. Cambiar la cantidad borrará esa selección para este vuelo. ¿Deseas continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Continuar', style: 'destructive',
            onPress: () => {
              setAsientosSeleccionados(prev => {
                const copia = { ...prev };
                delete copia[item.idVuelo];
                return copia;
              });
              onActualizarCantidad(item.idVuelo, nuevaCantidad);
            }
          }
        ]
      );
    } else {
      onActualizarCantidad(item.idVuelo, nuevaCantidad);
    }
  };

  // Finalizar compra
  const procesarCompraConAsientos = () => {
    const vuelosConAsientos = carrito.map(item => ({
      idVuelo: item.idVuelo,
      cantidad: item.cantidad,
      asientos: asientosSeleccionados[item.idVuelo] || []
    }));

    const todosConAsientos = vuelosConAsientos.every(v => v.asientos.length === v.cantidad);
    if (!todosConAsientos) {
      Alert.alert('Asientos pendientes', 'Aún faltan asientos por seleccionar para uno o más vuelos.');
      return;
    }

    onClose(); // cierra el modal del carrito
    setTimeout(() => onComprar(vuelosConAsientos), 150);
  };

  const renderCarritoItem = (item) => {
    const maxPermitido = Math.min(item.vuelo.Disponibles, 20);
    const asientosDeEsteVuelo = asientosSeleccionados[item.idVuelo];

    return (
      <View key={`carrito-${item.idVuelo}`} style={[
        styles.carritoItem, isDesktop && styles.carritoItemDesktop
      ]}>
        <View style={styles.carritoInfo}>
          <Text style={[styles.carritoVuelo, isDesktop && { fontSize: 18 }]}>
            ✈️ {item.vuelo.CodigoVuelo}
          </Text>
          <Text style={[styles.carritoRuta, isDesktop && { fontSize: 15 }]}>
            {getNombreCiudad(item.vuelo.origen)} → {getNombreCiudad(item.vuelo.destino)}
          </Text>
          <Text style={[styles.carritoFecha, isDesktop && { fontSize: 14 }]}>
            📅 {formatearFecha(item.vuelo.HoraSalida.split('T')[0])} · {item.vuelo.HoraSalida.split('T')[1].substring(0, 5)}
          </Text>
          <Text style={[styles.carritoSubtotal, isDesktop && { fontSize: 16 }]}>
            {item.cantidad} × ${item.vuelo.Valor} = {(parseFloat(item.vuelo.Valor) * item.cantidad).toFixed(2)}
          </Text>

          {asientosDeEsteVuelo && asientosDeEsteVuelo.length > 0 && (
            <View style={styles.asientosSeleccionadosInfo}>
              <Text style={styles.asientosSeleccionadosLabel}>
                💺 Asientos: {asientosDeEsteVuelo.map(a => a.numeroVisual).join(', ')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.carritoControles}>
          <TouchableOpacity
            onPress={() => handleCambiarCantidad(item, item.cantidad - 1)}
            style={[styles.carritoBtn, item.cantidad <= 1 && styles.carritoBtnDisabled]}
            disabled={item.cantidad <= 1}
          >
            <Text style={styles.carritoBtnText}>−</Text>
          </TouchableOpacity>

          <Text style={[styles.carritoCantidad, isDesktop && { fontSize: 18, minWidth: 40 }]}>
            {item.cantidad}
          </Text>

          <TouchableOpacity
            onPress={() => handleCambiarCantidad(item, item.cantidad + 1)}
            style={[styles.carritoBtn, item.cantidad >= maxPermitido && styles.carritoBtnDisabled]}
            disabled={item.cantidad >= maxPermitido}
          >
            <Text style={styles.carritoBtnText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (asientosSeleccionados[item.idVuelo]) {
                const nuevos = { ...asientosSeleccionados };
                delete nuevos[item.idVuelo];
                setAsientosSeleccionados(nuevos);
              }
              onRemover(item.idVuelo);
            }}
            style={styles.carritoEliminar}
          >
            <Text style={styles.carritoEliminarText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render amortización inline (solo diferido) — responsive
  const renderAmortizacion = () => {
    if (tipoPago !== 'diferido') return null;
    const monto = parseFloat(totalCarrito);
    const data = calcularAmortizacion(monto, numeroCuotas, tasaAnual);

    return (
      <View style={{ marginTop: 12 }}>
        <TouchableOpacity
          style={styles.btnVerAmortizacion}
          onPress={() => { /* toggle dentro de state local usando número de cuotas como key simple */ setMostrarTabla(prev => !prev); }}
        >
          <Text style={styles.btnText}>
            {mostrarTabla ? 'Ocultar Amortización' : '📊 Ver Tabla Amortización'}
          </Text>
        </TouchableOpacity>

        {mostrarTabla && (
          <View
            style={{
              marginTop: 10,
              borderRadius: 12,
              backgroundColor: '#f8fafb',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              padding: isDesktop ? 16 : 12
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: '700', fontSize: isDesktop ? 16 : 14 }}>
                Monto: ${monto.toFixed(2)} · Cuotas: {numeroCuotas} · Tasa anual: {tasaAnual}%
              </Text>
              <Text style={{ marginTop: 4, fontSize: isDesktop ? 14 : 13 }}>
                Cuota mensual aprox.: <Text style={{ fontWeight: '700' }}>${data.cuotaMensual}</Text> · Interés total: <Text style={{ fontWeight: '700' }}>${data.interesTotal}</Text>
              </Text>
            </View>

            {/* En móvil hacemos scroll horizontal para que no se aplaste */}
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View style={{ minWidth: isDesktop ? 700 : 600 }}>
                <View style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#e2e8f0' }}>
                  <Text style={{ flex: 1, fontWeight: '700' }}>#</Text>
                  <Text style={{ flex: 2, fontWeight: '700' }}>Cuota</Text>
                  <Text style={{ flex: 2, fontWeight: '700' }}>Interés</Text>
                  <Text style={{ flex: 2, fontWeight: '700' }}>Capital</Text>
                  <Text style={{ flex: 2, fontWeight: '700' }}>Saldo</Text>
                </View>

                {data.tabla.map((r, idx) => (
                  <View
                    key={r.cuota}
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 8,
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f1f5f9'
                    }}
                  >
                    <Text style={{ flex: 1 }}>{r.cuota}</Text>
                    <Text style={{ flex: 2 }}>${r.valorCuota}</Text>
                    <Text style={{ flex: 2 }}>${r.interes}</Text>
                    <Text style={{ flex: 2 }}>${r.capital}</Text>
                    <Text style={{ flex: 2 }}>${r.saldo}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const [mostrarTabla, setMostrarTabla] = useState(false);

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop, styles.carritoModal]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator>
              <Text style={[styles.carritoHeader, isDesktop && styles.carritoHeaderDesktop]}>
                🛒 Carrito de Compras
              </Text>

              {carrito.length === 0 ? (
                <Text style={styles.carritoVacio}>El carrito está vacío</Text>
              ) : (
                <>
                  <View style={styles.carritoListaContainer}>
                    {carrito.map(renderCarritoItem)}
                  </View>

                  <View style={[styles.carritoResumen, isDesktop && styles.carritoResumenDesktop]}>
                    <Text style={[styles.carritoTotal, isDesktop && styles.carritoTotalDesktop]}>
                      Total: ${totalCarrito}
                    </Text>
                    <Text style={styles.carritoTotalBoletos}>
                      {totalBoletos} boleto(s)
                    </Text>
                  </View>

                  {/* Tipo de pago */}
                  <View style={styles.tipoPagoContainer}>
                    <Text style={styles.subheader}>💰 Tipo de Pago</Text>
                    <View style={styles.tipoPagoBotones}>
                      <TouchableOpacity
                        onPress={() => { setTipoPago('contado'); setMostrarTabla(false); }}
                        style={[styles.tipoPagoBtn, tipoPago === 'contado' && styles.tipoPagoBtnSelected]}
                      >
                        <Text style={[styles.tipoPagoBtnText, tipoPago === 'contado' && styles.tipoPagoBtnTextSelected]}>
                          Pago al Contado
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setTipoPago('diferido')}
                        style={[styles.tipoPagoBtn, styles.tipoPagoBtnDiferido, tipoPago === 'diferido' && styles.tipoPagoBtnSelected]}
                      >
                        <Text style={[styles.tipoPagoBtnText, tipoPago === 'diferido' && styles.tipoPagoBtnTextSelected]}>
                          Pago Diferido
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Cuotas + Amortización (solo diferido) */}
                    {tipoPago === 'diferido' && (
                      <View style={{ marginTop: 8 }}>
                        <Text style={styles.cuotasLabel}>📆 Número de Cuotas</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cuotasScroll}>
                          {[3, 6, 12, 15].map((cuota) => (
                            <TouchableOpacity
                              key={cuota}
                              onPress={() => setNumeroCuotas(cuota)}
                              style={[styles.cuotaBtn, numeroCuotas === cuota && styles.cuotaBtnSelected]}
                            >
                              <Text style={[styles.cuotaBtnText, numeroCuotas === cuota && styles.cuotaBtnTextSelected]}>
                                {cuota} meses
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>

                        {renderAmortizacion()}
                      </View>
                    )}
                  </View>

                  {/* Aviso de asientos pendientes si hay más de 1 vuelo */}
                  {vuelosPendientes.length > 0 && (
                    <View style={[styles.notaAsientos, { marginTop: 8 }]}>
                      <Text style={[styles.notaAsientosText, { fontWeight: '700' }]}>
                        Debes seleccionar asientos para {vuelosPendientes.length} vuelo(s):
                      </Text>
                      {vuelosPendientes.map(v => (
                        <Text key={v.idVuelo} style={styles.notaAsientosText}>
                          • {v.vuelo.CodigoVuelo} — faltan {v.faltan}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Botón principal */}
                  <TouchableOpacity
                    style={[styles.btnComprarTodo, isDesktop && styles.btnComprarTodoDesktop]}
                    onPress={() => (todosAsientosCompletos ? procesarCompraConAsientos() : handleIniciarCompra())}
                  >
                    <Text style={styles.btnText}>
                      {todosAsientosCompletos ? '✅ Finalizar Compra' : '💺 Seleccionar Asientos y Comprar'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setAsientosSeleccionados({});
                  onClose();
                }}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Selector de Asientos */}
      {mostrarSelectorAsientos && vueloActualAsientos && (
        <SelectorAsientos
          visible={mostrarSelectorAsientos}
          onClose={() => setMostrarSelectorAsientos(false)}
          vuelo={vueloActualAsientos}
          cantidad={cantidadAsientosActual}
          onConfirmar={handleConfirmarAsientos}
          datosAutoLlenado={datosAutoLlenado}
          getNombreCiudad={getNombreCiudad}
          formatearFecha={formatearFecha}
        />
      )}
    </>
  );
}
