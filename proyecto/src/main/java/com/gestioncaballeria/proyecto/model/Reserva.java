package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reserva")
@Data
@NoArgsConstructor
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "caballo_id", nullable = false)
    private Caballo caballo;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @Column(name = "`fechaInicio`", nullable = false)
    private java.time.LocalDateTime fechaInicio;

    @Column(name = "`fechaFin`", nullable = false)
    private java.time.LocalDateTime fechaFin;

    @Column(length = 50)
    private String tipo;

    @Column(length = 50)
    private String estado;
}
