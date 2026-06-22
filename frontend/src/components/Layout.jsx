import React, { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const token = localStorage.getItem('token');
  const usuarioRaw = localStorage.getItem('usuario');
  let rol = null;

  let usuario = null;

  if (usuarioRaw) {
    try {
      usuario = JSON.parse(usuarioRaw);
      rol = usuario.rol;
    } catch (e) {}
  }

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchAlertas();
      // Optional: Polling every 60 seconds
      const interval = setInterval(fetchAlertas, 60000);
      return () => clearInterval(interval);
    }
  }, [token, navigate]);

  const fetchAlertas = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/alertas');
      const allAlertas = res.data;
      const usuarioRaw = localStorage.getItem('usuario');
      let currentUserId = null;
      let currentRol = null;
      if (usuarioRaw) {
        try {
          const u = JSON.parse(usuarioRaw);
          currentUserId = u.id;
          currentRol = u.rol;
        } catch(e){}
      }
      
      const filtered = allAlertas.filter(a => {
        if (currentRol === 'CLIENTE') {
          return a.usuarioId === currentUserId;
        } else {
          return a.usuarioId == null || a.usuarioId === currentUserId;
        }
      });
      
      setAlertas(filtered);
    } catch (err) {
      console.error("Error fetching alerts", err);
    }
  };

  const handleMarcarLeida = async (id, e) => {
    e.stopPropagation(); // Evitar que cierre el menú si hace click
    try {
      await axios.put(`http://localhost:8080/api/alertas/${id}/leida`);
      fetchAlertas(); // Recargar alertas
    } catch (err) {
      console.error("Error marcando alerta", err);
    }
  };

  const unreadCount = alertas.filter(a => !a.leida).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Gestión Caballería</span>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <span 
              onClick={() => setShowMenu(!showMenu)} 
              style={{ cursor: 'pointer', fontSize: '20px', position: 'relative' }}
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-10px',
                  background: 'red', color: 'white', borderRadius: '50%',
                  padding: '2px 6px', fontSize: '10px', fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
            </span>
            {showMenu && (
              <div style={{
                position: 'absolute', top: '35px', left: '0', background: 'white', color: '#333',
                width: '320px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000, maxHeight: '400px', overflowY: 'auto'
              }}>
                <div style={{ padding: '10px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                  Notificaciones
                </div>
                {alertas.length === 0 ? (
                  <div style={{ padding: '15px', textAlign: 'center', color: '#888' }}>No hay alertas.</div>
                ) : (
                  alertas.map((a, i) => (
                    <div key={i} style={{ 
                      padding: '10px', 
                      borderBottom: '1px solid #eee', 
                      fontSize: '13px',
                      background: a.leida ? '#f9f9f9' : '#fff',
                      opacity: a.leida ? 0.6 : 1
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ color: a.tipo.includes('VENCIDA') || a.tipo.includes('STOCK') ? 'red' : '#d97706' }}>
                            {a.tipo.replace('_', ' ')}
                          </strong><br/>
                          {a.mensaje}
                        </div>
                        {!a.leida && (
                          <button 
                            onClick={(e) => handleMarcarLeida(a.id, e)}
                            style={{ 
                              background: '#4ade80', color: 'white', border: 'none', 
                              borderRadius: '4px', padding: '4px 8px', fontSize: '11px',
                              cursor: 'pointer', marginLeft: '10px'
                            }}
                          >
                            ✓ Leída
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1 }}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>

          {(rol === 'ADMINISTRADOR' || rol === 'VETERINARIO' || rol === 'CUIDADOR') && (
            <Link
              to="/caballos"
              className={`nav-link ${location.pathname.includes('/caballos') ? 'active' : ''}`}
            >
              Caballos
            </Link>
          )}

          {rol === 'ADMINISTRADOR' && (
            <Link
              to="/personal"
              className={`nav-link ${location.pathname.includes('/personal') ? 'active' : ''}`}
            >
              Personal
            </Link>
          )}

          {(rol === 'ADMINISTRADOR' || rol === 'CUIDADOR' || rol === 'VETERINARIO') && (
            <Link
              to="/inventario"
              className={`nav-link ${location.pathname.includes('/inventario') ? 'active' : ''}`}
            >
              Inventario
            </Link>
          )}

          {(rol === 'ADMINISTRADOR' || rol === 'CUIDADOR' || rol === 'VETERINARIO') && (
            <Link
              to="/caballerizas"
              className={`nav-link ${location.pathname.includes('/caballerizas') ? 'active' : ''}`}
            >
              Caballerizas
            </Link>
          )}

          <Link
            to="/reservas"
            className={`nav-link ${location.pathname.includes('/reservas') ? 'active' : ''}`}
          >
            Reservas / Citas
          </Link>

          </div>
          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
            <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#ff8a8a' }}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '15px' }}>{usuario?.nombre || 'Usuario'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{rol}</div>
          </div>
          <div style={{ 
            width: '45px', height: '45px', borderRadius: '50%', 
            backgroundColor: 'var(--secondary)', color: 'white', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            fontWeight: 'bold', fontSize: '18px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
          }}>
            {rol ? rol.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
