import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Función para limpiar el loader inicial suavemente
    const removeLoader = () => {
      const loader = document.getElementById('app-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 600);
      }
    };

    // Quitamos el loader lo antes posible
    if (document.readyState === 'complete') {
      removeLoader();
    } else {
      window.addEventListener('load', removeLoader);
    }
    
    // Fallback de seguridad por si el evento load tarda demasiado
    setTimeout(removeLoader, 2000);

  } catch (err) {
    console.error("Fallo crítico en el punto de entrada:", err);
    const loaderMsg = document.getElementById('loader-msg');
    if (loaderMsg) {
      loaderMsg.innerText = "ERROR AL RENDERIZAR LA APP";
    }
  }
}