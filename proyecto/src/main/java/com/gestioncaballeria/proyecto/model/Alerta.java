package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerta")
@Data
@NoArgsConstructor
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "inventario_id")
    private Inventario inventario;

    private String mensaje;

    private LocalDateTime fecha;

    private String tipo;
}