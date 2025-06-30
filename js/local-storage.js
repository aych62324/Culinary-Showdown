// js/localstorage.js

const STORAGE_KEYS = {
  TEAMS: 'culinary_teams',
  SETTINGS: 'culinary_settings',
};

export const Storage = {
  saveTeams(teams) {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  },

  loadTeams() {
    const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return data ? JSON.parse(data) : [];
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  loadSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  }
};
