import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [caballos, setCaballos] = useState([]);

  useEffect(() => {
    const fetchCaballos = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/caballos');
        setCaballos(res.data);
      } catch (err) {
        console.error("Error fetching caballos:", err);
      }
    };
    fetchCaballos();
  }, []);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'Desconocida';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad + ' años';
  };

  const getFotoUrl = (foto, nombre) => {
    if (!foto) return null;
    if (foto.startsWith('http')) return foto;
    
    const unsplashHorses = [
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80',
      'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=400&q=80',
      'https://images.unsplash.com/photo-1549474776-85fb45041a77?w=400&q=80',
      'https://images.unsplash.com/photo-1528629297340-d1d466945dc5?w=400&q=80',
      'https://images.unsplash.com/photo-1594895697523-926c06a9d701?w=400&q=80'
    ];
    return unsplashHorses[nombre.length % unsplashHorses.length];
  };

  const rol = localStorage.getItem('rol') || '';

  if (rol !== 'CLIENTE') {
    return (
      <div>
        <h1 className="page-header">
          Bienvenido al Sistema de Gestión
        </h1>
        <div className="card">
          <p>
            Seleccione un módulo en el menú lateral para comenzar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-header">
        Catálogo de Caballos
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        Conoce a todos los miembros de nuestro establo.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {caballos.map(caballo => {
          const fotoFinal = getFotoUrl(caballo.foto, caballo.nombre);
          return (
            <div key={caballo.id} className="card" style={{ padding: '15px', textAlign: 'center' }}>
              {fotoFinal ? (
                <img 
                  src={fotoFinal} 
                  alt={caballo.nombre} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} 
                />
              ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                🐴 Sin foto
              </div>
            )}
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-color)' }}>{caballo.nombre}</h3>
            <p style={{ margin: '0', color: 'var(--text-muted)' }}>
              <strong>Edad:</strong> {calcularEdad(caballo.fechaNacimiento)}
            </p>
            {caballo.raza && (
              <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)' }}>
                <strong>Raza:</strong> {caballo.raza}
              </p>
            )}
          </div>
          );
        })}
        {caballos.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
            No hay caballos registrados actualmente.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
