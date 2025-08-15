import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
  useWindowDimensions,
  Alert,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFacturasPorUsuario } from '../controllers/FacturaController';
import styles from '../styles/FacturaStyles'; // Importación de estilos corregida

export default function FacturasView() {
  const router = useRouter();
  const { idUsuario: idParam } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [boletosConDetalles, setBoletosConDetalles] = useState([]);
  const [amortizacion, setAmortizacion] = useState([]);
  const [tipoPago, setTipoPago] = useState("Cargando...");
  const [modalAmortVisible, setModalAmortVisible] = useState(false);

  // Determinar número de columnas basado en el tamaño de pantalla
  const getNumColumns = () => {
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  };

  // Key para forzar re-render cuando cambia el número de columnas
  const flatListKey = `${getNumColumns()}-${width}`;

  const obtenerIdUsuarioSeguro = async (idP) => {
    if (idP) return parseInt(idP);
    const id = await AsyncStorage.getItem('idUsuario');
    return id ? parseInt(id) : null;
  };

  useFocusEffect(
    useCallback(() => {
      const cargarFacturas = async () => {
        setLoading(true);
        try {
          const idUsuarioActual = await obtenerIdUsuarioSeguro(idParam);
          if (!idUsuarioActual) {
            Alert.alert('Error', 'No se pudo obtener el usuario actual');
            router.replace('/');
            return;
          }

          const datos = await getFacturasPorUsuario(idUsuarioActual);
          console.log('🧾 Facturas recibidas:', datos.length);

          const ordenadas = Array.isArray(datos)
            ? datos.sort((a, b) => new Date(b.FechaFactura) - new Date(a.FechaFactura))
            : [];

          setFacturas(ordenadas);
        } catch (e) {
          console.error('Error al cargar facturas:', e);
          Alert.alert('Error', 'No se pudieron cargar las facturas');
        } finally {
          setLoading(false);
        }
      };
      cargarFacturas();
    }, [idParam])
  );

  const parseFechaISO = (input) => {
    if (!input) return null;
    const limpio = input.replace(/\[.*?\]/g, '');
    const fecha = new Date(limpio);
    return isNaN(fecha.getTime()) ? null : fecha;
  };

  const formatDate = (dateString) => {
    const fecha = parseFechaISO(dateString);
    if (!fecha) return 'Fecha inválida';
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'Fecha inválida';
    const limpio = dateString.replace(/\[.*?\]/g, '');
    const fecha = new Date(limpio);
    if (isNaN(fecha.getTime())) return 'Fecha inválida';

    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleVolverMenu = async () => {
    const idUsuarioActual = await obtenerIdUsuarioSeguro(idParam);
    if (idUsuarioActual) {
      router.replace({
        pathname: '/views/MenuView',
        params: { idUsuario: idUsuarioActual }
      });
    } else {
      router.replace('/');
    }
  };

  const handleFacturaPress = async (factura) => {
    console.log('🔍 Factura presionada:', factura);
    try {
      setFacturaSeleccionada(factura);
      
      setUsuarioSeleccionado(factura.Usuario || {
        IdUsuario: factura.IdUsuario,
        Nombre: 'Cliente',
        Cedula: '-',
        Telefono: '-',
        Correo: '-'
      });
      
      setAmortizacion(factura.Amortizaciones || []);
      setTipoPago(factura.EsCredito ? "Diferido (Crédito)" : "Contado (Pago completo)");
      
      const boletos = factura.Boletos || [];
      const boletosFormateados = boletos.map(boleto => ({
        ...boleto,
        ciudadOrigen: boleto.vuelo?.ciudadOrigen || 'Ciudad desconocida',
        ciudadDestino: boleto.vuelo?.ciudadDestino || 'Ciudad desconocida'
      }));
      
      setBoletosConDetalles(boletosFormateados);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al obtener detalle:", error);
      Alert.alert('Error', 'No se pudo cargar el detalle de la factura');
    }
  };

  const getCardStyle = () => {
    const numColumns = getNumColumns();
    const padding = 16;
    const gap = 12;
    
    if (numColumns === 1) {
      return { width: '100%' };
    }
    
    const availableWidth = width - (padding * 2) - (gap * (numColumns - 1));
    const cardWidth = availableWidth / numColumns;
    
    return { width: cardWidth };
  };

  // Función para calcular totales correctamente
  const calcularTotales = (factura) => {
    const subtotal = parseFloat(factura.PrecioSinIVA || factura['a:PrecioSinIVA'] || 0);
    const total = parseFloat(factura.PrecioConIVA || factura['a:PrecioConIVA'] || 0);
    const iva = total - subtotal;
    const descuento = 0;
    
    return {
      subtotal: subtotal.toFixed(2),
      descuento: descuento.toFixed(2),
      subtotalConDescuento: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        getCardStyle(),
        isLargeScreen && styles.cardLarge
      ]}
      onPress={() => handleFacturaPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={[
          styles.cardTitle,
          isLargeScreen && styles.cardTitleLarge
        ]}>
          🧾 Factura {item.NumeroFactura}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>#{index + 1}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, isLargeScreen && styles.labelLarge]}>📅 Fecha:</Text>
          <Text style={[styles.value, isLargeScreen && styles.valueLarge]}>
            {formatDate(item.FechaFactura)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, isLargeScreen && styles.labelLarge]}>💵 Total:</Text>
          <Text style={[styles.priceValue, isLargeScreen && styles.priceValueLarge]}>
            ${item.PrecioConIVA || item.precioConIVA}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getModalWidth = () => {
    if (isDesktop) return '85%';
    if (isTablet) return '90%';
    return '95%';
  };

  const getModalMaxHeight = () => height * 0.9;

  // Wrapper con soporte de scrollbars en web
  const EnhancedScrollView = ({ children, ...props }) => {
    const webScrollStyles = Platform.OS === 'web' ? {
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
    } : {};

    if (Platform.OS === 'web') {
      return (
        <View style={[styles.scrollWrapper, props.style, { overflow: 'hidden' }]}>
          <ScrollView
            {...props}
            showsVerticalScrollIndicator
            showsHorizontalScrollIndicator
            persistentScrollbar
            style={[webScrollStyles, props.scrollViewStyle]}
          >
            {children}
          </ScrollView>
        </View>
      );
    }
    return (
      <ScrollView
        {...props}
        showsVerticalScrollIndicator
        showsHorizontalScrollIndicator
        persistentScrollbar
      >
        {children}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <Text style={[
          styles.header,
          isLargeScreen && styles.headerLarge
        ]}>
          🧾 Mis Facturas
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4e88a9" />
            <Text style={styles.loadingText}>Cargando facturas...</Text>
          </View>
        ) : (
          <>
            {isLargeScreen ? (
              <View style={styles.tableWrapper}>
                <View style={styles.tableContainer}>
                  {facturas.length > 7 && (
                    <View style={styles.scrollBadge}>
                      <Text style={styles.scrollBadgeText}>↕️ {facturas.length} facturas</Text>
                    </View>
                  )}
                  <View style={styles.tableHeaderFixed}>
                    <Text style={[styles.tableColHeader, styles.tableColNum]}>#</Text>
                    <Text style={[styles.tableColHeader, styles.tableColFactura]}>Factura</Text>
                    <Text style={[styles.tableColHeader, styles.tableColFecha]}>Fecha</Text>
                    <Text style={[styles.tableColHeader, styles.tableColTotal]}>Total</Text>
                  </View>
                  <ScrollView 
                    style={{
                      maxHeight: 450,
                      ...(Platform.OS === 'web' && { overflowY: 'auto', overflowX: 'hidden' })
                    }}
                    contentContainerStyle={styles.tableBodyContainer}
                    showsVerticalScrollIndicator
                    persistentScrollbar
                    nestedScrollEnabled
                  >
                    {facturas.map((item, index) => (
                      <TouchableOpacity
                        key={item.IdFactura || index}
                        onPress={() => handleFacturaPress(item)}
                      >
                        <View style={[
                          styles.tableRow,
                          index % 2 === 0 && styles.tableRowEven,
                          index === facturas.length - 1 && styles.tableRowLast
                        ]}>
                          <Text style={[styles.tableCol, styles.tableColNum]}>
                            {index + 1}
                          </Text>
                          <Text style={[styles.tableCol, styles.tableColFactura]}>
                            {item.NumeroFactura}
                          </Text>
                          <Text style={[styles.tableCol, styles.tableColFecha]}>
                            {formatDate(item.FechaFactura)}
                          </Text>
                          <Text style={[styles.tableCol, styles.tableColTotal]}>
                            ${item.PrecioConIVA || item.precioConIVA}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                {facturas.length > 7 && (
                  <Text style={styles.scrollIndicator}>
                    💡 Usa la barra de desplazamiento o la rueda del mouse para ver todas las facturas
                  </Text>
                )}
              </View>
            ) : (
              <FlatList
                key={flatListKey}
                data={facturas}
                numColumns={getNumColumns()}
                keyExtractor={(item, index) => item.IdFactura?.toString() || index.toString()}
                renderItem={renderItem}
                columnWrapperStyle={getNumColumns() > 1 ? styles.row : null}
                contentContainerStyle={[
                  styles.listContainer,
                  isLargeScreen && styles.listContainerLarge
                ]}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        )}

        <Modal 
          visible={modalVisible} 
          transparent 
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { width: getModalWidth(), maxHeight: getModalMaxHeight() }
              ]}
            >
              <EnhancedScrollView 
                contentContainerStyle={styles.modalScrollContent}
                style={[{ maxHeight: getModalMaxHeight() - 100 }, styles.forceScrollbar]}
                nestedScrollEnabled
              >
                {facturaSeleccionada ? (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={[
                        styles.modalTitle,
                        isLargeScreen && styles.modalTitleLarge
                      ]}>
                        🧾 Factura {facturaSeleccionada.NumeroFactura}
                      </Text>
                      <Text style={[
                        styles.modalSubtitle,
                        isLargeScreen && styles.modalSubtitleLarge
                      ]}>
                        Viajecitos S.A. | RUC: 1710708973001
                      </Text>
                      <Text style={[
                        styles.modalDate,
                        isLargeScreen && styles.modalDateLarge
                      ]}>
                        📅 Fecha de Emisión: {formatDate(facturaSeleccionada.FechaFactura)}
                      </Text>
                    </View>

                    <View className="section" style={styles.section}>
                      <Text style={[
                        styles.sectionTitle,
                        isLargeScreen && styles.sectionTitleLarge
                      ]}>
                        👤 Datos del Cliente
                      </Text>
                      <View style={[
                        styles.clientInfo,
                        isLargeScreen && styles.clientInfoLarge
                      ]}>
                        <Text style={[styles.sectionItem, isLargeScreen && styles.sectionItemLarge]}>
                          <Text style={styles.bold}>Nombre:</Text> {usuarioSeleccionado?.Nombre || 'Desconocido'}
                        </Text>
                        <Text style={[styles.sectionItem, isLargeScreen && styles.sectionItemLarge]}>
                          <Text style={styles.bold}>Cédula:</Text> {usuarioSeleccionado?.Cedula || '-'}
                        </Text>
                        <Text style={[styles.sectionItem, isLargeScreen && styles.sectionItemLarge]}>
                          <Text style={styles.bold}>Teléfono:</Text> {usuarioSeleccionado?.Telefono || '-'}
                        </Text>
                        <Text style={[styles.sectionItem, isLargeScreen && styles.sectionItemLarge]}>
                          <Text style={styles.bold}>Correo:</Text> {usuarioSeleccionado?.Correo || '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.section}>
                      <Text style={[
                        styles.sectionTitle,
                        isLargeScreen && styles.sectionTitleLarge
                      ]}>
                        🏦 Tipo de Pago
                      </Text>
                      <Text style={[
                        styles.sectionItem,
                        isLargeScreen && styles.sectionItemLarge
                      ]}>
                        {tipoPago}
                      </Text>
                    </View>

                    {tipoPago === 'Diferido (Crédito)' && amortizacion.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setModalAmortVisible(true)}
                        style={styles.verAmortBtn}
                      >
                        <Text style={styles.verAmortText}>📊 Ver tabla de amortización</Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.section}>
                      <Text style={[
                        styles.sectionTitle,
                        isLargeScreen && styles.sectionTitleLarge
                      ]}>
                        📄 Detalle de Boletos
                      </Text>

                      {isLargeScreen ? (
                        <View style={styles.boletosTableContainer}>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator
                            persistentScrollbar
                            indicatorStyle="black"
                            contentContainerStyle={styles.horizontalScrollContent}
                            style={{ maxHeight: 400 }}
                            nestedScrollEnabled
                          >
                            <View style={styles.boletosTable}>
                              <View style={styles.boletosTableHeader}>
                                <Text style={[styles.boletosTableColHeader, styles.boletosColNum]}>#</Text>
                                <Text style={[styles.boletosTableColHeader, styles.boletosColBoleto]}>Núm. Boleto</Text>
                                <Text style={[styles.boletosTableColHeader, styles.boletosColRuta]}>Ruta</Text>
                                <Text style={[styles.boletosTableColHeader, styles.boletosColFecha]}>Fecha Vuelo</Text>
                                <Text style={[styles.boletosTableColHeader, styles.boletosColAsiento]}>Asiento</Text>
                                <Text style={[styles.boletosTableColHeader, styles.boletosColPasajero]}>Pasajero</Text>
                                <Text style={[styles.boletosTableColHeader, styles.boletosColCedula]}>Cédula/ID</Text>
                                <Text style={[styles.boletosTableColHeader, styles.boletosColPrecio]}>Precio</Text>
                              </View>

                              <ScrollView
                                style={{ maxHeight: 350 }}
                                showsVerticalScrollIndicator
                                persistentScrollbar
                                nestedScrollEnabled
                              >
                                {boletosConDetalles.map((boleto, idx) => (
                                  <View
                                    key={idx}
                                    style={[
                                      styles.boletosTableRow,
                                      idx % 2 === 0 && styles.boletosTableRowEven
                                    ]}
                                  >
                                    <Text style={[styles.boletosTableCol, styles.boletosColNum]}>
                                      {idx + 1}
                                    </Text>
                                    <Text style={[styles.boletosTableCol, styles.boletosColBoleto]}>
                                      {boleto['a:NumeroBoleto'] || boleto.numeroBoleto || '—'}
                                    </Text>
                                    <Text style={[styles.boletosTableCol, styles.boletosColRuta]}>
                                      {`${boleto.ciudadOrigen} → ${boleto.ciudadDestino}`}
                                    </Text>
                                    <Text style={[styles.boletosTableCol, styles.boletosColFecha]}>
                                      {formatDateShort(boleto['a:FechaCompra'] || boleto.fechaCompra)}
                                    </Text>
                                    <Text style={[styles.boletosTableCol, styles.boletosColAsiento]}>
                                      💺 {boleto['a:NumeroAsiento'] ?? boleto.numeroAsiento ?? '—'}
                                    </Text>
                                    <Text style={[styles.boletosTableCol, styles.boletosColPasajero]} numberOfLines={2}>
                                      {boleto['a:NombrePropietario'] || boleto.nombrePropietario || 'Sin asignar'}
                                    </Text>
                                    <Text style={[styles.boletosTableCol, styles.boletosColCedula]}>
                                      {boleto['a:CedulaPropietario'] || boleto.cedulaPropietario || boleto['a:IdUsuarioBoleto'] || boleto.idUsuarioBoleto || '—'}
                                    </Text>
                                    <Text style={[styles.boletosTableCol, styles.boletosColPrecio]}>
                                      ${parseFloat(boleto['a:PrecioCompra'] || boleto.precioCompra || 0).toFixed(2)}
                                    </Text>
                                  </View>
                                ))}
                              </ScrollView>
                            </View>
                          </ScrollView>

                          {boletosConDetalles.length > 5 && (
                            <Text style={styles.scrollIndicator}>
                              💡 Tip: {Platform.OS === 'web' ? 'Usa las barras de scroll o la rueda del mouse' : 'Desliza'} para ver más {boletosConDetalles.length > 10 ? `(${boletosConDetalles.length} boletos en total)` : 'contenido'}
                            </Text>
                          )}
                        </View>
                      ) : (
                        <View style={styles.boletosCardContainer}>
                          {boletosConDetalles.map((boleto, idx) => (
                            <View key={idx} style={styles.boletoCard}>
                              <View style={styles.boletoCardHeader}>
                                <Text style={styles.boletoCardTitle}>🎫 Boleto #{idx + 1}</Text>
                                <Text style={styles.boletoCardNumber}>
                                  {boleto['a:NumeroBoleto'] || boleto.numeroBoleto || '—'}
                                </Text>
                              </View>

                              <View style={styles.boletoCardContent}>
                                <View style={styles.boletoCardSection}>
                                  <Text style={styles.boletoCardSectionTitle}>✈️ Información del Vuelo</Text>
                                  <View style={styles.boletoCardRow}>
                                    <Text style={styles.boletoCardLabel}>🛫 Ruta:</Text>
                                    <Text style={styles.boletoCardValue}>
                                      {`${boleto.ciudadOrigen} → ${boleto.ciudadDestino}`}
                                    </Text>
                                  </View>
                                  <View style={styles.boletoCardRow}>
                                    <Text style={styles.boletoCardLabel}>📅 Fecha:</Text>
                                    <Text style={styles.boletoCardValue}>
                                      {formatDateShort(boleto['a:FechaCompra'] || boleto.fechaCompra)}
                                    </Text>
                                  </View>
                                  <View style={styles.boletoCardRow}>
                                    <Text style={styles.boletoCardLabel}>💺 Asiento:</Text>
                                    <Text style={[styles.boletoCardValue, styles.asientoHighlight]}>
                                      {boleto['a:NumeroAsiento'] ?? boleto.numeroAsiento ?? 'Sin asignar'}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.boletoCardSection}>
                                  <Text style={styles.boletoCardSectionTitle}>👤 Información del Pasajero</Text>
                                  <View style={styles.boletoCardRow}>
                                    <Text style={styles.boletoCardLabel}>Nombre:</Text>
                                    <Text style={styles.boletoCardValue}>
                                      {boleto['a:NombrePropietario'] || boleto.nombrePropietario || 'Sin asignar'}
                                    </Text>
                                  </View>
                                  <View style={styles.boletoCardRow}>
                                    <Text style={styles.boletoCardLabel}>🆔 Documento:</Text>
                                    <Text style={styles.boletoCardValue}>
                                      {boleto['a:CedulaPropietario'] || boleto.cedulaPropietario || boleto['a:IdUsuarioBoleto'] || boleto.idUsuarioBoleto || 'Sin documento'}
                                    </Text>
                                  </View>
                                </View>

                                <View style={styles.boletoCardPriceSection}>
                                  <View style={styles.boletoCardRow}>
                                    <Text style={styles.boletoCardLabel}>💰 Precio:</Text>
                                    <Text style={styles.boletoCardPrice}>
                                      ${parseFloat(boleto['a:PrecioCompra'] || boleto.precioCompra || 0).toFixed(2)}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>

                    <View style={[styles.section, styles.totalSection]}>
                      {(() => {
                        const totales = calcularTotales(facturaSeleccionada);
                        return (
                          <>
                            <View style={styles.totalRow}>
                              <Text style={[styles.totalLabel, isLargeScreen && styles.totalLabelLarge]}>
                                🔢 Subtotal:
                              </Text>
                              <Text style={[styles.totalValue, isLargeScreen && styles.totalValueLarge]}>
                                ${totales.subtotal}
                              </Text>
                            </View>
                            <View style={styles.totalRow}>
                              <Text style={[styles.totalLabel, isLargeScreen && styles.totalLabelLarge]}>
                                🎯 Descuento:
                              </Text>
                              <Text style={[styles.totalValue, isLargeScreen && styles.totalValueLarge]}>
                                ${totales.descuento}
                              </Text>
                            </View>
                            <View style={styles.totalRow}>
                              <Text style={[styles.totalLabel, isLargeScreen && styles.totalLabelLarge]}>
                                💰 IVA (15%):
                              </Text>
                              <Text style={[styles.totalValue, isLargeScreen && styles.totalValueLarge]}>
                                ${totales.iva}
                              </Text>
                            </View>
                            <View style={[styles.totalRow, styles.totalRowFinal]}>
                              <Text style={[styles.totalLabel, styles.totalLabelFinal, isLargeScreen && styles.totalLabelFinalLarge]}>
                                💵 Total:
                              </Text>
                              <Text style={[styles.totalValue, styles.totalValueFinal, isLargeScreen && styles.totalValueFinalLarge]}>
                                ${totales.total}
                              </Text>
                            </View>
                          </>
                        );
                      })()}
                    </View>
                  </>
                ) : (
                  <View style={styles.loadingModal}>
                    <ActivityIndicator size="large" color="#4e88a9" />
                    <Text style={styles.loadingModalText}>Cargando detalles...</Text>
                  </View>
                )}
              </EnhancedScrollView>

              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                style={[
                  styles.closeBtn,
                  isLargeScreen && styles.closeBtnLarge
                ]}
              >
                <Text style={[
                  styles.closeText,
                  isLargeScreen && styles.closeTextLarge
                ]}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalAmortVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalAmortVisible(false)}
        >
          <View style={styles.amortModalOverlay}>
            <View
              style={[
                styles.amortModalContent,
                { width: isDesktop ? '50%' : isTablet ? '70%' : '92%', maxWidth: 700 }
              ]}
            >
              <Text style={[
                styles.amortModalTitle,
                isLargeScreen && styles.amortModalTitleLarge
              ]}>
                📑 Tabla de Amortización
              </Text>

              <View style={styles.amortTotalesContainer}>
                <View style={styles.amortTotalItem}>
                  <Text style={styles.amortTotalLabel}>Total Cuotas:</Text>
                  <Text style={styles.amortTotalValue}>{amortizacion.length}</Text>
                </View>
                <View style={styles.amortTotalItem}>
                  <Text style={styles.amortTotalLabel}>Total a Pagar:</Text>
                  <Text style={styles.amortTotalValue}>
                    ${amortizacion.reduce((sum, a) => sum + a.valorCuota, 0).toFixed(2)}
                  </Text>
                </View>
              </View>

              {amortizacion.length > 5 && (
                <Text style={styles.scrollIndicator}>
                  ↕️ Tabla scrolleable - Desliza para ver todas las cuotas
                </Text>
              )}

              {isLargeScreen ? (
                <EnhancedScrollView
                  horizontal={width < 600}
                  contentContainerStyle={styles.amortScrollContainer}
                  style={[{ maxHeight: 400 }, styles.forceScrollbar]}
                  nestedScrollEnabled
                >
                  <View style={styles.amortTable}>
                    <View style={styles.amortTableHeader}>
                      <Text style={[styles.amortTableColHeader, styles.amortColCuota]}>#</Text>
                      <Text style={[styles.amortTableColHeader, styles.amortColValor]}>Valor Cuota</Text>
                      <Text style={[styles.amortTableColHeader, styles.amortColInteres]}>Interés</Text>
                      <Text style={[styles.amortTableColHeader, styles.amortColCapital]}>Capital</Text>
                      <Text style={[styles.amortTableColHeader, styles.amortColSaldo]}>Saldo</Text>
                    </View>

                    {amortizacion.map((fila, idx) => (
                      <View
                        key={idx}
                        style={[styles.amortTableRow, idx % 2 === 0 && styles.amortTableRowEven]}
                      >
                        <Text style={[styles.amortTableCol, styles.amortColCuota]}>{fila.numeroCuota}</Text>
                        <Text style={[styles.amortTableCol, styles.amortColValor, styles.amortColBold]}>
                          ${fila.valorCuota.toFixed(2)}
                        </Text>
                        <Text style={[styles.amortTableCol, styles.amortColInteres]}>
                          ${fila.interesPagado.toFixed(2)}
                        </Text>
                        <Text style={[styles.amortTableCol, styles.amortColCapital]}>
                          ${fila.capitalPagado.toFixed(2)}
                        </Text>
                        <Text style={[styles.amortTableCol, styles.amortColSaldo, styles.amortColBold]}>
                          ${fila.saldo.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </EnhancedScrollView>
              ) : (
                <EnhancedScrollView style={[styles.amortCardsScrollView, styles.forceScrollbar]}>
                  {amortizacion.map((fila, idx) => (
                    <View
                      key={idx}
                      style={[styles.amortCard, idx === amortizacion.length - 1 && styles.amortCardLast]}
                    >
                      <View style={styles.amortCardHeader}>
                        <Text style={styles.amortCardTitle}>Cuota #{fila.numeroCuota}</Text>
                        <Text style={styles.amortCardValor}>${fila.valorCuota.toFixed(2)}</Text>
                      </View>

                      <View style={styles.amortCardBody}>
                        <View style={styles.amortCardRow}>
                          <View style={styles.amortCardItem}>
                            <Text style={styles.amortCardLabel}>💰 Interés</Text>
                            <Text style={styles.amortCardValue}>${fila.interesPagado.toFixed(2)}</Text>
                          </View>
                          <View style={styles.amortCardItem}>
                            <Text style={styles.amortCardLabel}>📊 Capital</Text>
                            <Text style={styles.amortCardValue}>${fila.capitalPagado.toFixed(2)}</Text>
                          </View>
                        </View>

                        <View style={styles.amortCardSaldo}>
                          <Text style={styles.amortCardSaldoLabel}>Saldo Pendiente</Text>
                          <Text style={[styles.amortCardSaldoValue, fila.saldo === 0 && styles.amortCardSaldoPagado]}>
                            ${fila.saldo.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </EnhancedScrollView>
              )}

              <View style={styles.amortResumen}>
                <Text style={styles.amortResumenText}>
                  💡 Total Intereses: ${amortizacion.reduce((sum, a) => sum + a.interesPagado, 0).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalAmortVisible(false)}
                style={[styles.amortCloseBtn, isLargeScreen && styles.amortCloseBtnLarge]}
              >
                <Text style={[styles.amortCloseText, isLargeScreen && styles.amortCloseTextLarge]}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>

      <View style={styles.menuButtonContainer}>
        <TouchableOpacity
          onPress={handleVolverMenu}
          style={styles.volverBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.volverText}>← Volver al Menú</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
