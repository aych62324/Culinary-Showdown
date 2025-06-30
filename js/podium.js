export function showPodium(teams, containerId) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;

  teams.forEach(team => {
    team.totalScore = Object.values(team.scores).reduce((a,b) => a + b, 0);
  });

  teams.sort((a,b) => b.totalScore - a.totalScore);

  const podiumTeams = teams.slice(0, 3);

  container.innerHTML = `
    <div class="podium">
      <h2>Podium Final</h2>
      <div class="places">
        ${podiumTeams.map((team, i) => `
          <div class="place place-${i+1}">
            <div class="rank">${i+1}${i === 0 ? 'er' : i === 1 ? 'nd' : 'ème'}</div>
            <div class="team-name">${team.name}</div>
            <div class="score">Score: ${team.totalScore}</div>
          </div>
        `).join('')}
      </div>
      <canvas id="confetti-canvas"></canvas>
    </div>
  `;

  // Animation d'entrée
  const places = container.querySelectorAll('.place');
  places.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'scale(0.5)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = 1;
      el.style.transform = 'scale(1)';
    }, i * 700);
  });

  launchConfetti();
}

function launchConfetti() {
  const duration = 5 * 1000;
  const end = Date.now() + duration;

  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const confettiPieces = [];

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: randomRange(0, canvas.width),
      y: randomRange(-canvas.height, 0),
      size: randomRange(5, 10),
      speed: randomRange(2, 5),
      angle: randomRange(0, 2 * Math.PI),
      angularSpeed: randomRange(0.01, 0.05),
      color: `hsl(${Math.floor(randomRange(0, 360))}, 70%, 60%)`,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(p => {
      p.y += p.speed;
      p.angle += p.angularSpeed;
      if (p.y > canvas.height) p.y = randomRange(-canvas.height, 0);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      ctx.restore();
    });
  }

  function animate() {
    draw();
    if (Date.now() < end) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}