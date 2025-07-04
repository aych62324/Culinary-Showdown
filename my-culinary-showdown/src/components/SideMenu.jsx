import React from 'react';
import { NavLink } from 'react-router-dom';

// Le composant reçoit 'isOpen' (booléen) et 'onClose' (fonction)
const SideMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay sombre qui prend toute la page quand le menu est ouvert */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose} // Ferme le menu si on clique sur l'overlay
        ></div>
      )}

      {/* Le menu lui-même */}
      <div
        className={`side-menu fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col ${isOpen ? 'open' : ''}`}
        // La classe 'side-menu' et 'open' sont définies dans index.css pour la transition
      >
        {/* Bouton Fermer */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close Menu"
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
           </svg>
        </button>

        {/* Titre ou Logo (optionnel) */}
        <h2 className="text-2xl font-bold mb-8 accent-text">Menu</h2>

        {/* Liens de navigation */}
        <nav className="flex flex-col space-y-4">
          {/* NavLink ajoute une classe 'active' automatiquement si la route correspond */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg hover:accent-text transition-colors ${isActive ? 'accent-text font-semibold' : 'text-gray-700'}`
            }
            onClick={onClose} // Ferme le menu après avoir cliqué sur un lien
          >
            Accueil
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) =>
              `text-lg hover:accent-text transition-colors ${isActive ? 'accent-text font-semibold' : 'text-gray-700'}`
            }
             onClick={onClose}
          >
            Équipes
          </NavLink>
           {/* On pourrait ajouter un lien vers jugement/résultats si pertinent, mais on y navigue auto */}
           {/* <NavLink
            to="/judging"
            className={({ isActive }) =>
              `text-lg hover:accent-text transition-colors ${isActive ? 'accent-text font-semibold' : 'text-gray-700'}`
            }
             onClick={onClose}
          >
            Jugement (Debug)
          </NavLink> */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `text-lg hover:accent-text transition-colors ${isActive ? 'accent-text font-semibold' : 'text-gray-700'}`
            }
             onClick={onClose}
          >
            Paramètres
          </NavLink>
          {/* Bouton pour reset la compétition / effacer les données (utile en dev) */}
           <button
               className="mt-8 text-sm text-red-500 hover:text-red-700 self-start"
               onClick={() => {
                   if(window.confirm("Attention : Ceci va supprimer toutes les équipes et scores. Confirmez ?")) {
                       useCompetition().resetCompetition(); // Utilise directement le hook ici pour simplifier
                       onClose();
                       // Optionnel: naviguer vers l'accueil après le reset
                       window.location.href = '/'; // Recharge la page pour s'assurer que tout l'état est réinitialisé
                   }
               }}
           >
               Réinitialiser tout (Danger)
           </button>
        </nav>
      </div>
    </>
  );
};

export default SideMenu;