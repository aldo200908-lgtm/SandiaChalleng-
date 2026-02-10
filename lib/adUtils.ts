
/**
 * Carga un script externo de publicidad de forma segura y dinámica.
 * Útil para Adsterra, Google AdSense o scripts de seguimiento.
 */
export const loadExternalAd = (scriptUrl: string, containerId?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Si el script ya existe, no duplicarlo
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.type = 'text/javascript';

    script.onload = () => resolve();
    script.onerror = (err) => reject(err);

    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.appendChild(script);
      } else {
        document.body.appendChild(script);
      }
    } else {
      document.body.appendChild(script);
    }
  });
};

/**
 * Función específica para configuraciones de Adsterra que requieren objetos globales (atOptions)
 */
export const initAdsterraBanner = (zoneId: string, containerId: string) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = `
    atOptions = {
      'key' : '${zoneId}',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
  `;
  container.appendChild(script);
  
  const invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.src = `//www.profitabledisplaynetwork.com/${zoneId}/invoke.js`;
  container.appendChild(invokeScript);
};
