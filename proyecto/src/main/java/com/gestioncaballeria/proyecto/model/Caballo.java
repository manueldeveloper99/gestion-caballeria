package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "caballos")
@Data
@NoArgsConstructor
public class Caballo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String identificador;

    private Integer edad;
    private String raza;
    private String sexo;
    private Double peso;

    @Column(name = "foto_url")
    private String fotoUrl;

    @OneToMany(mappedBy = "caballo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistorialMedico> historialesMedicos;
}
