
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '././App.tsx';

console.log("QuestNet index.tsx: Iniciando montaje de React...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("QuestNet index.tsx: Renderizado exitoso.");
} catch (error) {
  console.error("Error fatal durante el montaje de React:", error);
  const loader = document.getElementById('loader-msg');
  if (loader) loader.innerText = "Error de carga. Revisa la consola.";
}
