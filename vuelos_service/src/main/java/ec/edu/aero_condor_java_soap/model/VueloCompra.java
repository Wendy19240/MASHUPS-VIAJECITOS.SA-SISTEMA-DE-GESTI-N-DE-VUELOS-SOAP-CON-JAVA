package ec.edu.aero_condor_java_soap.model;

import jakarta.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class VueloCompra {

    private int idVuelo;
    private int cantidad;

    public int getIdVuelo() {
        return idVuelo;
    }

    public void setIdVuelo(int idVuelo) {
        this.idVuelo = idVuelo;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
