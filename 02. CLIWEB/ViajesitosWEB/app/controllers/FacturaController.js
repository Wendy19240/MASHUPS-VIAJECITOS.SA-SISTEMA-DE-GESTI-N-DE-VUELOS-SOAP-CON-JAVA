import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const COMPRAS_SERVICE_URL = process.env.EXPO_PUBLIC_COMPRAS_SERVICE_URL;
const parser = new XMLParser({ 
  ignoreAttributes: false,
  removeNSPrefix: false // Mantener prefijos para mejor control
});

// 🔹 1. Obtener facturas por usuario
export const getFacturasPorUsuario = async (idUsuario) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:con="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <con:getFacturasPorUsuario>
        <arg0>${idUsuario}</arg0>
      </con:getFacturasPorUsuario>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    console.log('📤 Enviando request para obtener facturas del usuario:', idUsuario);
    
    const { data } = await axios.post(COMPRAS_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    console.log('📥 Respuesta SOAP recibida');

    const json = parser.parse(data);
    const facturas = json['S:Envelope']?.['S:Body']?.['ns2:getFacturasPorUsuarioResponse']?.return;
    
    if (!facturas) {
      console.log('No se encontraron facturas');
      return [];
    }

    // Asegurar que sea un array
    const listaFacturas = Array.isArray(facturas) ? facturas : [facturas];
    
    console.log(`Se encontraron ${listaFacturas.length} facturas`);

    return listaFacturas.map(f => {
      // Procesar boletos de la factura
      let boletos = [];
      if (f.boletosCollection) {
        const boletosArray = Array.isArray(f.boletosCollection) ? 
          f.boletosCollection : [f.boletosCollection];
        
        boletos = boletosArray.map(b => ({
          'a:IdBoleto': b.idBoleto,
          'a:NumeroBoleto': b.numeroBoleto,
          'a:FechaCompra': b.fechaCompra,
          'a:PrecioCompra': b.precioCompra,
          'a:IdVuelo': b.idVuelo?.idVuelo,
            // 🔹 NUEVO: datos de asiento y pasajero
          'a:NumeroAsiento': b.idAsiento?.numeroAsiento ?? null,
          'a:IdAsiento': b.idAsiento?.idAsiento ?? null,
          'a:NombrePropietario': b.nombrePropietario ?? '',
          'a:CedulaPropietario': b.cedulaPropietario ?? '',
          'a:IdUsuarioBoleto': b.idUsuario?.idUsuario ?? null,
            // Estructura plana adicional por comodidad
          idBoleto: parseInt(b.idBoleto),
          numeroBoleto: b.numeroBoleto,
          fechaCompra: b.fechaCompra,
          precioCompra: parseFloat(b.precioCompra),
          idVuelo: b.idVuelo?.idVuelo ? parseInt(b.idVuelo.idVuelo) : null,
          numeroAsiento: b.idAsiento?.numeroAsiento ?? null,
          idAsiento: b.idAsiento?.idAsiento ? parseInt(b.idAsiento.idAsiento) : null,
          nombrePropietario: b.nombrePropietario ?? '',
          cedulaPropietario: b.cedulaPropietario ?? '',
          idUsuarioBoleto: b.idUsuario?.idUsuario ? parseInt(b.idUsuario.idUsuario) : null,

          // Información adicional del vuelo
          vuelo: b.idVuelo ? {
            codigo: b.idVuelo.codigoVuelo,
            ciudadOrigen: b.idVuelo.idCiudadOrigen?.nombreCiudad,
            ciudadDestino: b.idVuelo.idCiudadDestino?.nombreCiudad,
            horaSalida: b.idVuelo.horaSalida
          } : null
        }));
      }

      // Procesar amortizaciones de la factura
      let amortizaciones = [];
      if (f.amortizacionBoletosCollection) {
        const amortizacionesArray = Array.isArray(f.amortizacionBoletosCollection) ? 
          f.amortizacionBoletosCollection : [f.amortizacionBoletosCollection];
        
        // Ordenar por número de cuota
        amortizaciones = amortizacionesArray
          .map(a => ({
            idAmortizacion: parseInt(a.idAmortizacion),
            numeroCuota: parseInt(a.numeroCuota),
            valorCuota: parseFloat(a.valorCuota),
            interesPagado: parseFloat(a.interesPagado),
            capitalPagado: parseFloat(a.capitalPagado),
            saldo: parseFloat(a.saldo)
          }))
          .sort((a, b) => a.numeroCuota - b.numeroCuota);
      }

      // Datos del usuario
      const usuario = f.idUsuario || {};

      return {
        // Estructura compatible con la vista existente
        'a:IdFactura': f.idFactura,
        'a:NumeroFactura': f.numeroFactura,
        'a:FechaFactura': f.fechaFactura,
        'a:PrecioSinIVA': f.precioSinIva,
        'a:PrecioConIVA': f.precioConIva,
        'a:IdUsuario': usuario.idUsuario,
        'a:BoletosRelacionados': {
          'a:Boletos': boletos
        },
        // Datos adicionales
        IdFactura: parseInt(f.idFactura),
        NumeroFactura: f.numeroFactura,
        FechaFactura: f.fechaFactura,
        PrecioSinIVA: parseFloat(f.precioSinIva),
        PrecioConIVA: parseFloat(f.precioConIva),
        precioConIVA: parseFloat(f.precioConIva), // Para compatibilidad
        IdUsuario: parseInt(usuario.idUsuario),
        Usuario: {
          IdUsuario: usuario.idUsuario,
          Nombre: usuario.nombre,
          Cedula: usuario.cedula,
          Telefono: usuario.telefono,
          Correo: usuario.correo
        },
        Boletos: boletos,
        Amortizaciones: amortizaciones,
        EsCredito: amortizaciones.length > 0
      };
    });
  } catch (err) {
    console.error('❌ Error al obtener facturas:', err);
    console.error('Detalles:', err.response?.data || err.message);
    return [];
  }
};

