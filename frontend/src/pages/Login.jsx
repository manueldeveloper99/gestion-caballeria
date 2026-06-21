import React, { useState } from 'react';

function Login() {

const [correo, setCorreo] = useState('');
const [password, setPassword] = useState('');

const handleLogin = async (e) => {
e.preventDefault();

try {

  const response = await fetch(
    'http://localhost:8080/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo,
        password
      })
    }
  );

  if (response.ok) {

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem(
      'usuario',
      JSON.stringify(data.usuario)
    );

    alert(
      'Bienvenido ' +
      data.usuario.correo +
      ' (' +
      data.usuario.rol +
      ')'
    );

    window.location.href = "/";

  } else {

    const mensaje = await response.text();
    alert(mensaje);

  }

} catch (error) {

  console.error(error);
  alert('Error al conectar con el servidor');

}


};

return ( <div> <h1>Login</h1>


  <form onSubmit={handleLogin}>

    <div>
      <label>Correo</label>
      <br />
      <input
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
    </div>

    <br />

    <div>
      <label>Contraseña</label>
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <br />

    <button type="submit">
      Iniciar Sesión
    </button>

  </form>
</div>


);
}

export default Login;
