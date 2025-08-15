// styles/SelectorAsientosStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  containerDesktop: {
    backgroundColor: '#fff',
  },

  // Header - Más compacto en desktop
  header: {
    backgroundColor: '#35798e',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  headerDesktop: {
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  headerLargeDesktop: {
    padding: 15,
    paddingTop: 15,
    paddingBottom: 12,
  },

  headerInfo: {
    alignItems: 'center',
    marginTop: 5,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },

  tituloDesktop: {
    fontSize: 20,
    marginBottom: 3,
  },

  subtitulo: {
    fontSize: 14,
    color: '#e8f4f8',
    marginTop: 2,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6c757d',
  },

  // Leyenda - Más compacta
  leyenda: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  leyendaDesktop: {
    marginHorizontal: 'auto',
    marginTop: 10,
    padding: 10,
    maxWidth: 400,
    borderRadius: 8,
  },

  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leyendaColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  asientoDisponibleLeyenda: {
    backgroundColor: '#fff',
  },

  asientoSeleccionadoLeyenda: {
    backgroundColor: '#4CAF50',
  },

  asientoOcupadoLeyenda: {
    backgroundColor: '#f44336',
  },

  leyendaTexto: {
    fontSize: 12,
    color: '#666',
  },

  // Scroll y contenedor del avión - Optimizado para desktop
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },

  scrollContainerDesktop: {
    marginTop: 5,
    maxHeight: 450, // Limitar altura en desktop
  },

  scrollContent: {
    paddingBottom: 20,
  },

  scrollContentDesktop: {
    paddingBottom: 10,
    alignItems: 'center',
  },

  avion: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  avionDesktop: {
    paddingHorizontal: 20,
    minWidth: 500,
  },

  avionLargeDesktop: {
    paddingHorizontal: 30,
    minWidth: 600,
  },

  // Frente del avión - Más pequeño en desktop
  frenteAvion: {
    width: '80%',
    maxWidth: 400,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  frenteAvionDesktop: {
    width: 300,
    height: 30,
    marginBottom: 15,
  },

  frenteAvionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },

  // Columnas de referencia
  columnasRef: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingHorizontal: 30,
  },

  columnaRefText: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },

  columnaRefTextDesktop: {
    width: 35,
    fontSize: 11,
  },

  pasilloRef: {
    width: 30,
  },

  pasilloRefDesktop: {
    width: 25,
  },

  // Filas
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },

  numeroFila: {
    width: 25,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },

  numeroFilaDesktop: {
    width: 30,
    fontSize: 11,
  },

  asientosFila: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Asientos - Más pequeños en desktop
  asiento: {
    width: 40,
    height: 40,
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  asientoDesktop: {
    width: 35,
    height: 35,
    margin: 2,
    borderRadius: 6,
    borderWidth: 1.5,
  },

  asientoLargeDesktop: {
    width: 40,
    height: 40,
  },

  asientoOcupado: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    opacity: 0.6,
  },

  asientoSeleccionado: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },

  asientoTexto: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },

  asientoTextoDesktop: {
    fontSize: 9,
  },

  asientoTextoSeleccionado: {
    color: '#fff',
  },

  asientoTextoOcupado: {
    color: '#999',
  },

  pasillo: {
    width: 30,
    height: 40,
  },

  pasilloDesktop: {
    width: 25,
    height: 35,
  },

  // Resumen - Más compacto
  resumen: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  resumenDesktop: {
    marginHorizontal: 'auto',
    marginTop: 5,
    padding: 10,
    maxWidth: 600,
    width: '90%',
  },

  resumenTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  resumenAsientos: {
    flexDirection: 'row',
    gap: 10,
  },

  resumenAsiento: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#35798e',
    minWidth: 80,
    alignItems: 'center',
  },

  resumenAsientoNumero: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#35798e',
  },

  resumenAsientoNombre: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },

  resumenAsientoEdit: {
    fontSize: 10,
    marginTop: 2,
  },

  // Botón auto-llenar todos
  btnAutoLlenarTodos: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  btnAutoLlenarTodosDesktop: {
    marginHorizontal: 'auto',
    maxWidth: 400,
    paddingVertical: 10,
    marginTop: 5,
  },

  btnAutoLlenarTodosText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Botones - Más compactos en desktop
  botones: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },

  botonesDesktop: {
    paddingHorizontal: 'auto',
    paddingVertical: 10,
    maxWidth: 500,
    width: '90%',
    marginHorizontal: 'auto',
  },

  btn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  btnCancelar: {
    backgroundColor: '#6c757d',
  },

  btnConfirmar: {
    backgroundColor: '#35798e',
  },

  btnDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Formulario de datos
  formularioContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },

  formularioContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  formularioContentDesktop: {
    padding: 30,
    maxWidth: 500,
  },

  formularioTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },

  formularioGrupo: {
    marginBottom: 15,
  },

  formularioLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },

  formularioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  inputAutoLlenado: {
    backgroundColor: '#e8f4f8',
    borderColor: '#35798e',
  },

  btnAutoLlenar: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  btnAutoLlenarText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },

  formularioBotones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  formularioBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  formularioBtnCancelar: {
    backgroundColor: '#6c757d',
  },

  formularioBtnGuardar: {
    backgroundColor: '#4CAF50',
  },

  formularioBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});