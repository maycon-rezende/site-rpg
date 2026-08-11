(function () {
  const stages = [
    {
      selector: '.portrait-frame.connor-stage',
      config: {
        particleCount: 44,
        baseColor: '#3ee0a0',
        accentColor: '#f0d38a',
        lineColor: 'rgba(62,224,160,0.36)',
        glowColor: 'rgba(62,224,160,0.22)',
        runeColor: 'rgba(240,211,138,0.86)',
        mode: 'connor'
      }
    },
    {
      selector: '.companion-portrait.alice-stage',
      config: {
        particleCount: 40,
        baseColor: '#ff5d78',
        accentColor: '#ffd1dc',
        lineColor: 'rgba(255,93,120,0.38)',
        glowColor: 'rgba(255,93,120,0.24)',
        runeColor: 'rgba(255,209,220,0.88)',
        mode: 'alice'
      }
    }
  ];

  function initStage(stageEl, config) {
    if (!stageEl) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'magic-canvas';
    stageEl.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: 0, y: 0, active: false };
    let particles = [];

    function resize() {
      const rect = stageEl.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: config.particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 1.7 + 0.8,
        seed: Math.random() * Math.PI * 2
      }));
    }

    function drawRune(cx, cy, radius, time) {
      ctx.save();
      ctx.strokeStyle = config.runeColor;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = (i / 6) * Math.PI * 2 + time * 0.00035;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function drawAliceHalo(cx, cy, radius, time) {
      ctx.save();
      ctx.strokeStyle = config.runeColor;
      ctx.lineWidth = 1.1;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, time * 0.0004, time * 0.0004 + Math.PI * 1.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.7, -time * 0.0003, Math.PI * 1.35 - time * 0.0003);
      ctx.stroke();
      ctx.restore();
    }

    function animate(time) {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const focusX = pointer.active ? pointer.x : cx;
      const focusY = pointer.active ? pointer.y : cy;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx + Math.sin(time * 0.0004 + p.seed) * 0.04;
        p.y += p.vy + Math.cos(time * 0.00035 + p.seed) * 0.04;

        if (p.x < -15 || p.x > width + 15) p.vx *= -1;
        if (p.y < -15 || p.y > height + 15) p.vy *= -1;

        const dx = focusX - p.x;
        const dy = focusY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          p.x -= dx * 0.008;
          p.y -= dy * 0.008;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = config.mode === 'connor'
          ? `rgba(62,224,160,${0.55 + Math.sin(time * 0.001 + p.seed) * 0.2})`
          : `rgba(255,93,120,${0.55 + Math.sin(time * 0.001 + p.seed) * 0.2})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 92) {
            const alpha = (1 - dist / 92) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = config.lineColor.replace('0.36', alpha.toFixed(2));
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      if (config.mode === 'connor') {
        ctx.save();
        ctx.globalAlpha = 0.7;
        drawRune(cx, cy, 58 + Math.sin(time * 0.001) * 5, time);
        drawRune(cx, cy, 86, time * 0.7);
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy + 10);
        ctx.quadraticCurveTo(cx + 8, cy - 60, cx + 36, cy - 16);
        ctx.strokeStyle = 'rgba(240,211,138,0.38)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      } else {
        drawAliceHalo(cx, cy, 70 + Math.sin(time * 0.0011) * 6, time);
        drawAliceHalo(cx, cy, 100 + Math.cos(time * 0.0008) * 8, time * 1.2);
        ctx.save();
        ctx.strokeStyle = 'rgba(255,209,220,0.32)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 120 + Math.sin(time * 0.0008) * 8, time * 0.0003, time * 0.0003 + Math.PI * 1.2);
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    }

    stageEl.addEventListener('mousemove', (event) => {
      const rect = stageEl.getBoundingClientRect();
      pointer.active = true;
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    });

    stageEl.addEventListener('mouseleave', () => {
      pointer.active = false;
    });

    window.addEventListener('resize', resize);
    resize();
    animate(0);
  }

  stages.forEach(({ selector, config }) => initStage(document.querySelector(selector), config));

  const spellLayer = document.getElementById('spell-layer');
  if (spellLayer) {
    const ctx = spellLayer.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = [];
    const pointer = { x: 0, y: 0, active: false };

    function resizeLayer() {
      width = window.innerWidth;
      height = window.innerHeight;
      spellLayer.width = Math.floor(width * dpr);
      spellLayer.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getThemeColors() {
      return document.body.classList.contains('theme-scarlet')
        ? { primary: '#ff5d78', secondary: '#ffd1dc', glow: 'rgba(255,93,120,0.26)' }
        : { primary: '#3ee0a0', secondary: '#f0d38a', glow: 'rgba(62,224,160,0.24)' };
    }

    function spawnBurst(x, y, amount = 16, speed = 1) {
      const colors = getThemeColors();
      for (let i = 0; i < amount; i += 1) {
        const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.7;
        const velocity = (Math.random() * 2 + 1.2) * speed;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 70 + Math.random() * 30,
          maxLife: 70 + Math.random() * 30,
          size: Math.random() * 2.2 + 0.9,
          color: i % 2 === 0 ? colors.primary : colors.secondary,
          glow: colors.glow,
          rune: Math.random() > 0.6
        });
      }
    }

    function animateLayer(time) {
      ctx.clearRect(0, 0, width, height);
      const colors = getThemeColors();
      if (pointer.active) {
        spawnBurst(pointer.x, pointer.y, 2, 0.5);
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.012;
        p.life -= 1;
        p.vx *= 0.985;
        p.vy *= 0.985;

        const alpha = p.life / p.maxLife;
        if (p.rune) {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 2.4, p.y);
          ctx.lineTo(p.x + p.size * 2.4, p.y);
          ctx.moveTo(p.x, p.y - p.size * 2.4);
          ctx.lineTo(p.x, p.y + p.size * 2.4);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (p.life <= 0) particles.splice(i, 1);
      }

      if (Math.random() < 0.05) {
        const flickerX = Math.random() * width;
        const flickerY = Math.random() * height;
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(flickerX, flickerY, 18 + Math.random() * 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(animateLayer);
    }

    window.addEventListener('resize', resizeLayer);
    window.addEventListener('mousemove', (event) => {
      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    });
    window.addEventListener('mouseleave', () => {
      pointer.active = false;
    });
    window.addEventListener('mousedown', (event) => {
      spawnBurst(event.clientX, event.clientY, 24, 1.4);
    });

    document.querySelectorAll('.magic-card, .artifact-trigger, .cauldron-trigger, .companion-portrait, .portrait-frame').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        const rect = element.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12, 0.9);
      });
    });

    resizeLayer();
    animateLayer(0);
  }
})();
