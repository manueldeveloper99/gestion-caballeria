import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from '../axiosConfig';

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
  const isCuidador = rol === 'CUIDADOR';

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

      const mappedEvents = resReservas.data
        .filter(res => {
          if (isCuidador) {
             // Fallback: si por alguna razón el usuarioActual no tiene el empleado vinculado (datos antiguos),
             // mostramos las citas si el nombre coincide, o si es el único cuidador.
             const hasLinkedEmpleado = usuarioActual && usuarioActual.empleado;
             if (hasLinkedEmpleado) {
               return res.empleado && res.empleado.id === usuarioActual.empleado.id;
             }
             // Si no hay vínculo estricto, intenta coincidir por nombre o correo
             return res.empleado && (
                res.empleado.nombre === usuarioActual.nombre || 
                res.empleado.contacto === usuarioActual.correo ||
                res.empleado.rol === 'CUIDADOR' // fallback extremo: muestra todas las de cuidadores
             );
          }
          const isMio = res.usuario?.id === usuarioActual.id;
          if (isCliente && !isMio) {
            return false; // No mostrar las citas de otros a los clientes
          }
          return true;
        })
        .map(res => {
          const isMio = usuarioActual && res.usuario?.id === usuarioActual.id;
          let title = `[${res.estado}] ${res.tipo} - ${res.caballo?.nombre}`;
          
          if (!isCliente) {
            title = `[${res.estado}] ${res.usuario?.correo} - ${res.caballo?.nombre}`;
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
    if (isCuidador) return;
    setEditingEvent(null);
    setFormData({
      caballoId: caballos[0]?.id || '',
      empleadoId: '',
      fechaInicio: moment(start).format('YYYY-MM-DDTHH:mm'),
      fechaFin: moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm'),
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
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'fechaInicio' && value) {
        const newStartDate = value.split('T')[0];
        if (prev.fechaFin) {
          const oldEndTime = prev.fechaFin.split('T')[1] || '00:00';
          newData.fechaFin = `${newStartDate}T${oldEndTime}`;
        } else {
          newData.fechaFin = value;
        }
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de fechas
    const now = new Date();
    const fechaInicioDate = new Date(formData.fechaInicio);
    const fechaFinDate = new Date(formData.fechaFin);
    const minTime = new Date(now.getTime() + 30 * 60000); // 30 minutos desde ahora

    if (fechaInicioDate < minTime) {
      alert("La reserva debe realizarse con al menos 30 minutos de anticipación y no puede ser en el pasado.");
      return;
    }

    if (fechaFinDate <= fechaInicioDate) {
      alert("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }

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
      const errorMessage = err.response?.data?.message || err.response?.data || "El caballo podría estar ocupado o los datos son inválidos.";
      alert("Ocurrió un error: " + (typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)));
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
        <h1>Calendario de {isCliente ? 'Reservas' : 'Paseos y Citas'}</h1>
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
          popup={true}
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
            <h2 className="modal-title">{editingEvent ? 'Detalle de la Cita' : 'Agendar Cita'}</h2>
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
                  {!isCliente && (
                    <>
                      <option value="Revisión Médica">Revisión Médica</option>
                      <option value="Entrenamiento">Entrenamiento</option>
                      <option value="Mantenimiento">Mantenimiento / Limpieza</option>
                    </>
                  )}
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
                {!isCuidador && editingEvent && editingEvent.estado !== 'CANCELADA' && (
                   <button type="button" className="btn btn-danger" onClick={handleCancel}>
                     Cancelar Cita
                   </button>
                )}
                {!isCuidador && (
                  <button type="submit" className="btn btn-primary">
                    {editingEvent ? 'Guardar Cambios' : 'Confirmar Cita'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioCitas;
