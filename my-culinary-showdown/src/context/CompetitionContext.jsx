import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Définition du Contexte ---
const CompetitionContext = createContext();

// --- Hook personnalisé pour utiliser le Contexte ---
// C'est la façon recommandée d'accéder au contexte dans les composants
export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};

// --- Fournisseur du Contexte (Provider) ---
// Ce composant enveloppera ton application (dans main.jsx)
export const CompetitionProvider = ({ children }) => {
  // --- États globaux ---
  // Initialise l'état en essayant de charger depuis localStorage, sinon valeurs par défaut
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : [];
  });

  const [scores, setScores] = useState(() => {
    const savedScores = localStorage.getItem('scores');
    return savedScores ? JSON.parse(savedScores) : {};
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings');
    // Valeurs par défaut : couleur jaune Tailwind yellow-400
    return savedSettings ? JSON.parse(savedSettings) : { themeColor: '#facc15' };
  });

  // --- État de la compétition ---
  const [competitionStarted, setCompetitionStarted] = useState(() => {
     const savedStarted = localStorage.getItem('competitionStarted');
     return savedStarted ? JSON.parse(savedStarted) : false;
  });
  const [competitionFinished, setCompetitionFinished] = useState(() => {
     const savedFinished = localStorage.getItem('competitionFinished');
     return savedFinished ? JSON.parse(savedFinished) : false;
  });
   const [currentTeamIndex, setCurrentTeamIndex] = useState(() => {
     const savedTeamIndex = localStorage.getItem('currentTeamIndex');
     return savedTeamIndex ? JSON.parse(savedTeamIndex) : 0;
  });
   const [currentCriterionIndex, setCurrentCriterionIndex] = useState(() => {
     const savedCriterionIndex = localStorage.getItem('currentCriterionIndex');
     return savedCriterionIndex ? JSON.parse(savedCriterionIndex) : 0;
  });

  // Définir les critères de jugement (peut être déplacé dans les paramètres plus tard)
  const criteria = ['Originalité', 'Présentation', 'Goût', 'Technique'];


  // --- Effets pour sauvegarder l'état dans localStorage ---
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
     // Appliquer la couleur du thème à une variable CSS globale
     document.body.style.setProperty('--theme-color', settings.themeColor);
  }, [settings]);

   useEffect(() => {
      localStorage.setItem('competitionStarted', JSON.stringify(competitionStarted));
   }, [competitionStarted]);

   useEffect(() => {
      localStorage.setItem('competitionFinished', JSON.stringify(competitionFinished));
   }, [competitionFinished]);

   useEffect(() => {
      localStorage.setItem('currentTeamIndex', JSON.stringify(currentTeamIndex));
   }, [currentTeamIndex]);

   useEffect(() => {
      localStorage.setItem('currentCriterionIndex', JSON.stringify(currentCriterionIndex));
   }, [currentCriterionIndex]);


   // --- Logique pour initialiser la couleur du thème au chargement ---
   // S'assure que la couleur est appliquée même si settings ne change pas immédiatement
   useEffect(() => {
       document.body.style.setProperty('--theme-color', settings.themeColor);
   }, []); // Exécute une seule fois au montage initial

  // --- Fonctions pour modifier l'état ---

  const addTeam = (teamName) => {
    if (teamName.trim() && !teams.some(team => team.name.toLowerCase() === teamName.trim().toLowerCase())) {
      const newTeam = { id: Date.now(), name: teamName.trim() }; // Utilise un ID simple basé sur le timestamp
      setTeams([...teams, newTeam]);
      // Initialise l'entrée pour cette équipe dans les scores si elle n'existe pas
      setScores(prevScores => ({
          ...prevScores,
          [newTeam.id]: criteria.reduce((acc, criterion) => {
              acc[criterion] = 0; // Initialise chaque critère à 0
              return acc;
          }, {})
      }));
    }
  };

  const removeTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId));
    // Supprime aussi les scores associés à cette équipe
    setScores(prevScores => {
        const updatedScores = { ...prevScores };
        delete updatedScores[teamId];
        return updatedScores;
    });
  };

  const updateSetting = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const startCompetition = () => {
      if (teams.length === 0) {
          alert("Veuillez d'abord ajouter des équipes !");
          return false; // Indique que la compétition n'a pas pu démarrer
      }
      setCompetitionStarted(true);
      setCompetitionFinished(false);
      setCurrentTeamIndex(0);
      setCurrentCriterionIndex(0);
      // Initialiser les scores à 0 pour toutes les équipes si nécessaire (déjà fait à l'ajout)
      // Assurez-vous que chaque équipe a bien une entrée pour chaque critère à 0
       const initialScores = {};
       teams.forEach(team => {
           initialScores[team.id] = criteria.reduce((acc, criterion) => {
               // Conserve le score si déjà existant, sinon met 0 (utile si on relance)
               acc[criterion] = (scores[team.id] && scores[team.id][criterion] !== undefined) ? scores[team.id][criterion] : 0;
               return acc;
           }, {});
       });
       setScores(initialScores);

      return true; // Indique que la compétition a démarré
  };

  const updateScore = (teamId, criterion, score) => {
      setScores(prevScores => ({
          ...prevScores,
          [teamId]: {
              ...prevScores[teamId],
              [criterion]: score, // Met à jour le score pour le critère donné
          },
      }));
      // NOTE: La logique de passage à l'étape suivante sera gérée dans le composant JudgingPage
      // ou dans une fonction separate `nextStep` appelée APRÈS `updateScore`
  };

  // Fonction pour passer à l'étape suivante (critère ou équipe)
   const nextStep = () => {
       const nextCritIndex = currentCriterionIndex + 1;
       const nextTeamIndex = currentTeamIndex + 1;

       if (nextCritIndex < criteria.length) {
           // Passer au critère suivant pour la même équipe
           setCurrentCriterionIndex(nextCritIndex);
       } else if (nextTeamIndex < teams.length) {
           // Passer à l'équipe suivante et revenir au premier critère
           setCurrentTeamIndex(nextTeamIndex);
           setCurrentCriterionIndex(0); // Réinitialise l'index du critère
       } else {
           // Toutes les équipes et tous les critères ont été jugés
           finishCompetition();
       }
   };


  const finishCompetition = () => {
      setCompetitionStarted(false);
      setCompetitionFinished(true);
      // On pourrait réinitialiser les indices ici ou les laisser pour l'affichage final
      // setCurrentTeamIndex(0);
      // setCurrentCriterionIndex(0);
  };

   const resetCompetition = () => {
       setTeams([]);
       setScores({});
       setCompetitionStarted(false);
       setCompetitionFinished(false);
       setCurrentTeamIndex(0);
       setCurrentCriterionIndex(0);
        // Optionnel: reset settings? setSettings({ themeColor: '#facc15' });
   }


  // --- Valeur du contexte à fournir ---
  const contextValue = {
    teams,
    scores,
    settings,
    criteria, // Fournit les critères pour les pages de jugement/résultats
    competitionStarted,
    competitionFinished,
    currentTeamIndex,
    currentCriterionIndex,
    addTeam,
    removeTeam,
    updateSetting,
    startCompetition,
    updateScore,
    nextStep, // Ajout de la fonction nextStep
    finishCompetition,
    resetCompetition,
  };

  return (
    <CompetitionContext.Provider value={contextValue}>
      {children}
    </CompetitionContext.Provider>
  );
};