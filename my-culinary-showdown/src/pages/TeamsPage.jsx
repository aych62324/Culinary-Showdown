import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';

const TeamsPage = () => {
  const [newTeamName, setNewTeamName] = useState('');
  const { teams, addTeam, removeTeam, competitionStarted } = useCompetition(); // Accède aux équipes et fonctions

  const handleAddTeam = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    if (newTeamName.trim()) { // S'assure que le nom n'est pas vide
      addTeam(newTeamName);
      setNewTeamName(''); // Réinitialise le champ après ajout
    }
  };

  return (
    <div className="container mx-auto p-4 mt-12"> {/* Ajoute une marge en haut pour le menu */}
      <h1 className="text-3xl font-bold mb-6 accent-text">Gérer les Équipes</h1>

      {/* Formulaire d'ajout d'équipe */}
      <form onSubmit={handleAddTeam} className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Nom de l'équipe"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           // Désactive le champ si la compétition a démarré
          disabled={competitionStarted}
        />
        <button
          type="submit"
          className="px-6 py-2 accent-bg text-white rounded-md font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          // Désactive le bouton si la compétition a démarré
          disabled={competitionStarted}
        >
          Ajouter
        </button>
      </form>

       {/* Message si la compétition est lancée */}
        {competitionStarted && (
            <p className="mb-4 text-orange-600 italic">Impossible de modifier les équipes pendant la compétition.</p>
        )}


      {/* Liste des équipes */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Liste des Équipes ({teams.length})</h2>
        {teams.length === 0 ? (
          <p>Aucune équipe ajoutée pour l'instant.</p>
        ) : (
          <ul className="space-y-3">
            {teams.map((team) => (
              <li key={team.id} className="flex items-center justify-between bg-white shadow-sm rounded-md p-3">
                <span className="text-lg">{team.name}</span>
                 {/* Bouton Supprimer (désactivé si compétition démarrée) */}
                <button
                  onClick={() => removeTeam(team.id)}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                   disabled={competitionStarted}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;