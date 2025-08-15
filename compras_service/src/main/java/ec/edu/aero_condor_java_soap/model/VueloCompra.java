package ec.edu.aero_condor_java_soap.model;

import jakarta.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class VueloCompra {

    private int idVuelo;
    private List<AsientoCompra> asientos;

    public int getIdVuelo() {
        return idVuelo;
    }

    public void setIdVuelo(int idVuelo) {
        this.idVuelo = idVuelo;
    }

    public List<AsientoCompra> getAsientos() {
        return asientos;
    }

    public void setAsientos(List<AsientoCompra> asientos) {
        this.asientos = asientos;
    }
    
    // Método de conveniencia para obtener la cantidad de asientos
    public int getCantidad() {
        return asientos != null ? asientos.size() : 0;
    }
}
