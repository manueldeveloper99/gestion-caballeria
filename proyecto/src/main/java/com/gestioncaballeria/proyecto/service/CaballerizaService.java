package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Caballeriza;
import com.gestioncaballeria.proyecto.model.Caballo;
import com.gestioncaballeria.proyecto.repository.CaballerizaRepository;
import com.gestioncaballeria.proyecto.repository.CaballoRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CaballerizaService {

    @Autowired
    private CaballerizaRepository caballerizaRepository;

    @Autowired
    private CaballoRepository caballoRepository;

    @PostConstruct
    public void initStables() {
        if (caballerizaRepository.count() == 0) {
            for (int i = 1; i <= 10; i++) {
                Caballeriza c = new Caballeriza();
                c.setNumero("Box " + i);
                c.setEstado("VACIA");
                caballerizaRepository.save(c);
            }
        }
    }

    public List<Caballeriza> findAll() {
        return caballerizaRepository.findAll();
    }

    public Optional<Caballeriza> findById(Long id) {
        return caballerizaRepository.findById(id);
    }

    public Caballeriza assignCaballo(Long id, Long caballoId) {
        Optional<Caballeriza> cabOpt = caballerizaRepository.findById(id);
        if (cabOpt.isEmpty()) {
            throw new RuntimeException("Caballeriza no encontrada");
        }
        Optional<Caballo> cabalOpt = caballoRepository.findById(caballoId);
        if (cabalOpt.isEmpty()) {
            throw new RuntimeException("Caballo no encontrado");
        }

        Caballeriza caballeriza = cabOpt.get();
        Caballo caballo = cabalOpt.get();

        // Liberar el caballo de cualquier otro box si ya estaba asignado
        List<Caballeriza> all = caballerizaRepository.findAll();
        for (Caballeriza other : all) {
            if (other.getCaballo() != null && other.getCaballo().getId().equals(caballoId)) {
                other.setCaballo(null);
                other.setEstado("VACIA");
                caballerizaRepository.save(other);
            }
        }

        caballeriza.setCaballo(caballo);
        caballeriza.setEstado("OCUPADA");
        return caballerizaRepository.save(caballeriza);
    }

    public Caballeriza releaseCaballo(Long id) {
        Optional<Caballeriza> cabOpt = caballerizaRepository.findById(id);
        if (cabOpt.isEmpty()) {
            throw new RuntimeException("Caballeriza no encontrada");
        }
        Caballeriza caballeriza = cabOpt.get();
        caballeriza.setCaballo(null);
        caballeriza.setEstado("VACIA");
        return caballerizaRepository.save(caballeriza);
    }

    public Caballeriza updateEstado(Long id, String estado) {
        Optional<Caballeriza> cabOpt = caballerizaRepository.findById(id);
        if (cabOpt.isEmpty()) {
            throw new RuntimeException("Caballeriza no encontrada");
        }
        Caballeriza caballeriza = cabOpt.get();
        caballeriza.setEstado(estado);
        if ("MANTENIMIENTO".equals(estado) || "VACIA".equals(estado)) {
            caballeriza.setCaballo(null);
        }
        return caballerizaRepository.save(caballeriza);
    }
}
