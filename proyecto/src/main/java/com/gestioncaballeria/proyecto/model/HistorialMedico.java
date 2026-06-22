package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "historial_medico")
@Data
@NoArgsConstructor
public class HistorialMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "caballo_id", nullable = false)
    private Caballo caballo;

    @ManyToOne
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 150)
    private String vacuna;

    @Column(length = 255)
    private String tratamiento;

    private Double pesoRegistrado;

    @Column(length = 255)
    private String alergias;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_proxima")
    private LocalDate fechaProxima;
}
