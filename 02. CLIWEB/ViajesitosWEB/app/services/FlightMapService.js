
import { obtenerVueloPorId } from '../controllers/VueloController';
import { obtenerCiudadPorId } from '../controllers/CiudadController';

// Coordenadas de los aeropuertos principales
// ✅ COORDENADAS AMPLIADAS: Más aeropuertos y ciudades
const AIRPORT_COORDINATES = {
  // Ecuador
  'UIO': { latitude: -0.1293, longitude: -78.3575, name: 'Quito - Mariscal Sucre' },
  'GYE': { latitude: -2.1574, longitude: -79.8836, name: 'Guayaquil - José Joaquín de Olmedo' },
  'CUE': { latitude: -2.8894, longitude: -78.9844, name: 'Cuenca - Mariscal Lamar' },
  'LTX': { latitude: -3.2553, longitude: -79.9617, name: 'Loja - Camilo Ponce Enríquez' },
  'ESM': { latitude: -1.0342, longitude: -79.6268, name: 'Esmeraldas - Carlos Concha Torres' },
  'MEC': { latitude: -1.5081, longitude: -78.6165, name: 'Manta - Eloy Alfaro' },
  
  // Panamá
  'PTY': { latitude: 9.0714, longitude: -79.3835, name: 'Panamá - Tocumen International' },
  'PAC': { latitude: 8.9733, longitude: -79.5556, name: 'Panamá - Pacifico' },
  
  // México
  'MEX': { latitude: 19.4363, longitude: -99.0721, name: 'Ciudad de México - Benito Juárez' },
  'CUN': { latitude: 21.0365, longitude: -86.8773, name: 'Cancún International' },
  'GDL': { latitude: 20.5218, longitude: -103.3119, name: 'Guadalajara - Miguel Hidalgo' },
  'MTY': { latitude: 25.7785, longitude: -100.1069, name: 'Monterrey - General Mariano Escobedo' },
  
  // Estados Unidos
  'WAS': { latitude: 38.9531, longitude: -77.4565, name: 'Washington - Dulles International' },
  'IAD': { latitude: 38.9531, longitude: -77.4565, name: 'Washington - Dulles International' },
  'DCA': { latitude: 38.8521, longitude: -77.0377, name: 'Washington - National' },
  'BWI': { latitude: 39.1754, longitude: -76.6683, name: 'Baltimore-Washington' },
  'JFK': { latitude: 40.6413, longitude: -73.7781, name: 'Nueva York - JFK' },
  'LGA': { latitude: 40.7769, longitude: -73.8740, name: 'Nueva York - LaGuardia' },
  'EWR': { latitude: 40.6895, longitude: -74.1745, name: 'Nueva York - Newark' },
  'LAX': { latitude: 33.9425, longitude: -118.4081, name: 'Los Ángeles International' },
  'MIA': { latitude: 25.7617, longitude: -80.1918, name: 'Miami International' },
  'ORD': { latitude: 41.9786, longitude: -87.9048, name: 'Chicago - O\'Hare' },
  'ATL': { latitude: 33.6407, longitude: -84.4277, name: 'Atlanta - Hartsfield-Jackson' },
  
  // Reino Unido
  'LCY': { latitude: 51.5048, longitude: 0.0495, name: 'Londres - City Airport' },
  'LHR': { latitude: 51.4700, longitude: -0.4543, name: 'Londres - Heathrow' },
  'LGW': { latitude: 51.1481, longitude: -0.1903, name: 'Londres - Gatwick' },
  'STN': { latitude: 51.8860, longitude: 0.2389, name: 'Londres - Stansted' },
  
  // España
  'MAD': { latitude: 40.4936, longitude: -3.5668, name: 'Madrid - Barajas' },
  'BCN': { latitude: 41.2974, longitude: 2.0833, name: 'Barcelona - El Prat' },
  'VLC': { latitude: 39.4893, longitude: -0.4816, name: 'Valencia' },
  'SVQ': { latitude: 37.4180, longitude: -5.8931, name: 'Sevilla - San Pablo' },
  
  // Francia
  'CDG': { latitude: 49.0097, longitude: 2.5479, name: 'París - Charles de Gaulle' },
  'ORY': { latitude: 48.7262, longitude: 2.3652, name: 'París - Orly' },
  
  // Alemania
  'FRA': { latitude: 50.0264, longitude: 8.5431, name: 'Frankfurt am Main' },
  'MUC': { latitude: 48.3538, longitude: 11.7861, name: 'Múnich - Franz Josef Strauss' },
  
  // Colombia
  'BOG': { latitude: 4.7016, longitude: -74.1469, name: 'Bogotá - El Dorado' },
  'MDE': { latitude: 6.1645, longitude: -75.4231, name: 'Medellín - José María Córdova' },
  'CLO': { latitude: 3.5430, longitude: -76.3816, name: 'Cali - Alfonso Bonilla Aragón' },
  'CTG': { latitude: 10.4424, longitude: -75.5130, name: 'Cartagena - Rafael Núñez' },
  
  // Perú
  'LIM': { latitude: -12.0219, longitude: -77.1143, name: 'Lima - Jorge Chávez' },
  'CUZ': { latitude: -13.5358, longitude: -71.9388, name: 'Cusco - Alejandro Velasco Astete' },
  
  // Brasil
  'GRU': { latitude: -23.4356, longitude: -46.4731, name: 'São Paulo - Guarulhos' },
  'GIG': { latitude: -22.8070, longitude: -43.2435, name: 'Río de Janeiro - Galeão' },
  'BSB': { latitude: -15.8697, longitude: -47.9208, name: 'Brasilia - Presidente Juscelino Kubitschek' },
  
  // Argentina
  'EZE': { latitude: -34.8222, longitude: -58.5358, name: 'Buenos Aires - Ezeiza' },
  'AEP': { latitude: -34.5592, longitude: -58.4156, name: 'Buenos Aires - Jorge Newbery' },
  
  // Chile
  'SCL': { latitude: -33.3927, longitude: -70.7858, name: 'Santiago - Arturo Merino Benítez' },
};



