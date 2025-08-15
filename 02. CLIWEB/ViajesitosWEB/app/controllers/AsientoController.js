// controllers/AsientoController.js
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const COMPRAS_SERVICE_URL = process.env.EXPO_PUBLIC_COMPRAS_SERVICE_URL;
// Si quieres habilitar simulación solo en desarrollo, pon esta var en true
const USE_SEAT_SIMULATION = process.env.EXPO_PUBLIC_USE_SEAT_SIMULATION === 'true';

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true
});

// Obtiene los números de asientos OCUPADOS de un vuelo desde el SOAP
export const obtenerAsientosDisponibles = async (idVuelo) => {
  if (!idVuelo && idVuelo !== 0) {
    throw new Error('idVuelo no proporcionado');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:con="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <con:obtenerAsientosOcupados>
        <idVuelo>${idVuelo}</idVuelo>
      </con:obtenerAsientosOcupados>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    if (!COMPRAS_SERVICE_URL) {
      throw new Error('EXPO_PUBLIC_COMPRAS_SERVICE_URL no configurada');
    }

    const { data } = await axios.post(COMPRAS_SERVICE_URL, xml, {
      headers: {
        'Content-Type': 'text/xml; charset=UTF-8'
        // 'SOAPAction': '' // descomenta si tu servidor lo exige
      },
      timeout: 15000
    });

    const json = parser.parse(data);

    // Localiza la respuesta sin importar prefijos/espacios de nombres
    let asientos = null;

    // Caso común sin prefijos
    if (json?.Envelope?.Body?.obtenerAsientosOcupadosResponse) {
      asientos = json.Envelope.Body.obtenerAsientosOcupadosResponse.return;
    }

    // Variante con prefijo S:
    if (!asientos && json?.['S:Envelope']?.['S:Body']) {
      const body = json['S:Envelope']['S:Body'];
      const key = Object.keys(body).find(k => k.includes('obtenerAsientosOcupados'));
      if (key) {
        asientos = body[key].return ?? body[key]['return'];
      }
    }

    // Si el servicio devuelve vacío, interpretamos "ninguno ocupado"
    if (asientos == null) {
      return [];
    }

    // Normaliza a array de enteros
    const lista = Array.isArray(asientos) ? asientos : [asientos];

    const asientosOcupados = lista
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          // Maneja casos tipo { "#text": "17" } o { numeroAsiento: "17" }
          const raw =
            item['#text'] ??
            item.numeroAsiento ??
            item.value ??
            Object.values(item)[0];
          return parseInt(raw, 10);
        }
        return parseInt(item, 10);
      })
      .filter((n) => Number.isFinite(n));

    return asientosOcupados;
  } catch (err) {
    console.error('Error obteniendo asientos ocupados:', err?.message || err);
    if (USE_SEAT_SIMULATION) {
      console.warn('⚠️ Simulación de asientos ACTIVADA por configuración.');
      // --- Simulación opcional (activar con EXPO_PUBLIC_USE_SEAT_SIMULATION=true) ---
      const asientosSimulados = new Set();
      const totalAsientos = 120;
      const porcentajeOcupacion = 0.3;
      const asientosAOcupar = Math.floor(totalAsientos * porcentajeOcupacion);
      while (asientosSimulados.size < asientosAOcupar) {
        asientosSimulados.add(Math.floor(Math.random() * totalAsientos) + 1);
      }
      return Array.from(asientosSimulados);
    }
    // Sin simulación: falla para que la UI muestre el error
    throw new Error('No se pudieron obtener los asientos desde el servidor');
  }
};

// Re-verifica en backend si una lista de asientos está libre
export const verificarDisponibilidadAsientos = async (idVuelo, numerosAsiento) => {
  try {
    const ocupados = await obtenerAsientosDisponibles(idVuelo);
    const noDisponibles = numerosAsiento.filter((n) => ocupados.includes(n));
    return {
      disponibles: noDisponibles.length === 0,
      asientosNoDisponibles: noDisponibles
    };
  } catch (error) {
    console.error('Error verificando disponibilidad:', error?.message || error);
    return {
      disponibles: false,
      asientosNoDisponibles: []
    };
  }
};
