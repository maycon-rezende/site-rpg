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
    const ripples = [];
    const vortexes = [];
    const trails = [];
    const pointer = { x: 0, y: 0, active: false, moved: false };

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

    function spawnRipple(x, y, intensity = 1) {
      ripples.push({
        x,
        y,
        radius: 2 + intensity * 2,
        maxRadius: 70 + intensity * 35,
        alpha: 0.4 + intensity * 0.08,
        lineWidth: 0.8 + intensity * 0.2
      });
    }

    function spawnVortex(x, y, intensity = 1) {
      vortexes.push({
        x,
        y,
        radius: 8 + intensity * 6,
        life: 44 + intensity * 12,
        maxLife: 44 + intensity * 12,
        spin: (Math.random() * 0.08 + 0.04) * (Math.random() > 0.5 ? 1 : -1),
        color: document.body.classList.contains('theme-scarlet') ? '#ffd1dc' : '#f0d38a'
      });
    }

    function spawnLightning(x, y, color) {
      const segments = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < segments; i += 1) {
        const startX = x + (Math.random() - 0.5) * 22;
        const startY = y + (Math.random() - 0.5) * 22;
        const endX = x + (Math.random() - 0.5) * 42;
        const endY = y + (Math.random() - 0.5) * 42;
        particles.push({
          x: startX,
          y: startY,
          vx: (endX - startX) * 0.02,
          vy: (endY - startY) * 0.02,
          life: 18 + Math.random() * 8,
          maxLife: 18 + Math.random() * 8,
          size: 1.1,
          color,
          glow: 'rgba(255,255,255,0.18)',
          rune: false,
          lightning: true
        });
      }
    }

    function spawnBurst(x, y, amount = 16, speed = 1, options = {}) {
      const colors = getThemeColors();
      const primary = options.primary || colors.primary;
      const secondary = options.secondary || colors.secondary;
      const glow = options.glow || colors.glow;
      for (let i = 0; i < amount; i += 1) {
        const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.7 + (options.twist || 0);
        const velocity = (Math.random() * 2 + 1.2) * speed;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 70 + Math.random() * 30,
          maxLife: 70 + Math.random() * 30,
          size: Math.random() * 2.2 + 0.9,
          color: i % 2 === 0 ? primary : secondary,
          glow,
          rune: Math.random() > 0.6,
          lightning: false
        });
      }
      if (options.ripple) spawnRipple(x, y, options.intensity || 1);
      if (options.vortex) spawnVortex(x, y, options.intensity || 1);
      if (options.lightning !== false && Math.random() < 0.72) spawnLightning(x, y, options.primary || colors.primary);
    }

    function showSpellText(text, x, y) {
      const label = document.createElement('div');
      label.className = 'spell-text';
      label.textContent = text;
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
      document.body.appendChild(label);
      setTimeout(() => label.remove(), 1200);
    }

    function animateLayer(time) {
      ctx.clearRect(0, 0, width, height);
      const colors = getThemeColors();
      if (pointer.active) {
        spawnBurst(pointer.x, pointer.y, 2, 0.5, { lightning: false });
      }

      for (let i = trails.length - 1; i >= 0; i -= 1) {
        const trail = trails[i];
        trail.life -= 1;
        if (trail.life <= 0) {
          trails.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = trail.life / trail.maxLife;
        ctx.strokeStyle = trail.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(trail.x1, trail.y1);
        ctx.lineTo(trail.x2, trail.y2);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        ripple.radius += 1.6;
        ripple.alpha -= 0.015;
        if (ripple.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = ripple.alpha;
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = ripple.lineWidth;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = vortexes.length - 1; i >= 0; i -= 1) {
        const vortex = vortexes[i];
        vortex.life -= 1;
        vortex.radius += 0.55;
        if (vortex.life <= 0) {
          vortexes.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = vortex.life / vortex.maxLife;
        ctx.strokeStyle = vortex.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let step = 0; step < 16; step += 1) {
          const angle = (step / 16) * Math.PI * 2 + vortex.life * 0.02 * vortex.spin;
          const x = vortex.x + Math.cos(angle) * (vortex.radius + step * 0.8);
          const y = vortex.y + Math.sin(angle) * (vortex.radius + step * 0.8);
          if (step === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
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
        if (p.lightning) {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 10, p.y + p.vy * 10);
          ctx.stroke();
          ctx.restore();
        } else if (p.rune) {
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
      if (pointer.moved) {
        trails.push({
          x1: pointer.x - 3,
          y1: pointer.y - 3,
          x2: event.clientX - 3,
          y2: event.clientY - 3,
          life: 18,
          maxLife: 18,
          color: document.body.classList.contains('theme-scarlet') ? '#ffd1dc' : '#f0d38a'
        });
      }
      pointer.moved = true;
      const shiftX = (event.clientX / window.innerWidth - 0.5) * 10;
      const shiftY = (event.clientY / window.innerHeight - 0.5) * 8;
      document.documentElement.style.setProperty('--hero-shift-x', `${shiftX}px`);
      document.documentElement.style.setProperty('--hero-shift-y', `${shiftY}px`);
    });
    window.addEventListener('mouseleave', () => {
      pointer.active = false;
      pointer.moved = false;
    });
    window.addEventListener('mousedown', (event) => {
      spawnBurst(event.clientX, event.clientY, 24, 1.4, { ripple: true, intensity: 1.3, vortex: true, lightning: true });
    });
    window.addEventListener('mouseup', () => {
      pointer.active = false;
    });

    document.addEventListener('keydown', (event) => {
      const spellMap = {
        a: { label: 'Escudo Arcano', primary: '#3ee0a0', secondary: '#f0d38a', amount: 26, speed: 1.3, ripple: true, vortex: false, intensity: 0.9 },
        s: { label: 'Vórtice do Caos', primary: '#ff5d78', secondary: '#ffd1dc', amount: 32, speed: 1.6, ripple: true, vortex: true, intensity: 1.4 },
        d: { label: 'Lâmina do Destino', primary: '#f0d38a', secondary: '#3ee0a0', amount: 24, speed: 1.4, ripple: true, vortex: false, intensity: 1 },
        f: { label: 'Portal Arcano', primary: '#8ff7d0', secondary: '#ffffff', amount: 28, speed: 1.2, ripple: true, vortex: true, intensity: 1.2 }
      };
      const spell = spellMap[event.key.toLowerCase()];
      if (!spell || event.repeat) return;
      const x = window.innerWidth * 0.5 + (Math.random() - 0.5) * 220;
      const y = window.innerHeight * 0.45 + (Math.random() - 0.5) * 180;
      spawnBurst(x, y, spell.amount, spell.speed, { primary: spell.primary, secondary: spell.secondary, ripple: spell.ripple, vortex: spell.vortex, intensity: spell.intensity, lightning: true });
      showSpellText(spell.label, x, y);
    });

    document.querySelectorAll('.magic-card, .artifact-trigger, .cauldron-trigger, .companion-portrait, .portrait-frame, .section-head h2, .hero-text h1, .hero-quote, .stat-box').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        spawnBurst(x, y, 10, 0.8, { ripple: true, intensity: 0.8, lightning: false });
        element.classList.add('hover-arcane');
        if (element.tagName === 'H2' || element.tagName === 'H1') {
          element.classList.add('arcane-title');
        }
      });
      element.addEventListener('mouseleave', () => {
        element.classList.remove('hover-arcane');
        if (element.tagName === 'H2' || element.tagName === 'H1') {
          element.classList.remove('arcane-title');
        }
      });
    });

    resizeLayer();
    animateLayer(0);
  }
})();
