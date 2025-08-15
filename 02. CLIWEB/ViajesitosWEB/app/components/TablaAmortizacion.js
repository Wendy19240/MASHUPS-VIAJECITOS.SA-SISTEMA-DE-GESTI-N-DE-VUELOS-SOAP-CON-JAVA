// components/TablaAmortizacion.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function TablaAmortizacion({ 
  visible, 
  onClose, 
  tablaAmortizacion, 
  numeroCuotas,
  isDesktop 
}) {
  if (!tablaAmortizacion) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalAmortizacionContainer}>
        <View style={[
          styles.modalAmortizacionContent,
          isDesktop && styles.modalAmortizacionContentDesktop
        ]}>
          <ScrollView 
            contentContainerStyle={styles.modalAmortizacionScroll}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.modalAmortizacionTitle}>
              📄 Resumen de Cuotas
            </Text>

            <View style={styles.resumenAmortizacion}>
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>💳 Cuotas Totales:</Text>
                <Text style={styles.resumenValue}>{numeroCuotas}</Text>
              </View>
              
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>💵 Cuota Mensual:</Text>
                <Text style={styles.resumenValue}>
                  ${tablaAmortizacion.cuotaMensual}
                </Text>
              </View>
              
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>📊 Total Intereses:</Text>
                <Text style={[styles.resumenValue, styles.resumenValueRed]}>
                  ${tablaAmortizacion.interesTotal}
                </Text>
              </View>
              
              <View style={[styles.resumenRow, styles.resumenRowTotal]}>
                <Text style={styles.resumenLabelTotal}>💰 Total a Pagar:</Text>
                <Text style={styles.resumenValueTotal}>
                  ${(numeroCuotas * parseFloat(tablaAmortizacion.cuotaMensual || 0)).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Tabla detallada (solo para desktop) */}
            {isDesktop && tablaAmortizacion.tabla && (
              <View style={styles.tablaDetalleContainer}>
                <Text style={styles.tablaDetalleTitle}>Detalle por Cuota</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View style={styles.tablaDetalle}>
                    <View style={styles.tablaDetalleHeader}>
                      <Text style={[styles.tablaDetalleCell, styles.tablaCellSmall]}>Cuota</Text>
                      <Text style={styles.tablaDetalleCell}>Valor</Text>
                      <Text style={styles.tablaDetalleCell}>Interés</Text>
                      <Text style={styles.tablaDetalleCell}>Capital</Text>
                      <Text style={styles.tablaDetalleCell}>Saldo</Text>
                    </View>
                    {tablaAmortizacion.tabla.map((fila, idx) => (
                      <View key={idx} style={[
                        styles.tablaDetalleRow,
                        idx % 2 === 0 && styles.tablaDetalleRowEven
                      ]}>
                        <Text style={[styles.tablaDetalleCell, styles.tablaCellSmall]}>
                          {fila.cuota}
                        </Text>
                        <Text style={styles.tablaDetalleCell}>
                          ${fila.valorCuota}
                        </Text>
                        <Text style={styles.tablaDetalleCell}>
                          ${fila.interes}
                        </Text>
                        <Text style={styles.tablaDetalleCell}>
                          ${fila.capital}
                        </Text>
                        <Text style={styles.tablaDetalleCell}>
                          ${fila.saldo}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              onPress={onClose}
              style={styles.modalAmortizacionCloseBtn}
            >
              <Text style={styles.modalAmortizacionCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalAmortizacionContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  modalAmortizacionContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  modalAmortizacionContentDesktop: {
    maxWidth: 600,
    padding: 32,
  },

  modalAmortizacionScroll: {
    paddingBottom: 16,
  },

  modalAmortizacionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f6476',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Resumen de amortización
  resumenAmortizacion: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 20,
  },

  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },

  resumenRowTotal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#dee2e6',
    marginBottom: 0,
  },

  resumenLabel: {
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },

  resumenLabelTotal: {
    fontSize: 16,
    color: '#2f6476',
    fontWeight: 'bold',
  },

  resumenValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },

  resumenValueRed: {
    color: '#dc3545',
  },

  resumenValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f6476',
  },

  // Tabla detallada (desktop)
  tablaDetalleContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },

  tablaDetalleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#495057',
    textAlign: 'center',
  },

  tablaDetalle: {
    minWidth: 500,
  },

  tablaDetalleHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  tablaDetalleRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  tablaDetalleRowEven: {
    backgroundColor: '#f9f9f9',
  },

  tablaDetalleCell: {
    width: 90,
    textAlign: 'center',
    fontSize: 14,
    color: '#212529',
  },

  tablaCellSmall: {
    width: 50,
    fontWeight: 'bold',
  },

  // Botón cerrar
  modalAmortizacionCloseBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
    elevation: 2,
  },

  modalAmortizacionCloseBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});