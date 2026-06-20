package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.Caballo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaballoRepository extends JpaRepository<Caballo, Long> {
}
