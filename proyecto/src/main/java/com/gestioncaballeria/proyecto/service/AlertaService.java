package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Alerta;
import com.gestioncaballeria.proyecto.model.Inventario;
import com.gestioncaballeria.proyecto.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AlertaService {


@Autowired
private AlertaRepository alertaRepository;

public void verificarStock(Inventario inventario) {

    if (inventario.getStock() <= inventario.getStockMinimo()) {

        Alerta alerta = new Alerta();

        alerta.setInventario(inventario);
        alerta.setFecha(LocalDateTime.now());
        alerta.setTipo("STOCK_BAJO");
        alerta.setMensaje(
            "Stock bajo de: " + inventario.getNombre()
        );

        alertaRepository.save(alerta);
    }
}


}
