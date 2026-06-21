import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const InventarioDashboard = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', stock: '', stockMinimo: ''
  });

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = () => {
    axios.get('http://localhost:8080/api/inventario')
      .then(res => {
        setInventario(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ nombre: '', stock: '', stockMinimo: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre || '',
      stock: item.stock || '',
      stockMinimo: item.stockMinimo || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      stock: parseInt(formData.stock, 10),
      stockMinimo: parseInt(formData.stockMinimo, 10)
    };

    if (editingId) {
      axios.put(`http://localhost:8080/api/inventario/${editingId}`, payload)
        .then(res => {
          setInventario(inventario.map(i => i.id === editingId ? res.data : i));
          setShowModal(false);
        })
        .catch(err => alert('Error al actualizar artículo'));
    } else {
      axios.post('http://localhost:8080/api/inventario', payload)
        .then(res => {
          setInventario([...inventario, res.data]);
          setShowModal(false);
        })
        .catch(err => alert('Error al añadir artículo'));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
      axios.delete(`http://localhost:8080/api/inventario/${id}`)
        .then(() => setInventario(inventario.filter(i => i.id !== id)))
        .catch(err => alert('Error al eliminar artículo'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Inventario</h1>
        <button className="btn btn-primary" onClick={openAddModal}>+ Agregar Artículo</button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? <p>Cargando inventario...</p> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Artículo</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventario.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No hay artículos en el inventario.</td>
                </tr>
              ) : (
                inventario.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td style={{ fontWeight: '500' }}>{item.nombre}</td>
                    <td>{item.stock}</td>
                    <td>{item.stockMinimo}</td>
                    <td>
                      {item.stock <= item.stockMinimo ? (
                        <span style={{ backgroundColor: '#ffcccc', color: '#cc0000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                          STOCK BAJO
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#ccffcc', color: '#006600', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                          ADECUADO
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#5D737E' }}
                          onClick={() => openEditModal(item)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn"
                          style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#C94C4C', color: 'white' }}
                          onClick={() => handleDelete(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Editar Artículo' : 'Añadir Nuevo Artículo'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Artículo</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Stock Actual</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Stock Mínimo</label>
                <input type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ backgroundColor: '#ccc', color: '#333' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar Artículo' : 'Guardar Artículo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioDashboard;