// ✅ FUNCIÓN MEJORADA: Obtener coordenadas con mejor logging
const getCoordinatesForCity = (cityCode) => {
  if (!cityCode) {
    console.warn('⚠️ getCoordinatesForCity: cityCode es null o undefined');
    return null;
  }
  
  const upperCityCode = cityCode.toUpperCase();
  const coordinates = AIRPORT_COORDINATES[upperCityCode];
  
  if (coordinates) {
    console.log(`✅ Coordenadas encontradas para ${upperCityCode}:`, {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      name: coordinates.name
    });
    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    };
  } else {
    console.warn(`⚠️ No se encontraron coordenadas para el código: ${upperCityCode}`);
    console.log('📍 Códigos disponibles:', Object.keys(AIRPORT_COORDINATES).join(', '));
    return null;
  }
};

// ✅ FUNCIÓN NUEVA: Buscar ciudad por nombre
const findCityByName = (cityName) => {
  if (!cityName) return null;
  
  const normalizedSearch = cityName.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  for (const [code, data] of Object.entries(AIRPORT_COORDINATES)) {
    const normalizedName = data.name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    if (normalizedName.includes(normalizedSearch) || 
        normalizedSearch.includes(normalizedName.split(' - ')[0])) {
      console.log(`🎯 Ciudad encontrada por nombre: ${cityName} -> ${code} (${data.name})`);
      return {
        code,
        coordinates: {
          latitude: data.latitude,
          longitude: data.longitude
        },
        name: data.name
      };
    }
  }
  
  console.warn(`⚠️ No se encontró ciudad por nombre: ${cityName}`);
  return null;
};

// ✅ FUNCIÓN NUEVA: Obtener coordenadas con fallback inteligente
const getCoordinatesWithFallback = (cityCode, cityName) => {
  console.log(`🔍 Buscando coordenadas para: código="${cityCode}", nombre="${cityName}"`);
  
  // Primero intentar por código
  if (cityCode) {
    const coordsByCode = getCoordinatesForCity(cityCode);
    if (coordsByCode) {
      return coordsByCode;
    }
  }
  
  // Si no funciona, intentar por nombre
  if (cityName) {
    const cityByName = findCityByName(cityName);
    if (cityByName) {
      return cityByName.coordinates;
    }
  }
  
  // Si aún no funciona, intentar extraer código del nombre
  if (cityName && !cityCode) {
    const extractedCode = extractCodeFromCityName(cityName);
    if (extractedCode) {
      const coordsByExtractedCode = getCoordinatesForCity(extractedCode);
      if (coordsByExtractedCode) {
        console.log(`✅ Coordenadas encontradas con código extraído: ${cityName} -> ${extractedCode}`);
        return coordsByExtractedCode;
      }
    }
  }
  
  console.error(`❌ No se pudieron obtener coordenadas para: código="${cityCode}", nombre="${cityName}"`);
  return null;
};

