package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.PlanAlimentacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanAlimentacionRepository extends JpaRepository<PlanAlimentacion, Long> {
}