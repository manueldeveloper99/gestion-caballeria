package com.gestioncaballeria.proyecto.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "historiales_medicos")
@Data
@NoArgsConstructor
public class HistorialMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private String responsable;

    private String vacunas;
    private String tratamientos;
    private String alergias;
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "caballo_id", nullable = false)
    @JsonIgnore
    private Caballo caballo;
}
