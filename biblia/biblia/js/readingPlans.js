/**
 * @fileoverview Módulo responsável pelo Sistema de Planos de Leitura Diária da Bíblia.
 * Permite ao usuário escolher um plano, acompanhar o progresso diário, clicar para abrir capítulos e concluir os dias.
 * @module readingPlans
 */

import { openChapterReader } from './uiController.js';
import { ALL_BOOKS } from './booksData.js';

// Definição dos planos de leitura disponíveis
const READING_PLANS = [
  {
    id: 'annual_adjustable',
    name: 'Plano Bíblico Anual Flexível',
    description: 'Acompanhe a leitura de todos os 1189 capítulos da Bíblia em 1 ano. Escolha livremente entre o ritmo Diário, Semanal ou Mensal a qualquer momento e acompanhe seu progresso de forma integrada.',
    duration: 365,
    isSpecial: true,
    days: [] // Gerado dinamicamente
  },
  {
    id: 'gospels_15_days',
    name: 'Maratona dos Quatro Evangelhos',
    description: 'Acompanhe a vida, os milagres e os ensinamentos de Jesus Cristo lendo os livros de Mateus, Marcos, Lucas e João em 15 dias.',
    duration: 15,
    days: [
      { day: 1, title: 'Dia 1', tasks: [{ bookId: 'mateus', bookName: 'Mateus', chapters: [1, 2, 3, 4] }] },
      { day: 2, title: 'Dia 2', tasks: [{ bookId: 'mateus', bookName: 'Mateus', chapters: [5, 6, 7, 8] }] },
      { day: 3, title: 'Dia 3', tasks: [{ bookId: 'mateus', bookName: 'Mateus', chapters: [9, 10, 11, 12, 13] }] },
      { day: 4, title: 'Dia 4', tasks: [{ bookId: 'mateus', bookName: 'Mateus', chapters: [14, 15, 16, 17, 18, 19] }] },
      { day: 5, title: 'Dia 5', tasks: [{ bookId: 'mateus', bookName: 'Mateus', chapters: [20, 21, 22, 23, 24] }] },
      { day: 6, title: 'Dia 6', tasks: [{ bookId: 'mateus', bookName: 'Mateus', chapters: [25, 26, 27, 28] }] },
      { day: 7, title: 'Dia 7', tasks: [{ bookId: 'marcos', bookName: 'Marcos', chapters: [1, 2, 3, 4, 5] }] },
      { day: 8, title: 'Dia 8', tasks: [{ bookId: 'marcos', bookName: 'Marcos', chapters: [6, 7, 8, 9, 10] }] },
      { day: 9, title: 'Dia 9', tasks: [{ bookId: 'marcos', bookName: 'Marcos', chapters: [11, 12, 13, 14, 15, 16] }] },
      { day: 10, title: 'Dia 10', tasks: [{ bookId: 'lucas', bookName: 'Lucas', chapters: [1, 2, 3, 4, 5, 6] }] },
      { day: 11, title: 'Dia 11', tasks: [{ bookId: 'lucas', bookName: 'Lucas', chapters: [7, 8, 9, 10, 11, 12] }] },
      { day: 12, title: 'Dia 12', tasks: [{ bookId: 'lucas', bookName: 'Lucas', chapters: [13, 14, 15, 16, 17, 18] }] },
      { day: 13, title: 'Dia 13', tasks: [{ bookId: 'lucas', bookName: 'Lucas', chapters: [19, 20, 21, 22, 23, 24] }] },
      { day: 14, title: 'Dia 14', tasks: [{ bookId: 'joao', bookName: 'João', chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }] },
      { day: 15, title: 'Dia 15', tasks: [{ bookId: 'joao', bookName: 'João', chapters: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21] }] }
    ]
  },
  {
    id: 'wisdom_7_days',
    name: 'Sabedoria Diária: Salmos e Provérbios',
    description: 'Encontre paz, direção e conselhos práticos para o seu dia a dia lendo seleções inspiradoras de Provérbios e Salmos em uma semana.',
    duration: 7,
    days: [
      { day: 1, title: 'Dia 1: Princípios e Louvor', tasks: [{ bookId: 'salmos', bookName: 'Salmos', chapters: [1, 2, 3] }, { bookId: 'proverbios', bookName: 'Provérbios', chapters: [1] }] },
      { day: 2, title: 'Dia 2: Confiança e Direção', tasks: [{ bookId: 'salmos', bookName: 'Salmos', chapters: [19, 23, 24] }, { bookId: 'proverbios', bookName: 'Provérbios', chapters: [3] }] },
      { day: 3, title: 'Dia 3: Proteção e Sabedoria', tasks: [{ bookId: 'salmos', bookName: 'Salmos', chapters: [34, 37] }, { bookId: 'proverbios', bookName: 'Provérbios', chapters: [4] }] },
      { day: 4, title: 'Dia 4: Sede de Deus e Prudência', tasks: [{ bookId: 'salmos', bookName: 'Salmos', chapters: [42, 46, 51] }, { bookId: 'proverbios', bookName: 'Provérbios', chapters: [10] }] },
      { day: 5, title: 'Dia 5: Gratidão e Palavra', tasks: [{ bookId: 'salmos', bookName: 'Salmos', chapters: [91, 100, 103] }, { bookId: 'proverbios', bookName: 'Provérbios', chapters: [15] }] },
      { day: 6, title: 'Dia 6: Meditação e Humildade', tasks: [{ bookId: 'salmos', bookName: 'Salmos', chapters: [119] }, { bookId: 'proverbios', bookName: 'Provérbios', chapters: [22] }] },
      { day: 7, title: 'Dia 7: Socorro e Vitória', tasks: [{ bookId: 'salmos', bookName: 'Salmos', chapters: [121, 139, 150] }, { bookId: 'proverbios', bookName: 'Provérbios', chapters: [31] }] }
    ]
  },
  {
    id: 'epistles_10_days',
    name: 'Princípios da Fé (Epístolas)',
    description: 'Aprofunde seus conhecimentos teológicos e viva a prática cristã através de cartas essenciais que moldaram a igreja primitiva.',
    duration: 10,
    days: [
      { day: 1, title: 'Dia 1: Justificação pela Fé', tasks: [{ bookId: 'romanos', bookName: 'Romanos', chapters: [1, 2, 3, 4] }] },
      { day: 2, title: 'Dia 2: Vida no Espírito', tasks: [{ bookId: 'romanos', bookName: 'Romanos', chapters: [5, 6, 7, 8] }] },
      { day: 3, title: 'Dia 3: Relacionamentos e Fé', tasks: [{ bookId: 'romanos', bookName: 'Romanos', chapters: [12, 13, 14, 15, 16] }] },
      { day: 4, title: 'Dia 4: Sabedoria da Cruz', tasks: [{ bookId: '1corintios', bookName: '1 Coríntios', chapters: [1, 2, 3, 4] }] },
      { day: 5, title: 'Dia 5: Dons e Amor Excelentíssimo', tasks: [{ bookId: '1corintios', bookName: '1 Coríntios', chapters: [12, 13, 14, 15] }] },
      { day: 6, title: 'Dia 6: Liberdade em Cristo', tasks: [{ bookId: 'galatas', bookName: 'Gálatas', chapters: [1, 2, 3, 4, 5, 6] }] },
      { day: 7, title: 'Dia 7: Riquezas da Graça', tasks: [{ bookId: 'efesios', bookName: 'Efésios', chapters: [1, 2, 3, 4, 5, 6] }] },
      { day: 8, title: 'Dia 8: Alegria e Humildade', tasks: [{ bookId: 'filipenses', bookName: 'Filipenses', chapters: [1, 2, 3, 4] }, { bookId: 'colossenses', bookName: 'Colossenses', chapters: [1, 2, 3, 4] }] },
      { day: 9, title: 'Dia 9: Heróis da Fé', tasks: [{ bookId: 'hebreus', bookName: 'Hebreus', chapters: [11, 12, 13] }] },
      { day: 10, title: 'Dia 10: Fé Prática e Operosa', tasks: [{ bookId: 'tiago', bookName: 'Tiago', chapters: [1, 2, 3, 4, 5] }] }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'biblia_reading_plans_state_v1';

// Estado padrão do sistema de planos de leitura
let state = {
  activePlanId: null, // ID do plano ativo, ou null
  progress: {}, // Armazena dias concluídos por plano, ex: { 'wisdom_7_days': [1, 2] }
  currentDay: {}, // Armazena o dia atual que o usuário deve ler por plano, ex: { 'wisdom_7_days': 3 }
  // Novos campos para o plano anual:
  annualMode: 'daily', // 'daily' | 'weekly' | 'monthly'
  annualCompletedChapters: [], // índices de 0 a 1188 do plano anual concluídos
  annualCurrentStep: { daily: 1, weekly: 1, monthly: 1 } // passo atual para cada modo
};

let allChaptersCached = null;

/**
 * Retorna todos os 1189 capítulos da Bíblia sequencialmente como uma única lista.
 */
export function getAllChapters() {
  if (allChaptersCached) return allChaptersCached;
  const chapters = [];
  ALL_BOOKS.forEach(book => {
    for (let c = 1; c <= book.chapters; c++) {
      chapters.push({
        bookId: book.id,
        bookName: book.name,
        chapter: c
      });
    }
  });
  allChaptersCached = chapters;
  return chapters;
}

/**
 * Divide um array em partes o mais iguais possível.
 */
function chunkChapters(chaptersArray, numChunks) {
  const chunks = [];
  let start = 0;
  for (let i = 0; i < numChunks; i++) {
    const size = Math.floor(chaptersArray.length / numChunks) + (i < (chaptersArray.length % numChunks) ? 1 : 0);
    const chunk = chaptersArray.slice(start, start + size);
    chunks.push(chunk);
    start += size;
  }
  return chunks;
}

/**
 * Retorna as etapas do plano anual baseadas no ritmo (modo) selecionado.
 * @param {string} mode - 'daily' | 'weekly' | 'monthly'
 */
export function getAnnualSteps(mode) {
  const allChapters = getAllChapters();
  let numChunks = 365;
  let titlePrefix = 'Dia';
  
  if (mode === 'weekly') {
    numChunks = 52;
    titlePrefix = 'Semana';
  } else if (mode === 'monthly') {
    numChunks = 12;
    titlePrefix = 'Mês';
  }

  const chunks = chunkChapters(allChapters, numChunks);
  
  let currentGlobalIndex = 0;
  return chunks.map((chunk, i) => {
    const stepNum = i + 1;
    const startIndex = currentGlobalIndex;
    const endIndex = currentGlobalIndex + chunk.length - 1;
    currentGlobalIndex += chunk.length;

    const tasks = [];
    const bookGroups = {};
    chunk.forEach((item, chIndex) => {
      const globalIdx = startIndex + chIndex;
      if (!bookGroups[item.bookId]) {
        bookGroups[item.bookId] = {
          bookId: item.bookId,
          bookName: item.bookName,
          chapters: [],
          globalIndices: []
        };
      }
      bookGroups[item.bookId].chapters.push(item.chapter);
      bookGroups[item.bookId].globalIndices.push(globalIdx);
    });

    Object.keys(bookGroups).forEach(bId => {
      tasks.push(bookGroups[bId]);
    });

    return {
      step: stepNum,
      title: `${titlePrefix} ${stepNum}`,
      tasks: tasks,
      startIndex,
      endIndex,
      totalChapters: chunk.length
    };
  });
}

/**
 * Inicializa o estado dos planos de leitura e renderiza a interface.
 */
export function initReadingPlans() {
  loadState();
  state.activePlanId = null; // Sempre inicia mostrando os 4 planos ao carregar a página
  saveState();
  renderReadingPlans();
  setupEventListeners();
}

/**
 * Carrega o estado salvo do LocalStorage.
 */
function loadState() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      state = {
        activePlanId: null,
        progress: {},
        currentDay: {},
        annualMode: 'daily',
        annualCompletedChapters: [],
        annualCurrentStep: { daily: 1, weekly: 1, monthly: 1 },
        ...JSON.parse(saved)
      };
    }
  } catch (error) {
    console.error('Erro ao ler estado do plano de leitura do localStorage:', error);
  }
}

