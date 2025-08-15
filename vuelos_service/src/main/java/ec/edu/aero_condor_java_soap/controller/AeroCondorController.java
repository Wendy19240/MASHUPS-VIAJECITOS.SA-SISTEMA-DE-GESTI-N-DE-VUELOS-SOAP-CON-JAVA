/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/WebServices/WebService.java to edit this template
 */
package ec.edu.aero_condor_java_soap.controller;

import ec.edu.aero_condor_java_soap.model.Ciudades;
import ec.edu.aero_condor_java_soap.model.Vuelos;
import jakarta.jws.WebService;
import jakarta.jws.WebMethod;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 *
 * @author Drouet
 */
@WebService(serviceName = "VuelosController")
public class AeroCondorController {
    
    @PersistenceContext(unitName = "my_persistence_unit")
    private EntityManager em;
    
    // ========== IMPLEMENTACIÓN DE MÉTODOS DE CIUDADES ==========
    
    @WebMethod(operationName = "getCiudades")
    public List<Ciudades> getCiudades() {
        try {
            List<Ciudades> ciudades = em.createQuery("SELECT c FROM Ciudades c", Ciudades.class)
                                        .getResultList();
           
            return ciudades;

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    // ========== IMPLEMENTACIÓN DE MÉTODOS DE VUELOS ==========
    
    @WebMethod(operationName = "obtenerVueloPorId")
    public Vuelos obtenerVueloPorId(Integer id) {
        try {
            return em.find(Vuelos.class, id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    @WebMethod(operationName = "getVuelos")
    public List<Vuelos> getVuelos() {
        try {
            return em.createQuery("SELECT v FROM Vuelos v", Vuelos.class)
                    .getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    @WebMethod(operationName = "buscarVuelos")
    public List<Vuelos> buscarVuelos(String origen, String destino, 
            String fechaSalida) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date inicio = sdf.parse(fechaSalida); // yyyy-MM-dd 00:00:00
            Calendar cal = Calendar.getInstance();
            cal.setTime(inicio);
            cal.set(Calendar.HOUR_OF_DAY, 23);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            cal.set(Calendar.MILLISECOND, 999);
            Date fin = cal.getTime();

            return em.createQuery(
                    "SELECT v FROM Vuelos v WHERE v.idCiudadOrigen.codigoCiudad = :origen " +
                    "AND v.idCiudadDestino.codigoCiudad = :destino " +
                    "AND v.horaSalida BETWEEN :inicio AND :fin ORDER BY v.valor DESC",
                    Vuelos.class)
                    .setParameter("origen", origen)
                    .setParameter("destino", destino)
                    .setParameter("inicio", inicio)
                    .setParameter("fin", fin)
                    .getResultList();
        } catch (ParseException e) {
            e.printStackTrace();
            return new ArrayList<>();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
}
