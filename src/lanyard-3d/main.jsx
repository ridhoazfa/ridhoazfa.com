import React from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './Lanyard.jsx';

export function mountLanyard(container, props = {}) {
  if (!container) {
    console.error('[Lanyard] Target container element not provided.');
    return null;
  }
  const root = createRoot(container);
  root.render(<Lanyard {...props} />);
  return {
    unmount: () => {
      try {
        root.unmount();
      } catch (e) {
        console.warn('[Lanyard] Error during unmount:', e);
      }
    }
  };
}

if (typeof window !== 'undefined') {
  window.mountLanyard = mountLanyard;
}

export default mountLanyard;
