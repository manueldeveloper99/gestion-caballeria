package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
}
