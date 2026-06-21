import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (!rol) {
      navigate('/login');
    }
  }, [rol, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (!rol) return null; // Evita renderizar antes del redirect

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Gestión Caballería
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

          {(rol === 'ADMINISTRADOR') && (
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
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
