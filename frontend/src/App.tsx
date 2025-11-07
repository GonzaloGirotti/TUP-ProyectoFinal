import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [message, setMessage] = useState("Cargando...");

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error("Error conectando con el backend:", error);
        setMessage("Error: No se pudo conectar al backend.");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Nutrición App</h1>
      <p>Frontend inicial funcionando correctamente.</p>

      {}
      <div style={{ marginTop: "2rem", border: "1px solid #ccc", padding: "1rem" }}>
        <strong>Mensaje del Backend:</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default App;