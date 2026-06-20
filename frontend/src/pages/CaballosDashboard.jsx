import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaballosDashboard = () => {
  const [caballos, setCaballos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Para propositos de demostración (en desarrollo real apuntaría a /api/caballos)
    axios.get('http://localhost:8080/api/caballos')
      .then(res => {
        setCaballos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Caballos</h1>
        <button className="btn btn-primary">+ Añadir Caballo</button>
      </div>

      <div className="card">
        {loading ? <p>Cargando caballos...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Identificador</th>
                <th>Raza</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {caballos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No hay caballos registrados.</td>
                </tr>
              ) : (
                caballos.map(caballo => (
                  <tr key={caballo.id}>
                    <td>{caballo.id}</td>
                    <td>{caballo.nombre}</td>
                    <td>{caballo.identificador}</td>
                    <td>{caballo.raza}</td>
                    <td>
                      <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '12px' }}>Ver detalles</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CaballosDashboard;
