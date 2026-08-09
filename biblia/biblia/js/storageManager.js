/**
 * @fileoverview Módulo responsável pelo gerenciamento de persistência local (LocalStorage).
 * Armazena histórico de leitura, favoritos, marcações, anotações e preferências do usuário.
 * @module storageManager
 */

const STORAGE_KEYS = {
  THEME: 'biblia_nt_theme',
  FONT_SIZE: 'biblia_nt_font_size',
  HISTORY: 'biblia_nt_history',
  FAVORITES: 'biblia_nt_favorites',
  BOOKMARKS: 'biblia_nt_bookmarks',
  HIGHLIGHTS: 'biblia_nt_highlights',
  NOTES: 'biblia_nt_notes'
};

/**
 * Salva a preferência do tema do aplicativo (dark ou light).
 * @param {string} theme - Nome do tema ('dark' ou 'light').
 * @returns {void}
 */
export function saveThemePreference(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Erro ao salvar tema no localStorage:', error);
  }
}

/**
 * Obtém a preferência do tema salva pelo usuário.
 * @returns {string} Retorna 'dark' ou 'light' (padrão: 'light').
 */
export function getThemePreference() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  } catch (error) {
    console.error('Erro ao ler tema do localStorage:', error);
    return 'light';
  }
}

/**
 * Salva o tamanho de fonte preferido para o leitor de versículos.
 * @param {number} size - Tamanho da fonte em pixels (ex: 18).
 * @returns {void}
 */
export function saveFontSizePreference(size) {
  try {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, String(size));
  } catch (error) {
    console.error('Erro ao salvar tamanho de fonte:', error);
  }
}

/**
 * Obtém o tamanho de fonte configurado pelo usuário.
 * @returns {number} Tamanho em pixels (padrão: 18).
 */
export function getFontSizePreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    return saved ? parseInt(saved, 10) : 18;
  } catch (error) {
    return 18;
  }
}

/**
 * Adiciona um registro ao histórico de leitura recente do usuário.
 * Mantém no máximo os 20 últimos capítulos acessados.
 * @param {string} bookId - ID do livro (ex: 'mateus').
 * @param {string} bookName - Nome legível do livro (ex: 'Mateus').
 * @param {number} chapter - Número do capítulo.
 * @returns {Array<Object>} Lista atualizada do histórico.
 */
export function addReadingHistory(bookId, bookName, chapter) {
  try {
    const history = getReadingHistory();
    // Remover duplicados prévios do mesmo livro/capítulo
    const filtered = history.filter(item => !(item.bookId === bookId && item.chapter === chapter));
    
    const newItem = {
      bookId,
      bookName,
      chapter,
      timestamp: new Date().toISOString()
    };
    
    // Inserir no início e limitar a 20 itens
    filtered.unshift(newItem);
    const updatedHistory = filtered.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Erro ao registrar histórico de leitura:', error);
    return [];
  }
}

/**
 * Obtém a lista completa do histórico de leitura.
 * @returns {Array<{bookId: string, bookName: string, chapter: number, timestamp: string}>}
 */
export function getReadingHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao recuperar histórico:', error);
    return [];
  }
}

/**
 * Limpa todo o histórico de leitura do usuário.
 * @returns {void}
 */
export function clearReadingHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
}

/**
 * Alterna um versículo como favorito (adiciona se não existir, remove se já for favorito).
 * @param {string} bookId - ID do livro.
 * @param {string} bookName - Nome do livro.
 * @param {number} chapter - Número do capítulo.
 * @param {number} verseNumber - Número do versículo.
 * @param {string} verseText - Texto do versículo.
 * @returns {boolean} Retorna true se foi adicionado, false se foi removido.
 */
export function toggleFavoriteVerse(bookId, bookName, chapter, verseNumber, verseText) {
  try {
    const favorites = getFavoriteVerses();
    const verseKey = `${bookId}_${chapter}_${verseNumber}`;
    const index = favorites.findIndex(item => item.key === verseKey);

    if (index >= 0) {
      // Já é favorito, remover
      favorites.splice(index, 1);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return false;
    } else {
      // Adicionar
      favorites.unshift({
        key: verseKey,
        bookId,
        bookName,
        chapter,
        verseNumber,
        verseText,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return true;
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    return false;
  }
}

/**
 * Verifica se um versículo específico está marcado como favorito.
 * @param {string} bookId - ID do livro.
 * @param {number} chapter - Número do capítulo.
 * @param {number} verseNumber - Número do versículo.
 * @returns {boolean} True se for favorito, false caso contrário.
 */
export function isVerseFavorite(bookId, chapter, verseNumber) {
  try {
    const favorites = getFavoriteVerses();
    const verseKey = `${bookId}_${chapter}_${verseNumber}`;
    return favorites.some(item => item.key === verseKey);
  } catch (error) {
    return false;
  }
}

/**
 * Obtém todos os versículos favoritados pelo usuário.
 * @returns {Array<Object>} Lista de versículos favoritos.
 */
export function getFavoriteVerses() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao recuperar favoritos:', error);
    return [];
  }
}

/**
 * Salva a marcação de cor de destaque em um versículo.
 * @param {string} bookId - ID do livro.
 * @param {number} chapter - Número do capítulo.
 * @param {number} verseNumber - Número do versículo.
 * @param {string|null} colorClass - Classe de cor (ex: 'highlight-yellow', 'highlight-green', etc) ou null para remover.
 * @returns {void}
 */
export function setVerseHighlight(bookId, chapter, verseNumber, colorClass) {
  try {
    const highlights = getAllHighlights();
    const key = `${bookId}_${chapter}_${verseNumber}`;
    
    if (!colorClass) {
      delete highlights[key];
    } else {
      highlights[key] = colorClass;
    }
    
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
  } catch (error) {
    console.error('Erro ao salvar marcação de versículo:', error);
  }
}

/**
 * Obtém todas as marcações de cor registradas.
 * @returns {Object<string, string>} Objeto com chaves do tipo 'bookId_chap_verse' e valor da cor.
 */
export function getAllHighlights() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
}

/**
 * Salva uma anotação ou comentário em um versículo específico.
 * @param {string} bookId - ID do livro.
 * @param {number} chapter - Número do capítulo.
 * @param {number} verseNumber - Número do versículo.
 * @param {string} noteText - Texto da anotação do usuário.
 * @returns {void}
 */
export function saveVerseNote(bookId, chapter, verseNumber, noteText) {
  try {
    const notes = getAllNotes();
    const key = `${bookId}_${chapter}_${verseNumber}`;
    
    if (!noteText || noteText.trim() === '') {
      delete notes[key];
    } else {
      notes[key] = {
        text: noteText.trim(),
        updatedAt: new Date().toISOString()
      };
    }
    
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('Erro ao salvar anotação do versículo:', error);
  }
}

/**
 * Obtém a anotação registrada para um versículo específico.
 * @param {string} bookId - ID do livro.
 * @param {number} chapter - Número do capítulo.
 * @param {number} verseNumber - Número do versículo.
 * @returns {string|null} Texto da anotação ou null se não houver.
 */
export function getVerseNote(bookId, chapter, verseNumber) {
  try {
    const notes = getAllNotes();
    const key = `${bookId}_${chapter}_${verseNumber}`;
    return notes[key] ? notes[key].text : null;
  } catch (error) {
    return null;
  }
}

/**
 * Obtém todas as anotações salvas pelo usuário.
 * @returns {Object<string, {text: string, updatedAt: string}>} Objeto com as anotações.
 */
export function getAllNotes() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
}
