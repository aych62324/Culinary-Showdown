import React, { useEffect, useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { teams, scores, criteria, competitionFinished } = useCompetition();
  const [sortedTeams, setSortedTeams] = useState([]);
  const [podiumVisible, setPodiumVisible] = useState({ third: false, second: false, first: false });
  const [showConfetti, setShowConfetti] = useState(false);


   // Vérifie si la compétition est terminée, sinon redirige
   useEffect(() => {
       if (!competitionFinished) {
           // Si la compétition n'est pas terminée, redirige vers l'accueil
           // Ou vers la page de jugement si elle est en cours (selon la logique d'App.jsx)
           navigate('/'); // Redirige vers l'accueil par défaut
       }
   }, [competitionFinished, navigate]);

   // Calculer les scores et trier les équipes une fois que les données sont disponibles
   useEffect(() => {
       if (competitionFinished && teams.length > 0 && Object.keys(scores).length > 0) {
           const teamsWithScores = teams.map(team => {
               const teamScores = scores[team.id] || {};
               const totalScore = criteria.reduce((sum, criterion) => sum + (teamScores[criterion] || 0), 0);
               return { ...team, totalScore };
           });

           // Trier par score total décroissant
           teamsWithScores.sort((a, b) => b.totalScore - a.totalScore);
           setSortedTeams(teamsWithScores);
       }
   }, [competitionFinished, teams, scores, criteria]); // Dépendances pour recalculer si les données changent


   // Animation d'apparition du podium après le tri
   useEffect(() => {
       if (sortedTeams.length > 0) {
           // Afficher le 3ème après un délai
           const timerThird = setTimeout(() => setPodiumVisible(prev => ({ ...prev, third: true })), 500);
           // Afficher le 2ème après un délai supplémentaire
           const timerSecond = setTimeout(() => setPodiumVisible(prev => ({ ...prev, second: true })), 1500);
           // Afficher le 1er et les confettis après un autre délai
           const timerFirst = setTimeout(() => {
               setPodiumVisible(prev => ({ ...prev, first: true }));
               setShowConfetti(true); // Déclenche les confettis
           }, 2500); // Délai total avant le premier

           // Nettoyer les timers si le composant est démonté avant la fin
           return () => {
               clearTimeout(timerThird);
               clearTimeout(timerSecond);
               clearTimeout(timerFirst);
           };
       }
   }, [sortedTeams]); // Déclenche l'animation une fois que sortedTeams est mis à jour


   // Si la compétition n'est pas finie ou s'il n'y a pas encore de données triées, ne rien afficher
   if (!competitionFinished || sortedTeams.length === 0) {
       return null; // L'useEffect gérera la navigation si pas fini
   }

   // Récupère les équipes du podium (s'il y en a assez)
   const firstPlace = sortedTeams[0];
   const secondPlace = sortedTeams[1];
   const thirdPlace = sortedTeams[2];


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-200 to-orange-400 relative overflow-hidden">
      {/* Titre des résultats */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 drop-shadow-lg">Résultats Finaux !</h1>

       {/* Conteneur du podium */}
       <div className="flex items-end justify-center w-full max-w-2xl gap-4 md:gap-8">

           {/* 2ème Place */}
           {secondPlace && (
               <div
                   className={`flex flex-col items-center transition-all duration-700 ease-out ${podiumVisible.second ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                   style={{ transitionDelay: '0.5s' }} // Petit délai après le 3ème
                >
                   <div className="text-center mb-2">
                       <span className="block text-xl md:text-2xl font-semibold">{secondPlace.name}</span>
                       <span className="block text-lg md:text-xl font-bold text-gray-700">{secondPlace.totalScore} points</span>
                   </div>
                   <div className="w-24 md:w-32 h-32 md:h-40 bg-gray-300 rounded-t-lg shadow-xl flex items-center justify-center text-5xl font-black text-gray-700 border-b-4 border-gray-500">
                       2
                   </div>
               </div>
           )}

           {/* 1ère Place */}
            {firstPlace && (
               <div
                    className={`flex flex-col items-center transition-all duration-700 ease-out ${podiumVisible.first ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                   style={{ transitionDelay: '1.5s' }} // Plus grand délai
               >
                   <div className="text-center mb-2">
                       <span className="block text-2xl md:text-3xl font-bold">{firstPlace.name}</span>
                       <span className="block text-xl md:text-2xl font-extrabold text-yellow-700">{firstPlace.totalScore} points</span>
                   </div>
                   <div className="w-28 md:w-40 h-40 md:h-56 bg-yellow-400 rounded-t-lg shadow-xl flex items-center justify-center text-6xl font-black text-yellow-800 border-b-4 border-yellow-600 transform scale-110">
                       1
                   </div>
               </div>
           )}


           {/* 3ème Place */}
           {thirdPlace && (
               <div
                   className={`flex flex-col items-center transition-all duration-700 ease-out ${podiumVisible.third ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                   style={{ transitionDelay: '0s' }} // Apparaît en premier
               >
                   <div className="text-center mb-2">
                       <span className="block text-xl md:text-2xl font-semibold">{thirdPlace.name}</span>
                       <span className="block text-lg md:text-xl font-bold text-gray-700">{thirdPlace.totalScore} points</span>
                   </div>
                   <div className="w-24 md:w-32 h-24 md:h-32 bg-yellow-600 rounded-t-lg shadow-xl flex items-center justify-center text-5xl font-black text-yellow-900 border-b-4 border-yellow-800">
                       3
                   </div>
               </div>
           )}
       </div>

       {/* Liste complète des résultats (optionnel, sous le podium) */}
       {sortedTeams.length > 3 && (
           <div className="mt-12 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
               <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Classement Complet</h2>
               <ul className="space-y-3">
                   {sortedTeams.slice(3).map((team, index) => (
                       <li key={team.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                           <span className="text-lg text-gray-700">#{index + 4} {team.name}</span>
                           <span className="font-semibold text-gray-800">{team.totalScore} points</span>
                       </li>
                   ))}
               </ul>
           </div>
       )}

       {/* Confettis (Placeholder - nécessite une bibliothèque ou une implémentation CSS/JS) */}
        {showConfetti && (
            <div className="confetti-container pointer-events-none">
                {/* Ici irait le code pour générer des confettis visuels */}
                {/* Par exemple, une librairie comme react-confetti ou une animation CSS */}
                {/* Pour l'instant, c'est juste un div vide */}
                <div className="absolute inset-0 w-full h-full overflow-hidden z-50">
                    {/* Des particules de confettis ici */}
                    {/* On peut utiliser des divs animées */}
                    {[...Array(50)].map((_, i) => (
                        <div
                             key={i}
                             className="confetti absolute"
                             style={{
                                left: `${Math.random() * 100}vw`,
                                top: `${Math.random() * -20}vh`,
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 20 + 10}px`,
                                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                                animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
                                opacity: Math.random() + 0.5,
                                transform: `rotate(${Math.random() * 360}deg)` // Rotation aléatoire
                              }}
                           ></div>
                    ))}
                </div>
                {/* Ajoute des styles pour l'animation 'fall' dans index.css ou un fichier CSS dédié */}
                {/* Ajouté une base dans index.css plus haut */}
            </div>
        )}
    </div>
  );
};

export default ResultsPage;

/*
   Ajoute cette animation CSS dans ton fichier src/index.css pour les confettis :

   @keyframes fall {
     0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
     100% { transform: translateY(100vh) rotate(360deg); opacity: 0.8; }
   }

   .confetti {
      position: absolute;
      pointer-events: none;
   }
*/