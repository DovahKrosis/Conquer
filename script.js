const initialResources = {
  humanos: { ouro: 20, madeira: 20, comida: 20, construtor: 0 },
  undeads: { ouro: 20, ossos: 20, almas: 20, necromantes: 0 },
  anoes: { ouro: 20, pedra: 20, metal: 20, anoes: 0, comida: 20 },
  elfos: { ouro: 20, mana: 20, madeira: 20, pixie: 0 }
};

const buildingEffects = {
  humanos: {
    "Mina": { trigger: "dia", effect: "1d6 ouro" },
    "Vila": { trigger: "dia", effect: "1d4 comida" },
    "Casa dos Artesãos": { trigger: "dia", effect: "1d4 madeira" }
  },
  undeads: {
    "Monolito Geológico": { trigger: "periodo", effect: "1d4 ouro" },
    "Catacumba Assombrada": { trigger: "noite", effect: "1d4 ossos" },
    "Torre Maligna": { trigger: "periodo", effect: "1d4 almas" }
  },
  anoes: {
    "Mina": { trigger: "periodo", effect: "1d6 ouro" },
    "Casa dos Metalúrgicos": { trigger: "dia", effect: "1d4 metal" },
    "Fazenda de Cogumelos": { trigger: "noite", effect: "1d4 comida" },
    "Montanha Mãe": { trigger: "periodo", effect: "1d6 pedra" }
  },
  elfos: {
    "Monolito da Natureza": { trigger: "periodo", effect: { dia: "1d4 madeira", noite: "1d4 ouro" }},
    "Templo da Lua": { trigger: "noite", effect: "1d4 mana" },
    "Fonte de Mana": { trigger: "noite", effect: "1d8 mana" },
    "Gaia": { trigger: "periodo", effect: "1d4 mana" }
  }
};

const unitCosts = {
  humanos: {
    construtor: { ouro: 2, comida: 2 },
    milicia: { ouro: 2, comida: 1 },
    cavaleiro: { ouro: 4, comida: 4 },
    mago: { ouro: 6, comida: 4 }
  },
  undeads: {
    necromantes: { ouro: 1, almas: 3 },
    "morto-vivo": { ouro: 1, almas: 6 },
    "cavaleiro da morte": { ouro: 5, almas: 10 }
  },
  anoes: {
    anoes: { ouro: 3, comida: 3 },
    "infantaria anã": { ouro: 8, metal: 2 },
    "mestre da forja": { ouro: 10, metal: 6 }
  },
  elfos: {
    pixie: { ouro: 1, mana: 3 },
    "infantaria élfica": { ouro: 6, mana: 10 },
    "sacerdote mestre": { ouro: 8, mana: 15 }
  }
};

let unitCooldowns = {};

const unitProduction = {
  humanos: {
    cavaleiro: { building: "Forte Militar", perDay: 2, current: 0 },
    mago: { building: "Torre dos Magos", perDay: 1, current: 0 },
    milicia: { building: "Capital", perDay: 2, current: 0 },
    construtor: { building: "Capital", perDay: Infinity, current: 0 }
  },
  undeads: {
    "morto-vivo": { building: "Catacumba Assombrada", perDay: 3, current: 0 },
    "cavaleiro da morte": { building: "Torre Maligna", perDay: 2, current: 0 },
    necromantes: { building: "Capital Negra", perDay: Infinity, current: 0 }
  },
  anoes: {
    "infantaria anã": { building: "Pináculo Militar", perDay: 2, current: 0 },
    "mestre da forja": { building: "Casa dos Metalúrgicos", perDay: 2, current: 0 },
    anoes: { building: "Montanha Mãe", perDay: Infinity, current: 0 }
  },
  elfos: {
    "infantaria élfica": { building: "Monolito da Natureza", perDay: 3, current: 0 },
    "sacerdote mestre": { building: "Templo da Lua", perDay: 2, current: 0 },
    pixie: { building: "Gaia", perDay: Infinity, current: 0 }
  }
};

