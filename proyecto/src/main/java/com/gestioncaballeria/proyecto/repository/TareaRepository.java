package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
}
