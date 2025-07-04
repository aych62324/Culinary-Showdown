import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import JudgingPage from './pages/JudgingPage';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import SideMenu from './components/SideMenu';
import { useCompetition } from './context/CompetitionContext'; // Pour le menu

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { competitionStarted } = useCompetition(); // Pour cacher le menu pendant le jugement
  const location = useLocation(); // Pour cacher le menu sur la page de jugement/résultats

  // Cacher le menu si la compétition a démarré ou si on est sur la page de jugement/résultats
  const showMenuButton = !competitionStarted && location.pathname !== '/judging' && location.pathname !== '/results';

  return (
    // La div principale prend toute la hauteur de l'écran
    <div className="relative min-h-screen overflow-hidden">
      {/* Bouton Menu Burger (afficher uniquement quand pertinent) */}
      {showMenuButton && (
         <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm shadow-md hover:bg-opacity-90 transition"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open Menu"
        >
          {/* Icône Burger simple */}
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      )}


      {/* Menu Latéral (position fixed pour qu'il soit superposé) */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Contenu principal (Routes) */}
      {/* Ajoute un padding left si le menu est ouvert pour ne pas que le contenu soit derrière le menu */}
      {/* La classe transition permet une animation douce du padding */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isMenuOpen ? 'md:pl-64' : ''}`}>
         <Routes>
            {/* Route pour la page d'accueil */}
            <Route path="/" element={<HomePage />} />
            {/* Route pour la gestion des équipes */}
            <Route path="/teams" element={<TeamsPage />} />
            {/* Route pour la page de jugement (dynamique) */}
            <Route path="/judging" element={<JudgingPage />} />
             {/* Route pour la page des résultats/podium */}
            <Route path="/results" element={<ResultsPage />} />
            {/* Route pour les paramètres */}
            <Route path="/settings" element={<SettingsPage />} />
             {/* Optionnel: Redirection vers l'accueil pour les routes inconnues */}
            <Route path="*" element={<HomePage />} />
          </Routes>
      </div>

    </div>
  );
}

export default App;