package com.gestioncaballeria.proyecto.service;

import com.gestioncaballeria.proyecto.model.Inventario;
import com.gestioncaballeria.proyecto.model.PlanAlimentacion;
import com.gestioncaballeria.proyecto.repository.InventarioRepository;
import com.gestioncaballeria.proyecto.repository.PlanAlimentacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PlanAlimentacionServiceTest {

    @Mock
    private PlanAlimentacionRepository planAlimentacionRepository;

    @Mock
    private InventarioRepository inventarioRepository;

    @InjectMocks
    private PlanAlimentacionService planAlimentacionService;

    private Inventario inventarioAvena;
    private PlanAlimentacion planAlimentacion;

    @BeforeEach
    void setUp() {
        inventarioAvena = new Inventario();
        inventarioAvena.setId(1L);
        inventarioAvena.setNombre("Avena");
        inventarioAvena.setStock(10);
        inventarioAvena.setStockMinimo(2);

        planAlimentacion = new PlanAlimentacion();
        planAlimentacion.setInventarioId(1L);
        planAlimentacion.setCantidad(4.0);
    }

    @Test
    void testSave_ConStockSuficiente_DescuentaInventario() {
        // Arrange
        when(inventarioRepository.findById(1L)).thenReturn(Optional.of(inventarioAvena));
        when(planAlimentacionRepository.save(any(PlanAlimentacion.class))).thenReturn(planAlimentacion);

        // Act
        PlanAlimentacion savedPlan = planAlimentacionService.save(planAlimentacion);

        // Assert
        assertEquals("Avena", planAlimentacion.getDescripcion(), "La descripcion debe coincidir con el nombre del inventario");
        assertEquals(6, inventarioAvena.getStock(), "El stock debe haberse reducido en 4 unidades (10 - 4)");
        verify(inventarioRepository, times(1)).save(inventarioAvena);
        verify(planAlimentacionRepository, times(1)).save(planAlimentacion);
    }

    @Test
    void testSave_SinStockSuficiente_LanzaExcepcion() {
        // Arrange
        planAlimentacion.setCantidad(15.0); // Pedir 15kg cuando solo hay 10kg
        when(inventarioRepository.findById(1L)).thenReturn(Optional.of(inventarioAvena));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            planAlimentacionService.save(planAlimentacion);
        });

        assertTrue(exception.getMessage().contains("Stock insuficiente"));
        assertEquals(10, inventarioAvena.getStock(), "El stock NO debe haberse reducido");
        
        // Verificar que NO se guardó en el inventario ni en el historial
        verify(inventarioRepository, never()).save(any(Inventario.class));
        verify(planAlimentacionRepository, never()).save(any(PlanAlimentacion.class));
    }
}
