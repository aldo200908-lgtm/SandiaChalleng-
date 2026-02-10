
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("QuestNet: Cargando módulo principal...");

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("QuestNet: React montado correctamente.");
} else {
  console.error("QuestNet: No se encontró el elemento #root");
}
