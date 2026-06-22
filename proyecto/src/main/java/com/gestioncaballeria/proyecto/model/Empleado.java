package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "empleado")
@Data
@NoArgsConstructor
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolEmpleado rol;

    @Column(length = 100)
    private String contacto;

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty
    private String correo;

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty
    private String password;

    public enum RolEmpleado {
        VETERINARIO,
        POTRADOR,
        CUIDADOR,
        ADMINISTRADOR
    }
}
