/**
 * @fileoverview Módulo Controlador de Interface do Usuário (UI Controller).
 * Gerencia a renderização de telas, navegação por breadcrumbs, eventos de clique,
 * barras de ferramentas, alteração de temas e interação com versículos.
 * @module uiController
 */

import { getBooksByTestament, getBookById, searchBooks, getBooksByGroup } from './booksData.js';
import { loadChapterVerses } from './dataLoader.js';
import {
  saveThemePreference, getThemePreference,
  saveFontSizePreference, getFontSizePreference,
  addReadingHistory, getReadingHistory, clearReadingHistory,
  toggleFavoriteVerse, isVerseFavorite, getFavoriteVerses,
  setVerseHighlight, getAllHighlights,
  saveVerseNote, getVerseNote, getAllNotes
} from './storageManager.js';
import {
  playAudioText, stopAudioText, pauseAudioText, resumeAudioText, setAudioRate,
  searchBibleContent, copyVerseToClipboard, shareVerse, getAiVerseInsight
} from './futureFeatures.js';
import { initReadingPlans, renderReadingPlans } from './readingPlans.js';

/**
 * Estado atual da navegação e visualização do aplicativo.
 * @type {{currentView: string, selectedBookId: string|null, selectedChapter: number|null, currentFontSize: number, activeVerse: Object|null, currentTestament: string}}
 */
export const appState = {
  currentView: 'home', // 'home' | 'books' | 'chapters' | 'reader'
  currentTestament: 'novo', // 'novo' | 'antigo'
  selectedBookId: null,
  selectedChapter: null,
  currentFontSize: getFontSizePreference(),
  activeVerse: null // Versículo atualmente selecionado pelo usuário
};

/**
 * Inicializa a interface de usuário, aplicando tema salvo, listeners de eventos e carregando a tela inicial.
 * @returns {void}
 */
export function initUI() {
  applySavedTheme();
  setupEventListeners();
  renderBreadcrumbs();
  showView('home');
  updateReadingStats();
  initReadingPlans();
}

/**
 * Aplica o tema visual (light ou dark) armazenado nas preferências do usuário.
 * @returns {void}
 */
export function applySavedTheme() {
  const theme = getThemePreference();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
}

/**
 * Alterna entre o tema claro (light) e escuro (dark), salvando no LocalStorage.
 * @returns {void}
 */
export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark-theme');
  const newTheme = isDark ? 'dark' : 'light';
  saveThemePreference(newTheme);
}

/**
 * Altera a tela exibida no aplicativo escondendo as outras com animação suave.
 *
 * @param {'home'|'books'|'chapters'|'reader'} viewName - Nome da tela de destino.
 * @returns {void}
 */
