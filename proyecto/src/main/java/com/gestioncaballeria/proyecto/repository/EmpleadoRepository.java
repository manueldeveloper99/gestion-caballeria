package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
}
