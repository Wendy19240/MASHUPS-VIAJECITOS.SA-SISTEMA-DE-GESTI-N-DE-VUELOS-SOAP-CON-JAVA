// styles/VueloItemStyles.js (ACTUALIZADO)
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Cards base
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '100%',
    position: 'relative',
  },
  
  cardDesktop: {
    padding: 28,
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    flex: 1,
    maxWidth: 520,
    minHeight: 380,
  },
  
  cardRestricted: {
    opacity: 0.8,
    borderWidth: 2,
    borderColor: '#ffc107',
    backgroundColor: '#fffbf0',
  },

  cardEnCarrito: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff9',
  },

  // Badge en carrito
  badgeEnCarrito: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 1,
  },

  badgeEnCarritoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Título
  title: { 
    fontSize: 18,
    fontWeight: 'bold', 
    marginBottom: 16,
    marginTop: 10,
    color: '#35798e',
    textAlign: 'center',
  },
  
  // Información del vuelo
  vueloInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  
  vueloInfoDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  
  infoColumn: {
    flex: 1,
    minWidth: 100,
    marginBottom: 8,
  },
  
  infoLabel: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 2,
  },
  
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
  },

  // Información de escalas
  escalasInfo: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },

  escalasText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '600',
  },
  
  // Disponibilidad
  disponibilidadInfo: {
    backgroundColor: '#e8f4f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#35798e',
  },

  disponibilidadBaja: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#dc3545',
  },
  
  disponibilidadText: {
    fontSize: 14,
    color: '#35798e',
    textAlign: 'center',
    fontWeight: '500',
  },

  disponibilidadTextBaja: {
    color: '#dc3545',
    fontWeight: 'bold',
  },

  // Info de compra
  infoCompra: {
    backgroundColor: '#f0f9ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },

  infoCompraText: {
    fontSize: 12,
    color: '#0369a1',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Restricciones
  restriccionFecha: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  
  restriccionFechaText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // Contenedor de botones de acción
  botonesAccion: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  
  // Botón Ver Ruta
  btnVerRuta: {
    backgroundColor: '#17a2b8',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    flex: 0.4,
  },
  
  // Botón agregar
  btnAgregar: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    flex: 0.6,
  },
  
  btnAgregarDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },

  // Botón en carrito
  btnEnCarrito: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    flex: 0.6,
    borderWidth: 2,
    borderColor: '#388E3C',
  },

  btnEnCarritoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  btnEnCarritoSubtext: {
    color: '#e8f5e9',
    fontSize: 12,
    marginTop: 2,
  },
  
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  btnTextSecundario: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});