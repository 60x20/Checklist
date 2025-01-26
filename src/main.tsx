import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// components
import App from './App';

// helpers
import { assertCondition } from './helpers/utils';

const rootElement = document.getElementById('root');

assertCondition(rootElement !== null, 'No root found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
