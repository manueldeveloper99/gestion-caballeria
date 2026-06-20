package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Empleado;
import com.gestioncaballeria.proyecto.model.Turno;
import com.gestioncaballeria.proyecto.model.Tarea;
import com.gestioncaballeria.proyecto.repository.EmpleadoRepository;
import com.gestioncaballeria.proyecto.repository.TurnoRepository;
import com.gestioncaballeria.proyecto.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private TareaRepository tareaRepository;

    public List<Empleado> findAll() {
        return empleadoRepository.findAll();
    }

    public Optional<Empleado> findById(Long id) {
        return empleadoRepository.findById(id);
    }

    public Empleado save(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    public void deleteById(Long id) {
        empleadoRepository.deleteById(id);
    }

    public Turno addTurno(Long empleadoId, Turno turno) {
        Optional<Empleado> empleadoOpt = empleadoRepository.findById(empleadoId);
        if (empleadoOpt.isPresent()) {
            turno.setEmpleado(empleadoOpt.get());
            return turnoRepository.save(turno);
        }
        throw new RuntimeException("Empleado no encontrado");
    }

    public Tarea addTarea(Long empleadoId, Tarea tarea) {
        Optional<Empleado> empleadoOpt = empleadoRepository.findById(empleadoId);
        if (empleadoOpt.isPresent()) {
            tarea.setEmpleado(empleadoOpt.get());
            return tareaRepository.save(tarea);
        }
        throw new RuntimeException("Empleado no encontrado");
    }
}
