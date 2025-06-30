const criteria = ['Originalité', 'Présentation', 'Goût', 'Technique'];

export function startVoting(teams, container, onFinish) {
  let teamIndex = 0;
  let criterionIndex = 0;

  if (teams.length === 0) {
    container.innerHTML = '<p>Aucune équipe à noter.</p>';
    return;
  }

  // Initialiser les scores vides
  teams.forEach(t => t.scores = {});

  function renderVote() {
    const team = teams[teamIndex];
    const criterion = criteria[criterionIndex];

    container.innerHTML = `
      <div class="vote-screen">
        <h2>${team.name}</h2>
        <h3>${criterion}</h3>
        <div class="choices">
          ${[1,2,3,4].map(n => `<button class="choice" data-score="${n}">${n}</button>`).join('')}
        </div>
        <p>Équipe ${teamIndex + 1} / ${teams.length} — Critère ${criterionIndex + 1} / ${criteria.length}</p>
      </div>
    `;

    container.querySelectorAll('.choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const score = Number(btn.dataset.score);
        teams[teamIndex].scores[criterion] = score;

        criterionIndex++;
        if (criterionIndex >= criteria.length) {
          criterionIndex = 0;
          teamIndex++;
        }

        if (teamIndex >= teams.length) {
          onFinish();
        } else {
          renderVote();
        }
      });
    });
  }

  renderVote();
}