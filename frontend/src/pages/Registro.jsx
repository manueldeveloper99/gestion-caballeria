import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password,
        rol: 'CLIENTE' // Default role for public registration
      };

      await axios.post('http://localhost:8080/api/usuarios/registrar', payload);
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Error al crear la cuenta. El correo ya podría estar en uso.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <div className="login-logo">
          <h2>Crear Cuenta</h2>
          <p>Regístrate para agendar paseos</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              name="nombre"
              className="form-control" 
              value={formData.nombre}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              name="correo"
              className="form-control" 
              value={formData.correo}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              name="password"
              className="form-control" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input 
              type="password" 
              name="confirmPassword"
              className="form-control" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Registrarse
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
