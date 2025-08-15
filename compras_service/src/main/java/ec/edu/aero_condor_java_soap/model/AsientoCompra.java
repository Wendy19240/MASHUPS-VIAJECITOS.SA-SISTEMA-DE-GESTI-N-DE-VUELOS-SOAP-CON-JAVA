package ec.edu.aero_condor_java_soap.model;

import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class AsientoCompra {
    
    private int numeroAsiento;
    private String nombrePropietario;
    private String cedulaPropietario;
    
    public AsientoCompra() {
    }
    
    public AsientoCompra(int numeroAsiento, String nombrePropietario, String cedulaPropietario) {
        this.numeroAsiento = numeroAsiento;
        this.nombrePropietario = nombrePropietario;
        this.cedulaPropietario = cedulaPropietario;
    }

    public int getNumeroAsiento() {
        return numeroAsiento;
    }

    public void setNumeroAsiento(int numeroAsiento) {
        this.numeroAsiento = numeroAsiento;
    }

    public String getNombrePropietario() {
        return nombrePropietario;
    }

    public void setNombrePropietario(String nombrePropietario) {
        this.nombrePropietario = nombrePropietario;
    }

    public String getCedulaPropietario() {
        return cedulaPropietario;
    }

    public void setCedulaPropietario(String cedulaPropietario) {
        this.cedulaPropietario = cedulaPropietario;
    }
}
