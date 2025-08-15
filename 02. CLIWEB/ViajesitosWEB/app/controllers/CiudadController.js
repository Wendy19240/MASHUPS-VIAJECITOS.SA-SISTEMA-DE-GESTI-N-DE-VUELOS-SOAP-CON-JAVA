// CiudadController.js - Versión corregida para Java SOAP

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const VUELOS_SERVICE_URL = process.env.EXPO_PUBLIC_VUELOS_SERVICE_URL;
const parser = new XMLParser({ 
  ignoreAttributes: false,
  removeNSPrefix: true
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

  return response?.return || response?.['return'] || null;
};

// 🔹 1. Obtener todas las ciudades
export const obtenerCiudades = async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:con="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <con:getCiudades/>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    console.log('📤 Enviando request para obtener ciudades');
    
    const { data } = await axios.post(VUELOS_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    console.log('📥 Respuesta SOAP recibida');

    const ciudades = parseSOAPResponse(data, 'getCiudadesResponse');
    
    if (!ciudades) {
      console.log('No se encontraron ciudades');
      return [];
    }

    // Asegurar que sea un array
    const listaCiudades = Array.isArray(ciudades) ? ciudades : [ciudades];
    
    console.log(`Se encontraron ${listaCiudades.length} ciudades`);

    return listaCiudades.map(c => ({
      id: parseInt(c.idCiudad),
      codigo: c.codigoCiudad,
      nombre: c.nombreCiudad
    }));
  } catch (err) {
    console.error('❌ Error al obtener ciudades:', err);
    console.error('Detalles:', err.response?.data || err.message);
    return [];
  }
};

// 🔹 2. Obtener ciudad por ID
export const obtenerCiudadPorId = async (idCiudad) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:con="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <con:obtenerCiudadPorId>
        <arg0>${idCiudad}</arg0>
      </con:obtenerCiudadPorId>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    console.log('📤 Enviando request para obtener ciudad ID:', idCiudad);
    
    const { data } = await axios.post(VUELOS_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    const ciudad = parseSOAPResponse(data, 'obtenerCiudadPorIdResponse');
    
    if (!ciudad) {
      console.log('Ciudad no encontrada');
      return null;
    }

    return {
      id: parseInt(ciudad.idCiudad),
      codigo: ciudad.codigoCiudad,
      nombre: ciudad.nombreCiudad
    };
  } catch (err) {
    console.error('❌ Error al obtener ciudad por ID:', err);
    return null;
  }
};

// 🔹 3. Buscar ciudad por código
export const buscarCiudadPorCodigo = async (codigoCiudad) => {
  try {
    console.log('🔍 Buscando ciudad por código:', codigoCiudad);
    
    // Obtener todas las ciudades y filtrar
    const todasLasCiudades = await obtenerCiudades();
    
    const ciudad = todasLasCiudades.find(c => c.codigo === codigoCiudad);
    
    if (!ciudad) {
      console.log('Ciudad no encontrada con código:', codigoCiudad);
      return null;
    }
    
    return ciudad;
  } catch (err) {
    console.error('❌ Error al buscar ciudad por código:', err);
    return null;
  }
};