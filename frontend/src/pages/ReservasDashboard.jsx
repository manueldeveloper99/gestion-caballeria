import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservasDashboard = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [caballos, setCaballos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    usuarioId: '',
    caballoId: '',
    empleadoId: '',
    fechaInicio: '',
    fechaFin: '',
    tipo: 'Entrenamiento',
    estado: 'PENDIENTE'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resReservas, resUsuarios, resCaballos, resEmpleados] = await Promise.all([
        axios.get('http://localhost:8080/api/reservas'),
        axios.get('http://localhost:8080/api/usuarios'),
        axios.get('http://localhost:8080/api/caballos'),
        axios.get('http://localhost:8080/api/empleados')
      ]);
      setReservas(resReservas.data);
      setUsuarios(resUsuarios.data);
      setCaballos(resCaballos.data);
      setEmpleados(resEmpleados.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingReserva(null);
    setFormData({
      usuarioId: usuarios[0]?.id || '',
      caballoId: caballos[0]?.id || '',
      empleadoId: empleados[0]?.id || '',
      fechaInicio: '',
      fechaFin: '',
      tipo: 'Entrenamiento',
      estado: 'PENDIENTE'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (reserva) => {
    setEditingReserva(reserva);
    setFormData({
      usuarioId: reserva.usuario?.id || '',
      caballoId: reserva.caballo?.id || '',
      empleadoId: reserva.empleado?.id || '',
      fechaInicio: reserva.fechaInicio ? reserva.fechaInicio.substring(0, 16) : '',
      fechaFin: reserva.fechaFin ? reserva.fechaFin.substring(0, 16) : '',
      tipo: reserva.tipo || 'Entrenamiento',
      estado: reserva.estado || 'PENDIENTE'
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      usuario: { id: parseInt(formData.usuarioId) },
      caballo: { id: parseInt(formData.caballoId) },
      empleado: formData.empleadoId ? { id: parseInt(formData.empleadoId) } : null,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      tipo: formData.tipo,
      estado: formData.estado
    };

    try {
      if (editingReserva) {
        await axios.put(`http://localhost:8080/api/reservas/${editingReserva.id}`, payload);
      } else {
        await axios.post('http://localhost:8080/api/reservas', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Error guardando reserva:", err);
      alert("Ocurrió un error al guardar la reserva. Verifica que los campos estén completos.");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      try {
        await axios.put(`http://localhost:8080/api/reservas/${id}/cancelar`);
        fetchData();
      } catch (err) {
        console.error("Error al cancelar reserva:", err);
      }
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const date = new Date(fechaStr);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Calendario y Reservas</h1>
        <button className="btn btn-primary" onClick={handleOpenCreate}>+ Crear Cita</button>
      </div>

      <div className="card">
        {loading ? <p>Cargando citas...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente / Usuario</th>
                <th>Caballo</th>
                <th>Personal Asignado</th>
                <th>Fecha Inicio</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No hay citas registradas.</td>
                </tr>
              ) : (
                reservas.map(reserva => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.usuario?.correo}</td>
                    <td>{reserva.caballo?.nombre} ({reserva.caballo?.identificador})</td>
                    <td>{reserva.empleado ? `${reserva.empleado.nombre} (${reserva.empleado.rol})` : 'No asignado'}</td>
                    <td>{formatFecha(reserva.fechaInicio)}</td>
                    <td>{reserva.tipo}</td>
                    <td>
                      <span className={`badge badge-${reserva.estado?.toLowerCase()}`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          onClick={() => handleOpenEdit(reserva)}
                        >
                          Editar
                        </button>
                        {reserva.estado !== 'CANCELADA' && (
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            onClick={() => handleCancel(reserva.id)}
                          >
                            Cancelar
                          </button>
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

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="modal-title">{editingReserva ? 'Editar Cita' : 'Crear Nueva Cita'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cliente / Usuario:</label>
                <select 
                  className="form-control"
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={handleInputChange}
                  required
                >
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.correo} ({u.rol})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Caballo:</label>
                <select 
                  className="form-control"
                  name="caballoId"
                  value={formData.caballoId}
                  onChange={handleInputChange}
                  required
                >
                  {caballos.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.identificador})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Personal Asignado (Opcional):</label>
                <select 
                  className="form-control"
                  name="empleadoId"
                  value={formData.empleadoId}
                  onChange={handleInputChange}
                >
                  <option value="">Ninguno</option>
                  {empleados.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre} ({e.rol})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fecha y Hora de Inicio:</label>
                <input 
                  type="datetime-local" 
                  className="form-control"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha y Hora de Fin:</label>
                <input 
                  type="datetime-local" 
                  className="form-control"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de Cita:</label>
                <select 
                  className="form-control"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Entrenamiento">Entrenamiento</option>
                  <option value="Veterinario">Consulta Veterinaria</option>
                  <option value="Paseo">Paseo / Recreación</option>
                  <option value="Limpieza">Limpieza / Cuidado</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estado:</label>
                <select 
                  className="form-control"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  required
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="CONFIRMADA">CONFIRMADA</option>
                  <option value="CANCELADA">CANCELADA</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingReserva ? 'Guardar Cambios' : 'Crear Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasDashboard;
