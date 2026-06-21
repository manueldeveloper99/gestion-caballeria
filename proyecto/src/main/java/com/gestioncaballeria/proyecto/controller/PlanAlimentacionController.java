package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.PlanAlimentacion;
import com.gestioncaballeria.proyecto.service.PlanAlimentacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plan-alimentacion")
@CrossOrigin("*")
public class PlanAlimentacionController {

    @Autowired
    private PlanAlimentacionService planAlimentacionService;

    @GetMapping
    public List<PlanAlimentacion> getAll() {
        return planAlimentacionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanAlimentacion> getById(@PathVariable Long id) {
        return planAlimentacionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PlanAlimentacion create(@RequestBody PlanAlimentacion planAlimentacion) {
        return planAlimentacionService.save(planAlimentacion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanAlimentacion> update(
            @PathVariable Long id,
            @RequestBody PlanAlimentacion planDetails) {

        return planAlimentacionService.findById(id).map(plan -> {

            plan.setCaballo(planDetails.getCaballo());
            plan.setDescripcion(planDetails.getDescripcion());
            plan.setCantidad(planDetails.getCantidad());
            plan.setHorario(planDetails.getHorario());

            return ResponseEntity.ok(
                    planAlimentacionService.save(plan)
            );

        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        if (planAlimentacionService.findById(id).isPresent()) {
            planAlimentacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}