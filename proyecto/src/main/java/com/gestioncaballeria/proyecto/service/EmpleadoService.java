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

import com.gestioncaballeria.proyecto.model.Usuario;
import com.gestioncaballeria.proyecto.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Empleado> findAll() {
        return empleadoRepository.findAll();
    }

    public Optional<Empleado> findById(Long id) {
        return empleadoRepository.findById(id);
    }

    public Empleado save(Empleado empleado) {
        Empleado savedEmpleado = empleadoRepository.save(empleado);

        if (empleado.getCorreo() != null && !empleado.getCorreo().trim().isEmpty() &&
            empleado.getPassword() != null && !empleado.getPassword().trim().isEmpty()) {
            
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombre(savedEmpleado.getNombre());
            nuevoUsuario.setCorreo(empleado.getCorreo());
            nuevoUsuario.setPassword(passwordEncoder.encode(empleado.getPassword()));
            nuevoUsuario.setRol(savedEmpleado.getRol().name());
            nuevoUsuario.setEmpleado(savedEmpleado);
            
            usuarioRepository.save(nuevoUsuario);
        }

        return savedEmpleado;
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
    public List<Turno> getTurnos(Long empleadoId) {
        return turnoRepository.findByEmpleadoId(empleadoId);
    }

    public List<Tarea> getTareas(Long empleadoId) {
        return tareaRepository.findByEmpleadoId(empleadoId);
    }
}
