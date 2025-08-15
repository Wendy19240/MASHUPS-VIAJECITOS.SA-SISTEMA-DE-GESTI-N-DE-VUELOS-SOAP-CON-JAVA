// styles/CarritoModalStyles.js (ACTUALIZADO)
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Modal container
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  modalContentDesktop: {
    width: '70%',
    maxWidth: 800,
    maxHeight: '85%',
    padding: 30,
  },

  carritoModal: {
    maxHeight: '90%',
  },

  // Header
  carritoHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#35798e',
    textAlign: 'center',
    marginBottom: 20,
  },

  carritoHeaderDesktop: {
    fontSize: 28,
    marginBottom: 25,
  },

  // Lista de items
  carritoListaContainer: {
    marginBottom: 20,
  },

  carritoItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  carritoItemDesktop: {
    padding: 20,
    borderRadius: 15,
  },

  carritoInfo: {
    flex: 1,
    marginRight: 10,
  },

  carritoVuelo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  carritoRuta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },

  carritoFecha: {
    fontSize: 13,
    color: '#888',
    marginBottom: 5,
  },

  carritoSubtotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#35798e',
    marginTop: 5,
  },

  // Información de asientos seleccionados
  asientosSeleccionadosInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },

  asientosSeleccionadosLabel: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },

  // Controles del carrito
  carritoControles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  carritoBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#35798e',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

  carritoBtnDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
  },

  carritoBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  carritoCantidad: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },

  carritoEliminar: {
    marginLeft: 5,
    padding: 5,
  },

  carritoEliminarText: {
    fontSize: 20,
  },

  // Resumen
  carritoResumen: {
    backgroundColor: '#35798e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  carritoResumenDesktop: {
    padding: 20,
    borderRadius: 15,
  },

  carritoTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  carritoTotalDesktop: {
    fontSize: 24,
  },

  carritoTotalBoletos: {
    fontSize: 14,
    color: '#e8f4f8',
    marginTop: 5,
  },

  // Carrito vacío
  carritoVacio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 40,
  },

  // Tipo de pago
  tipoPagoContainer: {
    marginBottom: 20,
  },

  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },

  tipoPagoBotones: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  tipoPagoBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },

  tipoPagoBtnDiferido: {
    backgroundColor: '#fff3e0',
  },

  tipoPagoBtnSelected: {
    borderColor: '#35798e',
    backgroundColor: '#e8f4f8',
  },

  tipoPagoBtnText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },

  tipoPagoBtnTextSelected: {
    color: '#35798e',
    fontWeight: 'bold',
  },

  // Cuotas
  cuotasContainer: {
    marginTop: 10,
  },

  cuotasLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },

  cuotasScroll: {
    paddingVertical: 5,
    gap: 10,
  },

  cuotaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 10,
  },

  cuotaBtnSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
  },

  cuotaBtnText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },

  cuotaBtnTextSelected: {
    color: '#333',
    fontWeight: 'bold',
  },

  // Botón ver amortización
  btnVerAmortizacion: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Nota sobre asientos
  notaAsientos: {
    backgroundColor: '#e8f4f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#35798e',
  },

  notaAsientosText: {
    fontSize: 14,
    color: '#35798e',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Botón comprar
  btnComprarTodo: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  btnComprarTodoDesktop: {
    paddingVertical: 20,
    borderRadius: 15,
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Botón cerrar
  modalCloseButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});