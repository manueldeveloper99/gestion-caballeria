package com.gestioncaballeria.proyecto.controller;

import com.gestioncaballeria.proyecto.model.Alerta;
import com.gestioncaballeria.proyecto.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin("*")
public class AlertaController {
    
@Autowired
private AlertaRepository alertaRepository;

@GetMapping
public List<Alerta> getAllAlertas() {
    return alertaRepository.findAll();
}


}
