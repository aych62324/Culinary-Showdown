// js/confettis.js

export function launchConfetti(canvasId = 'confetti-canvas', duration = 5000) {
  const end = Date.now() + duration;

  const canvas = document.getElementById(canvasId);
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