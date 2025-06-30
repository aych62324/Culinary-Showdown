// js/main.js
import { Storage } from './localstorage.js';
import { renderSettings } from './settings.js';
import { startVoting } from './voting.js';
import { showPodium } from './podium.js';
import { launchConfetti } from './confettis.js';

const burgerMenu = document.getElementById('burger-menu');
const sidebar = document.getElementById('sidebar');
const view = document.getElementById('view') || document.body; // selon ta structure
let teams = Storage.loadTeams();

function renderHome() {
  view.innerHTML = `
    <div class="overlay">
      <h1>CULINARY SHOWDOWN</h1>
      <button id="startBtn" class="btn-glow">Démarrer la compétition</button>
    </div>
  `;
  document.getElementById('startBtn').addEventListener('click', () => {
    if (teams.length === 0) {
      alert("Veuillez créer au moins une équipe avant de commencer !");
      return;
    }
    startCompetition();
  });
}

function renderTeams() {
  view.innerHTML = '';
  const container = document.createElement('div');
  container.classList.add('team-list');
  container.innerHTML = `
    <h2>Gestion des équipes</h2>
    <form id="teamForm">
      <input type="text" id="teamName" placeholder="Nom de l'équipe" required minlength="2" />
      <button type="submit">Ajouter équipe</button>
    </form>
    <ul id="teamList"></ul>
  `;
  view.appendChild(container);

  const teamList = container.querySelector('#teamList');
  const teamForm = container.querySelector('#teamForm');
  const teamNameInput = container.querySelector('#teamName');

  function updateList() {
    teamList.innerHTML = '';
    teams.forEach((team, idx) => {
      const li = document.createElement('li');
      li.textContent = team.name;
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Supprimer';
      delBtn.classList.add('delete-btn');
      delBtn.onclick = () => {
        teams.splice(idx, 1);
        Storage.saveTeams(teams);
        updateList();
      };
      li.appendChild(delBtn);
      teamList.appendChild(li);
    });
  }

  teamForm.onsubmit = (e) => {
    e.preventDefault();
    const name = teamNameInput.value.trim();
    if (name.length < 2) {
      alert('Le nom doit faire au moins 2 caractères.');
      return;
    }
    if (teams.find(t => t.name.toLowerCase() === name.toLowerCase())) {
      alert('Cette équipe existe déjà.');
      return;
    }
    teams.push({ name, scores: {} });
    Storage.saveTeams(teams);
    updateList();
    teamNameInput.value = '';
  };

  updateList();
}

function renderSettingsPage() {
  renderSettings(view);
}

function navigateTo(page) {
  sidebar.classList.remove('show');
  switch(page) {
    case 'teams': renderTeams(); break;
    case 'settings': renderSettingsPage(); break;
    default: renderHome();
  }
}

function startCompetition() {
  startVoting(teams, view, () => {
    showPodium(teams, view);
    launchConfetti();
  });
}

burgerMenu.addEventListener('click', () => {
  sidebar.classList.toggle('show');
});

renderHome();

window.navigateTo = navigateTo; // rendre accessible globalement