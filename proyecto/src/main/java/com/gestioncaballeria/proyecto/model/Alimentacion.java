package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "alimentaciones")
@Data
@NoArgsConstructor
public class Alimentacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: (Carol) Agregar campos como fecha, tipo, cantidad
    // TODO: (Carol) Relacionar con Caballo
}
