package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "caballo")
@Data
@NoArgsConstructor
public class Caballo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String identificador;

    @Column(nullable = false, length = 100)
    private String nombre;

    private LocalDate fechaNacimiento;

    @Column(length = 100)
    private String raza;

    @Column(length = 20)
    private String sexo;

    @Column(precision = 10, scale = 2)
    private BigDecimal peso;

    @Column(length = 255)
    private String foto;
}