// 🔹 2. Obtener factura por ID
export const obtenerFacturaPorId = async (idFactura) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:con="http://controller.aero_condor_java_soap.edu.ec/">
    <soapenv:Header/>
    <soapenv:Body>
      <con:obtenerFacturaPorId>
        <arg0>${idFactura}</arg0>
      </con:obtenerFacturaPorId>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    console.log('📤 Enviando request para obtener factura:', idFactura);
    
    const { data } = await axios.post(COMPRAS_SERVICE_URL, xml, {
      headers: { 'Content-Type': 'text/xml;charset=UTF-8' }
    });

    const json = parser.parse(data);
    const factura = json['S:Envelope']?.['S:Body']?.['ns2:obtenerFacturaPorIdResponse']?.return;
    
    if (!factura) {
      console.log('No se encontró la factura');
      return null;
    }

    // Procesar igual que en getFacturasPorUsuario
    let boletos = [];
    if (factura.boletosCollection) {
      const boletosArray = Array.isArray(factura.boletosCollection) ? 
        factura.boletosCollection : [factura.boletosCollection];
      
      boletos = boletosArray.map(b => ({
        'a:IdBoleto': b.idBoleto,
        'a:NumeroBoleto': b.numeroBoleto,
        'a:FechaCompra': b.fechaCompra,
        'a:PrecioCompra': b.precioCompra,
        'a:IdVuelo': b.idVuelo?.idVuelo,
          // 🔹 NUEVO
        'a:NumeroAsiento': b.idAsiento?.numeroAsiento ?? null,
        'a:IdAsiento': b.idAsiento?.idAsiento ?? null,
        'a:NombrePropietario': b.nombrePropietario ?? '',
        'a:CedulaPropietario': b.cedulaPropietario ?? '',
        'a:IdUsuarioBoleto': b.idUsuario?.idUsuario ?? null,
          // Plano
        idBoleto: parseInt(b.idBoleto),
        numeroBoleto: b.numeroBoleto,
        fechaCompra: b.fechaCompra,
        precioCompra: parseFloat(b.precioCompra),
        idVuelo: b.idVuelo?.idVuelo ? parseInt(b.idVuelo.idVuelo) : null,
        numeroAsiento: b.idAsiento?.numeroAsiento ?? null,
        idAsiento: b.idAsiento?.idAsiento ? parseInt(b.idAsiento.idAsiento) : null,
        nombrePropietario: b.nombrePropietario ?? '',
        cedulaPropietario: b.cedulaPropietario ?? '',
        idUsuarioBoleto: b.idUsuario?.idUsuario ? parseInt(b.idUsuario.idUsuario) : null,
        vuelo: b.idVuelo ? {
          codigo: b.idVuelo.codigoVuelo,
          ciudadOrigen: b.idVuelo.idCiudadOrigen?.nombreCiudad,
          ciudadDestino: b.idVuelo.idCiudadDestino?.nombreCiudad,
          horaSalida: b.idVuelo.horaSalida
        } : null
      }));
    }

    let amortizaciones = [];
    if (factura.amortizacionBoletosCollection) {
      const amortizacionesArray = Array.isArray(factura.amortizacionBoletosCollection) ? 
        factura.amortizacionBoletosCollection : [factura.amortizacionBoletosCollection];
      
      amortizaciones = amortizacionesArray
        .map(a => ({
          idAmortizacion: parseInt(a.idAmortizacion),
          numeroCuota: parseInt(a.numeroCuota),
          valorCuota: parseFloat(a.valorCuota),
          interesPagado: parseFloat(a.interesPagado),
          capitalPagado: parseFloat(a.capitalPagado),
          saldo: parseFloat(a.saldo)
        }))
        .sort((a, b) => a.numeroCuota - b.numeroCuota);
    }

    const usuario = factura.idUsuario || {};

    return {
      'a:IdFactura': factura.idFactura,
      'a:NumeroFactura': factura.numeroFactura,
      'a:FechaFactura': factura.fechaFactura,
      'a:PrecioSinIVA': factura.precioSinIva,
      'a:PrecioConIVA': factura.precioConIva,
      'a:IdUsuario': usuario.idUsuario,
      'a:BoletosRelacionados': {
        'a:Boletos': boletos
      },
      IdFactura: parseInt(factura.idFactura),
      NumeroFactura: factura.numeroFactura,
      FechaFactura: factura.fechaFactura,
      PrecioSinIVA: parseFloat(factura.precioSinIva),
      PrecioConIVA: parseFloat(factura.precioConIva),
      precioConIVA: parseFloat(factura.precioConIva),
      IdUsuario: parseInt(usuario.idUsuario),
      Usuario: {
        IdUsuario: usuario.idUsuario,
        Nombre: usuario.nombre,
        Cedula: usuario.cedula,
        Telefono: usuario.telefono,
        Correo: usuario.correo
      },
      Boletos: boletos,
      Amortizaciones: amortizaciones,
      EsCredito: amortizaciones.length > 0
    };
  } catch (err) {
    console.error('❌ Error al obtener factura:', err);
    console.error('Detalles:', err.response?.data || err.message);
    return null;
  }
};

