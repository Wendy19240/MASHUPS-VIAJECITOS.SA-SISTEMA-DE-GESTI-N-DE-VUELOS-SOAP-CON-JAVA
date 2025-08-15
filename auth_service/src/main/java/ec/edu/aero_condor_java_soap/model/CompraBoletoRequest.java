package ec.edu.aero_condor_java_soap.model;

import jakarta.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class CompraBoletoRequest {

    private int idUsuario;
    private List<VueloCompra> vuelos;
    private boolean esCredito;
    private int numeroCuotas;
    private double tasaInteresAnual;

    // Getters y Setters
    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public List<VueloCompra> getVuelos() {
        return vuelos;
    }

    public void setVuelos(List<VueloCompra> vuelos) {
        this.vuelos = vuelos;
    }

    public boolean isEsCredito() {
        return esCredito;
    }

    public void setEsCredito(boolean esCredito) {
        this.esCredito = esCredito;
    }

    public int getNumeroCuotas() {
        return numeroCuotas;
    }

    public void setNumeroCuotas(int numeroCuotas) {
        this.numeroCuotas = numeroCuotas;
    }

    public double getTasaInteresAnual() {
        return tasaInteresAnual;
    }

    public void setTasaInteresAnual(double tasaInteresAnual) {
        this.tasaInteresAnual = tasaInteresAnual;
    }
}
