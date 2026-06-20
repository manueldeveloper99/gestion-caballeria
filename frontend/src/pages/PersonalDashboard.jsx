import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonalDashboard = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    rol: 'CUIDADOR',
    contacto: ''
  });

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = () => {
    axios.get('http://localhost:8080/api/empleados')
      .then(res => {
        setEmpleados(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ nombre: '', rol: 'CUIDADOR', contacto: '' });
    setShowModal(true);
  };

  const openEditModal = (empleado) => {
    setEditingId(empleado.id);
    setFormData({
      nombre: empleado.nombre || '',
      rol: empleado.rol || 'CUIDADOR',
      contacto: empleado.contacto || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este empleado?')) {
      axios.delete(`http://localhost:8080/api/empleados/${id}`)
        .then(() => {
          setEmpleados(empleados.filter(e => e.id !== id));
        })
        .catch(err => {
          console.error(err);
          alert('Error al eliminar empleado. Es posible que tenga turnos o historial asignado.');
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://localhost:8080/api/empleados/${editingId}`, formData)
        .then(res => {
          setEmpleados(empleados.map(emp => emp.id === editingId ? res.data : emp));
          setShowModal(false);
        })
        .catch(err => {
          console.error(err);
          alert('Error al actualizar empleado');
        });
    } else {
      axios.post('http://localhost:8080/api/empleados', formData)
        .then(res => {
          setEmpleados([...empleados, res.data]);
          setShowModal(false);
        })
        .catch(err => {
          console.error(err);
          alert('Error al añadir empleado');
        });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Personal</h1>
        <button className="btn btn-primary" onClick={openAddModal}>+ Añadir Empleado</button>
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
                    <td style={{ fontWeight: '500' }}>{empleado.nombre}</td>
                    <td>
                      <span style={{ 
                        backgroundColor: '#e6d5cb', 
                        color: '#542c18', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {empleado.rol}
                      </span>
                    </td>
                    <td>{empleado.contacto || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#5D737E' }}
                          onClick={() => openEditModal(empleado)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#C94C4C', color: 'white' }}
                          onClick={() => handleDelete(empleado.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Editar Empleado' : 'Añadir Nuevo Empleado'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select name="rol" value={formData.rol} onChange={handleChange} required>
                  <option value="VETERINARIO">Veterinario</option>
                  <option value="POTRADOR">Potrador</option>
                  <option value="CUIDADOR">Cuidador</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contacto</label>
                <input type="text" name="contacto" value={formData.contacto} onChange={handleChange} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ backgroundColor: '#ccc', color: '#333' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar Empleado' : 'Guardar Empleado'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDashboard;
