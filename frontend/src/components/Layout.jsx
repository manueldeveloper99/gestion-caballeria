import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Layout = () => {

const location = useLocation();
const navigate = useNavigate();

const token = localStorage.getItem('token');
const usuarioRaw = localStorage.getItem('usuario');
let rol = null;

if (usuarioRaw) {
  try {
    const usuario = JSON.parse(usuarioRaw);
    rol = usuario.rol;
  } catch (e) {}
}

useEffect(() => {
  if (!token) {
    navigate('/login');
  }
}, [token, navigate]);

if (!token) return null;

return ( <div className="app-container">


  <aside className="sidebar">

    <div className="sidebar-logo">
      Gestión Caballería
    </div>

    <nav>

      <Link
        to="/"
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        Dashboard
      </Link>

      {(rol === 'ADMINISTRADOR' || rol === 'VETERINARIO') && (
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

      {(rol === 'ADMINISTRADOR' || rol === 'CUIDADOR') && (
        <Link
          to="/inventario"
          className={`nav-link ${location.pathname.includes('/inventario') ? 'active' : ''}`}
        >
          Inventario
        </Link>
      )}

    </nav>

  </aside>

  <main className="main-content">
    <Outlet />
  </main>

</div>


);
};

export default Layout;