/**
 * Salva o estado atual no LocalStorage.
 */
function saveState() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Erro ao salvar estado do plano de leitura:', error);
  }
}

/**
 * Ativa um plano de leitura.
 * @param {string} planId - ID do plano a ser ativado.
 */
export function startPlan(planId) {
  state.activePlanId = planId;
  
  if (planId === 'annual_adjustable') {
    if (!state.annualMode) state.annualMode = 'daily';
    if (!state.annualCompletedChapters) state.annualCompletedChapters = [];
    if (!state.annualCurrentStep) state.annualCurrentStep = { daily: 1, weekly: 1, monthly: 1 };
  } else {
    if (!state.progress[planId]) {
      state.progress[planId] = [];
    }
    if (!state.currentDay[planId]) {
      state.currentDay[planId] = 1;
    }
  }
  
  saveState();
  renderReadingPlans();
}

/**
 * Desativa/Cancela o plano de leitura atual, voltando para o menu de seleção.
 */
export function abandonPlan() {
  state.activePlanId = null;
  saveState();
  renderReadingPlans();
}

/**
 * Reinicia o progresso de um plano de leitura específico.
 * @param {string} planId 
 */
export function resetPlanProgress(planId) {
  if (planId === 'annual_adjustable') {
    state.annualCompletedChapters = [];
    state.annualCurrentStep = { daily: 1, weekly: 1, monthly: 1 };
  } else {
    state.progress[planId] = [];
    state.currentDay[planId] = 1;
  }
  saveState();
  renderReadingPlans();
}

