import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// components
import App from './App';

// helpers
import { assertCondition } from './helpers/utils';

const rootElement = document.getElementById('root');

assertCondition(rootElement !== null, 'root always exists');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