// 🔹 3. Obtener amortización por factura
export const obtenerAmortizacionPorFactura = async (idFactura) => {
  // Esta función ya no es necesaria porque las amortizaciones vienen incluidas
  // en la respuesta de getFacturasPorUsuario, pero la mantengo por compatibilidad
  const factura = await obtenerFacturaPorId(idFactura);
  return factura?.Amortizaciones || [];
};

// 🔹 4. Función auxiliar para formatear fecha
export const formatearFecha = (fechaString) => {
  if (!fechaString) return 'Fecha no disponible';
  
  try {
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return 'Fecha inválida';
    
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

// 🔹 5. Función auxiliar para calcular totales de amortización
export const calcularTotalesAmortizacion = (amortizaciones) => {
  if (!amortizaciones || amortizaciones.length === 0) {
    return {
      totalCuotas: 0,
      totalCapital: 0,
      totalInteres: 0,
      totalPagado: 0
    };
  }

  return amortizaciones.reduce((totales, cuota) => ({
    totalCuotas: amortizaciones.length,
    totalCapital: totales.totalCapital + cuota.capitalPagado,
    totalInteres: totales.totalInteres + cuota.interesPagado,
    totalPagado: totales.totalPagado + cuota.valorCuota
  }), {
    totalCuotas: 0,
    totalCapital: 0,
    totalInteres: 0,
    totalPagado: 0
  });
};