// ✅ FUNCIÓN NUEVA: Validar y limpiar datos de vuelo
const validateAndCleanFlightData = (flightData) => {
  console.group('🧹 VALIDANDO Y LIMPIANDO DATOS DE VUELO');
  
  const cleaned = { ...flightData };
  
  // Validar y limpiar origen
  if (!cleaned.originCoords) {
    const originCode = cleaned.codigoOrigen || cleaned.origen;
    const originName = cleaned.ciudadOrigen || cleaned.nombreCiudadOrigen;
    cleaned.originCoords = getCoordinatesWithFallback(originCode, originName);
  }
  
  // Validar y limpiar destino
  if (!cleaned.destinationCoords) {
    const destinationCode = cleaned.codigoDestino || cleaned.destino;
    const destinationName = cleaned.ciudadDestino || cleaned.nombreCiudadDestino;
    cleaned.destinationCoords = getCoordinatesWithFallback(destinationCode, destinationName);
  }
  
  // Validar y limpiar escalas
  if (cleaned.stops && Array.isArray(cleaned.stops)) {
    cleaned.stops = cleaned.stops.map((stop, index) => {
      if (!stop.coords) {
        const stopCoords = getCoordinatesWithFallback(stop.codigo, stop.nombre);
        if (stopCoords) {
          return { ...stop, coords: stopCoords };
        } else {
          console.warn(`⚠️ No se pudieron obtener coordenadas para escala ${index + 1}:`, stop);
          return null;
        }
      }
      return stop;
    }).filter(Boolean); // Remover escalas sin coordenadas
  }
  
  console.log('✅ Datos limpiados:', cleaned);
  console.groupEnd();
  
  return cleaned;
};

// ✅ FUNCIÓN NUEVA: Debug completo del mapa
const debugMapGeneration = (flightData) => {
  console.group('🗺️ DEBUG GENERACIÓN DEL MAPA');
  
  console.log('📊 Resumen de datos:');
  console.log(`  - Origen: ${flightData.ciudadOrigen} (${flightData.codigoOrigen || 'sin código'})`);
  console.log(`  - Destino: ${flightData.ciudadDestino} (${flightData.codigoDestino || 'sin código'})`);
  console.log(`  - Escalas: ${flightData.stops?.length || 0}`);
  
  console.log('📍 Coordenadas:');
  console.log('  - Origen:', flightData.originCoords);
  console.log('  - Destino:', flightData.destinationCoords);
  
  if (flightData.stops && flightData.stops.length > 0) {
    console.log('  - Escalas:');
    flightData.stops.forEach((stop, index) => {
      console.log(`    ${index + 1}. ${stop.nombre} (${stop.codigo}):`, stop.coords);
    });
  }
  
  // Verificar que todas las coordenadas sean válidas
  const allCoords = [
    { name: 'Origen', coords: flightData.originCoords },
    { name: 'Destino', coords: flightData.destinationCoords },
    ...flightData.stops.map((stop, index) => ({
      name: `Escala ${index + 1} (${stop.nombre})`,
      coords: stop.coords
    }))
  ];
  
  console.log('🔍 Validación de coordenadas:');
  allCoords.forEach(({ name, coords }) => {
    const isValid = validateCoordinates(coords, name);
    console.log(`  ${isValid ? '✅' : '❌'} ${name}: ${isValid ? 'Válidas' : 'Inválidas'}`);
  });
  
  console.groupEnd();
};