/**
 * Verifica se uma etapa do plano anual está concluída.
 */
function isAnnualStepCompleted(stepData) {
  return stepData.tasks.every(task => 
    task.globalIndices.every(idx => (state.annualCompletedChapters || []).includes(idx))
  );
}

/**
 * Conclui ou desmarca a conclusão de um dia específico do plano ativo.
 * @param {number} dayNumber - Número do dia a ser alterado.
 * @param {boolean} isCompleted - Status de conclusão.
 */
export function toggleDayCompleted(dayNumber, isCompleted) {
  const planId = state.activePlanId;
  if (!planId) return;

  if (planId === 'annual_adjustable') {
    const mode = state.annualMode || 'daily';
    const steps = getAnnualSteps(mode);
    const stepData = steps.find(s => s.step === dayNumber);
    if (stepData) {
      toggleAnnualStepCompleted(stepData, isCompleted);
    }
    return;
  }

  const completedDays = state.progress[planId] || [];
  const index = completedDays.indexOf(dayNumber);

  if (isCompleted) {
    if (index === -1) {
      completedDays.push(dayNumber);
      completedDays.sort((a, b) => a - b);
    }
    
    // Se completou o dia atual sugerido, avança o dia atual se houver próximos dias
    const plan = READING_PLANS.find(p => p.id === planId);
    if (state.currentDay[planId] === dayNumber && dayNumber < plan.duration) {
      state.currentDay[planId] = dayNumber + 1;
    }
  } else {
    if (index !== -1) {
      completedDays.splice(index, 1);
    }
    // Se desmarcou, define o dia atual como o mínimo dia incompleto para ajudar o usuário
    const plan = READING_PLANS.find(p => p.id === planId);
    let firstIncomplete = 1;
    for (let d = 1; d <= plan.duration; d++) {
      if (!completedDays.includes(d)) {
        firstIncomplete = d;
        break;
      }
    }
    state.currentDay[planId] = firstIncomplete;
  }

  state.progress[planId] = completedDays;
  saveState();
  renderReadingPlans();
}

