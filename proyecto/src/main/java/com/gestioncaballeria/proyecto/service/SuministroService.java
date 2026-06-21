package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Suministro;
import com.gestioncaballeria.proyecto.repository.SuministroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SuministroService {

    @Autowired
    private SuministroRepository suministroRepository;

    public List<Suministro> findAll() {
        return suministroRepository.findAll();
    }

    public Optional<Suministro> findById(Long id) {
        return suministroRepository.findById(id);
    }

    public Suministro save(Suministro suministro) {
        return suministroRepository.save(suministro);
    }

    public void deleteById(Long id) {
        suministroRepository.deleteById(id);
    }
}