const initialResources = {
  humanos: { ouro: 20, madeira: 20, comida: 20, construtor: 0 },
  undeads: { ouro: 20, ossos: 20, almas: 20, necromantes: 0 },
  anoes: { ouro: 20, pedra: 20, metal: 20, anoes: 0, comida: 20 },
  elfos: { ouro: 20, mana: 20, madeira: 20, pixie: 0 }
};

const unitCosts = {
  humanos: { construtor: { ouro: 2, comida: 2 } },
  undeads: { necromantes: { ouro: 1, almas: 3 } },
  anoes: { anoes: { ouro: 3, comida: 3 } },
  elfos: { pixie: { ouro: 1, mana: 3 } }
};

const buildingCosts = {
  humanos: {
    "Mina": { ouro: 6, madeira: 6, construtor: 4 },
    "Vila": { ouro: 4, madeira: 2, construtor: 2 },
    "Casa dos Artesãos": { ouro: 3, madeira: 2, construtor: 4 },
    "Forte Militar": { ouro: 6, madeira: 4, construtor: 6 },
    "Torre dos Magos": { ouro: 10, madeira: 6, construtor: 6 },
    "Capital": { ouro: 12, madeira: 12, construtor: 12 }
  }
};

const militaryBuildings = ["Forte Militar", "Torre dos Magos", "Capital"];
let currentRace = null;
let resources = {};
let constructed = [];
let history = [];

function selectRace(race) {
  currentRace = race;
  resources = { ...initialResources[race] };
  renderResources();
  document.querySelectorAll(".race-select button").forEach(btn => btn.disabled = true);
  document.getElementById("btnStartColony").disabled = false;
  logHistory(`Raça escolhida: ${race.toUpperCase()}`);
}

function startColony() {
  const unit = Object.keys(unitCosts[currentRace])[0];
  resources[unit] += 5;
  renderResources();
  renderBuildings();
  renderTroops();
  logHistory("Colônia iniciada com capital e 1 unidade criada");
  document.getElementById("btnStartColony").disabled = true;
}

function renderResources() {
  const panel = document.getElementById('resourcePanel');
  panel.innerHTML = '';
  for (const [key, value] of Object.entries(resources)) {
    const div = document.createElement('div');
    div.className = 'resource';
    div.innerHTML = `<strong>${key}</strong><br>${value}`;
    panel.appendChild(div);
  }
}

function renderBuildings() {
  const panel = document.getElementById('buildingButtons');
  panel.innerHTML = '';
  for (const [name, cost] of Object.entries(buildingCosts[currentRace])) {
    const btn = document.createElement('button');
    const costStr = Object.entries(cost).map(([k, v]) => `${v} ${k}`).join(', ');
    btn.textContent = `Construir ${name} (${costStr})`;
    btn.onclick = () => tryBuild(name, cost);
    panel.appendChild(btn);
  }
}

function renderTroops() {
  const panel = document.getElementById('troopButtons');
  panel.innerHTML = '';
  for (const [unit, cost] of Object.entries(unitCosts[currentRace])) {
    const costStr = Object.entries(cost).map(([k, v]) => `${v} ${k}`).join(', ');
    const btn = document.createElement('button');
    btn.textContent = `Criar ${unit} (${costStr})`;
    btn.onclick = () => createUnit(unit, cost);
    panel.appendChild(btn);
  }
}

function tryBuild(name, cost) {
  const missing = Object.entries(cost).filter(([res, val]) => (resources[res] || 0) < val);
  if (missing.length > 0) return alert(`Falta: ${missing.map(([r, v]) => `${v - (resources[r] || 0)} ${r}`).join(', ')}`);
  for (const [res, val] of Object.entries(cost)) resources[res] -= val;
  constructed.push(name);
  renderResources();
  renderConstructed();
  logHistory(`Construção realizada: ${name}`);
}

function renderConstructed() {
  const panel = document.getElementById('constructedList');
  panel.innerHTML = '';
  constructed.forEach((name, index) => {
    const div = document.createElement('div');
    div.className = 'building-built';
    const btn = document.createElement('button');
    btn.textContent = 'Remover';
    btn.onclick = () => {
      constructed.splice(index, 1);
      renderConstructed();
      logHistory(`Construção removida: ${name}`);
    };
    div.innerHTML = `<strong>${name}</strong>${militaryBuildings.includes(name) ? '<br><small>Libera tropas militares</small>' : ''}`;
    div.appendChild(btn);
    panel.appendChild(div);
  });
}

function createUnit(unit, cost) {
  const missing = Object.entries(cost).filter(([res, val]) => (resources[res] || 0) < val);
  if (missing.length > 0) return alert(`Falta: ${missing.map(([r, v]) => `${v - (resources[r] || 0)} ${r}`).join(', ')}`);
  for (const [res, val] of Object.entries(cost)) resources[res] -= val;
  resources[unit] = (resources[unit] || 0) + 1;
  renderResources();
  logHistory(`Unidade criada: ${unit}`);
}

function manualChange(add) {
  const res = document.getElementById('manualResource').value;
  const val = parseInt(document.getElementById('manualAmount').value);
  if (!resources[res]) resources[res] = 0;
  resources[res] += add ? val : -val;
  if (resources[res] < 0) resources[res] = 0;
  renderResources();
  logHistory(`${add ? 'Adicionado' : 'Removido'} ${val} ${res}`);
}

function nextPhase(phase) {
  logHistory(`Fim do ${phase}`);
}

function logHistory(msg) {
  const date = new Date().toLocaleTimeString();
  history.unshift(`[${date}] ${msg}`);
  document.getElementById('historyPanel').innerHTML = history.slice(0, 10).join('<br>');
}
