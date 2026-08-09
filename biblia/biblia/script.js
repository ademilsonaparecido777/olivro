/**
 * @fileoverview Ponto de entrada principal do aplicativo Leitor do Novo Testamento.
 * Inicializa os controladores de UI, gerenciamento de estado e ouvintes de eventos da aplicação.
 * @module mainScript
 */

import { initUI } from './js/uiController.js';

/**
 * Função executada automaticamente assim que a árvore DOM estiver totalmente carregada.
 * Inicializa a interface de usuário do leitor da Bíblia Sagrada.
 * @returns {void}
 */
function onDOMContentLoaded() {
  try {
    initUI();
    console.log('[Leitor do Novo Testamento] Aplicativo inicializado com sucesso em modo offline.');
  } catch (error) {
    console.error('[Leitor do Novo Testamento] Erro durante a inicialização:', error);
  }
}

// Registro do evento de carregamento do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
  onDOMContentLoaded();
}
