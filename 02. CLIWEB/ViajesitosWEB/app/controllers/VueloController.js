// VueloController.js - Versión corregida para Java SOAP con escalas

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const VUELOS_SERVICE_URL = process.env.EXPO_PUBLIC_VUELOS_SERVICE_URL;

// Configuración del parser para manejar arrays correctamente
const parser = new XMLParser({ 
  ignoreAttributes: false,
  removeNSPrefix: true,
  parseTagValue: true,
  parseAttributeValue: true,
  trimValues: true,
  parseTrueNumberOnly: true,
  arrayMode: false,
  isArray: (name, jpath, isLeafNode, isAttribute) => {
    // Forzar que escalasCollection siempre sea un array
    if (name === 'escalasCollection') {
      return true;
    }
    return false;
  }
});

// Función auxiliar para parsear respuestas SOAP
const parseSOAPResponse = (xmlData, responseName) => {
  const json = parser.parse(xmlData);
  
  // Buscar la respuesta en diferentes posibles ubicaciones
  let response = null;
  
  // Con removeNSPrefix: true
  if (json?.Envelope?.Body?.[responseName]) {
    response = json.Envelope.Body[responseName];
  }
  // Sin removeNSPrefix o con estructura S:Envelope
  else if (json?.['S:Envelope']?.['S:Body']) {
    const body = json['S:Envelope']['S:Body'];
    for (let key in body) {
      if (key.includes(responseName.replace('Response', ''))) {
        response = body[key];
        break;
      }
    }
  }

  // Para getVuelos, return es un array
  if (responseName === 'getVuelosResponse') {
    const returnData = response?.return || response?.['return'] || null;
    return Array.isArray(returnData) ? returnData : [returnData].filter(Boolean);
  }
  
  // Para otros métodos, return es un objeto
  return response?.return || response?.['return'] || null;
};

// 🔹 1. Obtener todos los vuelos
export const obtenerVuelos = async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:con="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <con:getVuelos/>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    console.log('📤 Enviando request para obtener todos los vuelos');
    
    const { data } = await axios.post(VUELOS_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    console.log('📥 Respuesta SOAP recibida');

    const vuelos = parseSOAPResponse(data, 'getVuelosResponse');
    
    if (!vuelos || vuelos.length === 0) {
      console.log('No se encontraron vuelos');
      return [];
    }
    
    console.log(`Se encontraron ${vuelos.length} vuelos`);

    return vuelos.map(v => {
      // Procesar escalas si existen
      let escalas = [];
      
      if (v.escalasCollection && v.escalasCollection.length > 0) {
        console.log(`🔍 Vuelo ${v.codigoVuelo} tiene ${v.escalasCollection.length} escalas`);
        
        escalas = v.escalasCollection.map(escala => ({
          idEscala: parseInt(escala.idEscala),
          ordenEscala: parseInt(escala.ordenEscala),
          idCiudad: {
            id: parseInt(escala.idCiudad?.idCiudad),
            codigo: escala.idCiudad?.codigoCiudad,
            nombre: escala.idCiudad?.nombreCiudad
          }
        }));
      }

      return {
        IdVuelo: parseInt(v.idVuelo),
        CodigoVuelo: v.codigoVuelo,
        HoraSalida: v.horaSalida,
        Valor: parseFloat(v.valor),
        Capacidad: parseInt(v.capacidad),
        Disponibles: parseInt(v.disponibles),
        CiudadOrigen: {
          id: parseInt(v.idCiudadOrigen?.idCiudad),
          codigo: v.idCiudadOrigen?.codigoCiudad,
          nombre: v.idCiudadOrigen?.nombreCiudad
        },
        CiudadDestino: {
          id: parseInt(v.idCiudadDestino?.idCiudad),
          codigo: v.idCiudadDestino?.codigoCiudad,
          nombre: v.idCiudadDestino?.nombreCiudad
        },
        escalasCollection: escalas
      };
    });
  } catch (err) {
    console.error('❌ Error al obtener vuelos:', err);
    console.error('Detalles:', err.response?.data || err.message);
    return [];
  }
};

