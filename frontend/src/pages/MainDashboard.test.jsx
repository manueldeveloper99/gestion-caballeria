import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainDashboard from './MainDashboard';
import axios from '../axiosConfig';

// Mock de axios
vi.mock('../axiosConfig', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Evitar errores con ResponsiveContainer de Recharts en JSDOM
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '100%', height: '200px' }}>{children}</div>
    ),
  };
});

describe('MainDashboard Component', () => {

  it('debería renderizar la pantalla de carga inicialmente', () => {
    // Configurar el mock para que devuelva una promesa que no se resuelve inmediatamente
    axios.get.mockImplementation(() => new Promise(() => {}));

    render(<MainDashboard />);
    
    expect(screen.getByText(/Cargando Panel de Control/i)).toBeInTheDocument();
  });

  it('debería renderizar las tarjetas y los datos después de cargar', async () => {
    // Mockear las respuestas de las APIs
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/caballos')) {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }] }); // 2 caballos
      }
      if (url.includes('/api/reservas')) {
        return Promise.resolve({ data: [] }); // 0 reservas
      }
      if (url.includes('/api/inventario')) {
        return Promise.resolve({ data: [{ id: 1, stock: 5, stockMinimo: 10, nombre: 'Avena' }] }); // 1 alerta de inventario
      }
      if (url.includes('/api/empleados')) {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] }); // 3 empleados
      }
      return Promise.reject(new Error('not found'));
    });

    render(<MainDashboard />);

    // Esperar a que la carga termine (el texto de cargando desaparezca)
    await waitFor(() => {
      expect(screen.queryByText(/Cargando Panel de Control/i)).not.toBeInTheDocument();
    });

    // Verificar el título
    expect(screen.getByText('Centro de Control')).toBeInTheDocument();

    // Verificar las métricas calculadas
    expect(screen.getByText('Caballos Activos')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 Caballos

    expect(screen.getByText('Personal Registrado')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // 3 Empleados

    // La avena tiene stock 5 y mínimo 10, así que debería ser una alerta
    expect(screen.getByText('Alertas de Inventario')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 alerta
    expect(screen.getByText('Avena')).toBeInTheDocument();
  });

});
