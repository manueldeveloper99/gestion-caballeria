package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Caballeriza;
import com.gestioncaballeria.proyecto.service.CaballerizaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caballerizas")
@CrossOrigin("*")
public class CaballerizaController {

    @Autowired
    private CaballerizaService caballerizaService;

    @GetMapping
    public List<Caballeriza> getAllCaballerizas() {
        return caballerizaService.findAll();
    }

    @PutMapping("/{id}/asignar")
    public ResponseEntity<Caballeriza> assignCaballo(@PathVariable Long id, @RequestParam Long caballoId) {
        try {
            return ResponseEntity.ok(caballerizaService.assignCaballo(id, caballoId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/liberar")
    public ResponseEntity<Caballeriza> releaseCaballo(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(caballerizaService.releaseCaballo(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Caballeriza> updateEstado(@PathVariable Long id, @RequestParam String estado) {
        try {
            return ResponseEntity.ok(caballerizaService.updateEstado(id, estado));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