// 🔹 2. Buscar vuelos por criterios (origen, destino, fecha)
export const buscarVuelos = async (origen, destino, fecha) => {
  try {
    console.log('🔍 Buscando vuelos:', { origen, destino, fecha });
    
    // Primero obtenemos todos los vuelos
    const todosLosVuelos = await obtenerVuelos();
    
    if (!todosLosVuelos || todosLosVuelos.length === 0) {
      console.log('No hay vuelos disponibles');
      return [];
    }
    
    // Filtrar por origen, destino y fecha
    const vuelosFiltrados = todosLosVuelos.filter(vuelo => {
      const coincideOrigen = vuelo.CiudadOrigen.codigo === origen;
      const coincideDestino = vuelo.CiudadDestino.codigo === destino;
      
      // Comparar solo la fecha (sin hora)
      const fechaVuelo = vuelo.HoraSalida.split('T')[0];
      const coincideFecha = fechaVuelo === fecha;
      
      return coincideOrigen && coincideDestino && coincideFecha;
    });
    
    console.log(`Se encontraron ${vuelosFiltrados.length} vuelos que coinciden con los criterios`);
    
    return vuelosFiltrados;
  } catch (err) {
    console.error('❌ Error al buscar vuelos:', err);
    return [];
  }
};

// 🔹 3. Obtener vuelo por ID
export const obtenerVueloPorId = async (idVuelo) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:con="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <con:obtenerVueloPorId>
        <arg0>${idVuelo}</arg0>
      </con:obtenerVueloPorId>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    console.log('📤 Enviando request para obtener vuelo ID:', idVuelo);
    
    const { data } = await axios.post(VUELOS_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    const vuelo = parseSOAPResponse(data, 'obtenerVueloPorIdResponse');
    
    if (!vuelo) {
      console.log('Vuelo no encontrado');
      return null;
    }

    // Procesar escalas si existen
    let escalas = [];
    if (vuelo.escalasCollection && vuelo.escalasCollection.length > 0) {
      console.log(`🔍 Vuelo ${vuelo.codigoVuelo} tiene ${vuelo.escalasCollection.length} escalas`);
      
      escalas = vuelo.escalasCollection.map(escala => ({
        idEscala: parseInt(escala.idEscala),
        ordenEscala: parseInt(escala.ordenEscala),
        idCiudad: {
          id: parseInt(escala.idCiudad?.idCiudad),
          codigo: escala.idCiudad?.codigoCiudad,
          nombre: escala.idCiudad?.nombreCiudad
        }
      }));
    }

    return {
      IdVuelo: parseInt(vuelo.idVuelo),
      CodigoVuelo: vuelo.codigoVuelo,
      HoraSalida: vuelo.horaSalida,
      Valor: parseFloat(vuelo.valor),
      Capacidad: parseInt(vuelo.capacidad),
      Disponibles: parseInt(vuelo.disponibles),
      CiudadOrigen: {
        id: parseInt(vuelo.idCiudadOrigen?.idCiudad),
        codigo: vuelo.idCiudadOrigen?.codigoCiudad,
        nombre: vuelo.idCiudadOrigen?.nombreCiudad
      },
      CiudadDestino: {
        id: parseInt(vuelo.idCiudadDestino?.idCiudad),
        codigo: vuelo.idCiudadDestino?.codigoCiudad,
        nombre: vuelo.idCiudadDestino?.nombreCiudad
      },
      escalasCollection: escalas
    };
  } catch (err) {
    console.error('❌ Error al obtener vuelo por ID:', err);
    return null;
  }
};

// 🔹 4. Actualizar disponibilidad de vuelo (después de compra)
export const actualizarDisponibilidadVuelo = async (idVuelo, cantidadComprada) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:con="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <con:actualizarDisponibilidad>
        <arg0>${idVuelo}</arg0>
        <arg1>${cantidadComprada}</arg1>
      </con:actualizarDisponibilidad>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    console.log(`📤 Actualizando disponibilidad del vuelo ${idVuelo}, cantidad: ${cantidadComprada}`);
    
    const { data } = await axios.post(VUELOS_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    const result = parseSOAPResponse(data, 'actualizarDisponibilidadResponse');
    
    return result === 'true' || result === true;
  } catch (err) {
    console.error('❌ Error al actualizar disponibilidad:', err);
    return false;
  }
};