const buildingCosts = {
  humanos: {
    "Mina": { ouro: 6, madeira: 6, construtor: 4 },
    "Vila": { ouro: 4, madeira: 2, construtor: 2 },
    "Casa dos Artesãos": { ouro: 3, madeira: 2, construtor: 4 },
    "Forte Militar": { ouro: 6, madeira: 4, construtor: 6 },
    "Torre dos Magos": { ouro: 10, madeira: 6, construtor: 6 },
    "Capital": { ouro: 12, madeira: 12, construtor: 12 },
    "Ponte de Madeira": { ouro: 30, madeira: 40, construtor: 8 }
  },
  undeads: {
    "Monolito Geológico": { ouro: 8, ossos: 6, necromantes: 4 },
    "Catacumba Assombrada": { ouro: 5, ossos: 4, necromantes: 4 },
    "Torre Maligna": { ouro: 5, ossos: 4, necromantes: 3 },
    "Capital Negra": { ouro: 12, ossos: 12, almas: 12, necromantes: 12 },
    "Portal das trevas": { ouro: 50, ossos: 20, almas: 50, necromantes: 6 },
  },
  anoes: {
    "Mina": { ouro: 8, metal: 2, anoes: 4 },
    "Casa dos Metalúrgicos": { ouro: 8, pedra: 5, anoes: 5 },
    "Fundição": { ouro: 15, pedra: 10, anoes: 5 },
    "Fazenda de Cogumelos": { ouro: 8, pedra: 4, anoes: 3 },
    "Pináculo Militar": { ouro: 8, pedra: 4, anoes: 3 },
    "Montanha Mãe": { ouro: 15, pedra: 15, metal: 15, anoes: 10 },
    "Trilho de Ferro": { ouro: 50, pedra: 25, metal: 25, anoes: 6 }
  },
  elfos: {
    "Monolito da Natureza": { ouro: 6, madeira: 2, mana: 4, pixie: 4 },
    "Templo da Lua": { ouro: 8, mana: 5, pixie: 4 },
    "Árvore da Terra": { ouro: 10, madeira: 10, mana: 10, pixie: 6 },
    "Fonte de Mana": { ouro: 8, mana: 4, pixie: 5 },
    "Gaia": { ouro: 20, madeira: 20, mana: 20, pixie: 10 },
    "Navio Lunar": { ouro: 30, mana: 10, madeira: 45, pixie: 5 }
  }
};

const militaryBuildings = {
  humanos: ["Forte Militar", "Torre dos Magos", "Capital"],
  undeads: ["Catacumba Assombrada", "Torre Maligna"],
  anoes: ["Pináculo Militar", "Casa dos Metalúrgicos"],
  elfos: ["Infantaria élfica", "Sacerdote Mestre"]
};

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
  // Adiciona a capital automaticamente conforme as regras
  const capitalName = getCapitalName();
  constructed.push(capitalName);
  
  // Adiciona unidades iniciais conforme a raça
  const initialUnit = getInitialUnit();
  resources[initialUnit] = (resources[initialUnit] || 0) + 5;
  
  renderResources();
  renderBuildings();
  renderTroops();
  renderConstructed();
  
  logHistory(`Colônia iniciada com ${capitalName} e 1 ${initialUnit}`);
  document.getElementById("btnStartColony").disabled = true;
}

function getCapitalName() {
  switch(currentRace) {
    case 'humanos': return 'Capital';
    case 'undeads': return 'Capital Negra';
    case 'anoes': return 'Montanha Mãe';
    case 'elfos': return 'Gaia';
    default: return 'Capital';
  }
}