export function showView(viewName) {
  appState.currentView = viewName;

  const views = ['view-home', 'view-books', 'view-chapters', 'view-reader'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === `view-${viewName}`) {
        el.classList.remove('hidden');
        el.classList.add('active-view');
      } else {
        el.classList.add('hidden');
        el.classList.remove('active-view');
      }
    }
  });

  renderBreadcrumbs();
  if (viewName === 'home') {
    renderReadingPlans();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Atualiza e renderiza a barra de navegação breadcrumb com base no estado atual.
 * @returns {void}
 */
export function renderBreadcrumbs() {
  const container = document.getElementById('breadcrumb-bar');
  if (!container) return;

  if (appState.currentView === 'home') {
    container.style.display = 'none';
    return;
  } else {
    container.style.display = 'flex';
  }

  let html = `<button class="breadcrumb-item" data-action="go-home"><i class="icon-home"></i> Início</button>`;

  if (appState.currentView === 'books' || appState.selectedBookId) {
    html += `<span class="breadcrumb-separator">/</span>`;
    const testamentName = appState.currentTestament === 'antigo' ? 'Antigo Testamento' : 'Novo Testamento';
    html += `<button class="breadcrumb-item ${appState.currentView === 'books' ? 'active' : ''}" data-action="go-books">${testamentName}</button>`;
  }

  if (appState.selectedBookId && (appState.currentView === 'chapters' || appState.currentView === 'reader')) {
    const book = getBookById(appState.selectedBookId);
    if (book) {
      html += `<span class="breadcrumb-separator">/</span>`;
      html += `<button class="breadcrumb-item ${appState.currentView === 'chapters' ? 'active' : ''}" data-action="go-chapters" data-book-id="${book.id}">${book.name}</button>`;
    }
  }

  if (appState.selectedChapter && appState.currentView === 'reader') {
    html += `<span class="breadcrumb-separator">/</span>`;
    html += `<span class="breadcrumb-item active">Capítulo ${appState.selectedChapter}</span>`;
  }

  container.innerHTML = html;
}

/**
 * Renderiza a lista dos livros da Bíblia (Antigo ou Novo Testamento) na tela de livros.
 * Suporta filtragem por grupo de categorias e busca por texto.
 *
 * @param {string} [groupFilter='Todos'] - Categoria de filtro.
 * @param {string} [searchTerm=''] - Termo de busca rápida.
 * @returns {void}
 */
export function renderBooksList(groupFilter = 'Todos', searchTerm = '') {
  const container = document.getElementById('books-grid');
  if (!container) return;
  
  const titleEl = document.getElementById('books-section-title');
  if (titleEl) {
    titleEl.textContent = appState.currentTestament === 'antigo' ? 'Antigo Testamento' : 'Novo Testamento';
  }

  const allBooksForTestament = getBooksByTestament(appState.currentTestament);
  const groups = ['Todos', ...new Set(allBooksForTestament.map(b => b.group))];
  
  const pillsContainer = document.getElementById('category-pills-container');
  if (pillsContainer) {
    pillsContainer.innerHTML = groups.map(g => {
      const count = g === 'Todos' ? allBooksForTestament.length : allBooksForTestament.filter(b => b.group === g).length;
      const isActive = g === groupFilter ? 'active' : '';
      return `<button class="category-pill ${isActive}" data-group="${g}">${g} (${count})</button>`;
    }).join('');
  }

  let books = allBooksForTestament;

  if (groupFilter && groupFilter !== 'Todos') {
    books = getBooksByGroup(groupFilter, appState.currentTestament);
  }

  if (searchTerm && searchTerm.trim() !== '') {
    books = searchBooks(searchTerm, appState.currentTestament);
  }

  if (books.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Nenhum livro encontrado para o filtro selecionado.</p>
      </div>
    `;
    return;
  }

  let html = '';
  books.forEach(book => {
    html += `
      <div class="book-card" data-book-id="${book.id}">
        <div class="book-card-header">
          <span class="book-abbr">${book.abbreviation}</span>
          <span class="book-group-tag">${book.group}</span>
        </div>
        <h3 class="book-title">${book.name}</h3>
        <p class="book-chapters-count">${book.chapters} ${book.chapters === 1 ? 'Capítulo' : 'Capítulos'}</p>
        <button class="btn-read-book" data-book-id="${book.id}">
          Abrir Capítulos &rarr;
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Renderiza a tela com a lista de capítulos do livro selecionado.
 *
 * @param {string} bookId - Identificador do livro (ex: 'mateus').
 * @returns {void}
 */
export function openBookChapters(bookId) {
  const book = getBookById(bookId);
  if (!book) return;

  if (book.testament) {
    appState.currentTestament = book.testament;
  }

  appState.selectedBookId = book.id;
  appState.selectedChapter = null;

  const titleEl = document.getElementById('chapter-select-book-title');
  const infoEl = document.getElementById('chapter-select-book-info');
  const gridEl = document.getElementById('chapters-grid');

  if (titleEl) titleEl.textContent = book.name;
  if (infoEl) infoEl.textContent = `${book.group} • ${book.chapters} ${book.chapters === 1 ? 'Capítulo' : 'Capítulos'}`;

  if (gridEl) {
    let html = '';
    for (let i = 1; i <= book.chapters; i++) {
      html += `
        <button class="chapter-btn" data-book-id="${book.id}" data-chapter="${i}">
          ${i}
        </button>
      `;
    }
    gridEl.innerHTML = html;
  }

  showView('chapters');
}

/**
 * Carrega e exibe a tela do leitor de versículos para um livro e capítulo específicos.
 *
 * @param {string} bookId - ID do livro.
 * @param {number} chapter - Número do capítulo.
 * @returns {Promise<void>}
 */
export async function openChapterReader(bookId, chapter) {
  const book = getBookById(bookId);
  if (book && book.testament) {
    appState.currentTestament = book.testament;
  }

  appState.selectedBookId = bookId;
  appState.selectedChapter = chapter;

  showView('reader');

  const container = document.getElementById('verses-container');
  const titleEl = document.getElementById('reader-chapter-title');

  if (container) {
    container.innerHTML = `
      <div class="loading-spinner-container">
        <div class="spinner"></div>
        <p>Carregando capítulo ${chapter}...</p>
      </div>
    `;
  }

  // Registra no histórico de leitura
  if (book) {
    addReadingHistory(book.id, book.name, chapter);
    if (titleEl) titleEl.textContent = `${book.name} ${chapter}`;
    updateReadingProgress(book, chapter);
  }

  // Carrega os dados do JSON via dataLoader
  const chapterData = await loadChapterVerses(bookId, chapter);
  renderVerses(chapterData);
  updateReaderNavigationButtons(chapterData.totalChapters);
}

/**
 * Renderiza os versículos carregados na tela do leitor de versículos.
 *
 * @param {{bookName: string, bookId: string, chapter: number, totalChapters: number, verses: Array<{number: number, text: string}>, isPlaceholder?: boolean}} data
 * @returns {void}
 */
export function renderVerses(data) {
  const container = document.getElementById('verses-container');
  if (!container) return;

  const highlights = getAllHighlights();
  const notes = getAllNotes();

  let html = '';

  if (data.isPlaceholder) {
    html += `
      <div class="json-info-banner">
        <div class="json-info-header">
          <i class="icon-info"></i>
          <span>Aviso do Desenvolvedor: Estrutura Pronta</span>
        </div>
        <p>O arquivo JSON para <strong>${data.bookName} ${data.chapter}</strong> ainda não foi colocado na pasta <code>/data/</code>.</p>
        <p class="json-path-tip">Crie o arquivo em: <code>/data/${appState.currentTestament}/${data.bookId}.json</code> ou <code>/data/${appState.currentTestament}/${data.bookId}/${data.chapter}.json</code></p>
      </div>
    `;
  }

  data.verses.forEach(v => {
    const verseKey = `${data.bookId}_${data.chapter}_${v.number}`;
    const highlightClass = highlights[verseKey] || '';
    const hasNote = !!notes[verseKey];
    const isFav = isVerseFavorite(data.bookId, data.chapter, v.number);

    html += `
      <div class="verse-item ${highlightClass}"
           data-book-id="${data.bookId}"
           data-book-name="${data.bookName}"
           data-chapter="${data.chapter}"
           data-verse-number="${v.number}"
           data-verse-text="${v.text}">
        <span class="verse-number">${v.number}</span>
        <span class="verse-text" style="font-size: ${appState.currentFontSize}px;">${v.text}</span>
        <div class="verse-badges">
          ${isFav ? '<span class="badge-fav" title="Favorito">★</span>' : ''}
          ${hasNote ? '<span class="badge-note" title="Tem Anotação">📝</span>' : ''}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Atualiza o estado dos botões de navegação Anterior/Próximo Capítulo no leitor.
 *
 * @param {number} totalChapters - Total de capítulos do livro atual.
 * @returns {void}
 */
export function updateReaderNavigationButtons(totalChapters) {
  const btnPrev = document.getElementById('btn-prev-chapter');
  const btnNext = document.getElementById('btn-next-chapter');
  const btnPrevBottom = document.getElementById('btn-prev-chapter-bottom');
  const btnNextBottom = document.getElementById('btn-next-chapter-bottom');

  if (btnPrev) {
    btnPrev.disabled = (appState.selectedChapter <= 1);
  }
  if (btnNext) {
    btnNext.disabled = (appState.selectedChapter >= totalChapters);
  }
  if (btnPrevBottom) {
    btnPrevBottom.disabled = (appState.selectedChapter <= 1);
  }
  if (btnNextBottom) {
    btnNextBottom.disabled = (appState.selectedChapter >= totalChapters);
  }
}

/**
 * Atualiza o indicador visual de progresso de leitura do livro atual.
 *
 * @param {Object} book - O objeto do livro.
 * @param {number} chapter - O capítulo atual.
 * @returns {void}
 */
export function updateReadingProgress(book, chapter) {
  if (!book) return;

  const totalChapters = book.chapters;
  const currentChapter = parseInt(chapter, 10);
  
  // Porcentagem calculada: (capítulo_atual / total_capítulos) * 100
  const percentage = Math.min(100, Math.max(0, Math.round((currentChapter / totalChapters) * 100)));

  const fillEl = document.getElementById('reading-progress-fill');
  const percentEl = document.getElementById('reading-progress-percentage');
  const nameEl = document.getElementById('reading-progress-book-name');

  if (fillEl) {
    fillEl.style.width = `${percentage}%`;
  }
  if (percentEl) {
    percentEl.textContent = `${percentage}%`;
  }
  if (nameEl) {
    nameEl.textContent = `Progresso em ${book.name} (Capítulo ${currentChapter} de ${totalChapters})`;
  }
}

/**
 * Ajusta o tamanho da fonte do texto dos versículos no leitor.
 *
 * @param {number} delta - Valor de alteração (ex: +2 ou -2 pixels).
 * @returns {void}
 */
export function adjustFontSize(delta) {
  let newSize = appState.currentFontSize + delta;
  if (newSize < 14) newSize = 14;
  if (newSize > 32) newSize = 32;

  appState.currentFontSize = newSize;
  saveFontSizePreference(newSize);

  const verseTexts = document.querySelectorAll('.verse-text');
  verseTexts.forEach(el => {
    el.style.fontSize = `${newSize}px`;
  });
}

/**
 * Exibe o menu modal de ações para um versículo selecionado pelo usuário.
 *
 * @param {HTMLElement} verseElement - Elemento HTML do versículo clicado.
 * @returns {void}
 */
export function openVerseActionModal(verseElement) {
  const bookId = verseElement.getAttribute('data-book-id');
  const bookName = verseElement.getAttribute('data-book-name');
  const chapter = parseInt(verseElement.getAttribute('data-chapter'), 10);
  const verseNumber = parseInt(verseElement.getAttribute('data-verse-number'), 10);
  const verseText = verseElement.getAttribute('data-verse-text');

  appState.activeVerse = { bookId, bookName, chapter, verseNumber, verseText, element: verseElement };

  const modal = document.getElementById('modal-verse-actions');
  const titleEl = document.getElementById('modal-verse-title');
  const textEl = document.getElementById('modal-verse-body-text');

  if (titleEl) titleEl.textContent = `${bookName} ${chapter}:${verseNumber}`;
  if (textEl) textEl.textContent = `"${verseText}"`;

  // Atualizar estado do botão de favorito no modal
  const isFav = isVerseFavorite(bookId, chapter, verseNumber);
  const favBtn = document.getElementById('btn-modal-favorite');
  if (favBtn) {
    favBtn.innerHTML = isFav ? '<i class="icon-star-filled"></i> Remover dos Favoritos' : '<i class="icon-star"></i> Adicionar aos Favoritos';
  }

  // Atualizar campo de anotações prévias
  const existingNote = getVerseNote(bookId, chapter, verseNumber);
  const noteInput = document.getElementById('verse-note-textarea');
  if (noteInput) {
    noteInput.value = existingNote || '';
  }

  if (modal) modal.classList.remove('hidden');
}

/**
 * Fecha qualquer janela modal aberta.
 * @returns {void}
 */
export function closeModals() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(m => m.classList.add('hidden'));
}

/**
 * Atualiza o painel de histórico de leitura recente.
 * @returns {void}
 */
export function renderHistoryModal() {
  const container = document.getElementById('history-list');
  if (!container) return;

  const history = getReadingHistory();

  if (history.length === 0) {
    container.innerHTML = `<p class="empty-msg">Nenhum histórico de leitura recente.</p>`;
    return;
  }

  let html = '';
  history.forEach(item => {
    const dateFormatted = new Date(item.timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    html += `
      <div class="history-item" data-book-id="${item.bookId}" data-chapter="${item.chapter}">
        <div class="history-info">
          <strong>${item.bookName} ${item.chapter}</strong>
          <span class="history-date">${dateFormatted}</span>
        </div>
        <button class="btn-history-open" data-book-id="${item.bookId}" data-chapter="${item.chapter}">
          Ler &rarr;
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Renderiza o painel modal com a lista de versículos favoritados pelo usuário.
 * @returns {void}
 */
export function renderFavoritesModal() {
  const container = document.getElementById('favorites-list');
  if (!container) return;

  const favorites = getFavoriteVerses();

  if (favorites.length === 0) {
    container.innerHTML = `<p class="empty-msg">Nenhum versículo favoritado ainda.</p>`;
    return;
  }

  let html = '';
  favorites.forEach(fav => {
    html += `
      <div class="favorite-card" data-book-id="${fav.bookId}" data-chapter="${fav.chapter}">
        <div class="favorite-header">
          <strong>${fav.bookName} ${fav.chapter}:${fav.verseNumber}</strong>
          <button class="btn-remove-fav" data-key="${fav.key}" data-book-id="${fav.bookId}" data-chapter="${fav.chapter}" data-verse="${fav.verseNumber}">✕</button>
        </div>
        <p class="favorite-text">"${fav.verseText}"</p>
        <button class="btn-fav-goto" data-book-id="${fav.bookId}" data-chapter="${fav.chapter}">
          Ir para o Capítulo &rarr;
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Atualiza pequenos indicadores de estatísticas na tela inicial (ex: histórico recente, contagem de favoritos).
 * @returns {void}
 */
export function updateReadingStats() {
  const history = getReadingHistory();
  const lastReadEl = document.getElementById('home-last-read');
  if (lastReadEl && history.length > 0) {
    const last = history[0];
    lastReadEl.innerHTML = `
      <div class="continue-card" data-book-id="${last.bookId}" data-chapter="${last.chapter}">
        <span>Continuar Leitura</span>
        <strong>${last.bookName} ${last.chapter}</strong>
      </div>
    `;
  }
}

/**
 * Configura todos os ouvintes de eventos da interface do usuário (event delegation e listeners).
 * @returns {void}
 */
export function setupEventListeners() {
  // Clique global com delegação de eventos
  document.addEventListener('click', async (e) => {
    const target = e.target;

    // Abrir Novo Testamento (Tela Inicial)
    if (target.closest('#btn-novo-testamento')) {
      appState.currentTestament = 'novo';
      renderBooksList();
      showView('books');
      return;
    }

    // Abrir Antigo Testamento (Tela Inicial)
    if (target.closest('#btn-antigo-testamento')) {
      appState.currentTestament = 'antigo';
      renderBooksList();
      showView('books');
      return;
    }

    // Atalhos Rápidos por Categorias/Seções (Tela Inicial)
    const categoryShortcutBtn = target.closest('.btn-category-shortcut');
    if (categoryShortcutBtn) {
      const testament = categoryShortcutBtn.getAttribute('data-testament');
      const group = categoryShortcutBtn.getAttribute('data-group');
      if (testament && group) {
        appState.currentTestament = testament;
        showView('books');
        renderBooksList(group);
      }
      return;
    }

    // Navegação via Breadcrumb "go-books" (preserva o testamento atual)
    if (target.closest('[data-action="go-books"]')) {
      renderBooksList();
      showView('books');
      return;
    }

    // Filtro por pílulas (categoria)
    if (target.closest('.category-pill')) {
      const pill = target.closest('.category-pill');
      const group = pill.getAttribute('data-group');
      const searchVal = document.getElementById('search-books-input')?.value || '';
      renderBooksList(group, searchVal);
      return;
    }

    // Ir para tela inicial
    if (target.closest('[data-action="go-home"]')) {
      showView('home');
      return;
    }

    // Ir para capítulos do livro
    if (target.closest('[data-action="go-chapters"]')) {
      const btn = target.closest('[data-action="go-chapters"]');
      const bookId = btn.getAttribute('data-book-id');
      openBookChapters(bookId);
      return;
    }

    // Clique em card de livro
    const bookCard = target.closest('.book-card') || target.closest('.btn-read-book');
    if (bookCard && !target.closest('.modal-overlay')) {
      const bookId = bookCard.getAttribute('data-book-id');
      if (bookId) {
        openBookChapters(bookId);
      }
      return;
    }

    // Clique em botão de capítulo
    const chapterBtn = target.closest('.chapter-btn');
    if (chapterBtn) {
      const bookId = chapterBtn.getAttribute('data-book-id');
      const chapter = parseInt(chapterBtn.getAttribute('data-chapter'), 10);
      openChapterReader(bookId, chapter);
      return;
    }

    // Clique em versículo para abrir opções
    const verseEl = target.closest('.verse-item');
    if (verseEl && appState.currentView === 'reader') {
      openVerseActionModal(verseEl);
      return;
    }

    // Alternar Tema
    if (target.closest('#btn-theme-toggle')) {
      toggleTheme();
      return;
    }

    // Botões do leitor (Fonte, Navegação, Áudio)
    if (target.closest('#btn-font-increase')) {
      adjustFontSize(+2);
      return;
    }
    if (target.closest('#btn-font-decrease')) {
      adjustFontSize(-2);
      return;
    }
    if (target.closest('.btn-prev-chapter') || target.closest('#btn-prev-chapter')) {
      if (appState.selectedBookId && appState.selectedChapter > 1) {
        openChapterReader(appState.selectedBookId, appState.selectedChapter - 1);
      }
      return;
    }
    if (target.closest('.btn-next-chapter') || target.closest('#btn-next-chapter')) {
      if (appState.selectedBookId) {
        openChapterReader(appState.selectedBookId, appState.selectedChapter + 1);
      }
      return;
    }

    // Botão de Áudio no Leitor
    if (target.closest('#btn-play-audio')) {
      const verses = document.querySelectorAll('.verse-text');
      let fullText = '';
      verses.forEach(v => { fullText += v.textContent + ' '; });

      if (fullText.trim()) {
        playAudioText(fullText, () => {
          document.getElementById('audio-bar')?.classList.add('hidden');
        });
        document.getElementById('audio-bar')?.classList.remove('hidden');
      }
      return;
    }

    // Controles do player de áudio flutuante
    if (target.closest('#btn-audio-stop')) {
      stopAudioText();
      document.getElementById('audio-bar')?.classList.add('hidden');
      return;
    }
    if (target.closest('#btn-audio-pause')) {
      pauseAudioText();
      return;
    }
    if (target.closest('#btn-audio-resume')) {
      resumeAudioText();
      return;
    }

    // Modais - Abrir
    if (target.closest('#btn-search')) {
      document.getElementById('modal-search')?.classList.remove('hidden');
      document.getElementById('search-input-modal')?.focus();
      return;
    }
    if (target.closest('#btn-favorites')) {
      renderFavoritesModal();
      document.getElementById('modal-favorites')?.classList.remove('hidden');
      return;
    }
    if (target.closest('#btn-history')) {
      renderHistoryModal();
      document.getElementById('modal-history')?.classList.remove('hidden');
      return;
    }
    // Modais - Fechar
    if (target.closest('.btn-close-modal') || target.classList.contains('modal-overlay')) {
      closeModals();
      return;
    }

    // Ações do Modal de Versículo Selecionado
    if (target.closest('#btn-modal-favorite')) {
      if (appState.activeVerse) {
        const { bookId, bookName, chapter, verseNumber, verseText } = appState.activeVerse;
        toggleFavoriteVerse(bookId, bookName, chapter, verseNumber, verseText);
        openChapterReader(bookId, chapter); // Recarrega para atualizar badges
        closeModals();
      }
      return;
    }

    if (target.closest('#btn-modal-copy')) {
      if (appState.activeVerse) {
        const { bookName, chapter, verseNumber, verseText } = appState.activeVerse;
        const success = await copyVerseToClipboard(bookName, chapter, verseNumber, verseText);
        if (success) {
          alert('Versículo copiado com sucesso!');
        }
        closeModals();
      }
      return;
    }

    if (target.closest('#btn-modal-share')) {
      if (appState.activeVerse) {
        const { bookName, chapter, verseNumber, verseText } = appState.activeVerse;
        await shareVerse(bookName, chapter, verseNumber, verseText);
        closeModals();
      }
      return;
    }

    if (target.closest('#btn-modal-ai-explain')) {
      if (appState.activeVerse) {
        const { bookName, chapter, verseNumber, verseText } = appState.activeVerse;
        const resultContainer = document.getElementById('ai-explanation-content');
        if (resultContainer) {
          resultContainer.innerHTML = `<div class="spinner"></div> Analisando passagem com inteligência artificial...`;
        }
        document.getElementById('modal-ai')?.classList.remove('hidden');

        const insight = await getAiVerseInsight(bookName, chapter, verseNumber, verseText);
        if (resultContainer) {
          resultContainer.innerHTML = insight;
        }
      }
      return;
    }

    if (target.closest('#btn-modal-save-note')) {
      if (appState.activeVerse) {
        const { bookId, chapter, verseNumber } = appState.activeVerse;
        const noteText = document.getElementById('verse-note-textarea')?.value;
        saveVerseNote(bookId, chapter, verseNumber, noteText);
        openChapterReader(bookId, chapter);
        closeModals();
      }
      return;
    }

    // Cor de destaque (Highlight)
    const colorBtn = target.closest('.color-picker-btn');
    if (colorBtn && appState.activeVerse) {
      const colorClass = colorBtn.getAttribute('data-color');
      const { bookId, chapter, verseNumber } = appState.activeVerse;
      setVerseHighlight(bookId, chapter, verseNumber, colorClass);
      openChapterReader(bookId, chapter);
      closeModals();
      return;
    }

    // Ir para do histórico ou favorito
    const gotoBtn = target.closest('.btn-fav-goto') || target.closest('.btn-history-open');
    if (gotoBtn) {
      const bookId = gotoBtn.getAttribute('data-book-id');
      const chapter = parseInt(gotoBtn.getAttribute('data-chapter'), 10);
      closeModals();
      openChapterReader(bookId, chapter);
      return;
    }

    // Limpar Histórico
    if (target.closest('#btn-clear-history')) {
      clearReadingHistory();
      renderHistoryModal();
      updateReadingStats();
      return;
    }
  });

  // Campo de busca rápida de livros
  const booksSearchInput = document.getElementById('search-books-input');
  if (booksSearchInput) {
    booksSearchInput.addEventListener('input', (e) => {
      const activePill = document.querySelector('.category-pill.active');
      const group = activePill ? activePill.getAttribute('data-group') : 'Todos';
      renderBooksList(group, e.target.value);
    });
  }

  // Busca Geral no Modal
  const modalSearchInput = document.getElementById('search-input-modal');
  if (modalSearchInput) {
    let timeout = null;
    modalSearchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const query = e.target.value;
        const resultsContainer = document.getElementById('search-results-list');
        if (!resultsContainer) return;

        if (!query || query.trim().length < 2) {
          resultsContainer.innerHTML = '<p class="empty-msg">Digite pelo menos 2 caracteres para pesquisar.</p>';
          return;
        }

        resultsContainer.innerHTML = '<div class="spinner"></div> Pesquisando nos arquivos JSON...';
        const results = await searchBibleContent(query);

        if (results.length === 0) {
          resultsContainer.innerHTML = '<p class="empty-msg">Nenhum versículo encontrado nos arquivos JSON carregados.</p>';
          return;
        }

        let html = '';
        results.forEach(res => {
          html += `
            <div class="search-result-item" data-book-id="${res.bookId}" data-chapter="${res.chapter}">
              <strong>${res.bookName} ${res.chapter}:${res.verseNumber}</strong>
              <p>"${res.text}"</p>
            </div>
          `;
        });
        resultsContainer.innerHTML = html;
      }, 300);
    });
  }
}
