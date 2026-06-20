package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Caballo;
import com.gestioncaballeria.proyecto.model.HistorialMedico;
import com.gestioncaballeria.proyecto.repository.CaballoRepository;
import com.gestioncaballeria.proyecto.repository.HistorialMedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CaballoService {

    @Autowired
    private CaballoRepository caballoRepository;
    
    @Autowired
    private HistorialMedicoRepository historialMedicoRepository;

    public List<Caballo> findAll() {
        return caballoRepository.findAll();
    }

    public Optional<Caballo> findById(Long id) {
        return caballoRepository.findById(id);
    }

    public Caballo save(Caballo caballo) {
        return caballoRepository.save(caballo);
    }

    public void deleteById(Long id) {
        caballoRepository.deleteById(id);
    }

    public HistorialMedico addHistorialMedico(Long caballoId, HistorialMedico historial) {
        Optional<Caballo> caballoOpt = caballoRepository.findById(caballoId);
        if (caballoOpt.isPresent()) {
            Caballo caballo = caballoOpt.get();
            historial.setCaballo(caballo);
            return historialMedicoRepository.save(historial);
        }
        throw new RuntimeException("Caballo no encontrado");
    }
}
