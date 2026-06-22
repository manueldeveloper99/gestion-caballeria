import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const PersonalDashboard = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Empleado Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', rol: 'CUIDADOR', contacto: '', correo: '', password: ''
  });

  // States for Turnos/Tareas Modal
  const [showTurnosTareasModal, setShowTurnosTareasModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  
  const [turnos, setTurnos] = useState([]);
  const [turnoForm, setTurnoForm] = useState({ fecha: '', horaInicio: '', horaFin: '' });

  const [tareas, setTareas] = useState([]);
  const [tareaForm, setTareaForm] = useState({ descripcion: '', estado: 'Pendiente' });

  // States for Quick Popover
  const [hoveredEmpleado, setHoveredEmpleado] = useState(null);
  const [hoverData, setHoverData] = useState({ tareas: [], turnos: [], loading: false });

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
    setFormData({ nombre: '', rol: 'CUIDADOR', contacto: '', correo: '', password: '' });
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
        .then(() => setEmpleados(empleados.filter(e => e.id !== id)))
        .catch(err => alert('Error al eliminar empleado. Es posible que tenga turnos o historial asignado.'));
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
        .catch(err => alert('Error al actualizar empleado'));
    } else {
      axios.post('http://localhost:8080/api/empleados', formData)
        .then(res => {
          setEmpleados([...empleados, res.data]);
          setShowModal(false);
        })
        .catch(err => alert('Error al añadir empleado'));
    }
  };

  // --- TURNOS Y TAREAS LOGIC ---
  const openTurnosTareasModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowTurnosTareasModal(true);
    
    // Fetch Turnos
    axios.get(`http://localhost:8080/api/empleados/${empleado.id}/turnos`)
      .then(res => setTurnos(res.data))
      .catch(err => console.error('Error al cargar turnos', err));

    // Fetch Tareas
    axios.get(`http://localhost:8080/api/empleados/${empleado.id}/tareas`)
      .then(res => setTareas(res.data))
      .catch(err => console.error('Error al cargar tareas', err));
  };

  const handleTurnoChange = (e) => setTurnoForm({ ...turnoForm, [e.target.name]: e.target.value });
  const handleTareaChange = (e) => setTareaForm({ ...tareaForm, [e.target.name]: e.target.value });

  const handleTurnoSubmit = (e) => {
    e.preventDefault();
    const payload = {
      fecha: turnoForm.fecha,
      horario: `${turnoForm.horaInicio} - ${turnoForm.horaFin}`
    };
    axios.post(`http://localhost:8080/api/empleados/${selectedEmpleado.id}/turnos`, payload)
      .then(res => {
        setTurnos([...turnos, res.data]);
        setTurnoForm({ fecha: '', horaInicio: '', horaFin: '' });
      })
      .catch(err => alert('Error al añadir turno'));
  };

  const handleTareaSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:8080/api/empleados/${selectedEmpleado.id}/tareas`, tareaForm)
      .then(res => {
        setTareas([...tareas, res.data]);
        setTareaForm({ descripcion: '', estado: 'Pendiente' });
      })
      .catch(err => alert('Error al añadir tarea'));
  };

  const handleMouseEnter = (empleadoId) => {
    setHoveredEmpleado(empleadoId);
    setHoverData({ tareas: [], turnos: [], loading: true });
    
    Promise.all([
      axios.get(`http://localhost:8080/api/empleados/${empleadoId}/tareas`),
      axios.get(`http://localhost:8080/api/empleados/${empleadoId}/turnos`)
    ]).then(([resTareas, resTurnos]) => {
      setHoverData({ tareas: resTareas.data, turnos: resTurnos.data, loading: false });
    }).catch(err => {
      setHoverData({ tareas: [], turnos: [], loading: false });
    });
  };

  const handleMouseLeave = () => {
    setHoveredEmpleado(null);
    setHoverData({ tareas: [], turnos: [], loading: false });
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
                        backgroundColor: '#e6d5cb', color: '#542c18', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {empleado.rol}
                      </span>
                    </td>
                    <td>{empleado.contacto || '-'}</td>
                    <td style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <div 
                          onMouseEnter={() => handleMouseEnter(empleado.id)}
                          onMouseLeave={handleMouseLeave}
                          style={{ position: 'relative' }}
                        >
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => openTurnosTareasModal(empleado)}
                          >
                            Turnos y Tareas
                          </button>

                          {hoveredEmpleado === empleado.id && (
                            <div style={{
                              position: 'absolute', top: '100%', left: '0', 
                              backgroundColor: 'white', border: '1px solid #ddd', 
                              borderRadius: '6px', padding: '12px', 
                              boxShadow: '0 5px 15px rgba(0,0,0,0.2)', 
                              zIndex: 1000, width: '260px',
                              color: '#333', textAlign: 'left', marginTop: '5px'
                            }}>
                              <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                                Resumen Rápido
                              </h5>
                              {hoverData.loading ? (
                                <div style={{ fontSize: '12px', color: '#888' }}>Cargando datos...</div>
                              ) : (
                                <>
                                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#8b4513' }}>
                                    Tareas ({hoverData.tareas.length}):
                                  </div>
                                  {hoverData.tareas.length === 0 ? <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>Sin tareas asignadas.</div> : (
                                    <ul style={{ padding: '0 0 0 15px', margin: '0 0 10px 0', fontSize: '11px' }}>
                                      {hoverData.tareas.slice(0,3).map(t => (
                                        <li key={t.id} style={{ marginBottom: '2px' }}>
                                          <strong style={{ color: t.estado === 'Completada' ? '#4CAF50' : t.estado === 'En Progreso' ? '#FF9800' : '#F44336' }}>
                                            [{t.estado}]
                                          </strong> {t.descripcion}
                                        </li>
                                      ))}
                                      {hoverData.tareas.length > 3 && <li style={{ color: '#888', fontStyle: 'italic' }}>... y {hoverData.tareas.length - 3} más</li>}
                                    </ul>
                                  )}
                                  
                                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#8b4513' }}>
                                    Turnos ({hoverData.turnos.length}):
                                  </div>
                                  {hoverData.turnos.length === 0 ? <div style={{ fontSize: '11px', color: '#888' }}>Sin turnos asignados.</div> : (
                                    <ul style={{ padding: '0 0 0 15px', margin: '0 0 0 0', fontSize: '11px' }}>
                                      {hoverData.turnos.slice(0,2).map(t => (
                                        <li key={t.id} style={{ marginBottom: '2px' }}>{t.fecha} | {t.horario}</li>
                                      ))}
                                      {hoverData.turnos.length > 2 && <li style={{ color: '#888', fontStyle: 'italic' }}>... y {hoverData.turnos.length - 2} más</li>}
                                    </ul>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
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

      {/* MODAL EMPLEADO (ADD/EDIT) */}
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
              
              {!editingId && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed #ccc', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Credenciales de Acceso (Opcional)</h4>
                  <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px 0' }}>Si llenas estos campos, se le creará una cuenta de usuario para ingresar al sistema.</p>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" name="correo" value={formData.correo || ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" name="password" value={formData.password || ''} onChange={handleChange} />
                  </div>
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ backgroundColor: '#ccc', color: '#333' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar Empleado' : 'Guardar Empleado'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TURNOS Y TAREAS */}
      {showTurnosTareasModal && selectedEmpleado && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Gestión del Empleado: {selectedEmpleado.nombre}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              {/* COLUMNA TURNOS */}
              <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h4>Asignar Turno</h4>
                <form onSubmit={handleTurnoSubmit} style={{ marginTop: '10px' }}>
                  <div className="form-group">
                    <label>Fecha</label>
                    <input type="date" name="fecha" value={turnoForm.fecha} onChange={handleTurnoChange} required max="2099-12-31" />
                  </div>
                  <div className="form-group">
                    <label>Horario</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="time" name="horaInicio" value={turnoForm.horaInicio} onChange={handleTurnoChange} required className="form-control" />
                      <span style={{ alignSelf: 'center', color: '#555', fontWeight: 'bold' }}>a</span>
                      <input type="time" name="horaFin" value={turnoForm.horaFin} onChange={handleTurnoChange} required className="form-control" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>Añadir Turno</button>
                </form>

                <h4 style={{ marginTop: '20px' }}>Turnos Asignados</h4>
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                  {turnos.length === 0 ? <li style={{ fontSize: '13px', color: '#888' }}>Sin turnos.</li> : turnos.map(t => (
                    <li key={t.id} style={{ padding: '8px', borderBottom: '1px solid #ddd', fontSize: '14px' }}>
                      <strong>{t.fecha}</strong> | {t.horario}
                    </li>
                  ))}
                </ul>
              </div>

              {/* COLUMNA TAREAS */}
              <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h4>Asignar Tarea</h4>
                <form onSubmit={handleTareaSubmit} style={{ marginTop: '10px' }}>
                  <div className="form-group">
                    <label>Descripción de la Tarea</label>
                    <input type="text" name="descripcion" value={tareaForm.descripcion} onChange={handleTareaChange} required />
                  </div>
                  <div className="form-group">
                    <label>Estado Inicial</label>
                    <select name="estado" value={tareaForm.estado} onChange={handleTareaChange} required>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>Añadir Tarea</button>
                </form>

                <h4 style={{ marginTop: '20px' }}>Tareas Asignadas</h4>
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                  {tareas.length === 0 ? <li style={{ fontSize: '13px', color: '#888' }}>Sin tareas.</li> : tareas.map(t => (
                    <li key={t.id} style={{ padding: '8px', borderBottom: '1px solid #ddd', fontSize: '14px' }}>
                      <span style={{ 
                        display: 'inline-block', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', marginRight: '8px', color: 'white',
                        backgroundColor: t.estado === 'Completada' ? '#4CAF50' : t.estado === 'En Progreso' ? '#FF9800' : '#F44336'
                      }}>
                        {t.estado}
                      </span>
                      {t.descripcion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button type="button" className="btn" onClick={() => setShowTurnosTareasModal(false)} style={{ backgroundColor: '#ccc', color: '#333' }}>Cerrar Panel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDashboard;
