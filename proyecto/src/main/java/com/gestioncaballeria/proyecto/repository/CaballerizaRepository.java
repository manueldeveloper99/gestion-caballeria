package com.gestioncaballeria.proyecto.repository;

import com.gestioncaballeria.proyecto.model.Caballeriza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CaballerizaRepository extends JpaRepository<Caballeriza, Long> {
    Optional<Caballeriza> findByNumero(String numero);
}
