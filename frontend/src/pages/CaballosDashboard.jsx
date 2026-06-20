import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaballosDashboard = () => {
  const [caballos, setCaballos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    identificador: '',
    raza: '',
    edad: '',
    sexo: '',
    peso: '',
    foto: ''
  });

  useEffect(() => {
    fetchCaballos();
  }, []);

  const fetchCaballos = () => {
    axios.get('http://localhost:8080/api/caballos')
      .then(res => {
        setCaballos(res.data);
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
    setFormData({ nombre: '', identificador: '', raza: '', edad: '', sexo: '', peso: '', foto: '' });
    setShowModal(true);
  };

  const openEditModal = (caballo) => {
    setEditingId(caballo.id);
    setFormData({
      nombre: caballo.nombre || '',
      identificador: caballo.identificador || '',
      raza: caballo.raza || '',
      edad: caballo.edad || '',
      sexo: caballo.sexo || '',
      peso: caballo.peso || '',
      foto: caballo.foto || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este caballo? Esta acción no se puede deshacer.')) {
      axios.delete(`http://localhost:8080/api/caballos/${id}`)
        .then(() => {
          setCaballos(caballos.filter(c => c.id !== id));
        })
        .catch(err => {
          console.error(err);
          alert('Error al eliminar caballo');
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Editar existente
      axios.put(`http://localhost:8080/api/caballos/${editingId}`, formData)
        .then(res => {
          setCaballos(caballos.map(c => c.id === editingId ? res.data : c));
          setShowModal(false);
        })
        .catch(err => {
          console.error(err);
          alert('Error al actualizar caballo');
        });
    } else {
      // Crear nuevo
      axios.post('http://localhost:8080/api/caballos', formData)
        .then(res => {
          setCaballos([...caballos, res.data]);
          setShowModal(false);
        })
        .catch(err => {
          console.error(err);
          alert('Error al añadir caballo');
        });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Caballos</h1>
        <button className="btn btn-primary" onClick={openAddModal}>+ Añadir Caballo</button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? <p>Cargando caballos...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Identificador</th>
                <th>Raza</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Peso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {caballos.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>No hay caballos registrados.</td>
                </tr>
              ) : (
                caballos.map(caballo => (
                  <tr key={caballo.id}>
                    <td>
                      {caballo.foto ? (
                        <img 
                          src={caballo.foto} 
                          alt={caballo.nombre} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} 
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#888' }}>Sin foto</div>
                      )}
                    </td>
                    <td>{caballo.id}</td>
                    <td style={{ fontWeight: '500' }}>{caballo.nombre}</td>
                    <td>{caballo.identificador}</td>
                    <td>{caballo.raza || '-'}</td>
                    <td>{caballo.edad ? `${caballo.edad} años` : '-'}</td>
                    <td>{caballo.sexo || '-'}</td>
                    <td>{caballo.peso ? `${caballo.peso} kg` : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#5D737E' }}
                          onClick={() => openEditModal(caballo)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#C94C4C', color: 'white' }}
                          onClick={() => handleDelete(caballo.id)}
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
          <div className="modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{editingId ? 'Editar Caballo' : 'Añadir Nuevo Caballo'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Identificador (Código Único)</label>
                <input type="text" name="identificador" value={formData.identificador} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Raza</label>
                <input type="text" name="raza" value={formData.raza} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Edad (años)</label>
                  <input type="number" name="edad" value={formData.edad} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Sexo</label>
                  <select name="sexo" value={formData.sexo} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Peso (kg)</label>
                  <input type="number" step="0.01" name="peso" value={formData.peso} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>URL de la Foto (Imagen Web)</label>
                <input type="url" name="foto" value={formData.foto} onChange={handleChange} placeholder="https://ejemplo.com/foto.jpg" />
                <small style={{ color: '#888', marginTop: '5px', display: 'block' }}>Pega el enlace de una imagen de internet.</small>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ backgroundColor: '#ccc', color: '#333' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar Caballo' : 'Guardar Caballo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaballosDashboard;
