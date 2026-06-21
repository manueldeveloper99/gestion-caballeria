import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

moment.locale('es');
const localizer = momentLocalizer(moment);

const CalendarioCitas = () => {
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [caballos, setCaballos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const usuarioActualStr = localStorage.getItem('usuario');
  const usuarioActual = usuarioActualStr ? JSON.parse(usuarioActualStr) : null;
  const rol = localStorage.getItem('rol') || '';
  const isCliente = rol === 'CLIENTE';

  const [formData, setFormData] = useState({
    caballoId: '',
    empleadoId: '',
    fechaInicio: '',
    fechaFin: '',
    tipo: 'Paseo',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resReservas, resUsuarios, resCaballos, resEmpleados] = await Promise.all([
        axios.get('http://localhost:8080/api/reservas'),
        axios.get('http://localhost:8080/api/usuarios'),
        axios.get('http://localhost:8080/api/caballos'),
        axios.get('http://localhost:8080/api/empleados')
      ]);

      setUsuarios(resUsuarios.data);
      setCaballos(resCaballos.data);
      setEmpleados(resEmpleados.data);

      const mappedEvents = resReservas.data.map(res => {
        const isMio = usuarioActual && res.usuario?.id === usuarioActual.id;
        let title = `${res.tipo} - ${res.caballo?.nombre}`;
        
        if (isCliente && !isMio) {
          title = 'No Disponible';
        } else if (!isCliente) {
          title = `${res.usuario?.correo} - ${res.caballo?.nombre}`;
        }

        return {
          id: res.id,
          title: title,
          start: new Date(res.fechaInicio),
          end: new Date(res.fechaFin),
          reservaOriginal: res,
          isMio: isMio,
          estado: res.estado
        };
      });
      setEventos(mappedEvents);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setEditingEvent(null);
    setFormData({
      caballoId: caballos[0]?.id || '',
      empleadoId: '',
      fechaInicio: moment(start).format('YYYY-MM-DDTHH:mm'),
      fechaFin: moment(end).format('YYYY-MM-DDTHH:mm'),
      tipo: 'Paseo'
    });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    if (isCliente && !event.isMio) {
      alert("Este horario ya está reservado por otra persona.");
      return;
    }
    setEditingEvent(event);
    setFormData({
      caballoId: event.reservaOriginal.caballo?.id || '',
      empleadoId: event.reservaOriginal.empleado?.id || '',
      fechaInicio: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      fechaFin: moment(event.end).format('YYYY-MM-DDTHH:mm'),
      tipo: event.reservaOriginal.tipo || 'Paseo'
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
      usuario: { id: isCliente ? usuarioActual.id : (editingEvent?.reservaOriginal?.usuario?.id || usuarioActual.id) },
      caballo: { id: parseInt(formData.caballoId) },
      empleado: formData.empleadoId ? { id: parseInt(formData.empleadoId) } : null,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      tipo: formData.tipo,
      estado: editingEvent ? editingEvent.estado : 'PENDIENTE'
    };

    try {
      if (editingEvent) {
        await axios.put(`http://localhost:8080/api/reservas/${editingEvent.id}`, payload);
      } else {
        await axios.post('http://localhost:8080/api/reservas', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Error guardando reserva:", err);
      alert("Ocurrió un error. El caballo podría estar ocupado o los datos son inválidos.");
    }
  };

  const handleCancel = async () => {
    if (!editingEvent) return;
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      try {
        await axios.put(`http://localhost:8080/api/reservas/${editingEvent.id}/cancelar`);
        setShowModal(false);
        fetchData();
      } catch (err) {
        console.error("Error al cancelar reserva:", err);
      }
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // Default blue

    if (isCliente && !event.isMio) {
      backgroundColor = '#9ca3af'; // Gray out others
    } else if (event.estado === 'CANCELADA') {
      backgroundColor = '#ef4444'; // Red
    } else if (event.estado === 'CONFIRMADA') {
      backgroundColor = '#10b981'; // Green
    } else if (event.estado === 'PENDIENTE') {
      backgroundColor = '#f59e0b'; // Yellow/Orange
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div>
      <div className="page-header">
        <h1>Calendario de Paseos y Citas</h1>
      </div>

      <div className="card" style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={eventos}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          style={{ height: '100%' }}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay citas en este rango."
          }}
        />
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="modal-title">{editingEvent ? 'Detalle de la Cita' : 'Agendar Paseo'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo de Cita:</label>
                <select 
                  className="form-control"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Paseo">Paseo</option>
                  <option value="Revisión Médica">Revisión Médica</option>
                  <option value="Entrenamiento">Entrenamiento</option>
                  <option value="Mantenimiento">Mantenimiento / Limpieza</option>
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
                    <option key={c.id} value={c.id}>{c.nombre} ({c.raza || 'Sin raza'})</option>
                  ))}
                </select>
              </div>

              {!isCliente && (
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
              )}

              <div className="form-group">
                <label>Desde:</label>
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
                <label>Hasta:</label>
                <input 
                  type="datetime-local" 
                  className="form-control"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
                {editingEvent && editingEvent.estado !== 'CANCELADA' && (
                   <button type="button" className="btn btn-danger" onClick={handleCancel}>
                     Cancelar Cita
                   </button>
                )}
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Guardar Cambios' : 'Confirmar Paseo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioCitas;
