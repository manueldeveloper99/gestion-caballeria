package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Empleado;
import com.gestioncaballeria.proyecto.model.Turno;
import com.gestioncaballeria.proyecto.model.Tarea;
import com.gestioncaballeria.proyecto.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin("*")
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoService;

    @GetMapping
    public List<Empleado> getAllEmpleados() {
        return empleadoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> getEmpleadoById(@PathVariable Long id) {
        return empleadoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Empleado createEmpleado(@RequestBody Empleado empleado) {
        return empleadoService.save(empleado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empleado> updateEmpleado(@PathVariable Long id, @RequestBody Empleado empleadoDetails) {
        return empleadoService.findById(id).map(empleado -> {
            empleado.setNombre(empleadoDetails.getNombre());
            empleado.setRol(empleadoDetails.getRol());
            empleado.setContacto(empleadoDetails.getContacto());
            return ResponseEntity.ok(empleadoService.save(empleado));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpleado(@PathVariable Long id) {
        if (empleadoService.findById(id).isPresent()) {
            empleadoService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/turnos")
    public ResponseEntity<Turno> addTurno(@PathVariable Long id, @RequestBody Turno turno) {
        try {
            return ResponseEntity.ok(empleadoService.addTurno(id, turno));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/tareas")
    public ResponseEntity<Tarea> addTarea(@PathVariable Long id, @RequestBody Tarea tarea) {
        try {
            return ResponseEntity.ok(empleadoService.addTarea(id, tarea));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}/turnos")
    public ResponseEntity<List<Turno>> getTurnos(@PathVariable Long id) {
        return ResponseEntity.ok(empleadoService.getTurnos(id));
    }

    @GetMapping("/{id}/tareas")
    public ResponseEntity<List<Tarea>> getTareas(@PathVariable Long id) {
        return ResponseEntity.ok(empleadoService.getTareas(id));
    }

    @PutMapping("/tareas/{tareaId}")
    public ResponseEntity<Tarea> updateTarea(@PathVariable Long tareaId, @RequestBody java.util.Map<String, String> payload) {
        try {
            return ResponseEntity.ok(empleadoService.updateTareaEstado(tareaId, payload.get("estado")));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