function getInitialUnit() {
  switch(currentRace) {
    case 'humanos': return 'construtor';
    case 'undeads': return 'necromantes';
    case 'anoes': return 'anoes';
    case 'elfos': return 'pixie';
    default: return '';
  }
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
  
  if (!currentRace || !buildingCosts[currentRace]) return;
  
  for (const [name, cost] of Object.entries(buildingCosts[currentRace])) {
    // Não mostrar a capital pois ela já é adicionada automaticamente
    if (name === getCapitalName()) continue;
    
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
  
  if (!currentRace || !unitCosts[currentRace]) return;
  
  for (const [unit, cost] of Object.entries(unitCosts[currentRace])) {
    const btn = document.createElement('button');
    const costStr = Object.entries(cost).map(([k, v]) => `${v} ${k}`).join(', ');
    
    // Verifica requisitos
    const requirement = unitProduction[currentRace]?.[unit];
    let canCreate = true;
    let requirementText = '';
    
    if (requirement) {
      canCreate = constructed.includes(requirement.building);
      requirementText = ` (Req: ${requirement.building})`;
      
      // Mostra cooldown se aplicável
      if (unitCooldowns[unit] > 0) {
        requirementText += ` [Cooldown: ${unitCooldowns[unit]}]`;
      }
    }
    
    btn.textContent = `Criar ${unit} (${costStr})${requirementText}`;
    btn.onclick = () => createUnit(unit, cost);
    btn.disabled = !canCreate || (unitCooldowns[unit] > 0);
    panel.appendChild(btn);
  }
}

function isMilitaryUnit(unit) {
  switch(currentRace) {
    case 'humanos': 
      return ['cavaleiro', 'mago', 'milicia'].includes(unit);
    case 'undeads':
      return ['morto-vivo', 'cavaleiro da morte'].includes(unit);
    case 'anoes':
      return ['infantaria anã', 'mestre da forja'].includes(unit);
    case 'elfos':
      return ['infantaria élfica', 'sacerdote mestre'].includes(unit);
    default:
      return false;
  }
}

function tryBuild(name, cost) {
  const missing = Object.entries(cost).filter(([res, val]) => (resources[res] || 0) < val);
  if (missing.length > 0) {
    return alert(`Falta: ${missing.map(([r, v]) => `${v - (resources[r] || 0)} ${r}`).join(', ')}`);
  }
  
  for (const [res, val] of Object.entries(cost)) {
    resources[res] -= val;
  }
  
  constructed.push(name);
  renderResources();
  renderConstructed();
  renderTroops(); // Atualiza tropas disponíveis
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
      renderTroops(); // Atualiza tropas disponíveis
      logHistory(`Construção removida: ${name}`);
    };
    
    div.innerHTML = `<strong>${name}</strong>`;
    
    // Mostra se é uma construção militar
    if (militaryBuildings[currentRace]?.includes(name)) {
      div.innerHTML += '<br><small>Libera tropas militares</small>';
    }
    
    div.appendChild(btn);
    panel.appendChild(div);
  });
}

function createUnit(unit, cost) {
  const production = unitProduction[currentRace]?.[unit];
  
  // Verifica construção necessária
  if (production && !constructed.includes(production.building)) {
    return alert(`Você precisa construir ${production.building} para criar ${unit}`);
  }

  // Verifica limite de produção
  if (production && production.current >= production.perDay) {
    return alert(`Você já produziu o máximo de ${unit} por dia (${production.perDay})`);
  }

  const missing = Object.entries(cost).filter(([res, val]) => (resources[res] || 0) < val);
  if (missing.length > 0) {
    return alert(`Falta: ${missing.map(([r, v]) => `${v - (resources[r] || 0)} ${r}`).join(', ')}`);
  }

  for (const [res, val] of Object.entries(cost)) {
    resources[res] -= val;
  }

  resources[unit] = (resources[unit] || 0) + 1;
  
  // Incrementa contador de produção se não for infinito
  if (production && production.perDay !== Infinity) {
    production.current++;
  }

  renderResources();
  renderTroops(); // Atualiza botões de tropas
  logHistory(`Unidade criada: ${unit}`);
}

function nextPhase(phase) {

  // Atualiza o ciclo
  if (phase === 'dia') {
    isDayTime = false;
    document.getElementById('btn-day').disabled = true;
    document.getElementById('btn-night').disabled = false;
  } else {
    isDayTime = true;
    currentDay++;
    if (currentDay % 7 === 0) {
      currentWeek++;
    }
    document.getElementById('btn-day').disabled = false;
    document.getElementById('btn-night').disabled = true;
  }

  // Atualiza a interface
  updateTheme();
  updateCounters();
  
  // Processa eventos do período
  processPeriodEvents(phase);
  
  // Zera cooldowns no novo dia
  if (phase === 'dia') {
    for (const race in unitProduction) {
      for (const unit in unitProduction[race]) {
        unitProduction[race][unit].current = 0;
      }
    }
  }

  logHistory(`Fim da ${phase === 'dia' ? 'noite' : 'dia'} - Dia ${currentDay}, Semana ${currentWeek}`);
}

// Inicialização do tema
document.addEventListener('DOMContentLoaded', function() {
  updateTheme();
  updateCounters();
  
  // Desabilita o botão de noite inicialmente
  document.getElementById('btn-night').disabled = true;
});

function processPeriodEvents(phase) {
  if (!currentRace) return;
  
  const results = [];
  const buildingsWithEffects = buildingEffects[currentRace] || {};
  
  // Verifica cada construção do jogador
  constructed.forEach(building => {
    const effect = buildingsWithEffects[building];
    if (effect && (effect.trigger === phase || effect.trigger === "periodo")) {
      let effectStr = typeof effect.effect === 'object' ? effect.effect[phase] : effect.effect;
      results.push({ building, effect: effectStr });
    }
  });
  
  // Mostra modal com resultados
  if (results.length > 0) {
    showResultsModal(results, phase);
  }
  
  logHistory(`Fim do ${phase}`);
}

