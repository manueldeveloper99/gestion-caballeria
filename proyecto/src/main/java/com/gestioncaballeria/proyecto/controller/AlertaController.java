package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Alerta;
import com.gestioncaballeria.proyecto.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.gestioncaballeria.proyecto.model.HistorialMedico;
import com.gestioncaballeria.proyecto.repository.HistorialMedicoRepository;
import com.gestioncaballeria.proyecto.model.Reserva;
import com.gestioncaballeria.proyecto.repository.ReservaRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin("*")
public class AlertaController {
    
@Autowired
private AlertaRepository alertaRepository;

@Autowired
private HistorialMedicoRepository historialMedicoRepository;

@Autowired
private ReservaRepository reservaRepository;

@GetMapping
public List<Alerta> getAllAlertas() {
    LocalDate hoy = LocalDate.now();
    List<HistorialMedico> historiales = historialMedicoRepository.findAll();
    List<Alerta> existentes = alertaRepository.findAll();
    
    for (HistorialMedico h : historiales) {
        if (h.getFechaProxima() != null) {
            long dias = ChronoUnit.DAYS.between(hoy, h.getFechaProxima());
            String tipo = "";
            String mensaje = "";
            
            if (dias >= 0 && dias <= 1) {
                String detalle = "Revisión médica";
                if (h.getVacuna() != null && !h.getVacuna().isEmpty()) detalle = "Vacuna (" + h.getVacuna() + ")";
                else if (h.getTratamiento() != null && !h.getTratamiento().isEmpty()) detalle = "Tratamiento (" + h.getTratamiento() + ")";
                
                tipo = "ATENCION_PROXIMA";
                mensaje = "Atención próxima: " + detalle + " para el caballo " + h.getCaballo().getNombre() + " en " + dias + " días.";
            } else if (dias < 0) {
                String detalle = "Revisión médica";
                if (h.getVacuna() != null && !h.getVacuna().isEmpty()) detalle = "Vacuna (" + h.getVacuna() + ")";
                else if (h.getTratamiento() != null && !h.getTratamiento().isEmpty()) detalle = "Tratamiento (" + h.getTratamiento() + ")";
                
                tipo = "ATENCION_VENCIDA";
                mensaje = "Atención vencida: " + detalle + " de " + h.getCaballo().getNombre() + " (hace " + Math.abs(dias) + " días).";
            }

            if (!tipo.isEmpty()) {
                final String currentTipo = tipo;
                boolean yaExiste = existentes.stream().anyMatch(a -> 
                    a.getHistorialMedico() != null && 
                    a.getHistorialMedico().getId().equals(h.getId()) && 
                    a.getTipo().equals(currentTipo)
                );
                
                if (!yaExiste) {
                    Alerta a = new Alerta();
                    a.setFecha(LocalDateTime.now());
                    a.setTipo(currentTipo);
                    a.setMensaje(mensaje);
                    a.setHistorialMedico(h);
                    a.setLeida(false);
                    alertaRepository.save(a);
                    existentes.add(a); // Para que se retorne en esta misma petición
                }
            }
        }
    }
    
    List<Reserva> reservas = reservaRepository.findAll();
    for (Reserva r : reservas) {
        if (r.getFechaInicio() != null && ("PENDIENTE".equals(r.getEstado()) || "CONFIRMADA".equals(r.getEstado()) || "APROBADA".equals(r.getEstado()))) {
            long dias = ChronoUnit.DAYS.between(hoy, r.getFechaInicio().toLocalDate());
            if (dias >= 0 && dias <= 1) {
                String tipo = dias == 0 ? "RESERVA_HOY" : "RESERVA_PROXIMA";
                String mensaje = "Tienes una reserva programada para " + (dias == 0 ? "hoy" : "mañana") + " (" + r.getTipo() + ").";
                
                boolean yaExiste = existentes.stream().anyMatch(a -> 
                    a.getReserva() != null && 
                    a.getReserva().getId().equals(r.getId()) && 
                    a.getTipo().equals(tipo)
                );
                
                if (!yaExiste) {
                    Alerta a = new Alerta();
                    a.setFecha(LocalDateTime.now());
                    a.setTipo(tipo);
                    a.setMensaje(mensaje);
                    a.setReserva(r);
                    a.setUsuarioId(r.getUsuario().getId());
                    a.setLeida(false);
                    alertaRepository.save(a);
                    existentes.add(a);
                }
            }
        }
    }
    
    // Sort so unread are first
    existentes.sort((a, b) -> Boolean.compare(a.getLeida() != null && a.getLeida(), b.getLeida() != null && b.getLeida()));
    return existentes;
}

@PutMapping("/{id}/leida")
public Alerta marcarComoLeida(@PathVariable Long id) {
    Alerta alerta = alertaRepository.findById(id).orElseThrow();
    alerta.setLeida(true);
    return alertaRepository.save(alerta);
}

}
