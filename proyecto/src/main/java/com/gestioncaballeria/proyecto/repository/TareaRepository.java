package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByEmpleadoId(Long empleadoId);
}
