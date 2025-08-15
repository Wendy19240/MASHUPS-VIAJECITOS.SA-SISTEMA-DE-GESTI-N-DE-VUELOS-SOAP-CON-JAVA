/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package ec.edu.aero_condor_java_soap.model;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.util.Collection;

/**
 *
 * @author Drouet
 */
@Entity
@Table(name = "asientos")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Asientos.findAll", query = "SELECT a FROM Asientos a"),
    @NamedQuery(name = "Asientos.findByIdAsiento", query = "SELECT a FROM Asientos a WHERE a.idAsiento = :idAsiento"),
    @NamedQuery(name = "Asientos.findByNumeroAsiento", query = "SELECT a FROM Asientos a WHERE a.numeroAsiento = :numeroAsiento"),
    @NamedQuery(name = "Asientos.findByEstado", query = "SELECT a FROM Asientos a WHERE a.estado = :estado")})
public class Asientos implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_asiento")
    private Integer idAsiento;
    @Basic(optional = false)
    @NotNull
    @Column(name = "numero_asiento")
    private int numeroAsiento;
    @Size(max = 10)
    @Column(name = "estado")
    private String estado;
    @JoinColumn(name = "id_vuelo", referencedColumnName = "id_vuelo")
    @ManyToOne(optional = false)
    private Vuelos idVuelo;
    @OneToMany(mappedBy = "idAsiento")
    private Collection<Boletos> boletosCollection;

    public Asientos() {
    }

    public Asientos(Integer idAsiento) {
        this.idAsiento = idAsiento;
    }

    public Asientos(Integer idAsiento, int numeroAsiento) {
        this.idAsiento = idAsiento;
        this.numeroAsiento = numeroAsiento;
    }

    public Integer getIdAsiento() {
        return idAsiento;
    }

    public void setIdAsiento(Integer idAsiento) {
        this.idAsiento = idAsiento;
    }

    public int getNumeroAsiento() {
        return numeroAsiento;
    }

    public void setNumeroAsiento(int numeroAsiento) {
        this.numeroAsiento = numeroAsiento;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    @XmlTransient
    public Vuelos getIdVuelo() {
        return idVuelo;
    }

    public void setIdVuelo(Vuelos idVuelo) {
        this.idVuelo = idVuelo;
    }

    @XmlTransient
    public Collection<Boletos> getBoletosCollection() {
        return boletosCollection;
    }

    public void setBoletosCollection(Collection<Boletos> boletosCollection) {
        this.boletosCollection = boletosCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (idAsiento != null ? idAsiento.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Asientos)) {
            return false;
        }
        Asientos other = (Asientos) object;
        if ((this.idAsiento == null && other.idAsiento != null) || (this.idAsiento != null && !this.idAsiento.equals(other.idAsiento))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "ec.edu.aero_condor_java_soap.model.Asientos[ idAsiento=" + idAsiento + " ]";
    }
    
}
