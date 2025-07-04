import React from 'react';
import { useCompetition } from '../context/CompetitionContext';

const SettingsPage = () => {
  const { settings, updateSetting } = useCompetition(); // Accède aux paramètres et à la fonction de mise à jour

  const handleColorChange = (e) => {
    // Met à jour le paramètre 'themeColor' dans le contexte
    updateSetting('themeColor', e.target.value);
  };

  return (
    <div className="container mx-auto p-4 mt-12"> {/* Marge en haut */}
      <h1 className="text-3xl font-bold mb-6 accent-text">Paramètres</h1>

      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="themeColor" className="text-lg">Couleur principale du thème :</label>
        <input
          type="color"
          id="themeColor"
          value={settings.themeColor} // Utilise la couleur du contexte
          onChange={handleColorChange}
          className="w-12 h-12 rounded-md border-2 border-gray-300 cursor-pointer"
        />
      </div>

      {/* Ajoutez d'autres paramètres ici plus tard si besoin */}
      {/* Exemple : */}
       {/* <div className="flex items-center gap-4 mb-6">
            <label htmlFor="scoreMax" className="text-lg">Note maximale par critère :</label>
             <input type="number" id="scoreMax" value="4" disabled className="px-2 py-1 border rounded-md disabled:opacity-60" />
             <span className="text-sm text-gray-500">(Fonctionnalité à venir)</span>
        </div>*/}

    </div>
  );
};

export default SettingsPage;