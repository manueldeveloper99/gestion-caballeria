package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {
}