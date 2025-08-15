/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/WebServices/WebService.java to edit this template
 */
package ec.edu.aero_condor_java_soap.controller;

import ec.edu.aero_condor_java_soap.model.Usuarios;
import jakarta.jws.WebService;
import jakarta.jws.WebMethod;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

/**
 *
 * @author Drouet
 */
@WebService(serviceName = "AuthController")
public class AeroCondorController {
    
    @PersistenceContext(unitName = "my_persistence_unit")
    private EntityManager em;

    @Transactional
    @WebMethod(operationName = "crearUsuario")
    public boolean crearUsuario(Usuarios usuario) {
        try {
            em.persist(usuario);
            em.flush();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    @WebMethod(operationName = "login")
    public Usuarios login(String username, String password) {
        try {
            return em.createQuery(
                "SELECT u FROM Usuarios u WHERE u.username = :username AND u.password = :password", 
                Usuarios.class)
                .setParameter("username", username)
                .setParameter("password", password)
                .getSingleResult();
        } catch (Exception e) {
            // Si no se encuentra el usuario, retorna null
            return null;
        }
    }
    
}
