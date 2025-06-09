
import { useEffect } from 'react';

export const DebugStyles = () => {
  useEffect(() => {
    console.log('=== DEBUG: Verificando estilos aplicados ===');
    
    const body = document.body;
    const html = document.documentElement;
    const root = document.getElementById('root');
    
    console.log('Body computed style:', window.getComputedStyle(body).backgroundColor);
    console.log('HTML computed style:', window.getComputedStyle(html).backgroundColor);
    console.log('Root computed style:', root ? window.getComputedStyle(root).backgroundColor : 'No root');
    
    // Verifica se há classes com yellow/amber
    const allElements = document.querySelectorAll('*');
    const yellowElements: Element[] = [];
    
    allElements.forEach(el => {
      const classes = el.className;
      if (typeof classes === 'string' && (classes.includes('yellow') || classes.includes('amber'))) {
        yellowElements.push(el);
      }
    });
    
    if (yellowElements.length > 0) {
      console.log('ENCONTRADOS ELEMENTOS COM CLASSES AMARELAS:', yellowElements);
    } else {
      console.log('Nenhum elemento com classes amarelas encontrado');
    }
    
    // Verifica estilos CSS aplicados
    const sheets = Array.from(document.styleSheets);
    console.log('Stylesheets carregadas:', sheets.length);
    
  }, []);

  return null;
};
