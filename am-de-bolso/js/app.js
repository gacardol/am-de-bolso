
let flow = {};
let history = [];
let currentScreen = 'start';

async function init() {
  try {
    const res = await fetch('data/flow.json');
    flow = await res.json();
    renderScreen('start');
  } catch (e) {
    document.getElementById('app').innerHTML = '<p style="color:red;padding:20px;">Erro ao carregar flow.json: ' + e.message + '</p>';
  }
}

function renderScreen(id) {
  if (id === 'home') id = 'start';
  currentScreen = id;
  const screen = flow[id];
  if (!screen) {
    document.getElementById('app').innerHTML = '<p style="color:red;padding:20px;">Tela nao encontrada: ' + id + '</p>';
    return;
  }

  let html = '<div class="screen">';
  
  // Pergunta principal
  html += '<h2 class="question">' + screen.question + '</h2>';
  
  // Subtitulo
  if (screen.subtitle) {
    html += '<p class="subtitle">' + screen.subtitle + '</p>';
  }

  // Info
  if (screen.info) {
    html += '<div class="info-box">' + screen.info + '</div>';
  }

  // Warning
  if (screen.warning) {
    html += '<div class="warning-box">⚠️ ' + screen.warning + '</div>';
  }

  // Steps
  if (screen.steps) {
    html += '<div class="steps">';
    screen.steps.forEach(function(step, i) {
      html += '<div class="step"><span class="step-num">' + (i+1) + '</span> ' + step + '</div>';
    });
    html += '</div>';
  }

  // List
  if (screen.list) {
    html += '<ul class="info-list">';
    screen.list.forEach(function(item) {
      html += '<li>' + item + '</li>';
    });
    html += '</ul>';
  }

  // Opcoes (botoes)
  if (screen.options) {
    html += '<div class="options">';
    screen.options.forEach(function(opt) {
      if (opt.url) {
        html += '<a href="' + opt.url + '" target="_blank" class="btn btn-link">' + opt.emoji + ' ' + opt.text + '</a>';
      } else if (opt.next) {
        html += '<button class="btn" onclick="goTo(\'' + opt.next + '\')">' + opt.emoji + ' ' + opt.text + '</button>';
      }
    });
    html += '</div>';
  }

  // Footer fixo (a partir da 3a tela)
  if (history.length >= 2) {
    html += '<div class="footer-nav">';
    html += '<button class="footer-btn" onclick="goBack()">↩️ Voltar</button>';
    html += '<button class="footer-btn" onclick="goTo(\'start\')">🏠 Inicio</button>';
    html += '<a href="https://amazonexteu.qualtrics.com/jfe/form/SV_eEhccc2rqm5WURw" target="_blank" class="footer-btn">📋 Lista pra mim</a>';
    html += '</div>';
  }

  html += '</div>';
  document.getElementById('app').innerHTML = html;
  window.scrollTo(0, 0);
}

function goTo(id) {
  history.push(currentScreen);
  renderScreen(id);
}

function goBack() {
  if (history.length > 0) {
    var prev = history.pop();
    renderScreen(prev);
  }
}

document.addEventListener('DOMContentLoaded', init);