/**
 * Conclui ou desmarca a conclusão de uma etapa inteira do plano anual.
 */
export function toggleAnnualStepCompleted(stepData, isCompleted) {
  if (!state.annualCompletedChapters) state.annualCompletedChapters = [];
  
  const indices = [];
  stepData.tasks.forEach(task => {
    indices.push(...task.globalIndices);
  });

  if (isCompleted) {
    indices.forEach(idx => {
      if (!state.annualCompletedChapters.includes(idx)) {
        state.annualCompletedChapters.push(idx);
      }
    });
    
    const mode = state.annualMode || 'daily';
    const steps = getAnnualSteps(mode);
    const currentStepNum = state.annualCurrentStep[mode] || 1;
    if (stepData.step === currentStepNum && currentStepNum < steps.length) {
      state.annualCurrentStep[mode] = currentStepNum + 1;
    }
  } else {
    state.annualCompletedChapters = state.annualCompletedChapters.filter(idx => !indices.includes(idx));
    
    const mode = state.annualMode || 'daily';
    const steps = getAnnualSteps(mode);
    let firstIncomplete = 1;
    for (const s of steps) {
      if (!isAnnualStepCompleted(s)) {
        firstIncomplete = s.step;
        break;
      }
    }
    state.annualCurrentStep[mode] = firstIncomplete;
  }

  saveState();
  renderReadingPlans();
}

/**
 * Conclui ou desmarca a conclusão de um capítulo individual no plano anual.
 */
export function toggleAnnualChapterCompleted(globalIdx, isCompleted) {
  if (!state.annualCompletedChapters) state.annualCompletedChapters = [];

  const idxNum = parseInt(globalIdx, 10);
  const exists = state.annualCompletedChapters.includes(idxNum);

  if (isCompleted && !exists) {
    state.annualCompletedChapters.push(idxNum);
  } else if (!isCompleted && exists) {
    state.annualCompletedChapters = state.annualCompletedChapters.filter(idx => idx !== idxNum);
  }

  // Ajusta o progresso sugerido caso necessário
  const mode = state.annualMode || 'daily';
  const steps = getAnnualSteps(mode);
  let firstIncomplete = 1;
  for (const s of steps) {
    if (!isAnnualStepCompleted(s)) {
      firstIncomplete = s.step;
      break;
    }
  }
  state.annualCurrentStep[mode] = firstIncomplete;

  saveState();
  renderReadingPlans();
}

/**
 * Altera a frequência do plano anual.
 */
export function setAnnualMode(mode) {
  state.annualMode = mode;
  saveState();
  renderReadingPlans();
}

/**
 * Renderiza o container de planos de leitura no HTML.
 */
export function renderReadingPlans() {
  const container = document.getElementById('reading-plans-section');
  if (!container) return;

  if (!state.activePlanId) {
    renderSelectionView(container);
  } else if (state.activePlanId === 'annual_adjustable') {
    const plan = READING_PLANS.find(p => p.id === state.activePlanId);
    renderAnnualPlanView(container, plan);
  } else {
    renderActivePlanView(container);
  }
}

/**
 * Renderiza a visualização de seleção de planos de leitura.
 */
