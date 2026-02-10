
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("QuestNet: Inicializando aplicación...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("QuestNet: Renderizado inicial completado.");
  } catch (err) {
    console.error("QuestNet: Error crítico en el renderizado:", err);
  }
} else {
  console.error("QuestNet: No se encontró el contenedor #root");
}
