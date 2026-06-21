import React, { useState, useEffect } from 'react';

function InventarioDashboard() {

const inventario = [
{
id: 1,
nombre: 'Alimento Premium',
stock: 50,
stockMinimo: 10
},
{
id: 2,
nombre: 'Vitamina A',
stock: 3,
stockMinimo: 5
}
];

return ( <div>


  <h1 className="page-header">
    Inventario
  </h1>

  {inventario.map(item => (
    <div key={item.id} className="card">

      <h3>{item.nombre}</h3>

      <p>Stock: {item.stock}</p>

      <p>Stock mínimo: {item.stockMinimo}</p>

      {item.stock <= item.stockMinimo && (
        <p>
          Alerta Stock bajo!


        </p>
      )}

    </div>
  ))}

</div>


);
}

export default InventarioDashboard;
