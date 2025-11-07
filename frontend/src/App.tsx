import { useState, useEffect } from 'react';
import './App.css'
import BaseLayout from './layout/BaseLayout';

function App() {
  // const [message, setMessage] = useState("Cargando...");

  // useEffect(() => {
  //   fetch('/api/')
  //     .then((res) => res.text())
  //     .then((data) => setMessage(data))
  //     .catch((error) => {
  //       console.error("Error conectando con el backend:", error);
  //       setMessage("Error: No se pudo conectar al backend.");
  //     });
  // }, []);

  return (

    
<>
    
      <BaseLayout/>

   </>
  );
}

export default App;