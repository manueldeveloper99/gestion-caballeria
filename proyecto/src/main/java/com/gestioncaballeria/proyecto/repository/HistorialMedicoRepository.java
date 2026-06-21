package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.HistorialMedico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Long> {
    List<HistorialMedico> findByCaballoId(Long caballoId);
}
