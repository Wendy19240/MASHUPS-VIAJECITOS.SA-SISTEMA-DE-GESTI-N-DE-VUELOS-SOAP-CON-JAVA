/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/WebServices/WebService.java to edit this template
 */
package ec.edu.aero_condor_java_soap.controller;

import ec.edu.aero_condor_java_soap.model.Amortizacion;
import ec.edu.aero_condor_java_soap.model.AsientoCompra;
import ec.edu.aero_condor_java_soap.model.Asientos;
import ec.edu.aero_condor_java_soap.model.Boletos;
import ec.edu.aero_condor_java_soap.model.CompraBoletoRequest;
import ec.edu.aero_condor_java_soap.model.Facturas;
import ec.edu.aero_condor_java_soap.model.Usuarios;
import ec.edu.aero_condor_java_soap.model.VueloCompra;
import ec.edu.aero_condor_java_soap.model.Vuelos;
import jakarta.jws.WebService;
import jakarta.jws.WebMethod;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import jakarta.jws.WebParam; 
/**
 *
 * @author Drouet
 */
@WebService(serviceName = "ComprasController")
public class AeroCondorController {

    @PersistenceContext(unitName = "my_persistence_unit")
    private EntityManager em;

    // ========== IMPLEMENTACIÓN DE MÉTODOS DE AMORTIZACIÓN ==========
    @WebMethod(operationName = "obtenerAmortizacionPorFactura")
    public List<Amortizacion> obtenerAmortizacionPorFactura(Integer idFactura) {
        try {
            return em.createQuery("SELECT a FROM Amortizacion a WHERE a.idFactura.idFactura = :idFactura ORDER BY a.numeroCuota",
                    Amortizacion.class
            )
                    .setParameter("idFactura", idFactura)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // ========== IMPLEMENTACIÓN DE MÉTODOS DE BOLETOS ==========
    @Transactional
    @WebMethod(operationName = "comprar")
    public boolean comprar(CompraBoletoRequest request) {
        try {
            double totalSinIVA = 0.0;

            // Validación inicial y cálculo de total sin IVA
            for (VueloCompra vc : request.getVuelos()) {
                Vuelos vuelo = em.find(Vuelos.class, vc.getIdVuelo());
                if (vuelo == null) {
                    return false;
                }
                
                // Verificar que hay asientos especificados
                if (vc.getAsientos() == null || vc.getAsientos().isEmpty()) {
                    return false;
                }
                
                // Verificar disponibilidad general
                if (vuelo.getDisponibles() < vc.getCantidad()) {
                    return false;
                }
                
                // Verificar que los asientos específicos estén disponibles
                for (AsientoCompra ac : vc.getAsientos()) {
                    // Buscar el asiento específico en la base de datos
                    Asientos asiento = em.createQuery(
                        "SELECT a FROM Asientos a WHERE a.idVuelo.idVuelo = :idVuelo AND a.numeroAsiento = :numeroAsiento", 
                        Asientos.class)
                        .setParameter("idVuelo", vc.getIdVuelo())
                        .setParameter("numeroAsiento", ac.getNumeroAsiento())
                        .getResultStream()
                        .findFirst()
                        .orElse(null);
                    
                    if (asiento == null) {
                        return false; // El asiento no existe
                    }
                    
                    if (!"DISPONIBLE".equals(asiento.getEstado())) {
                        return false; // El asiento no está disponible
                    }
                    
                    // Validar datos del propietario
                    if (ac.getNombrePropietario() == null || ac.getNombrePropietario().trim().isEmpty() ||
                        ac.getCedulaPropietario() == null || ac.getCedulaPropietario().trim().isEmpty()) {
                        return false;
                    }
                }
                
                totalSinIVA += vuelo.getValor().doubleValue() * vc.getCantidad();
            }

            double totalConIVA = totalSinIVA * 1.15;
            Usuarios usuario = em.find(Usuarios.class, request.getIdUsuario());
            if (usuario == null) {
                return false;
            }

            // Generar número de factura
            Long maxFacturaId = em.createQuery("SELECT COALESCE(MAX(f.idFactura), 0) FROM Facturas f", Long.class)
                    .getSingleResult();
            String numeroFactura = "FAC-" + String.format("%09d", maxFacturaId + 1);

            // Crear factura
            Facturas factura = new Facturas();
            factura.setNumeroFactura(numeroFactura);
            factura.setIdUsuario(usuario);
            factura.setPrecioSinIva(BigDecimal.valueOf(totalSinIVA));
            factura.setPrecioConIva(BigDecimal.valueOf(totalConIVA));
            factura.setFechaFactura(new Date());
            em.persist(factura);
            em.flush(); // Para obtener ID generado

            // Si es a crédito, generar tabla amortización
            if (request.isEsCredito()) {
                List<Amortizacion> tabla = generarTablaAmortizacion(totalConIVA,
                        request.getTasaInteresAnual(), request.getNumeroCuotas(), factura);
                for (Amortizacion a : tabla) {
                    a.setIdFactura(factura);
                    em.persist(a);
                }
            }

            // Insertar boletos con asientos específicos y actualizar vuelos
            for (VueloCompra vc : request.getVuelos()) {
                Vuelos vuelo = em.find(Vuelos.class, vc.getIdVuelo());

                for (AsientoCompra ac : vc.getAsientos()) {
                    // Buscar y reservar el asiento específico
                    Asientos asiento = em.createQuery(
                        "SELECT a FROM Asientos a WHERE a.idVuelo.idVuelo = :idVuelo AND a.numeroAsiento = :numeroAsiento", 
                        Asientos.class)
                        .setParameter("idVuelo", vc.getIdVuelo())
                        .setParameter("numeroAsiento", ac.getNumeroAsiento())
                        .getSingleResult();
                    
                    // Cambiar estado del asiento a OCUPADO
                    asiento.setEstado("OCUPADO");
                    em.merge(asiento);
                    
                    // Crear boleto con información del propietario y asiento
                    Boletos boleto = new Boletos();
                    boleto.setNumeroBoleto(UUID.randomUUID().toString().substring(0, 10).toUpperCase());
                    boleto.setIdUsuario(usuario);
                    boleto.setIdVuelo(vuelo);
                    boleto.setIdAsiento(asiento);
                    boleto.setPrecioCompra(vuelo.getValor());
                    boleto.setFechaCompra(new Date());
                    boleto.setIdFactura(factura);
                    boleto.setNombrePropietario(ac.getNombrePropietario());
                    boleto.setCedulaPropietario(ac.getCedulaPropietario());
                    em.persist(boleto);
                }

                // Actualizar disponibilidad del vuelo
                vuelo.setDisponibles(vuelo.getDisponibles() - vc.getCantidad());
                em.merge(vuelo);
            }

            em.flush(); // Asegura que todos los cambios se escriban
            em.refresh(factura); // Refresca la factura desde la BD

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private List<Amortizacion> generarTablaAmortizacion(double monto, double tasaAnual,
            int cuotas, Facturas factura) {
        List<Amortizacion> lista = new ArrayList<>();

        BigDecimal saldo = BigDecimal.valueOf(monto);
        double tasaMensual = tasaAnual / 12 / 100;

        BigDecimal cuota = saldo.multiply(BigDecimal.valueOf(tasaMensual))
                .divide(BigDecimal.valueOf(1 - Math.pow(1 + tasaMensual, -cuotas)), 10, RoundingMode.HALF_UP);

        for (int i = 1; i <= cuotas; i++) {
            BigDecimal interes = saldo.multiply(BigDecimal.valueOf(tasaMensual));
            BigDecimal capital = cuota.subtract(interes);
            saldo = saldo.subtract(capital);

            Amortizacion a = new Amortizacion();
            a.setIdFactura(factura);
            a.setNumeroCuota(i);
            a.setValorCuota(cuota.setScale(2, RoundingMode.HALF_UP));
            a.setInteresPagado(interes.setScale(2, RoundingMode.HALF_UP));
            a.setCapitalPagado(capital.setScale(2, RoundingMode.HALF_UP));
            a.setSaldo(saldo.max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP));

            lista.add(a);
        }

        return lista;
    }

    @WebMethod(operationName = "obtenerBoletosPorUsuario")
    public List<Boletos> obtenerBoletosPorUsuario(Integer idUsuario) {
        try {
            Usuarios usuario = em.find(Usuarios.class, idUsuario);
            if (usuario == null) {
                return new ArrayList<>();
            }

            return em.createQuery(
                    "SELECT b FROM Boletos b WHERE b.idUsuario.idUsuario = :idUsuario", Boletos.class)
                    .setParameter("idUsuario", idUsuario)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    @WebMethod(operationName = "obtenerAsientosOcupados")
public List<Integer> obtenerAsientosOcupados(@WebParam(name = "idVuelo") Integer idVuelo) {
    try {
        return em.createQuery(
            "SELECT a.numeroAsiento " +
            "FROM Asientos a " +
            "WHERE a.idVuelo.idVuelo = :idVuelo AND a.estado = 'OCUPADO'",
            Integer.class
        )
        .setParameter("idVuelo", idVuelo)
        .getResultList();
    } catch (Exception e) {
        e.printStackTrace();
        return new ArrayList<>();
    }
}


    // ========== IMPLEMENTACIÓN DE MÉTODOS DE FACTURAS ==========
    @WebMethod(operationName = "obtenerFacturaPorId")
    public Facturas obtenerFacturaPorId(Integer id) {
        try {
            return em.find(Facturas.class, id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @WebMethod(operationName = "getFacturasPorUsuario")
    public List<Facturas> getFacturasPorUsuario(Integer idUsuario) {
        try {
            return em.createQuery(
                    "SELECT f FROM Facturas f WHERE f.idUsuario.idUsuario = :idUsuario ORDER BY f.fechaFactura DESC",
                    Facturas.class
            )
                    .setParameter("idUsuario", idUsuario)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

}
