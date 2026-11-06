import React, { useState, useEffect } from 'react';
import api from './services/api';
import MapaMesas from './components/MapaMesas';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    // Cargar Catálogo de Productos desde Django
    api.get('productos/productos/')
      .then(response => setProductos(response.data))
      .catch(error => console.error("Error al cargar productos:", error));
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
  };

  const enviarComanda = () => {
    if (!mesaSeleccionada) return alert('Por favor seleccione una mesa.');
    
    // Aquí puedes realizar el POST a tu endpoint de ventas/comandas en Django
    alert(`Comanda enviada con éxito para la Mesa ${mesaSeleccionada.codigo}!`);
    setCarrito([]);
    setMesaSeleccionada(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', background: '#f5f6fa' }}>
      
      {/* SECCIÓN IZQUIERDA: Salón y Menú Táctil */}
      <div style={{ flex: 2, padding: '20px', overflowY: 'auto' }}>
        <h2>Parque Safari - Terminal POS Táctil</h2>
        
        {/* Componente de Mapa de Mesas */}
        <MapaMesas mesaSeleccionada={mesaSeleccionada} setMesaSeleccionada={setMesaSeleccionada} />

        {/* Grilla Táctil de Productos */}
        <div>
          <h3>Catálogo de Menú</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            {productos.map(prod => (
              <button 
                key={prod.id}
                onClick={() => agregarAlCarrito(prod)}
                style={{
                  padding: '20px',
                  background: '#00a8ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {prod.nombre}
                <div style={{ marginTop: '10px', fontSize: '14px' }}>${prod.precio}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Ticket / Carrito Activo */}
      <div style={{ flex: 1, background: '#fff', padding: '20px', borderLeft: '1px solid #dcdde1', display: 'flex', flexDirection: 'column' }}>
        <h2>Ticket Actual</h2>
        <div style={{ marginBottom: '15px', padding: '10px', background: '#f1f2f6', borderRadius: '5px' }}>
          <strong>Mesa Activa: </strong> 
          {mesaSeleccionada ? `Mesa ${mesaSeleccionada.codigo}` : <span style={{ color: '#e84118' }}>Seleccione una mesa</span>}
        </div>

        {/* Lista de Ítems */}
        <div style={{ flex: 1, overflowY: 'auto', borderBottom: '1px solid #dcdde1', marginBottom: '15px' }}>
          {carrito.length === 0 ? (
            <p style={{ color: '#718093', textAlign: 'center', marginTop: '50px' }}>No hay productos en el ticket</p>
          ) : (
            carrito.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '15px' }}>
                <span>{item.cantidad}x {item.nombre}</span>
                <span>${item.precio * item.cantidad}</span>
              </div>
            ))
          )}
        </div>

        {/* Totales y Botones */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            <span>Total:</span>
            <span>${calcularTotal()}</span>
          </div>
          <button 
            style={{ width: '100%', padding: '15px', background: '#4cd137', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}
            onClick={enviarComanda}
            disabled={!mesaSeleccionada || carrito.length === 0}
          >
            Enviar Comanda
          </button>
          <button 
            style={{ width: '100%', padding: '15px', background: '#e84118', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => { setCarrito([]); setMesaSeleccionada(null); }}
          >
            Cancelar / Limpiar
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;