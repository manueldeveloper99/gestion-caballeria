package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Suministro;
import com.gestioncaballeria.proyecto.service.SuministroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suministros")
@CrossOrigin("*")
public class SuministroController {

    @Autowired
    private SuministroService suministroService;

    @GetMapping
    public List<Suministro> getAll() {
        return suministroService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Suministro> getById(@PathVariable Long id) {
        return suministroService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Suministro create(@RequestBody Suministro suministro) {
        return suministroService.save(suministro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Suministro> update(
            @PathVariable Long id,
            @RequestBody Suministro suministroDetails) {

        return suministroService.findById(id).map(suministro -> {

            suministro.setCaballo(suministroDetails.getCaballo());
            suministro.setInventario(suministroDetails.getInventario());
            suministro.setFecha(suministroDetails.getFecha());
            suministro.setTipo(suministroDetails.getTipo());
            suministro.setCantidad(suministroDetails.getCantidad());

            return ResponseEntity.ok(
                    suministroService.save(suministro)
            );

        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        if (suministroService.findById(id).isPresent()) {
            suministroService.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}