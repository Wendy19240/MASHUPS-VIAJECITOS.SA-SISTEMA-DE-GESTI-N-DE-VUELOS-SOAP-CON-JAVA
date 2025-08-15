import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const AUTH_SERVICE_URL = process.env.EXPO_PUBLIC_AUTH_SERVICE_URL;
const parser = new XMLParser({ 
  ignoreAttributes: false,
  removeNSPrefix: true // Esto ayuda a manejar los namespaces
});

// 🔹 LOGIN (definido en WSDL)
export const login = async (username, password) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:ws="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <ws:login>
        <arg0>${username}</arg0>
        <arg1>${password}</arg1>
      </ws:login>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const { data } = await axios.post(AUTH_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    console.log('Respuesta SOAP completa:', data); // Para debug

    const json = parser.parse(data);
    console.log('JSON parseado:', JSON.stringify(json, null, 2)); // Para debug

    // Manejo más flexible de namespaces
    let usuario = null;
    
    // Opción 1: Con namespace S:
    if (json?.['Envelope']?.['Body']?.['loginResponse']?.['return']) {
      usuario = json['Envelope']['Body']['loginResponse']['return'];
    }
    // Opción 2: Con S:Envelope (sin removeNSPrefix)
    else if (json?.['S:Envelope']?.['S:Body']?.['ns2:loginResponse']?.['return']) {
      usuario = json['S:Envelope']['S:Body']['ns2:loginResponse']['return'];
    }
    // Opción 3: Buscar en toda la estructura
    else {
      // Buscar el objeto 'return' en cualquier parte de la respuesta
      const findReturn = (obj) => {
        if (obj && typeof obj === 'object') {
          if (obj.return) return obj.return;
          for (let key in obj) {
            const result = findReturn(obj[key]);
            if (result) return result;
          }
        }
        return null;
      };
      usuario = findReturn(json);
    }

    if (!usuario || !usuario.idUsuario) {
      console.error('No se encontró usuario en la respuesta');
      return null;
    }

    // Convertir la respuesta al formato esperado
    const usuarioFormateado = {
      IdUsuario: parseInt(usuario.idUsuario),
      Nombre: usuario.nombre,
      Username: usuario.username,
      Password: usuario.password,
      Telefono: usuario.telefono,
      Cedula: usuario.cedula,
      Correo: usuario.correo
    };

    console.log('Usuario formateado:', usuarioFormateado); // Para debug
    return usuarioFormateado;

  } catch (error) {
    console.error('❌ Error en login (SOAP):', error);
    console.error('Detalles del error:', error.response?.data || error.message);
    return null;
  }
};

// 🔹 CREAR USUARIO (definido en WSDL)
export const crearUsuario = async (usuario) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:ws="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <ws:crearUsuario>
        <arg0>
          <cedula>${usuario.Cedula}</cedula>
          <correo>${usuario.Correo}</correo>
          <idUsuario>${usuario.IdUsuario || 0}</idUsuario>
          <nombre>${usuario.Nombre}</nombre>
          <password>${usuario.Password}</password>
          <telefono>${usuario.Telefono}</telefono>
          <username>${usuario.Username}</username>
        </arg0>
      </ws:crearUsuario>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const { data } = await axios.post(AUTH_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    console.log('Respuesta crearUsuario:', data); // Para debug

    const json = parser.parse(data);
    
    // Buscar la respuesta con manejo flexible de namespaces
    let result = null;
    
    if (json?.['Envelope']?.['Body']?.['crearUsuarioResponse']?.['return']) {
      result = json['Envelope']['Body']['crearUsuarioResponse']['return'];
    } else if (json?.['S:Envelope']?.['S:Body']?.['ns2:crearUsuarioResponse']?.['return']) {
      result = json['S:Envelope']['S:Body']['ns2:crearUsuarioResponse']['return'];
    } else {
      // Buscar 'return' en cualquier parte
      const findReturn = (obj) => {
        if (obj && typeof obj === 'object') {
          if (obj.return !== undefined) return obj.return;
          for (let key in obj) {
            const res = findReturn(obj[key]);
            if (res !== null) return res;
          }
        }
        return null;
      };
      result = findReturn(json);
    }

    return result === 'true' || result === true;

  } catch (error) {
    console.error('❌ Error en crearUsuario (SOAP):', error);
    console.error('Detalles del error:', error.response?.data || error.message);
    return false;
  }
};