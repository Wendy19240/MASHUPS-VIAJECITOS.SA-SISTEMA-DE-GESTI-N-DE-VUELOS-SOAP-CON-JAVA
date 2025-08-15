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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlTransient;
import java.io.Serializable;

/**
 *
 * @author Drouet
 */
@Entity
@Table(name = "escalas")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Escalas.findAll", query = "SELECT e FROM Escalas e"),
    @NamedQuery(name = "Escalas.findByIdEscala", query = "SELECT e FROM Escalas e WHERE e.idEscala = :idEscala"),
    @NamedQuery(name = "Escalas.findByOrdenEscala", query = "SELECT e FROM Escalas e WHERE e.ordenEscala = :ordenEscala")})
public class Escalas implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_escala")
    private Integer idEscala;
    @Basic(optional = false)
    @NotNull
    @Column(name = "orden_escala")
    private int ordenEscala;
    @JoinColumn(name = "id_ciudad", referencedColumnName = "id_ciudad")
    @ManyToOne(optional = false)
    private Ciudades idCiudad;
    @JoinColumn(name = "id_vuelo", referencedColumnName = "id_vuelo")
    @ManyToOne(optional = false)
    private Vuelos idVuelo;

    public Escalas() {
    }

    public Escalas(Integer idEscala) {
        this.idEscala = idEscala;
    }

    public Escalas(Integer idEscala, int ordenEscala) {
        this.idEscala = idEscala;
        this.ordenEscala = ordenEscala;
    }

    public Integer getIdEscala() {
        return idEscala;
    }

    public void setIdEscala(Integer idEscala) {
        this.idEscala = idEscala;
    }

    public int getOrdenEscala() {
        return ordenEscala;
    }

    public void setOrdenEscala(int ordenEscala) {
        this.ordenEscala = ordenEscala;
    }

    public Ciudades getIdCiudad() {
        return idCiudad;
    }

    public void setIdCiudad(Ciudades idCiudad) {
        this.idCiudad = idCiudad;
    }

    @XmlTransient
    public Vuelos getIdVuelo() {
        return idVuelo;
    }

    public void setIdVuelo(Vuelos idVuelo) {
        this.idVuelo = idVuelo;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (idEscala != null ? idEscala.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Escalas)) {
            return false;
        }
        Escalas other = (Escalas) object;
        if ((this.idEscala == null && other.idEscala != null) || (this.idEscala != null && !this.idEscala.equals(other.idEscala))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "ec.edu.aero_condor_java_soap.model.Escalas[ idEscala=" + idEscala + " ]";
    }
    
}
