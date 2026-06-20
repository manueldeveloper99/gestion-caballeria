package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Empleado;
import com.gestioncaballeria.proyecto.model.TurnoTarea;
import com.gestioncaballeria.proyecto.repository.EmpleadoRepository;
import com.gestioncaballeria.proyecto.repository.TurnoTareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private TurnoTareaRepository turnoTareaRepository;

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

    public TurnoTarea addTurnoTarea(Long empleadoId, TurnoTarea turnoTarea) {
        Optional<Empleado> empleadoOpt = empleadoRepository.findById(empleadoId);
        if (empleadoOpt.isPresent()) {
            Empleado empleado = empleadoOpt.get();
            turnoTarea.setEmpleado(empleado);
            return turnoTareaRepository.save(turnoTarea);
        }
        throw new RuntimeException("Empleado no encontrado");
    }
}
