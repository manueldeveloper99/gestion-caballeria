import React, { useState, useEffect } from 'react';

function InventarioDashboard() {
  const [inventario, setInventario] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const rol = localStorage.getItem('rol');
  const [formData, setFormData] = useState({
    nombre: '',
    stock: 0,
    stockMinimo: 0
  });

  const fetchInventario = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/inventario');
      if (response.ok) {
        const data = await response.json();
        setInventario(data);
      }
    } catch (error) {
      console.error('Error fetching inventario:', error);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre,
      stock: item.stock,
      stockMinimo: item.stockMinimo
    });
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ nombre: '', stock: 0, stockMinimo: 0 });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem 
        ? `http://localhost:8080/api/inventario/${editingItem.id}` 
        : 'http://localhost:8080/api/inventario';
        
      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setModalOpen(false);
        setEditingItem(null);
        setFormData({ nombre: '', stock: 0, stockMinimo: 0 });
        fetchInventario();
      }
    } catch (error) {
      console.error('Error guardando inventario:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Inventario</h1>
        {rol === 'ADMINISTRADOR' && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            + Agregar Artículo
          </button>
        )}
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Artículo</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
              {rol === 'ADMINISTRADOR' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {inventario.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nombre}</td>
                <td>{item.stock}</td>
                <td>{item.stockMinimo}</td>
                <td>
                  {item.stock <= item.stockMinimo ? (
                    <span className="badge badge-cancelada">Bajo Stock</span>
                  ) : (
                    <span className="badge badge-confirmada">Adecuado</span>
                  )}
                </td>
                {rol === 'ADMINISTRADOR' && (
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => handleEdit(item)}
                    >
                      Editar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {inventario.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No hay artículos en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{editingItem ? 'Editar Artículo' : 'Agregar al Inventario'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Nombre del Artículo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Actual</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Mínimo</label>
                <input
                  type="number"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventarioDashboard;