// components/SelectorAsientos.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerAsientosDisponibles, verificarDisponibilidadAsientos } from '../controllers/AsientoController';
import { styles } from '../styles/SelectorAsientosStyles';

export default function SelectorAsientos({
  visible,
  onClose,
  vuelo,
  cantidad,
  onConfirmar,
  datosAutoLlenado = null,
  getNombreCiudad,
  formatearFecha
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isLargeDesktop = width >= 1440;

  const [asientosDisponibles, setAsientosDisponibles] = useState([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [datosAsientos, setDatosAsientos] = useState({});
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [asientoActual, setAsientoActual] = useState(null);
  const [autoLlenarActivo, setAutoLlenarActivo] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [editandoAsiento, setEditandoAsiento] = useState(false);

  // Reemplazo de asiento (cuando ya alcanzaste el límite)
  const [reemplazoVisible, setReemplazoVisible] = useState(false);
  const [asientoCandidato, setAsientoCandidato] = useState(null);

  // Avión: 6 asientos por fila
  const ASIENTOS_POR_FILA = 6;
  const COLUMNAS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const PASILLO_DESPUES = 'C';
  const capacidad = vuelo?.Capacidad ?? vuelo?.capacidad ?? 100;
  const FILAS = Math.ceil(capacidad / ASIENTOS_POR_FILA);

  useEffect(() => {
    if (visible && vuelo) {
      cargarDatosUsuario();
      cargarAsientos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, vuelo]);

  const idVueloValue =
    vuelo?.IdVuelo ?? vuelo?.idVuelo ?? vuelo?.idvuelo ?? vuelo?.ID_VUELO;

  const cargarDatosUsuario = async () => {
    try {
      // Preferimos objeto "usuario" guardado al loguear
      const raw = await AsyncStorage.getItem('usuario');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.nombre && u?.cedula) {
          setDatosUsuario({ nombre: u.nombre, cedula: u.cedula });
          return;
        }
      }
      // Fallback a llaves sueltas o a datosAutoLlenado prop
      const nombre = (await AsyncStorage.getItem('nombreUsuario')) || datosAutoLlenado?.nombre || 'Consumidor final';
      const cedula = (await AsyncStorage.getItem('cedulaUsuario')) || datosAutoLlenado?.cedula || '9999999999';
      setDatosUsuario({ nombre, cedula });
    } catch {
      setDatosUsuario({ nombre: 'Consumidor final', cedula: '1234567890' });
    }
  };

  const cargarAsientos = async () => {
    setLoading(true);
    try {
      const asientosOcupados = await obtenerAsientosDisponibles(idVueloValue);

      const mapaAsientos = [];
      for (let fila = 1; fila <= FILAS; fila++) {
        for (let colIndex = 0; colIndex < ASIENTOS_POR_FILA; colIndex++) {
          const numeroAsiento = (fila - 1) * ASIENTOS_POR_FILA + colIndex + 1;
          if (numeroAsiento > capacidad) continue;
          
          const letra = COLUMNAS[colIndex];
          mapaAsientos.push({
            id: numeroAsiento,
            numero: numeroAsiento, // Ahora es solo el número
            numeroVisual: `${fila}${letra}`, // Para referencia visual opcional
            fila,
            columna: letra,
            disponible: !asientosOcupados.includes(numeroAsiento),
            tipo: 'normal'
          });
        }
      }

      setAsientosDisponibles(mapaAsientos);
    } catch (error) {
      console.error('Error cargando asientos:', error?.message || error);
      Alert.alert('Error', 'No se pudieron cargar los asientos disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarAsiento = (asiento) => {
    if (!asiento.disponible) {
      Alert.alert('Asiento no disponible', 'Este asiento ya está ocupado');
      return;
    }

    const yaSeleccionado = asientosSeleccionados.find(a => a.id === asiento.id);
    if (yaSeleccionado) {
      // Ya estaba seleccionado → abre opciones (editar/eliminar)
      Alert.alert(
        `Asiento ${asiento.numero}`,
        `Propietario: ${datosAsientos[asiento.id]?.nombre || 'Sin asignar'}`,
        [
          { text: 'Editar Datos', onPress: () => editarAsiento(asiento) },
          { text: 'Eliminar', onPress: () => eliminarAsiento(asiento), style: 'destructive' },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
      return;
    }

    if (asientosSeleccionados.length >= cantidad) {
      // Alcanzaste el límite → ofrecer reemplazo
      setAsientoCandidato(asiento);
      setReemplazoVisible(true);
      return;
    }

    // Nuevo asiento dentro del límite → pedir datos
    setAsientoActual(asiento);
    setEditandoAsiento(false);
    setMostrarFormulario(true);

    if (asientosSeleccionados.length === 0 && datosUsuario) {
      setDatosAsientos(prev => ({
        ...prev,
        [asiento.id]: { nombre: datosUsuario.nombre, cedula: datosUsuario.cedula }
      }));
    }
  };

  const reemplazarAsiento = (asientoViejo) => {
    if (!asientoCandidato) return;
    // Copiamos los datos del pasajero del asiento antiguo al nuevo
    const datos = datosAsientos[asientoViejo.id] || {};

    setAsientosSeleccionados(prev => {
      const sinViejo = prev.filter(a => a.id !== asientoViejo.id);
      return [...sinViejo, asientoCandidato];
    });

    setDatosAsientos(prev => {
      const copia = { ...prev };
      delete copia[asientoViejo.id];
      copia[asientoCandidato.id] = { ...datos };
      return copia;
    });

    setReemplazoVisible(false);
    setAsientoCandidato(null);
  };

  const editarAsiento = (asiento) => {
    setAsientoActual(asiento);
    setEditandoAsiento(true);
    setMostrarFormulario(true);
  };

  const eliminarAsiento = (asiento) => {
    setAsientosSeleccionados(prev => prev.filter(a => a.id !== asiento.id));
    const nuevos = { ...datosAsientos };
    delete nuevos[asiento.id];
    setDatosAsientos(nuevos);
  };

  const handleGuardarDatosAsiento = () => {
    if (!asientoActual) return;

    const nombre = datosAsientos[asientoActual.id]?.nombre || '';
    const cedula = datosAsientos[asientoActual.id]?.cedula || '';

    if (!nombre.trim() || !cedula.trim()) {
      Alert.alert('Datos incompletos', 'Por favor ingrese nombre y cédula');
      return;
    }

    if (!/^\d{10}$/.test(cedula)) {
      Alert.alert('Cédula inválida', 'La cédula debe tener 10 dígitos');
      return;
    }

    if (editandoAsiento) {
      setMostrarFormulario(false);
      setAsientoActual(null);
      setEditandoAsiento(false);
      return;
    }

    setAsientosSeleccionados(prev => [...prev, asientoActual]);
    setMostrarFormulario(false);
    setAsientoActual(null);
  };

  const handleAutoLlenar = () => {
    if (!asientoActual || !datosUsuario) return;

    setDatosAsientos(prev => ({
      ...prev,
      [asientoActual.id]: {
        nombre: datosUsuario.nombre,
        cedula: datosUsuario.cedula
      }
    }));
    setAutoLlenarActivo(true);
    setTimeout(() => setAutoLlenarActivo(false), 350);
  };

  const handleAutoLlenarTodos = () => {
    if (!datosUsuario) {
      Alert.alert('Error', 'No hay datos de usuario disponibles');
      return;
    }

    Alert.alert(
      'Auto-llenar todos',
      `¿Usar los datos de ${datosUsuario.nombre} para todos los asientos restantes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            const restantes = cantidad - asientosSeleccionados.length;
            if (restantes <= 0) {
              Alert.alert('Info', 'Ya has seleccionado todos los asientos necesarios');
              return;
            }

            const libres = asientosDisponibles
              .filter(a => a.disponible && !asientosSeleccionados.find(s => s.id === a.id))
              .slice(0, restantes);

            const nuevosSel = [...asientosSeleccionados];
            const nuevosDatos = { ...datosAsientos };

            libres.forEach(asiento => {
              nuevosSel.push(asiento);
              nuevosDatos[asiento.id] = {
                nombre: datosUsuario.nombre,
                cedula: datosUsuario.cedula
              };
            });

            setAsientosSeleccionados(nuevosSel);
            setDatosAsientos(nuevosDatos);
            Alert.alert('✅ Éxito', `Se agregaron ${libres.length} asientos automáticamente`);
          }
        }
      ]
    );
  };

  const handleConfirmarSeleccion = async () => {
    if (asientosSeleccionados.length !== cantidad) {
      Alert.alert(
        'Selección incompleta',
        `Debe seleccionar exactamente ${cantidad} asiento(s). Ha seleccionado ${asientosSeleccionados.length}.`
      );
      return;
    }

    // Re-verificar contra backend
    const numeros = asientosSeleccionados.map(a => a.id);
    const chk = await verificarDisponibilidadAsientos(idVueloValue, numeros);
    if (!chk.disponibles) {
      Alert.alert(
        'Asientos ocupados',
        `Los asientos ${chk.asientosNoDisponibles.join(', ')} ya no están disponibles. Se actualizará el mapa.`
      );
      await cargarAsientos();
      return;
    }

    const asientosConDatos = asientosSeleccionados.map(asiento => ({
      numeroAsiento: asiento.id,
      nombrePropietario: datosAsientos[asiento.id].nombre,
      cedulaPropietario: datosAsientos[asiento.id].cedula,
      numeroVisual: asiento.numero // Ahora es el número puro
    }));

    onConfirmar(asientosConDatos);
  };

  const limpiarSeleccion = () => {
    setAsientosSeleccionados([]);
    setDatosAsientos({});
    setAsientoActual(null);
    setMostrarFormulario(false);
    setEditandoAsiento(false);
  };

  const renderAsiento = (asiento) => {
    const seleccionado = asientosSeleccionados.find(a => a.id === asiento.id);
    const esPasillo = asiento.columna === PASILLO_DESPUES;

    return (
      <React.Fragment key={asiento.id}>
        <TouchableOpacity
          style={[
            styles.asiento,
            !asiento.disponible && styles.asientoOcupado,
            seleccionado && styles.asientoSeleccionado,
            isDesktop && styles.asientoDesktop,
            isLargeDesktop && styles.asientoLargeDesktop
          ]}
          onPress={() => handleSeleccionarAsiento(asiento)}
        >
          <Text
            style={[
              styles.asientoTexto,
              seleccionado && styles.asientoTextoSeleccionado,
              !asiento.disponible && styles.asientoTextoOcupado,
              isDesktop && styles.asientoTextoDesktop
            ]}
          >
            {asiento.numero}
          </Text>
        </TouchableOpacity>
        {esPasillo && <View style={[styles.pasillo, isDesktop && styles.pasilloDesktop]} />}
      </React.Fragment>
    );
  };

  const renderFormularioDatos = () => (
    <Modal
      visible={mostrarFormulario}
      transparent
      animationType="slide"
      onRequestClose={() => setMostrarFormulario(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formularioContainer}
      >
        <View style={[styles.formularioContent, isDesktop && styles.formularioContentDesktop]}>
          <Text style={styles.formularioTitulo}>
            {editandoAsiento ? 'Editar' : 'Datos para'} asiento {asientoActual?.numero}
          </Text>

          <View style={styles.formularioGrupo}>
            <Text style={styles.formularioLabel}>Nombre completo</Text>
            <TextInput
              style={[styles.formularioInput, autoLlenarActivo && styles.inputAutoLlenado]}
              placeholder="Ej: Juan Pérez"
              value={datosAsientos[asientoActual?.id]?.nombre || ''}
              onChangeText={(text) =>
                setDatosAsientos((prev) => ({
                  ...prev,
                  [asientoActual.id]: { ...prev[asientoActual.id], nombre: text }
                }))
              }
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formularioGrupo}>
            <Text style={styles.formularioLabel}>Cédula</Text>
            <TextInput
              style={[styles.formularioInput, autoLlenarActivo && styles.inputAutoLlenado]}
              placeholder="Ej: 1234567890"
              value={datosAsientos[asientoActual?.id]?.cedula || ''}
              onChangeText={(text) =>
                setDatosAsientos((prev) => ({
                  ...prev,
                  [asientoActual.id]: {
                    ...prev[asientoActual.id],
                    cedula: text.replace(/\D/g, '').slice(0, 10)
                  }
                }))
              }
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <TouchableOpacity
            style={styles.btnAutoLlenar}
            onPress={handleAutoLlenar}
            disabled={!datosUsuario}
          >
            <Text style={styles.btnAutoLlenarText}>
              ⚡ Auto-llenar con {datosUsuario?.nombre || 'mis datos'}
            </Text>
          </TouchableOpacity>

          <View style={styles.formularioBotones}>
            <TouchableOpacity
              style={[styles.formularioBtn, styles.formularioBtnCancelar]}
              onPress={() => {
                setMostrarFormulario(false);
                setAsientoActual(null);
                setEditandoAsiento(false);
              }}
            >
              <Text style={styles.formularioBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formularioBtn, styles.formularioBtnGuardar]}
              onPress={handleGuardarDatosAsiento}
            >
              <Text style={styles.formularioBtnText}>
                {editandoAsiento ? 'Actualizar' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, isDesktop && styles.containerDesktop]}>
        {/* Header informativo - más compacto en desktop */}
        <View style={[styles.header, isDesktop && styles.headerDesktop, isLargeDesktop && styles.headerLargeDesktop]}>
          <Text style={[styles.titulo, isDesktop && styles.tituloDesktop]}>
            ✈️ Seleccionar Asientos
          </Text>
          <View style={styles.headerInfo}>
            <Text style={styles.subtitulo}>
              {`${getNombreCiudad ? getNombreCiudad(vuelo?.origen) : (vuelo?.origen || '')} → ${getNombreCiudad ? getNombreCiudad(vuelo?.destino) : (vuelo?.destino || '')}`}
            </Text>
            <Text style={styles.subtitulo}>
              {`Vuelo ${vuelo?.CodigoVuelo || vuelo?.codigoVuelo || ''} • Seleccione ${cantidad} asiento(s)`}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#35798e" />
            <Text style={styles.loadingText}>Cargando asientos...</Text>
          </View>
        ) : (
          <>
            {/* Leyenda compacta */}
            <View style={[styles.leyenda, isDesktop && styles.leyendaDesktop]}>
              <View style={styles.leyendaItem}>
                <View style={[styles.leyendaColor, styles.asientoDisponibleLeyenda]} />
                <Text style={styles.leyendaTexto}>Disponible</Text>
              </View>
              <View style={styles.leyendaItem}>
                <View style={[styles.leyendaColor, styles.asientoSeleccionadoLeyenda]} />
                <Text style={styles.leyendaTexto}>Seleccionado</Text>
              </View>
              <View style={styles.leyendaItem}>
                <View style={[styles.leyendaColor, styles.asientoOcupadoLeyenda]} />
                <Text style={styles.leyendaTexto}>Ocupado</Text>
              </View>
            </View>

            {/* Botón auto-llenar todos si hay pendientes */}
            {asientosSeleccionados.length < cantidad && datosUsuario && (
              <TouchableOpacity 
                style={[styles.btnAutoLlenarTodos, isDesktop && styles.btnAutoLlenarTodosDesktop]} 
                onPress={handleAutoLlenarTodos}
              >
                <Text style={styles.btnAutoLlenarTodosText}>
                  ⚡ Auto-seleccionar {cantidad - asientosSeleccionados.length} asientos restantes
                </Text>
              </TouchableOpacity>
            )}

            {/* Mapa de asientos - contenedor optimizado para desktop */}
            <ScrollView
              style={[styles.scrollContainer, isDesktop && styles.scrollContainerDesktop]}
              contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
              showsVerticalScrollIndicator
            >
              <View style={[styles.avion, isDesktop && styles.avionDesktop, isLargeDesktop && styles.avionLargeDesktop]}>
                <View style={[styles.frenteAvion, isDesktop && styles.frenteAvionDesktop]}>
                  <Text style={styles.frenteAvionText}>↑ FRENTE</Text>
                </View>

                <View style={styles.columnasRef}>
                  {COLUMNAS.map((letra) => (
                    <React.Fragment key={letra}>
                      <Text style={[styles.columnaRefText, isDesktop && styles.columnaRefTextDesktop]}>
                        {letra}
                      </Text>
                      {letra === PASILLO_DESPUES && <View style={[styles.pasilloRef, isDesktop && styles.pasilloRefDesktop]} />}
                    </React.Fragment>
                  ))}
                </View>

                {Array.from({ length: FILAS }, (_, i) => i + 1).map((fila) => (
                  <View key={fila} style={styles.fila}>
                    <Text style={[styles.numeroFila, isDesktop && styles.numeroFilaDesktop]}>{fila}</Text>
                    <View style={styles.asientosFila}>
                      {asientosDisponibles
                        .filter((a) => a.fila === fila)
                        .map((asiento) => renderAsiento(asiento))}
                    </View>
                    <Text style={[styles.numeroFila, isDesktop && styles.numeroFilaDesktop]}>{fila}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Resumen - más compacto en desktop */}
            {asientosSeleccionados.length > 0 && (
              <View style={[styles.resumen, isDesktop && styles.resumenDesktop]}>
                <Text style={styles.resumenTitulo}>
                  Asientos seleccionados: {asientosSeleccionados.length}/{cantidad}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.resumenAsientos}>
                    {asientosSeleccionados.map((asiento) => (
                      <TouchableOpacity
                        key={asiento.id}
                        style={styles.resumenAsiento}
                        onPress={() => editarAsiento(asiento)}
                      >
                        <Text style={styles.resumenAsientoNumero}>{asiento.numero}</Text>
                        <Text style={styles.resumenAsientoNombre}>
                          {datosAsientos[asiento.id]?.nombre?.split(' ')[0] || 'Sin nombre'}
                        </Text>
                        <Text style={styles.resumenAsientoEdit}>✏️</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Botones - más compactos en desktop */}
            <View style={[styles.botones, isDesktop && styles.botonesDesktop]}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancelar]}
                onPress={() => {
                  limpiarSeleccion();
                  onClose();
                }}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnConfirmar, asientosSeleccionados.length !== cantidad && styles.btnDisabled]}
                onPress={handleConfirmarSeleccion}
                disabled={asientosSeleccionados.length !== cantidad}
              >
                <Text style={styles.btnText}>
                  Confirmar ({asientosSeleccionados.length}/{cantidad})
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {renderFormularioDatos()}

        {/* Modal de REEMPLAZO de asiento */}
        <Modal
          visible={reemplazoVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setReemplazoVisible(false)}
        >
          <View style={{
            flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center', alignItems: 'center', padding: 16
          }}>
            <View style={{
              width: '100%', maxWidth: 420, borderRadius: 12,
              backgroundColor: '#fff', padding: 16
            }}>
              <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>
                Cambiar asiento seleccionado
              </Text>
              <Text style={{ marginBottom: 12 }}>
                Ya seleccionaste {cantidad} asiento(s). Elige cuál quieres reemplazar por <Text style={{ fontWeight: '700' }}>{asientoCandidato?.numero}</Text>:
              </Text>

              <View style={{ gap: 8 }}>
                {asientosSeleccionados.map(a => (
                  <TouchableOpacity
                    key={a.id}
                    onPress={() => reemplazarAsiento(a)}
                    style={{
                      paddingVertical: 10, paddingHorizontal: 12,
                      borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <Text style={{ fontWeight: '600' }}>
                      {a.numero} — {datosAsientos[a.id]?.nombre || 'Sin asignar'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                <TouchableOpacity
                  onPress={() => { setReemplazoVisible(false); setAsientoCandidato(null); }}
                  style={{ paddingVertical: 10, paddingHorizontal: 14 }}
                >
                  <Text>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}