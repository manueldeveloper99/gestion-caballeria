package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.PlanAlimentacion;
import com.gestioncaballeria.proyecto.model.Inventario;
import com.gestioncaballeria.proyecto.repository.InventarioRepository;
import com.gestioncaballeria.proyecto.repository.PlanAlimentacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanAlimentacionService {

    @Autowired
    private PlanAlimentacionRepository planAlimentacionRepository;

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private AlertaService alertaService;

    public List<PlanAlimentacion> findAll() {
        return planAlimentacionRepository.findAll();
    }

    public Optional<PlanAlimentacion> findById(Long id) {
        return planAlimentacionRepository.findById(id);
    }

    public PlanAlimentacion save(PlanAlimentacion planAlimentacion) {
        if (planAlimentacion.getInventarioId() != null) {
            Optional<Inventario> invOpt = inventarioRepository.findById(planAlimentacion.getInventarioId());
            if (invOpt.isPresent()) {
                Inventario inv = invOpt.get();
                int cantidadRestar = planAlimentacion.getCantidad() != null ? planAlimentacion.getCantidad().intValue() : 0;
                
                if (inv.getStock() < cantidadRestar) {
                    throw new IllegalArgumentException("Stock insuficiente de " + inv.getNombre() + ". Solo hay " + inv.getStock() + " disponibles.");
                }
                
                inv.setStock(inv.getStock() - cantidadRestar);
                inventarioRepository.save(inv);
                alertaService.verificarStock(inv);
                planAlimentacion.setDescripcion(inv.getNombre());
            }
        }
        return planAlimentacionRepository.save(planAlimentacion);
    }

    public void deleteById(Long id) {
        planAlimentacionRepository.deleteById(id);
    }
}