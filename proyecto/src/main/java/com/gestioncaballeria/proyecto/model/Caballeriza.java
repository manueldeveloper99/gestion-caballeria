package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "caballeriza")
@Data
@NoArgsConstructor
public class Caballeriza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String numero;

    @Column(nullable = false, length = 50)
    private String estado; // VACIA, OCUPADA, MANTENIMIENTO

    @OneToOne
    @JoinColumn(name = "caballo_id", unique = true)
    private Caballo caballo;
}
