import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompetition } from '../context/CompetitionContext';

const JudgingPage = () => {
  const navigate = useNavigate();
  const {
    teams,
    criteria,
    scores, // Peut-être utile pour afficher le score actuel ou précédent
    competitionStarted,
    competitionFinished,
    currentTeamIndex,
    currentCriterionIndex,
    updateScore,
    nextStep, // Appeler cette fonction après chaque vote
  } = useCompetition();

   // Vérifie si la compétition a démarré et si on est sur la bonne page
   useEffect(() => {
       if (!competitionStarted && !competitionFinished) {
           // Si la compétition n'a pas démarré, redirige vers l'accueil
           navigate('/');
       } else if (competitionFinished) {
            // Si la compétition est terminée, redirige vers les résultats
            navigate('/results');
       }
       // Cette useEffect s'exécute à chaque changement d'état de compétition
       // ou si la route change pour s'assurer qu'on est au bon endroit
   }, [competitionStarted, competitionFinished, navigate]);


  // Si on est dans un état non valide (avant le redirect de l'useEffect), ne rien afficher
   if (!competitionStarted || competitionFinished || teams.length === 0) {
       return null; // L'useEffect gérera la navigation
   }


  // Récupère l'équipe et le critère actuels
  const currentTeam = teams[currentTeamIndex];
  const currentCriterion = criteria[currentCriterionIndex];

  // Si pour une raison quelconque les indices sont invalides (ne devrait pas arriver avec useEffect et nextStep)
  if (!currentTeam || !currentCriterion) {
       console.error("Index de l'équipe ou du critère invalide.");
       // Optionnel : Rediriger vers l'accueil ou une page d'erreur
       navigate('/');
       return null;
  }


  // Gère le clic sur un bouton de score
  const handleScoreClick = (score) => {
      // Met à jour le score via le contexte
      updateScore(currentTeam.id, currentCriterion, score);

      // Passe à l'étape suivante (prochain critère ou prochaine équipe)
      nextStep(); // La fonction nextStep dans le contexte gère le passage et met à jour les indices ou termine

      // NOTE: La navigation vers les résultats est gérée par l'useEffect ci-dessus
      // qui réagit au changement de l'état competitionFinished
  };

  // Couleurs pour les boutons de score (pour un look Kahoot)
   const scoreColors = ['bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-red-600'];


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      {/* Affichage de l'équipe et du critère actuels */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 text-gray-800">{currentTeam.name}</h2>
        <h3 className="text-2xl font-semibold accent-text">{currentCriterion}</h3>
      </div>

      {/* Boutons de score (les 4 cases) */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {[1, 2, 3, 4].map((score, index) => (
          <button
            key={score}
            className={`flex flex-col items-center justify-center p-8 rounded-lg shadow-lg text-white text-5xl font-bold
                       hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50
                       ${scoreColors[index]} ${scoreColors[index].replace('600', '500')} focus:ring-${scoreColors[index].split('-')[1]}-500`}
            onClick={() => handleScoreClick(score)}
          >
             {/* Icône ou forme simple (optionnel) */}
             {/* <div className="mb-2 w-10 h-10 bg-white bg-opacity-30 rounded"></div> */}
            {score}
          </button>
        ))}
      </div>

      {/* Optionnel: Afficher les étapes restantes */}
      {/* <p className="mt-8 text-gray-600">
         Critère {currentCriterionIndex + 1}/{criteria.length} pour l'équipe {currentTeamIndex + 1}/{teams.length}
      </p> */}
    </div>
  );
};

export default JudgingPage;