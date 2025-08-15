// styles/FormularioBusquedaStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedor del formulario
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  formContainerDesktop: {
    padding: 40,
    maxWidth: 1200,
    marginBottom: 32,
  },
  
  // Header
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#35798e',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Filas del formulario
  formRow: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 16,
  },
  
  formRowDesktop: {
    flexDirection: 'row',
    gap: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  // Grupos del formulario
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  
  formGroupDesktop: {
    flex: 1,
    marginBottom: 20,
  },
  
  formGroupCentered: {
    alignItems: 'center',
    maxWidth: 350,
    alignSelf: 'center',
    marginBottom: 24,
  },
  
  // Subtítulos
  subheader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  
  // Input
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  
  inputDesktop: {
    maxWidth: 350,
    fontSize: 18,
    padding: 20,
  },
  
  // Grid de ciudades
  ciudadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  
  // Botones de ciudad
  ciudadBtn: {
    backgroundColor: '#e9ecef',
    padding: 10,
    marginRight: 6,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 100,
  },
  
  ciudadBtnDesktop: {
    backgroundColor: '#e9ecef',
    padding: 16,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 140,
    maxWidth: 180,
  },
  
  ciudadBtnSelected: {
    backgroundColor: '#35798e',
    borderColor: '#2c6678',
    transform: [{ scale: 1.02 }],
  },
  
  ciudadText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  ciudadTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Contenedor de selector horizontal
  selectorContainer: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  // Botón de búsqueda
  btnBuscar: {
    backgroundColor: '#35798e',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  btnBuscarDesktop: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    maxWidth: 350,
    alignSelf: 'center',
    marginTop: 32,
  },
  
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});