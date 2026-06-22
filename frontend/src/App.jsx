import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './axiosConfig';
import Login from './pages/Login';
import Registro from './pages/Registro';

import CaballosDashboard from './pages/CaballosDashboard';
import PersonalDashboard from './pages/PersonalDashboard';
import InventarioDashboard from './pages/InventarioDashboard';
import CalendarioCitas from './pages/CalendarioCitas';
import CaballerizasDashboard from './pages/CaballerizasDashboard';
import MainDashboard from './pages/MainDashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<MainDashboard />} />

          <Route path="caballos" element={<CaballosDashboard />} />
          <Route path="personal" element={<PersonalDashboard />} />
          <Route path="inventario" element={<InventarioDashboard />} />
          <Route path="reservas" element={<CalendarioCitas />} />
          <Route path="caballerizas" element={<CaballerizasDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;