// Substitua a função showResultsModal por esta versão simplificada:
function showResultsModal(results, phase) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';

  const content = document.createElement('div');
  content.style.backgroundColor = '#222';
  content.style.padding = '20px';
  content.style.borderRadius = '10px';
  content.style.width = '80%';
  content.style.maxWidth = '500px';

  const title = document.createElement('h2');
  title.textContent = `Resultados do ${phase.toUpperCase()}`;
  title.style.color = 'white';
  title.style.textAlign = 'center';
  content.appendChild(title);

  const form = document.createElement('form');
  
  results.forEach(result => {
    const group = document.createElement('div');
    group.style.margin = '15px 0';
    
    const label = document.createElement('label');
    label.textContent = `${result.building} (${result.effect}):`;
    label.style.display = 'block';
    label.style.marginBottom = '5px';
    label.style.color = 'white';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.placeholder = 'Valor obtido';
    input.style.width = '100%';
    input.style.padding = '8px';
    input.required = true;
    input.dataset.effect = result.effect; // Armazena o tipo de recurso
    
    group.appendChild(label);
    group.appendChild(input);
    form.appendChild(group);
  });

  const buttonGroup = document.createElement('div');
  buttonGroup.style.display = 'flex';
  buttonGroup.style.justifyContent = 'space-between';
  buttonGroup.style.marginTop = '20px';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.type = 'button';
  cancelBtn.onclick = () => document.body.removeChild(modal);
  cancelBtn.style.padding = '10px 20px';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Aplicar Recursos';
  submitBtn.type = 'submit';
  submitBtn.style.padding = '10px 20px';
  submitBtn.style.backgroundColor = '#4CAF50';

  buttonGroup.appendChild(cancelBtn);
  buttonGroup.appendChild(submitBtn);
  form.appendChild(buttonGroup);

  form.onsubmit = (e) => {
    e.preventDefault();
    
    // Processa todos os inputs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      const value = parseInt(input.value) || 0;
      if (value > 0) {
        // Extrai o tipo de recurso do efeito (ex: "1d6 ouro" -> "ouro")
        const resourceType = input.dataset.effect.split(' ').pop();
        if (resourceType) {
          resources[resourceType] = (resources[resourceType] || 0) + value;
          logHistory(`${resourceType} +${value} de ${input.previousElementSibling.textContent.split(':')[0]}`);
        }
      }
    });
    
    renderResources();
    document.body.removeChild(modal);
    return false;
  };

  content.appendChild(form);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Foca no primeiro input
  const firstInput = form.querySelector('input');
  if (firstInput) firstInput.focus();
}
function applyResourceResult(type, amount) {
  if (!resources[type]) resources[type] = 0;
  resources[type] += amount;
  renderResources();
}

function manualChange(add) {
  const res = document.getElementById('manualResource').value;
  const val = parseInt(document.getElementById('manualAmount').value) || 0;
  
  if (!resources[res]) resources[res] = 0;
  resources[res] += add ? val : -val;
  if (resources[res] < 0) resources[res] = 0;
  
  renderResources();
  logHistory(`${add ? 'Adicionado' : 'Removido'} ${val} ${res}`);
}


function openTab(tabName) {
  // Esconde todos os conteúdos de abas
  const tabContents = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = 'none';
  }
  
  // Remove a classe 'active' de todos os botões
  const tabButtons = document.getElementsByClassName('tab-button');
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove('active');
  }
  
  // Mostra a aba atual e adiciona a classe 'active' ao botão
  document.getElementById(tabName).style.display = 'block';
  event.currentTarget.classList.add('active');
}

function logHistory(msg) {
  const date = new Date().toLocaleTimeString();
  history.unshift(`[${date}] ${msg}`);
  document.getElementById('historyPanel').innerHTML = history.slice(0, 10).join('<br>');
}

let currentDay = 1;
let currentWeek = 1;
let isDayTime = true;

// Função para atualizar o tema visual
function updateTheme() {
  document.body.classList.remove('day-theme', 'night-theme');
  if (isDayTime) {
    document.body.classList.add('day-theme');
    document.getElementById('time-of-day').textContent = '🌞 Dia';
  } else {
    document.body.classList.add('night-theme');
    document.getElementById('time-of-day').textContent = '🌙 Noite';
  }
}

function updateCounters() {
  document.getElementById('day-counter').textContent = `Dia: ${currentDay}`;
  document.getElementById('week-counter').textContent = `Semana: ${currentWeek}`;
}