package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Empleado;
import com.gestioncaballeria.proyecto.model.TurnoTarea;
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
    public ResponseEntity<TurnoTarea> addTurnoTarea(@PathVariable Long id, @RequestBody TurnoTarea turnoTarea) {
        try {
            return ResponseEntity.ok(empleadoService.addTurnoTarea(id, turnoTarea));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