function renderSelectionView(container) {
  let html = `
    <div class="plans-selection-card">
      <div class="plans-header">
        <div class="plans-badge">Novidade</div>
        <h2 class="plans-main-title">🎯 Planos de Leitura Diária</h2>
        <p class="plans-main-subtitle">Escolha um cronograma estruturado de leitura bíblica para manter a constância e enriquecer seu conhecimento.</p>
      </div>
      
      <div class="plans-grid">
  `;

  READING_PLANS.forEach(plan => {
    let completedCount = 0;
    let totalCount = plan.duration;
    let percentage = 0;
    let hasStarted = false;

    if (plan.id === 'annual_adjustable') {
      const completedChapters = state.annualCompletedChapters || [];
      completedCount = completedChapters.length;
      totalCount = 1189; // 1189 capítulos
      percentage = Math.round((completedCount / totalCount) * 100);
      hasStarted = completedCount > 0;
    } else {
      const completedDays = state.progress[plan.id] || [];
      completedCount = completedDays.length;
      percentage = Math.round((completedCount / totalCount) * 100);
      hasStarted = completedCount > 0;
    }

    html += `
      <div class="plan-option-card ${plan.id === 'annual_adjustable' ? 'special-plan-card' : ''}" id="plan-card-${plan.id}">
        <div class="plan-option-body">
          <div class="plan-meta-row">
            <span class="plan-duration-badge">
              ${plan.id === 'annual_adjustable' ? '👑 Ritmo Flexível' : `📅 ${plan.duration} ${plan.duration === 1 ? 'Dia' : 'Dias'}`}
            </span>
            ${hasStarted ? `<span class="plan-progress-badge">🔄 ${percentage}% concluído</span>` : '<span class="plan-not-started">Novo</span>'}
          </div>
          <h3 class="plan-option-title">${plan.name}</h3>
          <p class="plan-option-desc">${plan.description}</p>
          
          ${hasStarted ? `
            <div class="plan-option-progress-bar">
              <div class="plan-option-progress-fill" style="width: ${percentage}%;"></div>
            </div>
          ` : ''}
        </div>
        
        <div class="plan-option-footer">
          <button class="btn-start-plan btn-primary" data-plan-id="${plan.id}">
            ${hasStarted ? 'Continuar Plano ⚡' : 'Iniciar este Plano 🚀'}
          </button>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Renderiza a visualização do plano anual personalizado com ritmos.
 */
function renderAnnualPlanView(container, plan) {
  const allChapters = getAllChapters();
  const completedChapters = state.annualCompletedChapters || [];
  const totalBibleChapters = allChapters.length; // 1189
  const totalBiblePercentage = Math.round((completedChapters.length / totalBibleChapters) * 100);

  const mode = state.annualMode || 'daily';
  const steps = getAnnualSteps(mode);
  const currentStepNum = state.annualCurrentStep[mode] || 1;
  const currentStepData = steps.find(s => s.step === currentStepNum) || steps[0];

  const completedStepsCount = steps.filter(s => isAnnualStepCompleted(s)).length;
  const currentModePercentage = Math.round((completedStepsCount / steps.length) * 100);

  const isTodayCompleted = isAnnualStepCompleted(currentStepData);
  const isPlanFinished = completedChapters.length === totalBibleChapters;

  let modeLabel = 'Dias';
  let modeSingularLabel = 'Dia';
  let modeIntroText = 'Defina seu ritmo de leitura diário, semanal ou mensal para ler todos os 1189 capítulos da Bíblia em um ano!';
  if (mode === 'weekly') {
    modeLabel = 'Semanas';
    modeSingularLabel = 'Semana';
  } else if (mode === 'monthly') {
    modeLabel = 'Meses';
    modeSingularLabel = 'Mês';
  }

  let html = `
    <div class="active-plan-card annual-plan-card">
      <div class="active-plan-header">
        <div class="active-plan-title-group">
          <span class="active-plan-subtitle">👑 PLANO ANUAL PERSONALIZADO</span>
          <h2 class="active-plan-title">${plan.name}</h2>
          <p class="annual-intro-text">${modeIntroText}</p>
        </div>
        <div class="active-plan-actions">
          <button class="btn-plan-reset text-muted-btn" data-plan-id="${plan.id}" title="Reiniciar Progresso">🔄 Reiniciar</button>
          <button class="btn-plan-change text-muted-btn" title="Voltar para a seleção de planos">📋 Ver Outros Planos</button>
        </div>
      </div>

      <!-- Seletor de Ritmo -->
      <div class="annual-frequency-selector">
        <span class="selector-label">⏱️ Selecione seu ritmo:</span>
        <div class="frequency-tabs">
          <button class="btn-frequency-tab ${mode === 'daily' ? 'active' : ''}" data-mode="daily">
            <span class="tab-emoji">📅</span> Diário <span class="tab-meta">(365 dias)</span>
          </button>
          <button class="btn-frequency-tab ${mode === 'weekly' ? 'active' : ''}" data-mode="weekly">
            <span class="tab-emoji">📆</span> Semanal <span class="tab-meta">(52 semanas)</span>
          </button>
          <button class="btn-frequency-tab ${mode === 'monthly' ? 'active' : ''}" data-mode="monthly">
            <span class="tab-emoji">🗓️</span> Mensal <span class="tab-meta">(12 meses)</span>
          </button>
        </div>
      </div>

      <!-- Painel de Progresso Duplo -->
      <div class="annual-progress-dashboard">
        <div class="progress-subpanel">
          <div class="subpanel-header">
            <span>📖 Leitura Geral da Bíblia:</span>
            <strong>${completedChapters.length} de ${totalBibleChapters} capítulos (${totalBiblePercentage}%)</strong>
          </div>
          <div class="subpanel-bar">
            <div class="subpanel-fill bible-fill" style="width: ${totalBiblePercentage}%;"></div>
          </div>
        </div>

        <div class="progress-subpanel">
          <div class="subpanel-header">
            <span>📈 Progresso no ritmo ${mode === 'daily' ? 'Diário' : mode === 'weekly' ? 'Semanal' : 'Mensal'}:</span>
            <strong>${completedStepsCount} de ${steps.length} ${modeLabel.toLowerCase()} (${currentModePercentage}%)</strong>
          </div>
          <div class="subpanel-bar">
            <div class="subpanel-fill mode-fill" style="width: ${currentModePercentage}%;"></div>
          </div>
        </div>
      </div>

      <!-- Bloco de Leitura Ativo -->
      <div class="daily-task-box ${isTodayCompleted ? 'completed-day-bg' : ''}">
        <div class="daily-task-header">
          <div class="daily-day-indicator">
            <span class="day-number-circle gold-circle">${currentStepNum}</span>
            <div class="day-title-info">
              <h3>Sua Leitura de Hoje: ${currentStepData.title}</h3>
              <p class="text-secondary">${isTodayCompleted ? '✅ Excelente! Todos os capítulos desta etapa estão marcados como lidos.' : '📖 Marque as caixinhas individuais conforme for lendo ou conclua tudo de uma vez.'}</p>
            </div>
          </div>
          
          <div class="step-nav-and-toggle">
            <div class="step-nav-buttons">
              <button class="btn-step-nav" data-nav-step="${currentStepNum - 1}" ${currentStepNum <= 1 ? 'disabled' : ''} title="Etapa anterior">&larr;</button>
              <span class="step-nav-label">${currentStepNum} / ${steps.length}</span>
              <button class="btn-step-nav" data-nav-step="${currentStepNum + 1}" ${currentStepNum >= steps.length ? 'disabled' : ''} title="Próxima etapa">&rarr;</button>
            </div>

            <button class="btn-toggle-annual-step ${isTodayCompleted ? 'completed' : 'primary-action'}" 
                    data-completed="${isTodayCompleted}">
              ${isTodayCompleted ? '✓ Concluído' : `Concluir ${modeSingularLabel}`}
            </button>
          </div>
        </div>

        <div class="annual-chapters-list">
  `;

  currentStepData.tasks.forEach(task => {
    task.chapters.forEach((chap, idx) => {
      const globalIdx = task.globalIndices[idx];
      const isChapterRead = completedChapters.includes(globalIdx);

      html += `
        <div class="annual-chapter-row-item ${isChapterRead ? 'read' : ''}">
          <label class="annual-chapter-checkbox-label">
            <input type="checkbox" class="annual-chapter-checkbox" data-global-idx="${globalIdx}" ${isChapterRead ? 'checked' : ''} />
            <span class="custom-chapter-checkbox"></span>
          </label>
          <button class="btn-reading-chapter-link-inline" data-book-id="${task.bookId}" data-chapter="${chap}">
            <span class="chapter-icon-mini">📖</span>
            <span class="chapter-text-inline">${task.bookName} ${chap}</span>
          </button>
        </div>
      `;
    });
  });

  html += `
        </div>
      </div>

      <!-- Calendário de Etapas -->
      <div class="all-days-accordion">
        <details class="all-days-details">
          <summary class="all-days-summary">
            <span>📅 Ver Cronograma Completo (${steps.length} ${modeLabel.toLowerCase()})</span>
            <span class="summary-arrow">▼</span>
          </summary>
          <div class="all-days-content">
            <div class="days-list-grid">
  `;

  steps.forEach(s => {
    const isCompleted = isAnnualStepCompleted(s);
    const isCurrent = s.step === currentStepNum;
    
    // Calcula progresso numérico do passo
    const totalChaptersInStep = s.totalChapters;
    let readChaptersInStep = 0;
    s.tasks.forEach(task => {
      task.globalIndices.forEach(idx => {
        if (completedChapters.includes(idx)) {
          readChaptersInStep++;
        }
      });
    });

    const stepChaptersText = s.tasks.map(t => `${t.bookName} ` + (t.chapters.length > 1 ? `${t.chapters[0]}-${t.chapters[t.chapters.length - 1]}` : t.chapters[0])).join(', ');

    html += `
      <div class="day-row-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
        <label class="day-checkbox-label">
          <input type="checkbox" class="annual-step-status-checkbox" data-step-num="${s.step}" ${isCompleted ? 'checked' : ''} />
          <span class="custom-checkbox"></span>
          <span class="day-label-text">${modeSingularLabel} ${s.step}</span>
        </label>
        
        <div class="day-chapters-preview" title="Clique para focar nesta etapa" data-annual-step-jump="${s.step}">
          <strong>${s.title}</strong>
          <span class="chapters-text">${stepChaptersText}</span>
        </div>

        <div class="step-completion-fraction">
          ${readChaptersInStep}/${totalChaptersInStep} cap
        </div>

        <div class="day-arrow-jump" data-annual-step-jump="${s.step}" title="Visualizar esta etapa">
          🎯
        </div>
      </div>
    `;
  });

  html += `
            </div>
          </div>
        </details>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Renderiza a visualização do plano ativo atual com tarefas do dia e lista de progresso.
 */
function renderActivePlanView(container) {
  const plan = READING_PLANS.find(p => p.id === state.activePlanId);
  if (!plan) return;

  const completedDays = state.progress[plan.id] || [];
  const currentDayNum = state.currentDay[plan.id] || 1;
  const percentage = Math.round((completedDays.length / plan.duration) * 100);
  
  // Acha o dia de hoje
  const currentDayData = plan.days.find(d => d.day === currentDayNum) || plan.days[0];
  const isTodayCompleted = completedDays.includes(currentDayNum);
  const isPlanFinished = completedDays.length === plan.duration;

  let html = `
    <div class="active-plan-card">
      <div class="active-plan-header">
        <div class="active-plan-title-group">
          <span class="active-plan-subtitle">PLANO DE LEITURA ATIVO</span>
          <h2 class="active-plan-title">${plan.name}</h2>
        </div>
        <div class="active-plan-actions">
          <button class="btn-plan-reset text-muted-btn" data-plan-id="${plan.id}" title="Reiniciar Progresso">🔄 Reiniciar</button>
          <button class="btn-plan-change text-muted-btn" title="Voltar para a seleção de planos">📋 Ver Outros Planos</button>
        </div>
      </div>

      <div class="active-plan-progress-section">
        <div class="active-plan-progress-labels">
          <span>Progresso Geral: <strong>${completedDays.length} de ${plan.duration} dias</strong> (${percentage}%)</span>
          <span class="progress-congratulations">${isPlanFinished ? '🎉 Plano Concluído! Parabéns!' : ''}</span>
        </div>
        <div class="active-plan-progress-bar-container">
          <div class="active-plan-progress-fill" style="width: ${percentage}%;"></div>
        </div>
      </div>

      <!-- Bloco de Leitura do Dia -->
      <div class="daily-task-box ${isTodayCompleted ? 'completed-day-bg' : ''}">
        <div class="daily-task-header">
          <div class="daily-day-indicator">
            <span class="day-number-circle">${currentDayNum}</span>
            <div class="day-title-info">
              <h3>Tarefa de Leitura: ${currentDayData.title}</h3>
              <p class="text-secondary">${isTodayCompleted ? '✅ Você já completou as leituras de hoje!' : '📖 Clique em qualquer capítulo abaixo para abrir o texto e começar a leitura.'}</p>
            </div>
          </div>
          
          <button class="btn-toggle-day-status ${isTodayCompleted ? 'completed' : 'primary-action'}" 
                  data-day="${currentDayNum}" 
                  data-completed="${isTodayCompleted}">
            ${isTodayCompleted ? '✓ Concluído' : 'Marcar Dia como Concluído'}
          </button>
        </div>

        <div class="daily-chapters-grid">
  `;

  currentDayData.tasks.forEach(task => {
    task.chapters.forEach(chap => {
      html += `
        <button class="btn-reading-chapter-link" data-book-id="${task.bookId}" data-chapter="${chap}">
          <span class="chapter-badge">📖</span>
          <span class="chapter-name">${task.bookName} ${chap}</span>
        </button>
      `;
    });
  });

  html += `
        </div>
      </div>

      <!-- Seção Todos os Dias -->
      <div class="all-days-accordion">
        <details class="all-days-details">
          <summary class="all-days-summary">
            <span>📅 Ver Calendário Completo (${plan.duration} dias)</span>
            <span class="summary-arrow">▼</span>
          </summary>
          <div class="all-days-content">
            <div class="days-list-grid">
  `;

  plan.days.forEach(d => {
    const isCompleted = completedDays.includes(d.day);
    const isCurrent = d.day === currentDayNum;
    
    // Compila a listagem de capítulos de forma enxuta
    const chaptersText = d.tasks.map(t => `${t.bookName} ` + (t.chapters.length > 1 ? `${t.chapters[0]}-${t.chapters[t.chapters.length - 1]}` : t.chapters[0])).join(', ');

    html += `
      <div class="day-row-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
        <label class="day-checkbox-label">
          <input type="checkbox" class="day-status-checkbox" data-day="${d.day}" ${isCompleted ? 'checked' : ''} />
          <span class="custom-checkbox"></span>
          <span class="day-label-text">Dia ${d.day}</span>
        </label>
        
        <div class="day-chapters-preview" title="Clique para abrir e ler este dia" data-day-jump="${d.day}">
          <strong>${d.title}</strong>
          <span class="chapters-text">${chaptersText}</span>
        </div>

        <div class="day-arrow-jump" data-day-jump="${d.day}" title="Ir para as leituras deste dia">
          🎯
        </div>
      </div>
    `;
  });

  html += `
            </div>
          </div>
        </details>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Adiciona ouvintes de eventos delegados no container dos planos.
 */
function setupEventListeners() {
  const container = document.getElementById('reading-plans-section');
  if (!container) return;

  // Evita adicionar listeners múltiplos se init for chamado várias vezes
  if (container.dataset.hasListener === 'true') return;
  container.dataset.hasListener = 'true';

  container.addEventListener('click', (e) => {
    const target = e.target;

    // 1. Iniciar Plano
    const startBtn = target.closest('.btn-start-plan');
    if (startBtn) {
      const planId = startBtn.dataset.planId;
      startPlan(planId);
      return;
    }

    // 2. Trocar de Plano
    if (target.closest('.btn-plan-change')) {
      abandonPlan();
      return;
    }

    // 3. Reiniciar Plano
    const resetBtn = target.closest('.btn-plan-reset');
    if (resetBtn) {
      if (confirm('Tem certeza de que deseja reiniciar o progresso deste plano de leitura? Seus dados concluídos voltarão a zero.')) {
        const planId = resetBtn.dataset.planId;
        resetPlanProgress(planId);
      }
      return;
    }

    // 4. Marcar/Desmarcar Dia como Concluído (Planos padrão)
    const toggleStatusBtn = target.closest('.btn-toggle-day-status');
    if (toggleStatusBtn) {
      const dayNum = parseInt(toggleStatusBtn.dataset.day, 10);
      const isCompleted = toggleStatusBtn.dataset.completed === 'true';
      toggleDayCompleted(dayNum, !isCompleted);
      return;
    }

    // 5. Clique em capítulo para abrir no Leitor (Planos padrão)
    const chapterLinkBtn = target.closest('.btn-reading-chapter-link');
    if (chapterLinkBtn) {
      const bookId = chapterLinkBtn.dataset.bookId;
      const chapter = parseInt(chapterLinkBtn.dataset.chapter, 10);
      if (bookId && chapter) {
        openChapterReader(bookId, chapter);
      }
      return;
    }

    // 6. Navegar para um dia específico através do Calendário (Planos padrão)
    const dayJumpEl = target.closest('[data-day-jump]');
    if (dayJumpEl) {
      const dayNum = parseInt(dayJumpEl.dataset.dayJump, 10);
      const planId = state.activePlanId;
      if (planId) {
        state.currentDay[planId] = dayNum;
        saveState();
        renderReadingPlans();
      }
      return;
    }

    // ===== EVENTOS ESPECIFICOS DO PLANO ANUAL =====

    // A. Alternar Frequência/Modo do Plano Anual
    const freqTab = target.closest('.btn-frequency-tab');
    if (freqTab) {
      const mode = freqTab.dataset.mode;
      setAnnualMode(mode);
      return;
    }

    // B. Concluir Etapa Inteira do Plano Anual (Botão Grande)
    const toggleAnnualStepBtn = target.closest('.btn-toggle-annual-step');
    if (toggleAnnualStepBtn) {
      const isCompleted = toggleAnnualStepBtn.dataset.completed === 'true';
      const mode = state.annualMode || 'daily';
      const steps = getAnnualSteps(mode);
      const currentStepNum = state.annualCurrentStep[mode] || 1;
      const currentStepData = steps.find(s => s.step === currentStepNum) || steps[0];
      toggleAnnualStepCompleted(currentStepData, !isCompleted);
      return;
    }

    // C. Clique em capítulo individual para abrir o texto no Plano Anual
    const inlineChapterBtn = target.closest('.btn-reading-chapter-link-inline');
    if (inlineChapterBtn) {
      const bookId = inlineChapterBtn.dataset.bookId;
      const chapter = parseInt(inlineChapterBtn.dataset.chapter, 10);
      if (bookId && chapter) {
        openChapterReader(bookId, chapter);
      }
      return;
    }

    // D. Navegar pelas etapas do plano anual (< e >)
    const stepNavBtn = target.closest('.btn-step-nav');
    if (stepNavBtn) {
      const newStep = parseInt(stepNavBtn.dataset.navStep, 10);
      const mode = state.annualMode || 'daily';
      const steps = getAnnualSteps(mode);
      if (newStep >= 1 && newStep <= steps.length) {
        state.annualCurrentStep[mode] = newStep;
        saveState();
        renderReadingPlans();
      }
      return;
    }

    // E. Saltar etapa clicando na lista de cronograma do Plano Anual
    const annualStepJump = target.closest('[data-annual-step-jump]');
    if (annualStepJump) {
      const stepNum = parseInt(annualStepJump.dataset.annualStepJump, 10);
      const mode = state.annualMode || 'daily';
      state.annualCurrentStep[mode] = stepNum;
      saveState();
      renderReadingPlans();
      return;
    }
  });

  // Listener para checkboxes de dia no calendário padrão
  container.addEventListener('change', (e) => {
    const target = e.target;
    
    if (target.classList.contains('day-status-checkbox')) {
      const dayNum = parseInt(target.dataset.day, 10);
      const isChecked = target.checked;
      toggleDayCompleted(dayNum, isChecked);
      return;
    }

    // F. Checkbox individual de capítulo no Plano Anual
    if (target.classList.contains('annual-chapter-checkbox')) {
      const globalIdx = parseInt(target.dataset.globalIdx, 10);
      const isChecked = target.checked;
      toggleAnnualChapterCompleted(globalIdx, isChecked);
      return;
    }

    // G. Checkbox de etapa inteira no calendário do Plano Anual
    if (target.classList.contains('annual-step-status-checkbox')) {
      const stepNum = parseInt(target.dataset.stepNum, 10);
      const isChecked = target.checked;
      const mode = state.annualMode || 'daily';
      const steps = getAnnualSteps(mode);
      const stepData = steps.find(s => s.step === stepNum);
      if (stepData) {
        toggleAnnualStepCompleted(stepData, isChecked);
      }
      return;
    }
  });
}
