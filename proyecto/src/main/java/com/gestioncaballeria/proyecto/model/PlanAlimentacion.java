package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "plan_alimentacion")
@Data
@NoArgsConstructor
public class PlanAlimentacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "caballo_id")
    private Caballo caballo;

    private String descripcion;

    private Double cantidad;

    private String horario;

    @Transient
    private Long inventarioId;
}