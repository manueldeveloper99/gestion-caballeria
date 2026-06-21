import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaballosDashboard = () => {
  const [caballos, setCaballos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Caballo Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', identificador: '', raza: '', edad: '', sexo: '', peso: '', foto: ''
  });

  // States for Historial Modal
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedCaballo, setSelectedCaballo] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialForm, setHistorialForm] = useState({
    fecha: '', vacuna: '', tratamiento: '', alergias: '', observaciones: '', empleadoId: ''
  });

  useEffect(() => {
    fetchCaballos();
    fetchEmpleados();
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

  const fetchEmpleados = () => {
    axios.get('http://localhost:8080/api/empleados')
      .then(res => setEmpleados(res.data))
      .catch(err => console.error(err));
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
      nombre: caballo.nombre || '', identificador: caballo.identificador || '', raza: caballo.raza || '',
      edad: caballo.edad || '', sexo: caballo.sexo || '', peso: caballo.peso || '', foto: caballo.foto || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este caballo? Esta acción no se puede deshacer.')) {
      axios.delete(`http://localhost:8080/api/caballos/${id}`)
        .then(() => setCaballos(caballos.filter(c => c.id !== id)))
        .catch(err => alert('Error al eliminar caballo'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://localhost:8080/api/caballos/${editingId}`, formData)
        .then(res => {
          setCaballos(caballos.map(c => c.id === editingId ? res.data : c));
          setShowModal(false);
        })
        .catch(err => alert('Error al actualizar caballo'));
    } else {
      axios.post('http://localhost:8080/api/caballos', formData)
        .then(res => {
          setCaballos([...caballos, res.data]);
          setShowModal(false);
        })
        .catch(err => alert('Error al añadir caballo'));
    }
  };

  // --- HISTORIAL MEDICO LOGIC ---
  const openHistorialModal = (caballo) => {
    setSelectedCaballo(caballo);
    axios.get(`http://localhost:8080/api/caballos/${caballo.id}/historial`)
      .then(res => {
        setHistorial(res.data);
        setShowHistorialModal(true);
      })
      .catch(err => alert('Error al cargar el historial médico'));
  };

  const handleHistorialChange = (e) => {
    setHistorialForm({ ...historialForm, [e.target.name]: e.target.value });
  };

  const handleHistorialSubmit = (e) => {
    e.preventDefault();
    const payload = {
      fecha: historialForm.fecha,
      vacuna: historialForm.vacuna,
      tratamiento: historialForm.tratamiento,
      alergias: historialForm.alergias,
      observaciones: historialForm.observaciones,
      empleado: { id: historialForm.empleadoId }
    };

    axios.post(`http://localhost:8080/api/caballos/${selectedCaballo.id}/historial`, payload)
      .then(res => {
        setHistorial([...historial, res.data]);
        setHistorialForm({ fecha: '', vacuna: '', tratamiento: '', alergias: '', observaciones: '', empleadoId: '' });
      })
      .catch(err => {
        console.error(err);
        alert('Error al añadir registro médico');
      });
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
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                          onClick={() => openHistorialModal(caballo)}
                        >
                          Historial
                        </button>
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

      {/* MODAL CABALLO (ADD/EDIT) */}
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
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ backgroundColor: '#ccc', color: '#333' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar Caballo' : 'Guardar Caballo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL MEDICO */}
      {showHistorialModal && selectedCaballo && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Historial Médico de: {selectedCaballo.nombre}</h2>
            
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h4>Añadir Nuevo Registro Médico</h4>
              <form onSubmit={handleHistorialSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                <div className="form-group">
                  <label>Fecha</label>
                  <input type="date" name="fecha" value={historialForm.fecha} onChange={handleHistorialChange} required />
                </div>
                <div className="form-group">
                  <label>Veterinario / Responsable</label>
                  <select name="empleadoId" value={historialForm.empleadoId} onChange={handleHistorialChange} required>
                    <option value="">Seleccione un empleado...</option>
                    {empleados.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.nombre} - {emp.rol}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Vacuna Aplicada</label>
                  <input type="text" name="vacuna" value={historialForm.vacuna} onChange={handleHistorialChange} />
                </div>
                <div className="form-group">
                  <label>Tratamiento</label>
                  <input type="text" name="tratamiento" value={historialForm.tratamiento} onChange={handleHistorialChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Alergias Conocidas</label>
                  <input type="text" name="alergias" value={historialForm.alergias} onChange={handleHistorialChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Observaciones Adicionales</label>
                  <textarea name="observaciones" value={historialForm.observaciones} onChange={handleHistorialChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} rows="3"></textarea>
                </div>
                <div className="modal-actions" style={{ gridColumn: '1 / -1', marginTop: '0' }}>
                  <button type="submit" className="btn btn-primary">Registrar Historial</button>
                </div>
              </form>
            </div>

            <h4>Registros Existentes</h4>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Responsable</th>
                    <th>Vacuna</th>
                    <th>Tratamiento</th>
                    <th>Alergias</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>No hay registros médicos para este caballo.</td>
                    </tr>
                  ) : (
                    historial.map(h => (
                      <tr key={h.id}>
                        <td>{h.fecha}</td>
                        <td>{h.empleado?.nombre}</td>
                        <td>{h.vacuna || '-'}</td>
                        <td>{h.tratamiento || '-'}</td>
                        <td>{h.alergias || '-'}</td>
                        <td>{h.observaciones || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button type="button" className="btn" onClick={() => setShowHistorialModal(false)} style={{ backgroundColor: '#ccc', color: '#333' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaballosDashboard;
