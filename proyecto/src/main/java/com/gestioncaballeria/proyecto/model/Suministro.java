package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "suministro")
@Data
@NoArgsConstructor
public class Suministro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "caballo_id")
    private Caballo caballo;

    @ManyToOne
    @JoinColumn(name = "inventario_id")
    private Inventario inventario;

    private LocalDateTime fecha;

    private String tipo;

    private Double cantidad;
}