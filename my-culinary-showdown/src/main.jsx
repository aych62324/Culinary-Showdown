import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Importe les styles Tailwind et les styles globaux
import { BrowserRouter } from 'react-router-dom';
import { CompetitionProvider } from './context/CompetitionContext.jsx'; // Importe le Provider du Context

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Enveloppe toute l'application avec BrowserRouter pour la navigation */}
    <BrowserRouter>
      {/* Enveloppe toute l'application avec le CompetitionProvider pour l'état global */}
      <CompetitionProvider>
        <App />
      </CompetitionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);