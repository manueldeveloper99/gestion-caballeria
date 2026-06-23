package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Reserva;
import com.gestioncaballeria.proyecto.model.Alerta;
import com.gestioncaballeria.proyecto.model.Usuario;
import com.gestioncaballeria.proyecto.model.Caballo;
import com.gestioncaballeria.proyecto.repository.ReservaRepository;
import com.gestioncaballeria.proyecto.repository.AlertaRepository;
import com.gestioncaballeria.proyecto.repository.UsuarioRepository;
import com.gestioncaballeria.proyecto.repository.CaballoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private AlertaRepository alertaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CaballoRepository caballoRepository;

    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> findById(Long id) {
        return reservaRepository.findById(id);
    }

    public Reserva save(Reserva reserva) {
        boolean isNew = (reserva.getId() == null);

        if (reserva.getFechaInicio() != null) {
            java.time.LocalDateTime minTime = java.time.LocalDateTime.now().plusMinutes(30);
            if (reserva.getFechaInicio().isBefore(minTime)) {
                throw new IllegalArgumentException("La reserva debe realizarse con al menos 30 minutos de anticipación.");
            }
        }
        
        if (reserva.getFechaInicio() != null && reserva.getFechaFin() != null) {
            if (!reserva.getFechaFin().isAfter(reserva.getFechaInicio())) {
                throw new IllegalArgumentException("La fecha de fin debe ser posterior a la de inicio.");
            }
            
            // Validar solapamiento (double booking) para el mismo caballo
            if (reserva.getCaballo() != null && reserva.getCaballo().getId() != null) {
                List<Reserva> existentes = reservaRepository.findAll();
                for (Reserva r : existentes) {
                    boolean isSameReserva = reserva.getId() != null && reserva.getId().equals(r.getId());
                    if (!isSameReserva && ("PENDIENTE".equals(r.getEstado()) || "CONFIRMADA".equals(r.getEstado())) && r.getCaballo() != null && r.getCaballo().getId().equals(reserva.getCaballo().getId())) {
                        if (reserva.getFechaInicio().isBefore(r.getFechaFin()) && reserva.getFechaFin().isAfter(r.getFechaInicio())) {
                            throw new IllegalArgumentException("El caballo ya tiene una reserva activa en ese horario.");
                        }
                    }
                }
            }
        }

        if (reserva.getEstado() == null || reserva.getEstado().isEmpty()) {
            reserva.setEstado("PENDIENTE");
        }
        
        Reserva savedReserva = reservaRepository.save(reserva);

        if (isNew && savedReserva.getEmpleado() != null) {
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmpleadoId(savedReserva.getEmpleado().getId());
            
            // Fallback 1: si el empleado no tiene un usuario estrictamente vinculado, busquemos por su correo (contacto)
            if (usuarioOpt.isEmpty() && savedReserva.getEmpleado().getContacto() != null) {
                usuarioOpt = usuarioRepository.findByCorreo(savedReserva.getEmpleado().getContacto());
            }

            // Fallback 2: busquemos por nombre
            if (usuarioOpt.isEmpty() && savedReserva.getEmpleado().getNombre() != null) {
                String nombreEmpleado = savedReserva.getEmpleado().getNombre();
                usuarioOpt = usuarioRepository.findAll().stream()
                        .filter(u -> nombreEmpleado.equalsIgnoreCase(u.getNombre()))
                        .findFirst();
            }

            // Fallback 3: si sigue vacío pero sabemos que es un rol específico y hay un solo usuario con ese rol (ej. VETERINARIO)
            if (usuarioOpt.isEmpty() && savedReserva.getEmpleado().getRol() != null) {
                String rol = savedReserva.getEmpleado().getRol().name();
                usuarioOpt = usuarioRepository.findAll().stream()
                        .filter(u -> rol.equalsIgnoreCase(u.getRol()))
                        .findFirst();
            }

            if (usuarioOpt.isPresent()) {
                Alerta alerta = new Alerta();
                alerta.setTipo("CITA_ASIGNADA");
                String caballoName = savedReserva.getCaballo() != null ? savedReserva.getCaballo().getNombre() : "desconocido";
                alerta.setMensaje("Se te ha asignado una nueva cita (" + savedReserva.getTipo() + ") para el caballo " + caballoName + ".");
                alerta.setFecha(LocalDateTime.now());
                alerta.setUsuarioId(usuarioOpt.get().getId());
                alerta.setReserva(savedReserva);
                alerta.setLeida(false);
                alertaRepository.save(alerta);
            }
        }
        
        // Notificar a los Administradores si es una reserva nueva
        if (isNew) {
            List<Usuario> admins = usuarioRepository.findAll().stream()
                    .filter(u -> "ADMINISTRADOR".equalsIgnoreCase(u.getRol()))
                    .collect(java.util.stream.Collectors.toList());
                    
            String caballoName = "desconocido";
            if (savedReserva.getCaballo() != null && savedReserva.getCaballo().getId() != null) {
                Caballo c = caballoRepository.findById(savedReserva.getCaballo().getId()).orElse(null);
                if (c != null) caballoName = c.getNombre();
            }
            
            String creador = "Alguien";
            if (savedReserva.getUsuario() != null && savedReserva.getUsuario().getId() != null) {
                Usuario u = usuarioRepository.findById(savedReserva.getUsuario().getId()).orElse(null);
                if (u != null) creador = u.getNombre();
            }
            
            String fechaYHora = "no definida";
            if (savedReserva.getFechaInicio() != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
                fechaYHora = savedReserva.getFechaInicio().format(formatter);
            }
            
            for (Usuario admin : admins) {
                Alerta alertaAdmin = new Alerta();
                alertaAdmin.setTipo("NUEVA_CITA_CREADA");
                alertaAdmin.setMensaje(creador + " ha programado una nueva cita (" + savedReserva.getTipo() + ") para el caballo " + caballoName + " el día " + fechaYHora + ".");
                alertaAdmin.setFecha(LocalDateTime.now());
                alertaAdmin.setUsuarioId(admin.getId());
                alertaAdmin.setReserva(savedReserva);
                alertaAdmin.setLeida(false);
                alertaRepository.save(alertaAdmin);
            }
        }

        return savedReserva;
    }

    public void deleteById(Long id) {
        reservaRepository.deleteById(id);
    }

    public Reserva cancelReserva(Long id) {
        Optional<Reserva> resOpt = reservaRepository.findById(id);
        if (resOpt.isPresent()) {
            Reserva reserva = resOpt.get();
            reserva.setEstado("CANCELADA");
            return reservaRepository.save(reserva);
        }
        throw new RuntimeException("Reserva no encontrada");
    }
}
