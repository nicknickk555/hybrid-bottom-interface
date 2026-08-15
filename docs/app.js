(() => {
  const sections = [...document.querySelectorAll('[data-screen]')];
  const navLinks = [...document.querySelectorAll('[data-section-link]')];
  const progress = document.querySelector('.progress i');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const architecture = document.querySelector('#architecture');
  const architectureImage = architecture?.querySelector('.figure-frame img');
  let cycleStart = performance.now();

  function activateSection(id) {
    const index = Math.max(0, sections.findIndex(section => section.id === id));
    document.body.dataset.activeSection = id;
    navLinks.forEach(link => {
      const active = link.dataset.sectionLink === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (progress) progress.style.transform = `translateX(${index * 100}%)`;
  }

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activateSection(entry.target.id);
      if (entry.target === architecture && architectureImage && !reducedMotion) {
        const baseSource = architectureImage.getAttribute('src').split('?')[0];
        architectureImage.setAttribute('src', `${baseSource}?cycle=${Date.now()}`);
        cycleStart = performance.now();
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => sectionObserver.observe(section));
  sections[0].classList.add('is-visible');
  activateSection(location.hash.slice(1) || sections[0].id);

  document.addEventListener('keydown', event => {
    const formControl = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(event.target.tagName);
    if (formControl || !['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) return;
    const current = Math.max(0, sections.findIndex(section => section.id === document.body.dataset.activeSection));
    const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1 : -1;
    const target = sections[Math.min(sections.length - 1, Math.max(0, current + direction))];
    if (target && target !== sections[current]) {
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  });

  // Keep the explanatory timeline synchronized with the 7.2 s SVG pruning cycle.
  const processSteps = [...document.querySelectorAll('[data-process]')];
  const statusText = document.querySelector('.figure-status span');
  const phases = [
    { until: 3000, index: 0, label: 'Root approach' },
    { until: 3700, index: 1, label: 'Typar contact' },
    { until: 4350, index: 2, label: 'Local micro-drying' },
    { until: 5150, index: 3, label: 'Apex pruning' },
    { until: 7200, index: 4, label: 'Lateral branching' }
  ];
  function updateProcess(now) {
    const elapsed = reducedMotion ? 7100 : (now - cycleStart) % 7200;
    const phase = phases.find(item => elapsed < item.until) || phases[phases.length - 1];
    processSteps.forEach((step, index) => step.classList.toggle('active', index === phase.index));
    if (statusText && statusText.textContent !== phase.label) statusText.textContent = phase.label;
    if (!reducedMotion) requestAnimationFrame(updateProcess);
  }
  updateProcess(performance.now());

  // Comparative model. Values are directional design indices, not field claims.
  const climate = document.querySelector('#climate');
  const membrane = document.querySelector('#membrane');
  const humidity = document.querySelector('#humidity');
  const clearance = document.querySelector('#clearance');
  const rhOutput = document.querySelector('#rh-output');
  const gapOutput = document.querySelector('#gap-output');
  const delayValue = document.querySelector('#delay-value');
  const dryingValue = document.querySelector('#drying-value');
  const branchingValue = document.querySelector('#branching-value');
  const dryingBar = document.querySelector('#drying-bar');
  const branchingBar = document.querySelector('#branching-bar');
  const responseLabel = document.querySelector('#response-label');
  const modelNote = document.querySelector('#model-note');
  const rings = document.querySelector('.rings');
  const modeButtons = [...document.querySelectorAll('.mode')];
  const formatButtons = [...document.querySelectorAll('.format-card')];
  const formatName = document.querySelector('#format-name');
  const formatDimensions = document.querySelector('#format-dimensions');
  const bottomArea = document.querySelector('#bottom-area');
  const typarArea = document.querySelector('#typar-area');
  const openRing = document.querySelector('#open-ring');
  const typarDiameter = document.querySelector('#typar-diameter');

  const climates = {
    kyiv: { rh: 58, air: 1, name: 'continental conditions' },
    london: { rh: 82, air: .75, name: 'humid conditions' },
    greenhouse: { rh: 70, air: 1.12, name: 'optimised greenhouse conditions' }
  };
  const membranes = {
    SF16: { factor: .78, copy: 'SF16 reference' },
    SF20: { factor: 1, copy: 'SF20' },
    SF32: { factor: 1.34, copy: 'SF32' }
  };
  const formats = {
    R51: { diameter: 102, height: 100, bottomArea: 81.7, typarArea: 60.7, openRing: 21, typarDiameter: 88, scale: .72, renewal: 1.12 },
    R76: { diameter: 152, height: 150, bottomArea: 181.5, typarArea: 134.8, openRing: 46.6, typarDiameter: 131, scale: .84, renewal: 1.05 },
    R108: { diameter: 216, height: 200, bottomArea: 366.4, typarArea: 272.3, openRing: 94.2, typarDiameter: 186, scale: 1, renewal: 1 },
    R146: { diameter: 292, height: 260, bottomArea: 669.7, typarArea: 497.6, openRing: 172.1, typarDiameter: 252, scale: 1.1, renewal: .96 }
  };
  let airflowMode = 'natural';
  let activeFormat = 'R108';

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

  function calculate() {
    const climateData = climates[climate.value];
    const membraneData = membranes[membrane.value];
    const formatData = formats[activeFormat];
    const rh = Number(humidity.value);
    const gap = Number(clearance.value);
    const modeFactor = airflowMode === 'forced' ? 1.28 : 1;
    const gapAir = .2 + .6 * Math.tanh(gap / 10);
    const air = clamp(gapAir * climateData.air * modeFactor * formatData.renewal * 1.18, .24, 1.38);
    const humidityDrive = Math.max(.08, 1 - rh / 100);
    const dryHours = Math.max(3, 8.6 * membraneData.factor / (humidityDrive * air * 2.35));
    const delayMinutes = Math.round(dryHours * 12);
    const openShare = formatData.openRing / formatData.bottomArea;
    const prune = clamp(.25 + openShare * 1.15 + air * .34 - dryHours * .012, .12, .96);
    const dryingIndex = Math.round(clamp(air * 110, 18, 130));
    const branching = Math.round(prune * 100);
    const label = branching >= 78 ? 'decisive response' : branching >= 61 ? 'balanced adaptation' : 'soft adaptation';

    rhOutput.textContent = `${rh}%`;
    gapOutput.textContent = `${gap} mm`;
    delayValue.innerHTML = `${delayMinutes}<small>min</small>`;
    dryingValue.textContent = dryingIndex;
    branchingValue.textContent = `${branching}%`;
    dryingBar.style.width = `${clamp(dryingIndex / 1.3, 8, 100)}%`;
    branchingBar.style.width = `${branching}%`;
    responseLabel.textContent = label;
    formatName.textContent = activeFormat;
    formatDimensions.textContent = `Ø${formatData.diameter} · h${formatData.height} mm`;
    bottomArea.textContent = `${formatData.bottomArea.toFixed(1)} cm²`;
    typarArea.textContent = `${formatData.typarArea.toFixed(1)} cm²`;
    openRing.textContent = `${formatData.openRing.toFixed(1)} cm²`;
    typarDiameter.textContent = `${formatData.typarDiameter} mm`;
    modelNote.textContent = `${activeFormat} geometry, ${membraneData.copy} and ${airflowMode} airflow create a ${label.replace(' response', '').replace(' adaptation', '')} comparative drying window for ${climateData.name}.`;
    if (rings) {
      rings.style.setProperty('--ring-speed', `${clamp(3.2 - air * 1.25, 1.3, 3)}s`);
      rings.style.setProperty('--format-scale', formatData.scale);
    }
  }

  formatButtons.forEach(button => button.addEventListener('click', () => {
    activeFormat = button.dataset.format;
    formatButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    calculate();
  }));

  modeButtons.forEach(button => button.addEventListener('click', () => {
    airflowMode = button.dataset.mode;
    modeButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    calculate();
  }));

  climate.addEventListener('change', () => {
    humidity.value = climates[climate.value].rh;
    calculate();
  });
  [membrane, humidity, clearance].forEach(control => control.addEventListener('input', calculate));
  document.querySelector('#model-controls').addEventListener('submit', event => event.preventDefault());
  calculate();
})();
