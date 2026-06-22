import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const onlyDate = dateString.split('T')[0];
  const [year, month, day] = onlyDate.split('-');
  return `${day}/${month}/${year}`;
};

const CaballosDashboard = () => {
  const [caballos, setCaballos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const rol = localStorage.getItem('rol');
  
  // States for Caballo Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', identificador: '', raza: '', fechaNacimiento: '', sexo: '', peso: '', foto: ''
  });

  // States for Historial Modal
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedCaballo, setSelectedCaballo] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialForm, setHistorialForm] = useState({
    fecha: '', vacuna: '', tratamiento: '', alergias: '', observaciones: '', empleadoId: '', pesoRegistrado: '', fechaProxima: ''
  });

  // State for Tabs inside Ficha Veterinaria
  const [activeTab, setActiveTab] = useState('medico'); // 'medico' | 'alimentacion'

  // States for Plan Alimentacion
  const [planAlimentacion, setPlanAlimentacion] = useState([]);
  const [alimentacionForm, setAlimentacionForm] = useState({
    inventarioId: '', cantidad: '', horario: ''
  });

  useEffect(() => {
    fetchCaballos();
    fetchEmpleados();
    fetchInventario();
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

  const fetchInventario = () => {
    axios.get('http://localhost:8080/api/inventario')
      .then(res => setInventario(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ nombre: '', identificador: '', raza: '', fechaNacimiento: '', sexo: '', peso: '', foto: '' });
    setShowModal(true);
  };

  const openEditModal = (caballo) => {
    setEditingId(caballo.id);
    setFormData({
      nombre: caballo.nombre || '', identificador: caballo.identificador || '', raza: caballo.raza || '',
      fechaNacimiento: caballo.fechaNacimiento || '', sexo: caballo.sexo || '', peso: caballo.peso || '', foto: caballo.foto || ''
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

  // --- FICHA VETERINARIA LOGIC ---
  const openHistorialModal = async (caballo) => {
    setSelectedCaballo(caballo);
    setActiveTab('medico'); // Reset to default tab
    try {
      const [resHistorial, resAlimentacion] = await Promise.all([
        axios.get(`http://localhost:8080/api/caballos/${caballo.id}/historial`),
        axios.get('http://localhost:8080/api/plan-alimentacion')
      ]);
      
      setHistorial(resHistorial.data);
      // Filter feeding plans for this specific horse
      const filteredPlans = resAlimentacion.data.filter(p => p.caballo && p.caballo.id === caballo.id);
      setPlanAlimentacion(filteredPlans);
      
      setShowHistorialModal(true);
    } catch (err) {
      alert('Error al cargar la ficha veterinaria');
      console.error(err);
    }
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
      pesoRegistrado: historialForm.pesoRegistrado ? parseFloat(historialForm.pesoRegistrado) : null,
      fechaProxima: historialForm.fechaProxima,
      empleado: { id: historialForm.empleadoId }
    };

    axios.post(`http://localhost:8080/api/caballos/${selectedCaballo.id}/historial`, payload)
      .then(res => {
        setHistorial([...historial, res.data]);
        setHistorialForm({ fecha: '', vacuna: '', tratamiento: '', alergias: '', observaciones: '', empleadoId: '', pesoRegistrado: '', fechaProxima: '' });
      })
      .catch(err => {
        console.error(err);
        alert('Error al añadir registro médico');
      });
  };

  const handleAlimentacionChange = (e) => {
    setAlimentacionForm({ ...alimentacionForm, [e.target.name]: e.target.value });
  };

  const handleAlimentacionSubmit = (e) => {
    e.preventDefault();
    const payload = {
      caballo: { id: selectedCaballo.id },
      inventarioId: alimentacionForm.inventarioId,
      cantidad: parseFloat(alimentacionForm.cantidad),
      horario: alimentacionForm.horario
    };

    axios.post('http://localhost:8080/api/plan-alimentacion', payload)
      .then(res => {
        setPlanAlimentacion([...planAlimentacion, res.data]);
        setAlimentacionForm({ inventarioId: '', cantidad: '', horario: '' });
      })
      .catch(err => {
        console.error(err);
        const errorMessage = err.response?.data?.message || err.response?.data || 'Error al añadir plan de alimentación';
        alert("Ocurrió un error: " + (typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)));
      });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Caballos</h1>
        {rol !== 'CUIDADOR' && (
          <button className="btn btn-primary" onClick={openAddModal}>+ Añadir Caballo</button>
        )}
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
                <th>Edad Calculada</th>
                <th>Sexo</th>
                <th>Peso Actual</th>
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
                    <td>{caballo.fechaNacimiento ? `${new Date().getFullYear() - new Date(caballo.fechaNacimiento).getFullYear()} años` : '-'}</td>
                    <td>{caballo.sexo || '-'}</td>
                    <td>{caballo.peso ? `${caballo.peso} kg` : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                          onClick={() => openHistorialModal(caballo)}
                        >
                          Ficha Veterinaria
                        </button>
                        {rol !== 'CUIDADOR' && (
                          <>
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
                          </>
                        )}
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
                  <label>Fecha de Nacimiento</label>
                  <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
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

      {/* MODAL FICHA VETERINARIA */}
      {showHistorialModal && selectedCaballo && (
        <div className="modal-overlay">
          <div className="modal" style={{ width: '95%', maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Ficha Veterinaria: {selectedCaballo.nombre}</h2>
            <p style={{ marginTop: '-15px', marginBottom: '20px', color: '#666' }}>
              <strong>Edad actual:</strong> {selectedCaballo.fechaNacimiento ? `${new Date().getFullYear() - new Date(selectedCaballo.fechaNacimiento).getFullYear()} años` : 'Desconocida'} | 
              <strong> Peso base:</strong> {selectedCaballo.peso ? `${selectedCaballo.peso} kg` : 'Desconocido'}
            </p>
            
            {/* TABS MENU */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              <button 
                className={`btn ${activeTab === 'medico' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '20px', backgroundColor: activeTab !== 'medico' ? 'transparent' : '', color: activeTab !== 'medico' ? 'var(--text)' : '', border: activeTab !== 'medico' ? '1px solid #ccc' : 'none' }}
                onClick={() => setActiveTab('medico')}
              >
                Historial Médico
              </button>
              <button 
                className={`btn ${activeTab === 'alimentacion' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '20px', backgroundColor: activeTab !== 'alimentacion' ? 'transparent' : '', color: activeTab !== 'alimentacion' ? 'var(--text)' : '', border: activeTab !== 'alimentacion' ? '1px solid #ccc' : 'none' }}
                onClick={() => setActiveTab('alimentacion')}
              >
                Plan de Alimentación
              </button>
            </div>

            {/* TAB CONTENT: MEDICO */}
            {activeTab === 'medico' && (
              <div>
                {rol !== 'CUIDADOR' && (
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
                      <div className="form-group">
                        <label>Peso Registrado (kg) [Opcional]</label>
                        <input type="number" step="0.01" name="pesoRegistrado" value={historialForm.pesoRegistrado} onChange={handleHistorialChange} />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Alergias Conocidas</label>
                        <input type="text" name="alergias" value={historialForm.alergias} onChange={handleHistorialChange} />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Observaciones Adicionales</label>
                        <textarea name="observaciones" value={historialForm.observaciones} onChange={handleHistorialChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} rows="3"></textarea>
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Fecha Próxima Dosis / Seguimiento (Opcional)</label>
                        <input type="date" name="fechaProxima" value={historialForm.fechaProxima} onChange={handleHistorialChange} style={{ width: '50%' }} />
                      </div>
                      <div className="modal-actions" style={{ gridColumn: '1 / -1', marginTop: '0' }}>
                        <button type="submit" className="btn btn-primary">Registrar Historial</button>
                      </div>
                    </form>
                  </div>
                )}

            <h4>Registros Existentes</h4>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Responsable</th>
                    <th>Peso Registrado</th>
                    <th>Vacuna</th>
                    <th>Tratamiento</th>
                    <th>Alergias</th>
                    <th>Fecha Próx.</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center' }}>No hay registros médicos para este caballo.</td>
                    </tr>
                  ) : (
                    historial.map(h => (
                      <tr key={h.id}>
                        <td>{formatDate(h.fecha)}</td>
                        <td>{h.empleado?.nombre}</td>
                        <td>{h.pesoRegistrado ? `${h.pesoRegistrado} kg` : '-'}</td>
                        <td>{h.vacuna || '-'}</td>
                        <td>{h.tratamiento || '-'}</td>
                        <td>{h.alergias || '-'}</td>
                        <td style={{ color: h.fechaProxima ? '#d97706' : 'inherit', fontWeight: h.fechaProxima ? 'bold' : 'normal' }}>{formatDate(h.fechaProxima)}</td>
                        <td>{h.observaciones || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

              </div>
            )}

            {/* TAB CONTENT: ALIMENTACION */}
            {activeTab === 'alimentacion' && (
              <div>
                {rol !== 'CUIDADOR' && (
                  <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff8f0', borderRadius: '8px', border: '1px solid #fce8d5' }}>
                    <h4 style={{ color: '#d97706' }}>Asignar Ración de Alimento</h4>
                    <form onSubmit={handleAlimentacionSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '10px' }}>
                      <div className="form-group" style={{ gridColumn: '1 / span 3' }}>
                        <label>Descripción del Alimento (Seleccione del Inventario)</label>
                        <select name="inventarioId" value={alimentacionForm.inventarioId} onChange={handleAlimentacionChange} required className="form-control">
                          <option value="">-- Seleccione un Producto --</option>
                          {inventario.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.nombre} (Stock: {item.stock})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Cantidad (kg / porciones)</label>
                        <input type="number" step="0.01" name="cantidad" value={alimentacionForm.cantidad} onChange={handleAlimentacionChange} required />
                      </div>
                      <div className="form-group" style={{ gridColumn: '2 / span 2' }}>
                        <label>Horario (Ej. Mañana, Tarde, 08:00 AM)</label>
                        <input type="text" name="horario" value={alimentacionForm.horario} onChange={handleAlimentacionChange} required />
                      </div>
                      <div className="modal-actions" style={{ gridColumn: '1 / -1', marginTop: '0' }}>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#d97706' }}>Registrar Alimento</button>
                      </div>
                    </form>
                  </div>
                )}

                <h4>Dieta Actual</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table" style={{ fontSize: '14px' }}>
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Horario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planAlimentacion.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center' }}>No hay plan de alimentación registrado.</td>
                        </tr>
                      ) : (
                        planAlimentacion.map(p => (
                          <tr key={p.id}>
                            <td style={{ fontWeight: '500' }}>{p.descripcion}</td>
                            <td>{p.cantidad}</td>
                            <td>{p.horario}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <button type="button" className="btn" onClick={() => setShowHistorialModal(false)} style={{ backgroundColor: '#ccc', color: '#333' }}>Cerrar Ficha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaballosDashboard;
