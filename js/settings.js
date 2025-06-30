// js/settings.js
import { Storage } from './localstorage.js';

export function renderSettings(container) {
  const settings = Storage.loadSettings();
  container.innerHTML = `
    <h2>Paramètres</h2>
    <label for="colorPicker">Couleur principale :</label>
    <input type="color" id="colorPicker" value="${settings.accentColor || '#ff5722'}"/>
  `;

  const colorPicker = container.querySelector('#colorPicker');
  colorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    document.documentElement.style.setProperty('--accent-color', color);
    Storage.saveSettings({ ...settings, accentColor: color });
  });

  // Appliquer la couleur au chargement
  document.documentElement.style.setProperty('--accent-color', settings.accentColor || '#ff5722');
}
