import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CaballosDashboard from './pages/CaballosDashboard';
import PersonalDashboard from './pages/PersonalDashboard';
import InventarioDashboard from './pages/InventarioDashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <div>
              <h1 className="page-header">Bienvenido al Sistema de Gestión</h1>
              <div className="card">
                <p>Seleccione un módulo en el menú lateral para comenzar.</p>
              </div>
            </div>
          } />
          <Route path="caballos" element={<CaballosDashboard />} />
          <Route path="personal" element={<PersonalDashboard />} />
          <Route path="inventario" element={<InventarioDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
