package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.PlanAlimentacion;
import com.gestioncaballeria.proyecto.repository.PlanAlimentacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanAlimentacionService {

    @Autowired
    private PlanAlimentacionRepository planAlimentacionRepository;

    public List<PlanAlimentacion> findAll() {
        return planAlimentacionRepository.findAll();
    }

    public Optional<PlanAlimentacion> findById(Long id) {
        return planAlimentacionRepository.findById(id);
    }

    public PlanAlimentacion save(PlanAlimentacion planAlimentacion) {
        return planAlimentacionRepository.save(planAlimentacion);
    }

    public void deleteById(Long id) {
        planAlimentacionRepository.deleteById(id);
    }
}