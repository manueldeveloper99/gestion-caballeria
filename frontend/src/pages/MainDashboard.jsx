import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const MainDashboard = () => {
  const [stats, setStats] = useState({
    totalCaballos: 0,
    citasHoy: 0,
    alertasInventario: 0,
    totalPersonal: 0
  });

  const [proximasCitas, setProximasCitas] = useState([]);
  const [inventarioCritico, setInventarioCritico] = useState([]);
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Empleado Tasks
  const [misTareas, setMisTareas] = useState([]);
  const [isEmpleado, setIsEmpleado] = useState(false);
  const [empleadoId, setEmpleadoId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resCaballos, resReservas, resInventario, resPersonal] = await Promise.all([
        axios.get('http://localhost:8080/api/caballos'),
        axios.get('http://localhost:8080/api/reservas'),
        axios.get('http://localhost:8080/api/inventario'),
        axios.get('http://localhost:8080/api/empleados')
      ]);

      const caballos = resCaballos.data;
      const reservas = resReservas.data;
      const inventario = resInventario.data;
      const personal = resPersonal.data;

      // Calcular Citas de Hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);

      const citasHoyArr = reservas.filter(r => {
        const d = new Date(r.fechaInicio);
        return d >= hoy && d < manana && r.estado !== 'CANCELADA';
      });

      // Calcular Inventario Crítico
      const criticos = inventario.filter(i => i.stock < i.stockMinimo);

      setStats({
        totalCaballos: caballos.length,
        citasHoy: citasHoyArr.length,
        alertasInventario: criticos.length,
        totalPersonal: personal.length
      });

      // Próximas Citas (Ordenadas y max 5)
      const proximas = reservas
        .filter(r => new Date(r.fechaInicio) >= new Date() && r.estado !== 'CANCELADA')
        .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
        .slice(0, 5);
      
      setProximasCitas(proximas);
      setInventarioCritico(criticos.slice(0, 5));

      // Datos para el gráfico (Agrupados por tipo)
      const conteoTipos = reservas.reduce((acc, curr) => {
        if (curr.estado !== 'CANCELADA') {
          acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
        }
        return acc;
      }, {});

      const chartData = Object.keys(conteoTipos).map(key => ({
        name: key,
        value: conteoTipos[key]
      }));
      setDatosGrafico(chartData);

      // Check if current user is an employee and fetch tasks
      const usuarioRaw = localStorage.getItem('usuario');
      if (usuarioRaw) {
        try {
          const u = JSON.parse(usuarioRaw);
          if (u.empleado && u.empleado.id) {
            setIsEmpleado(true);
            setEmpleadoId(u.empleado.id);
            const resTareas = await axios.get(`http://localhost:8080/api/empleados/${u.empleado.id}/tareas`);
            setMisTareas(resTareas.data);
          }
        } catch(e) {}
      }

    } catch (err) {
      console.error("Error cargando dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const date = new Date(fechaStr);
    return date.toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleEstadoChange = async (tareaId, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:8080/api/empleados/tareas/${tareaId}`, { estado: nuevoEstado });
      // Update local state
      setMisTareas(misTareas.map(t => t.id === tareaId ? { ...t, estado: nuevoEstado } : t));
    } catch (err) {
      console.error("Error actualizando tarea:", err);
      alert("Error al actualizar la tarea");
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando Panel de Control...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Centro de Control</h1>
      </div>

      {isEmpleado && (
        <div className="card" style={{ marginBottom: '30px', borderLeft: '5px solid #8b4513' }}>
          <h2 style={{ fontSize: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '15px', color: '#8b4513' }}>
            Mis Tareas Asignadas
          </h2>
          {misTareas.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No tienes tareas asignadas en este momento.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
              {misTareas.map(tarea => (
                <div key={tarea.id} style={{ 
                  padding: '15px', 
                  backgroundColor: tarea.estado === 'Completada' ? '#f0fdf4' : tarea.estado === 'En Progreso' ? '#fffbeb' : '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#374151' }}>{tarea.descripcion}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Estado actual: <strong>{tarea.estado}</strong></span>
                    <select 
                      value={tarea.estado}
                      onChange={(e) => handleEstadoChange(tarea.id, e.target.value)}
                      style={{ 
                        padding: '5px 10px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '20px', borderTop: '4px solid #3b82f6' }}>
          <h3 style={{ margin: '0', color: '#6b7280', fontSize: '14px', textTransform: 'uppercase' }}>Caballos Activos</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalCaballos}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px', borderTop: '4px solid #10b981' }}>
          <h3 style={{ margin: '0', color: '#6b7280', fontSize: '14px', textTransform: 'uppercase' }}>Citas para Hoy</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{stats.citasHoy}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px', borderTop: '4px solid #ef4444' }}>
          <h3 style={{ margin: '0', color: '#6b7280', fontSize: '14px', textTransform: 'uppercase' }}>Alertas de Inventario</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{stats.alertasInventario}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px', borderTop: '4px solid #f59e0b' }}>
          <h3 style={{ margin: '0', color: '#6b7280', fontSize: '14px', textTransform: 'uppercase' }}>Personal Registrado</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalPersonal}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        {/* Próximas Citas */}
        <div className="card">
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '15px' }}>Próximas Citas</h2>
          {proximasCitas.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No hay citas próximas programadas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {proximasCitas.map(cita => (
                <div key={cita.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '5px' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#374151' }}>{cita.tipo} - {cita.caballo?.nombre}</strong>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{cita.usuario?.correo}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>{formatFecha(cita.fechaInicio)}</span>
                    <span className={`badge badge-${cita.estado.toLowerCase()}`}>{cita.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gráfico y Alertas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '15px' }}>Distribución de Citas</h2>
            {datosGrafico.length === 0 ? (
               <p style={{ color: '#6b7280' }}>No hay datos suficientes.</p>
            ) : (
              <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={datosGrafico} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {datosGrafico.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ fontSize: '18px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '15px', color: '#ef4444' }}>Atención Requerida (Inventario)</h2>
            {inventarioCritico.length === 0 ? (
              <p style={{ color: '#10b981' }}>✓ El inventario está en niveles óptimos.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {inventarioCritico.map(item => (
                  <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span>{item.nombre}</span>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{item.stock} / {item.stockMinimo}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
