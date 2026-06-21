import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaballerizasDashboard = () => {
  const [caballerizas, setCaballerizas] = useState([]);
  const [caballos, setCaballos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedCaballoId, setSelectedCaballoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resStables, resHorses] = await Promise.all([
        axios.get('http://localhost:8080/api/caballerizas'),
        axios.get('http://localhost:8080/api/caballos')
      ]);
      setCaballerizas(resStables.data);
      setCaballos(resHorses.data);
    } catch (err) {
      console.error("Error al cargar datos de caballerizas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssign = (box) => {
    setSelectedBox(box);
    // Filtrar los caballos que ya están asignados a algún box
    const assignedHorseIds = caballerizas
      .filter(c => c.caballo != null)
      .map(c => c.caballo.id);
    
    const available = caballos.filter(h => !assignedHorseIds.includes(h.id));
    
    setSelectedCaballoId(available[0]?.id || '');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCaballoId) {
      alert("Por favor selecciona un caballo.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/caballerizas/${selectedBox.id}/asignar?caballoId=${selectedCaballoId}`);
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      console.error("Error al asignar caballo:", err);
    }
  };

  const handleRelease = async (id) => {
    if (window.confirm("¿Deseas desocupar esta caballeriza y liberar al caballo?")) {
      try {
        await axios.put(`http://localhost:8080/api/caballerizas/${id}/liberar`);
        fetchData();
      } catch (err) {
        console.error("Error al liberar caballo:", err);
      }
    }
  };

  const handleToggleMaintenance = async (box) => {
    const nuevoEstado = box.estado === 'MANTENIMIENTO' ? 'VACIA' : 'MANTENIMIENTO';
    const msg = nuevoEstado === 'MANTENIMIENTO' 
      ? "¿Deseas poner esta caballeriza en mantenimiento? Se liberará el caballo asignado." 
      : "¿Deseas habilitar nuevamente esta caballeriza?";

    if (window.confirm(msg)) {
      try {
        await axios.put(`http://localhost:8080/api/caballerizas/${box.id}/estado?estado=${nuevoEstado}`);
        fetchData();
      } catch (err) {
        console.error("Error al cambiar estado:", err);
      }
    }
  };

  // Obtener caballos disponibles para asignar en el modal
  const getAvailableHorses = () => {
    const assignedHorseIds = caballerizas
      .filter(c => c.caballo != null && (selectedBox ? c.id !== selectedBox.id : true))
      .map(c => c.caballo.id);
    
    return caballos.filter(h => !assignedHorseIds.includes(h.id));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Gestión de Caballerizas (Boxes)</h1>
          <p style={{ color: 'var(--text-muted)' }}>Panel de visualización y ocupación de boxes del establo.</p>
        </div>
        <div style={{ width: '300px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar caballo por nombre..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? <p>Cargando caballerizas...</p> : (
        <div className="grid-caballerizas">
          {caballerizas.map(box => {
            const isVacia = box.estado === 'VACIA';
            const isOcupada = box.estado === 'OCUPADA';
            const isMantenimiento = box.estado === 'MANTENIMIENTO';
            const matchesSearch = searchTerm && box.caballo && box.caballo.nombre.toLowerCase().includes(searchTerm.toLowerCase());

            return (
              <div 
                key={box.id} 
                className={`box-card ${box.estado.toLowerCase()} ${matchesSearch ? 'highlight-box' : ''}`}
              >
                <div className="box-header">
                  <span className="box-number">{box.numero}</span>
                  <span className={`badge badge-${box.estado.toLowerCase()}`}>
                    {box.estado === 'VACIA' ? 'Disponible' : box.estado}
                  </span>
                </div>

                <div className="box-info">
                  {isOcupada && box.caballo ? (
                    <>
                      <p>Caballo asignado:</p>
                      <p className="box-horse-name">{box.caballo.nombre}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Raza: {box.caballo.raza || 'No especificada'}
                      </p>
                    </>
                  ) : isMantenimiento ? (
                    <p style={{ color: '#c2410c', fontStyle: 'italic' }}>
                      En reparación / Limpieza
                    </p>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Sin caballo asignado
                    </p>
                  )}
                </div>

                <div className="box-actions">
                  {isVacia && (
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }}
                      onClick={() => handleOpenAssign(box)}
                    >
                      Asignar Caballo
                    </button>
                  )}
                  {isOcupada && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }}
                      onClick={() => handleRelease(box.id)}
                    >
                      Liberar
                    </button>
                  )}
                  <button 
                    className="btn btn-secondary" 
                    style={{ 
                      padding: '6px 10px', 
                      fontSize: '13px',
                      backgroundColor: isMantenimiento ? '#dcfce7' : '#fee2e2',
                      color: isMantenimiento ? '#15803d' : '#b91c1c'
                    }}
                    onClick={() => handleToggleMaintenance(box)}
                    title={isMantenimiento ? "Habilitar Box" : "Poner en Mantenimiento"}
                  >
                    {isMantenimiento ? "Habilitar" : "Mant."}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAssignModal && selectedBox && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="modal-title">Asignar Caballo a {selectedBox.numero}</h2>
            <form onSubmit={handleAssignSubmit}>
              <div className="form-group">
                <label>Selecciona un Caballo disponible:</label>
                {getAvailableHorses().length === 0 ? (
                  <p style={{ color: 'red', fontStyle: 'italic', fontSize: '14px' }}>
                    No hay caballos registrados que no estén ya asignados a otro box.
                  </p>
                ) : (
                  <select 
                    className="form-control"
                    value={selectedCaballoId}
                    onChange={(e) => setSelectedCaballoId(e.target.value)}
                    required
                  >
                    {getAvailableHorses().map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.identificador})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={getAvailableHorses().length === 0}
                >
                  Asignar Caballo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaballerizasDashboard;
