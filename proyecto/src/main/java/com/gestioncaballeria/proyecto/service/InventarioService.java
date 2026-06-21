package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Inventario;
import com.gestioncaballeria.proyecto.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventarioService {


@Autowired
private InventarioRepository inventarioRepository;

@Autowired
private AlertaService alertaService;

public List<Inventario> findAll() {
    return inventarioRepository.findAll();
}

public Optional<Inventario> findById(Long id) {
    return inventarioRepository.findById(id);
}

public Inventario save(Inventario inventario) {

    Inventario guardado =
            inventarioRepository.save(inventario);

    alertaService.verificarStock(guardado);

    return guardado;
}

public void deleteById(Long id) {
    inventarioRepository.deleteById(id);
}


}
