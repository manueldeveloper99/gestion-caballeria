import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
      });

      if (response.ok) {
        const usuario = await response.json();
        
        // Guardamos tanto el objeto completo como el rol para facil acceso
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('rol', usuario.rol);

        // Redirigimos dependiendo del rol o al dashboard principal
        navigate('/');
      } else {
        const mensaje = await response.text();
        setError(mensaje || 'Correo o contraseña incorrectos');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor. Intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <div className="login-logo">
          <h2>Gestión Caballería</h2>
          <p>Bienvenido</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            ¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
