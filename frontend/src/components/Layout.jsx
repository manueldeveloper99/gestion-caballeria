import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {

const location = useLocation();

const rol = localStorage.getItem('rol');

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