// ✅ FUNCIÓN NUEVA: Generar URL de prueba para el mapa
const generateTestMapUrl = (flightData) => {
  const cleanedData = validateAndCleanFlightData(flightData);
  debugMapGeneration(cleanedData);
  
  // Generar URL simple para prueba
  const origin = `${cleanedData.originCoords.latitude},${cleanedData.originCoords.longitude}`;
  const destination = `${cleanedData.destinationCoords.latitude},${cleanedData.destinationCoords.longitude}`;
  
  let pathPoints = [origin];
  
  if (cleanedData.stops && cleanedData.stops.length > 0) {
    cleanedData.stops
      .sort((a, b) => (a.orden || 0) - (b.orden || 0))
      .forEach(stop => {
        if (stop.coords) {
          pathPoints.push(`${stop.coords.latitude},${stop.coords.longitude}`);
        }
      });
  }
  
  pathPoints.push(destination);
  
  const testUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=color:0x0000ff|weight:5|${pathPoints.join('|')}&markers=color:green|label:A|${origin}&markers=color:red|label:B|${destination}&key=YOUR_API_KEY`;
  
  console.log('🧪 URL de prueba generada (reemplaza YOUR_API_KEY):', testUrl);
  
  return testUrl;
};


// Función para calcular tiempo de vuelo estimado
const calculateFlightDuration = (distance, stopsCount = 0) => {
  const avgSpeedKmh = 800; // Velocidad promedio de crucero
  const flightHours = distance / avgSpeedKmh;
  const layoverHours = stopsCount * 1.5; // 1.5 horas por escala
  const totalHours = flightHours + layoverHours;
  
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  
  return `${hours}h ${minutes}m`;
};

// Función para calcular hora de llegada estimada
const calculateArrivalTime = (departureTime, duration) => {
  try {
    // Parsear hora de salida
    const [datePart, timePart] = departureTime.split('T');
    const [hours, minutes] = timePart.split(':');
    
    // Extraer duración
    const durationMatch = duration.match(/(\d+)h\s+(\d+)m/);
    if (!durationMatch) return 'Por calcular';
    
    const durationHours = parseInt(durationMatch[1]);
    const durationMinutes = parseInt(durationMatch[2]);
    
    // Calcular hora de llegada
    let arrivalHours = parseInt(hours) + durationHours;
    let arrivalMinutes = parseInt(minutes) + durationMinutes;
    
    if (arrivalMinutes >= 60) {
      arrivalHours += Math.floor(arrivalMinutes / 60);
      arrivalMinutes = arrivalMinutes % 60;
    }
    
    // Formatear hora de llegada
    const formattedHours = String(arrivalHours % 24).padStart(2, '0');
    const formattedMinutes = String(arrivalMinutes).padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
  } catch (error) {
    console.error('Error calculando hora de llegada:', error);
    return 'Por calcular';
  }
};

// Función principal para preparar datos del vuelo para el mapa
// ✅ FUNCIÓN CORREGIDA: Preparar datos del vuelo para el mapa
export const prepareFlightDataForMap = async (vuelo) => {
  try {
    console.group('🗺️ PREPARANDO DATOS DEL VUELO PARA EL MAPA');
    console.log('📥 Datos de entrada:', vuelo);
    
    // Obtener información completa del vuelo si es necesario
    let vueloCompleto = vuelo;
    
    // Si tenemos escalasCollection en los datos originales, las usamos
    if (vuelo.escalasCollection && vuelo.escalasCollection.length > 0) {
      vueloCompleto = vuelo;
      console.log('📋 Usando escalas del objeto original:', vuelo.escalasCollection);
    }
    // Si no tenemos escalas pero tenemos ID, intentamos obtener el vuelo completo
    else if (!vuelo.escalasCollection && (vuelo.IdVuelo || vuelo.idVuelo)) {
      try {
        const vueloDetallado = await obtenerVueloPorId(vuelo.IdVuelo || vuelo.idVuelo);
        vueloCompleto = { ...vuelo, ...vueloDetallado };
        console.log('🔍 Vuelo detallado obtenido:', vueloDetallado);
      } catch (error) {
        console.warn('⚠️ No se pudo obtener vuelo detallado:', error);
        vueloCompleto = vuelo;
      }
    }
    
    // ✅ CORREGIDO: Mejor extracción de códigos de origen y destino
    const originCode = extractCityCode(vuelo, 'origin');
    const destinationCode = extractCityCode(vuelo, 'destination');
    
    console.log('🎯 Códigos extraídos:', { originCode, destinationCode });
    
    const originCoords = getCoordinatesForCity(originCode);
    const destinationCoords = getCoordinatesForCity(destinationCode);
    
    // ✅ CORREGIDO: Validación más estricta de coordenadas
    if (!validateCoordinates(originCoords, 'Origen') || 
        !validateCoordinates(destinationCoords, 'Destino')) {
      console.error('❌ Coordenadas faltantes o inválidas:', { 
        originCode, 
        destinationCode, 
        originCoords, 
        destinationCoords 
      });
      throw new Error(`No se pudieron obtener coordenadas válidas: origen=${originCode}, destino=${destinationCode}`);
    }
    
    // ✅ CORREGIDO: Procesamiento mejorado de escalas
    const stops = await processFlightStops(vueloCompleto);
    
    console.log('🛑 Escalas procesadas finales:', stops);
    
    // Calcular distancia total
    const points = [originCoords, ...stops.map(s => s.coords), destinationCoords];
    let totalDistance = 0;
    
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += calculateDistance(points[i], points[i + 1]);
    }
    
    // Calcular duración del vuelo
    const duration = calculateFlightDuration(totalDistance, stops.length);
    
    // Preparar hora de salida
    const horaSalida = vuelo.horaSalida || 
                      vuelo.HoraSalida || 
                      vueloCompleto.horaSalida || 
                      'No disponible';
    
    const horaLlegada = calculateArrivalTime(horaSalida, duration);
    
    const result = {
      idVuelo: vuelo.IdVuelo || vuelo.idVuelo || vuelo.id,
      codigoVuelo: vuelo.CodigoVuelo || vuelo.codigoVuelo || vuelo.codigo || vueloCompleto.codigoVuelo || 'N/A',
      origen: vuelo.nombreCiudadOrigen || vuelo.origen || originCode,
      destino: vuelo.nombreCiudadDestino || vuelo.destino || destinationCode,
      ciudadOrigen: vuelo.nombreCiudadOrigen || vuelo.CiudadOrigen?.nombre || vuelo.idCiudadOrigen?.nombreCiudad || vuelo.origen,
      ciudadDestino: vuelo.nombreCiudadDestino || vuelo.CiudadDestino?.nombre || vuelo.idCiudadDestino?.nombreCiudad || vuelo.destino,
      originCoords,
      destinationCoords,
      stops,
      horaSalida: formatTime(horaSalida),
      horaLlegada,
      duracion: duration,
      distancia: Math.round(totalDistance)
    };
    
    console.log('✅ Datos del vuelo preparados:', result);
    console.groupEnd();
    return result;
    
  } catch (error) {
    console.error('❌ Error preparando datos del vuelo:', error);
    console.groupEnd();
    throw error;
  }
};

// ✅ FUNCIÓN NUEVA: Validar coordenadas
const validateCoordinates = (coords, name) => {
  if (!coords) {
    console.error(`❌ ${name}: Coordenadas faltantes`);
    return false;
  }
  
  if (typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
    console.error(`❌ ${name}: Coordenadas no son números`, coords);
    return false;
  }
  
  if (isNaN(coords.latitude) || isNaN(coords.longitude)) {
    console.error(`❌ ${name}: Coordenadas son NaN`, coords);
    return false;
  }
  
  if (Math.abs(coords.latitude) > 90 || Math.abs(coords.longitude) > 180) {
    console.error(`❌ ${name}: Coordenadas fuera de rango válido`, coords);
    return false;
  }
  
  console.log(`✅ ${name}: Coordenadas válidas`, coords);
  return true;
};

// ✅ FUNCIÓN MEJORADA: Extraer código de ciudad
const extractCityCode = (vuelo, type) => {
  let code = null;
  
  if (type === 'origin') {
    code = vuelo.codigoOrigen || 
           vuelo.CiudadOrigen?.codigo || 
           vuelo.CiudadOrigen?.codigoCiudad ||
           vuelo.idCiudadOrigen?.codigoCiudad ||
           vuelo.idCiudadOrigen?.codigo;
    
    // Si no tenemos código, intentar extraer del nombre
    if (!code) {
      const cityName = vuelo.nombreCiudadOrigen || 
                      vuelo.CiudadOrigen?.nombre || 
                      vuelo.idCiudadOrigen?.nombreCiudad ||
                      vuelo.origen;
      code = extractCodeFromCityName(cityName);
    }
  } else {
    code = vuelo.codigoDestino || 
           vuelo.CiudadDestino?.codigo || 
           vuelo.CiudadDestino?.codigoCiudad ||
           vuelo.idCiudadDestino?.codigoCiudad ||
           vuelo.idCiudadDestino?.codigo;
    
    // Si no tenemos código, intentar extraer del nombre
    if (!code) {
      const cityName = vuelo.nombreCiudadDestino || 
                      vuelo.CiudadDestino?.nombre || 
                      vuelo.idCiudadDestino?.nombreCiudad ||
                      vuelo.destino;
      code = extractCodeFromCityName(cityName);
    }
  }
  
  console.log(`🏷️ Código extraído para ${type}:`, code);
  return code;
};

// ✅ FUNCIÓN NUEVA: Procesar escalas del vuelo de manera más robusta
const processFlightStops = async (vueloCompleto) => {
  const stops = [];
  
  // Manejar escalas del SOAP response
  const escalasCollection = vueloCompleto.escalasCollection || [];
  console.log('🔍 Escalas a procesar:', escalasCollection);
  
  if (escalasCollection && escalasCollection.length > 0) {
    for (const [index, escala] of escalasCollection.entries()) {
      console.log(`📍 Procesando escala ${index + 1}:`, escala);
      
      // ✅ CORREGIDO: Acceder correctamente a los datos de la escala
      let stopCode, stopName, stopOrder;
      
      // Verificar diferentes estructuras posibles
      if (escala.idCiudad) {
        // Estructura del VueloController después del mapeo
        stopCode = escala.idCiudad.codigo || escala.idCiudad.codigoCiudad;
        stopName = escala.idCiudad.nombre || escala.idCiudad.nombreCiudad;
        stopOrder = escala.ordenEscala;
      } else if (escala.ciudad) {
        // Otra posible estructura
        stopCode = escala.ciudad.codigo || escala.ciudad.codigoCiudad;
        stopName = escala.ciudad.nombre || escala.ciudad.nombreCiudad;
        stopOrder = escala.ordenEscala || escala.orden;
      } else {
        // Estructura directa del SOAP
        stopCode = escala.codigoCiudad || escala.codigo;
        stopName = escala.nombreCiudad || escala.nombre;
        stopOrder = escala.ordenEscala || escala.orden;
      }
      
      // Si no tenemos código pero tenemos nombre, intentar extraer
      if (!stopCode && stopName) {
        stopCode = extractCodeFromCityName(stopName);
      }
      
      // Si aún no tenemos código, intentar obtener datos de la ciudad
      if (!stopCode && escala.idCiudad && (typeof escala.idCiudad === 'string' || typeof escala.idCiudad === 'number')) {
        try {
          const ciudadCompleta = await obtenerCiudadPorId(escala.idCiudad);
          stopCode = ciudadCompleta?.codigo || ciudadCompleta?.codigoCiudad;
          stopName = ciudadCompleta?.nombre || ciudadCompleta?.nombreCiudad || stopName;
          console.log(`🏙️ Datos de ciudad obtenidos: ${stopName} (${stopCode})`);
        } catch (error) {
          console.warn(`⚠️ No se pudo obtener datos de ciudad para ID: ${escala.idCiudad}`, error);
        }
      }
      
      const stopCoords = getCoordinatesForCity(stopCode);
      
      console.log('🛑 Datos de escala extraídos:', { 
        stopCode, 
        stopName,
        stopOrder,
        stopCoords,
        originalEscala: escala
      });
      
      // ✅ CORREGIDO: Validar coordenadas antes de agregar
      if (stopCoords && validateCoordinates(stopCoords, `Escala ${stopName}`)) {
        stops.push({
          nombre: stopName || stopCode || `Escala ${index + 1}`,
          codigo: stopCode,
          coords: stopCoords,
          orden: stopOrder || (index + 1)
        });
        console.log('✅ Escala añadida:', stops[stops.length - 1]);
      } else {
        console.warn('⚠️ Escala descartada por coordenadas inválidas:', {
          stopCode,
          stopName,
          stopCoords
        });
      }
    }
  }
  
  // Ordenar escalas por orden
  stops.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  
  return stops;
};

// ✅ FUNCIÓN MEJORADA: Extraer código del nombre de ciudad
const extractCodeFromCityName = (cityName) => {
  if (!cityName) return null;
  
  // Normalizar el nombre (quitar acentos, convertir a minúsculas)
  const normalizedName = cityName.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  const cityMappings = {
    'quito': 'UIO',
    'guayaquil': 'GYE',
    'cuenca': 'CUE',
    'tocumen': 'PTY',
    'panama': 'PTY',
    'ciudad de mexico': 'MEX',
    'mexico': 'MEX',
    'washington': 'WAS',
    'washington dulles': 'IAD',
    'dulles': 'IAD',
    'londres': 'LCY',
    'london': 'LCY',
    'inglaterra': 'LCY'
  };
  
  // Buscar coincidencia exacta primero
  if (cityMappings[normalizedName]) {
    console.log(`🎯 Código encontrado por coincidencia exacta: ${cityName} -> ${cityMappings[normalizedName]}`);
    return cityMappings[normalizedName];
  }
  
  // Buscar coincidencia parcial
  for (const [name, code] of Object.entries(cityMappings)) {
    if (normalizedName.includes(name) || name.includes(normalizedName)) {
      console.log(`🎯 Código encontrado por coincidencia parcial: ${cityName} -> ${code}`);
      return code;
    }
  }
  
  console.warn(`⚠️ No se encontró código para la ciudad: ${cityName}`);
  return null;
};

// ✅ FUNCIÓN ADICIONAL: Debug completo de una escala
const debugStopData = (escala, index) => {
  console.group(`🔍 DEBUG ESCALA ${index + 1}`);
  console.log('Estructura completa:', escala);
  console.log('Propiedades disponibles:', Object.keys(escala));
  
  if (escala.idCiudad) {
    console.log('idCiudad encontrado:', escala.idCiudad);
    console.log('Tipo de idCiudad:', typeof escala.idCiudad);
    if (typeof escala.idCiudad === 'object') {
      console.log('Propiedades de idCiudad:', Object.keys(escala.idCiudad));
    }
  }
  
  console.log('ordenEscala:', escala.ordenEscala);
  console.log('orden:', escala.orden);
  console.groupEnd();
};

// Función auxiliar para extraer código de ciudad del nombre


// Función para calcular distancia entre dos coordenadas
const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Función para formatear hora
const formatTime = (timeString) => {
  if (!timeString || timeString === 'No disponible') return 'N/A';
  
  try {
    if (timeString.includes('T')) {
      const [, timePart] = timeString.split('T');
      const [hours, minutes] = timePart.split(':');
      return `${hours}:${minutes}`;
    }
    return timeString;
  } catch (error) {
    return timeString;
  }
};

// Función para obtener datos de vuelo por ID de boleto
export const getFlightDataForTicket = async (boleto) => {
  try {
    console.log('🎫 Obteniendo datos de vuelo para boleto:', boleto);
    
    // Si el boleto ya tiene información del vuelo
    if (boleto.vuelo) {
      return prepareFlightDataForMap({
        idVuelo: boleto.vuelo.id || boleto.idVuelo,
        codigoVuelo: boleto.vuelo.codigo,
        origen: boleto.vuelo.origen,
        destino: boleto.vuelo.destino,
        horaSalida: boleto.vuelo.horaSalida,
        codigoOrigen: boleto.vuelo.codigoOrigen,
        codigoDestino: boleto.vuelo.codigoDestino
      });
    }
    
    // Si solo tenemos el ID del vuelo
    if (boleto.idVuelo) {
      const vueloCompleto = await obtenerVueloPorId(boleto.idVuelo);
      return prepareFlightDataForMap(vueloCompleto);
    }
    
    throw new Error('No se pudo obtener información del vuelo');
  } catch (error) {
    console.error('❌ Error obteniendo datos del vuelo:', error);
    throw error;
  }
};
// Función exportada para obtener coordenadas (usada por ComprarBoletoView)
export const obtenerCoordenadas = (cityCode) => {
  return getCoordinatesForCity(cityCode);
};