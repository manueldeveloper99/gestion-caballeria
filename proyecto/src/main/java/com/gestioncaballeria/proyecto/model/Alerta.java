package com.gestioncaballeria.proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.gestioncaballeria.proyecto.model.HistorialMedico;
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

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean leida = false;

    @ManyToOne
    @JoinColumn(name = "historial_medico_id")
    private HistorialMedico historialMedico;

    @ManyToOne
    @JoinColumn(name = "reserva_id")
    private Reserva reserva;

    @Column(name = "usuario_id")
    private Long usuarioId;
}