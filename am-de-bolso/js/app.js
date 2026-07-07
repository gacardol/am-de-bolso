const TABS = [
  {id: 'listar', name: '📦 Listar', file: 'data/aba_listar.json'},
  {id: 'massivo', name: '🚀 Massivo', file: 'data/aba_massivo.json'},
  {id: 'restritas', name: '🔒 Restritas', file: 'data/aba_restritas.json'},
  {id: 'custos', name: '💰 Custos', file: 'data/aba_custos.json'},
  {id: 'logistica', name: '🚚 Logística', file: 'data/aba_logistica.json'},
  {id: 'pedidos', name: '📋 Pedidos', file: 'data/aba_pedidos.json'},
  {id: 'catalogo', name: '⭐ Catálogo', file: 'data/aba_catalogo.json'},
  {id: 'ads', name: '📢 Ads', file: 'data/aba_ads.json'},
  {id: 'promocoes', name: '🏷️ Promoções', file: 'data/aba_promocoes.json'}
];

let currentTab = 'listar';
let tabData = {};
let history = [];

async function init() {
  renderTabs();
  await loadTab('listar');
}

function renderTabs() {
  const tabsEl = document.getElementById('tabs');
  tabsEl.innerHTML = TABS.map(t =>
    `<div class="tab ${t.id === currentTab ? 'active' : ''}" onclick="switchTab('${t.id}')">${t.name}</div>`
  ).join('');
}

async function switchTab(tabId) {
  currentTab = tabId;
  history = [];
  renderTabs();
  await loadTab(tabId);
}

async function loadTab(tabId) {
  const content = document.getElementById('content');
  content.innerHTML = '<div id="loading">Carregando...</div>';
  const tab = TABS.find(t => t.id === tabId);
  if (!tab) return;
  try {
    if (!tabData[tabId]) {
      const res = await fetch(tab.file);
      if (!res.ok) throw new Error('Arquivo não encontrado');
      tabData[tabId] = await res.json();
    }
    renderScreen('inicio');
  } catch(e) {
    content.innerHTML = `<div class="screen-card"><p class="question">Erro ao carregar</p><div class="warning">Não foi possível carregar esta aba. Verifique se o arquivo ${tab.file} existe.</div></div>`;
  }
}

function renderScreen(screenId) {
  const data = tabData[currentTab];
  const screen = data[screenId];
  if (!screen) {
    document.getElementById('content').innerHTML = '<div class="warning">Tela não encontrada.</div>';
    return;
  }
  let html = '<div class="screen-card">';
  if (screen.question) html += `<h2 class="question">${screen.question}</h2>`;
  if (screen.info) html += `<div class="info">${formatText(screen.info)}</div>`;
  if (screen.success) html += `<div class="success">${screen.success}</div>`;
  if (screen.highlight) html += `<div class="highlight">${formatText(screen.highlight)}</div>`;
  if (screen.warning) html += `<div class="warning">${formatText(screen.warning)}</div>`;
  if (screen.checklist) {
    html += '<div class="checklist">';
    screen.checklist.forEach(item => { html += `<div class="checklist-item">${item}</div>`; });
    html += '</div>';
  }
  if (screen.steps) {
    html += '<div class="steps">';
    screen.steps.forEach(step => { html += `<div class="step-item">${step}</div>`; });
    html += '</div>';
  }
  if (screen.table) {
    html += '<div class="table-container"><table class="data-table"><thead><tr>';
    screen.table.headers.forEach(h => { html += `<th>${h}</th>`; });
    html += '</tr></thead><tbody>';
    screen.table.rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => { html += `<td>${cell}</td>`; });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  }
  if (screen.options) {
    html += '<div class="options">';
    screen.options.forEach(opt => {
      if (opt.link) {
        html += `<a href="${opt.link}" target="_blank" class="link-btn"><span class="emoji">${opt.emoji || '🔗'}</span>${opt.text}</a>`;
      } else if (opt.next) {
        html += `<div class="option-btn" onclick="goTo('${opt.next}')"><span class="emoji">${opt.emoji || '▶️'}</span>${opt.text}</div>`;
      }
    });
    html += '</div>';
  }
  html += '</div>';
  document.getElementById('content').innerHTML = html;
  renderFooter(screenId);
}

function renderFooter(screenId) {
  const footer = document.getElementById('footer');
  if (screenId === 'inicio' && history.length === 0) {
    footer.innerHTML = '';
    return;
  }
  footer.innerHTML = `
    <div class="footer-btn" onclick="goBack()">↩️ Voltar</div>
    <div class="footer-btn" onclick="goHome()">🏠 Início</div>
    <a class="footer-btn" href="https://amazonexteu.qualtrics.com/jfe/form/SV_eEhccc2rqm5WURw" target="_blank">📋 Lista pra mim</a>
  `;
}

function goTo(screenId) {
  const data = tabData[currentTab];
  if (!data[screenId]) return;
  history.push(document.getElementById('content').dataset.current || 'inicio');
  document.getElementById('content').dataset.current = screenId;
  renderScreen(screenId);
  window.scrollTo(0, 0);
}

function goBack() {
  if (history.length > 0) {
    const prev = history.pop();
    document.getElementById('content').dataset.current = prev;
    renderScreen(prev);
  }
}

function goHome() {
  history = [];
  document.getElementById('content').dataset.current = 'inicio';
  renderScreen('inicio');
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\\n/g, '<br>')
    .replace(/\n/g, '<br>');
}

init();
