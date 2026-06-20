import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonalDashboard = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/empleados')
      .then(res => {
        setEmpleados(res.data);
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
        <h1>Gestión de Personal</h1>
        <button className="btn btn-primary">+ Añadir Empleado</button>
      </div>

      <div className="card">
        {loading ? <p>Cargando personal...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Contacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No hay empleados registrados.</td>
                </tr>
              ) : (
                empleados.map(empleado => (
                  <tr key={empleado.id}>
                    <td>{empleado.id}</td>
                    <td>{empleado.nombre}</td>
                    <td>{empleado.rol}</td>
                    <td>{empleado.contacto}</td>
                    <td>
                      <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '12px' }}>Ver turnos</button>
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

export default PersonalDashboard;
