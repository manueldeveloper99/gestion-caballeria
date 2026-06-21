package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Caballo;
import com.gestioncaballeria.proyecto.model.HistorialMedico;
import com.gestioncaballeria.proyecto.service.CaballoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caballos")
@CrossOrigin("*")
public class CaballoController {

    @Autowired
    private CaballoService caballoService;

    @GetMapping
    public List<Caballo> getAllCaballos() {
        return caballoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Caballo> getCaballoById(@PathVariable Long id) {
        return caballoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Caballo createCaballo(@RequestBody Caballo caballo) {
        return caballoService.save(caballo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Caballo> updateCaballo(@PathVariable Long id, @RequestBody Caballo caballoDetails) {
        return caballoService.findById(id).map(caballo -> {
            caballo.setNombre(caballoDetails.getNombre());
            caballo.setIdentificador(caballoDetails.getIdentificador());
            caballo.setEdad(caballoDetails.getEdad());
            caballo.setRaza(caballoDetails.getRaza());
            caballo.setSexo(caballoDetails.getSexo());
            caballo.setPeso(caballoDetails.getPeso());
            caballo.setFoto(caballoDetails.getFoto());
            return ResponseEntity.ok(caballoService.save(caballo));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCaballo(@PathVariable Long id) {
        if (caballoService.findById(id).isPresent()) {
            caballoService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/historial")
    public ResponseEntity<HistorialMedico> addHistorial(@PathVariable Long id, @RequestBody HistorialMedico historial) {
        try {
            return ResponseEntity.ok(caballoService.addHistorialMedico(id, historial));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}/historial")
    public ResponseEntity<List<HistorialMedico>> getHistorial(@PathVariable Long id) {
        return ResponseEntity.ok(caballoService.getHistorialMedico(id));
    }
}
