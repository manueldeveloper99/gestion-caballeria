package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Inventario;
import com.gestioncaballeria.proyecto.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin("*")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @GetMapping
    public List<Inventario> getAllInventario() {
        return inventarioService.findAll();
    }

    @GetMapping("/page")
    public Page<Inventario> getAllInventarioPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return inventarioService.findAllPaginated(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventario> getInventarioById(@PathVariable Long id) {
        return inventarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Inventario createInventario(@RequestBody Inventario inventario) {
        return inventarioService.save(inventario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventario> updateInventario(@PathVariable Long id,
                                                       @RequestBody Inventario inventarioDetails) {

        return inventarioService.findById(id).map(inventario -> {

            inventario.setNombre(inventarioDetails.getNombre());
            inventario.setStock(inventarioDetails.getStock());
            inventario.setStockMinimo(inventarioDetails.getStockMinimo());

            return ResponseEntity.ok(inventarioService.save(inventario));

        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventario(@PathVariable Long id) {

        if (inventarioService.findById(id).isPresent()) {
            inventarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}