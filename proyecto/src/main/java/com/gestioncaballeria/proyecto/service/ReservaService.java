package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Reserva;
import com.gestioncaballeria.proyecto.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> findById(Long id) {
        return reservaRepository.findById(id);
    }

    public Reserva save(Reserva reserva) {
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
        }

        if (reserva.getEstado() == null || reserva.getEstado().isEmpty()) {
            reserva.setEstado("PENDIENTE");
        }
        return reservaRepository.save(reserva);
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
