import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompetition } from '../context/CompetitionContext'; // Hook pour accéder au contexte

// Optionnel: Si tu utilises une image importée de src, tu l'importerais ici
// import culinaryBackground from '../assets/culinary-bg.jpg';

const HomePage = () => {
  const navigate = useNavigate(); // Hook de React Router pour naviguer
  const { startCompetition, teams } = useCompetition(); // Accède à la fonction startCompetition et aux équipes

  const handleStartCompetition = () => {
    // Vérifie s'il y a des équipes avant de démarrer
    if (teams.length === 0) {
        alert("Veuillez d'abord ajouter des équipes via le menu 'Équipes'.");
        return;
    }
    // Démarre la compétition via le contexte
    const success = startCompetition();
    // Si la compétition a démarré avec succès (il y a des équipes)
    if (success) {
       // Navigue vers la page de jugement
       navigate('/judging');
    }
  };

  return (
    // Utilise Tailwind pour styler la page : plein écran, centrage, image de fond, etc.
    // bg-cover et bg-center pour s'assurer que l'image couvre le fond et est centrée
    // bg-[url(...)] pour spécifier l'image de fond en utilisant le chemin depuis le dossier /public
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-4
                 bg-[url('/images/culinary-bg.jpg')]" // <--- Utilise le chemin /images/culinary-bg.jpg depuis le dossier public
    >
      {/* Overlay sombre pour améliorer la lisibilité du texte */}
      {/* Cela aide à faire ressortir le texte sur l'image de fond */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Contenu centré au-dessus de l'overlay */}
      <div className="relative z-10 text-center">
        {/* Titre principal */}
        {/* text-6xl/md:text-8xl pour la taille, font-bold pour le poids, mb-8 pour la marge */}
        {/* drop-shadow-lg et style={{ textShadow... }} pour un effet d'ombre sur le texte qui aide à la lisibilité */}
        <h1 className="text-6xl md:text-8xl font-bold mb-8 drop-shadow-lg" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.5)' }}>
          Culinary Showdown
        </h1>

        {/* Bouton "Démarrer la compétition" */}
        {/* px-8 py-4 padding, text-2xl taille du texte, font-semibold poids, rounded-lg bords arrondis */}
        {/* shadow-lg ombre, hover:scale-105 effet au survol, transition-transform animation */}
        {/* relative overflow-hidden group pour l'effet de lumière interne au survol */}
        <button
          onClick={handleStartCompetition}
          className="px-8 py-4 text-2xl font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 relative overflow-hidden group"
          // Utilise la couleur du thème pour le fond (défini dans index.css via une variable CSS)
          // color: '#333' force le texte en sombre pour qu'il contraste bien avec le fond coloré
          style={{ backgroundColor: 'var(--theme-color)', color: '#333' }}
        >
           {/* Petit effet de lumière blanche semi-transparente au survol du bouton */}
           {/* Absolute inset-0 w-full h-full place le span sur tout le bouton */}
           {/* bg-white opacity-20 transparence initiale, group-hover:opacity-30 augmente la transparence au survol du groupe (le bouton) */}
           {/* transition-opacity pour une animation douce */}
           <span className="absolute inset-0 w-full h-full px-8 py-4 rounded-lg bg-white opacity-20 group-hover:opacity-30 transition-opacity duration-300"></span>
           Démarrer la compétition
        </button>
         {/* Petit texte d'instruction sous le bouton */}
         <p className="mt-4 text-sm text-gray-200 drop-shadow">Ajoutez d'abord les équipes via le menu en haut à gauche.</p>
      </div>
    </div>
  );
};

export default HomePage;