// styles/ComprarBoletoStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedores principales
  scroll: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  
  container: {
    padding: 16,
    alignItems: 'center',
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  
  vuelosContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  
  vueloRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 16,
  },
  
  // Loading
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  
  // Carrito flotante
  carritoFloating: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#35798e',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 1000,
    minWidth: 200,
  },
  
  carritoFloatingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Modal de mensajes
  modalMensajeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },

  modalMensajeContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  modalMensajeContentDesktop: {
    padding: 32,
    maxWidth: 500,
  },

  modalMensajeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    color: '#333',
    paddingHorizontal: 8,
  },

  modalMensajeButton: {
    backgroundColor: '#35798e',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  modalMensajeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Botón volver al menú
  volverContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginTop: 20,
  },
  
  volverBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 220,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  volverBtnDesktop: {
    paddingVertical: 20,
    paddingHorizontal: 48,
    minWidth: 280,
    borderRadius: 20,
    elevation: 4,
  },
  
  volverText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Texto informativo
  noVuelos: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    fontSize: 16,
    color: '#6c757d',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
});