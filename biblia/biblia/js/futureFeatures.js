/**
 * @fileoverview Módulo contendo a lógica para as funcionalidades avançadas e futuras da aplicação:
 * Pesquisa, Áudio (Sintetizador de Voz), Assistente de IA, Compartilhamento e Marcações.
 * @module futureFeatures
 */

import { ALL_BOOKS } from './booksData.js';
import { fetchJsonFile } from './dataLoader.js';

/**
 * Instância ativa da síntese de voz para leitura de áudio dos capítulos e versículos.
 * @type {SpeechSynthesisUtterance|null}
 */
let currentUtterance = null;

/**
 * Estado atual da reprodução de áudio.
 * @type {{isPlaying: boolean, isPaused: boolean, currentRate: number}}
 */
export const audioState = {
  isPlaying: false,
  isPaused: false,
  currentRate: 1.0
};

/**
 * Inicia a leitura em áudio (Text-to-Speech) de um texto ou capítulo bíblico.
 * Utiliza a API nativa Web Speech Synthesis em Português (pt-BR).
 *
 * @param {string} textToRead - Texto completo a ser lido.
 * @param {Function} [onEndCallback] - Callback executado quando a leitura terminar.
 * @returns {boolean} True se a leitura iniciou com sucesso, false caso contrário.
 */
export function playAudioText(textToRead, onEndCallback) {
  if (!('speechSynthesis' in window)) {
    alert('A leitura de áudio por sintetizador não é suportada neste navegador.');
    return false;
  }

  // Parar qualquer reprodução anterior
  stopAudioText();

  currentUtterance = new SpeechSynthesisUtterance(textToRead);
  currentUtterance.lang = 'pt-BR';
  currentUtterance.rate = audioState.currentRate;

  currentUtterance.onend = () => {
    audioState.isPlaying = false;
    audioState.isPaused = false;
    if (typeof onEndCallback === 'function') {
      onEndCallback();
    }
  };

  currentUtterance.onerror = (e) => {
    console.error('Erro na síntese de voz:', e);
    audioState.isPlaying = false;
    audioState.isPaused = false;
  };

  window.speechSynthesis.speak(currentUtterance);
  audioState.isPlaying = true;
  audioState.isPaused = false;
  return true;
}

/**
 * Pausa a reprodução atual de áudio.
 * @returns {void}
 */
export function pauseAudioText() {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    audioState.isPaused = true;
    audioState.isPlaying = false;
  }
}

/**
 * Retoma a reprodução pausada de áudio.
 * @returns {void}
 */
export function resumeAudioText() {
  if ('speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    audioState.isPaused = false;
    audioState.isPlaying = true;
  }
}

/**
 * Interrompe completamente a reprodução de áudio.
 * @returns {void}
 */
export function stopAudioText() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    audioState.isPlaying = false;
    audioState.isPaused = false;
  }
}

/**
 * Altera a velocidade da leitura em áudio.
 * @param {number} rate - Fator de velocidade (ex: 0.8, 1.0, 1.25, 1.5).
 * @returns {void}
 */
export function setAudioRate(rate) {
  audioState.currentRate = rate;
  if (currentUtterance) {
    currentUtterance.rate = rate;
  }
}

/**
 * Realiza a busca de palavras ou trechos nos arquivos JSON disponíveis.
 * Procura termos nos livros do Novo Testamento.
 *
 * @param {string} query - Palavra ou frase pesquisada.
 * @returns {Promise<Array<{bookName: string, bookId: string, chapter: number, verseNumber: number, text: string}>>}
 */
export async function searchBibleContent(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.toLowerCase().trim();
  const results = [];

  // Percorre os livros registrados para buscar nos arquivos JSON existentes
  for (const book of ALL_BOOKS) {
    const testament = book.testament || 'novo';
    const bookData = await fetchJsonFile(`./data/${testament}/${book.id}.json`);
    if (!bookData) continue;

    if (bookData.capitulos && Array.isArray(bookData.capitulos)) {
      bookData.capitulos.forEach((chapArray, chapIndex) => {
        if (Array.isArray(chapArray)) {
          chapArray.forEach((verseText, verseIndex) => {
            const text = typeof verseText === 'object' && verseText !== null ? verseText.text : String(verseText);
            const num = typeof verseText === 'object' && verseText !== null ? (verseText.number || verseIndex + 1) : verseIndex + 1;
            if (text.toLowerCase().includes(cleanQuery)) {
              results.push({
                bookName: book.name,
                bookId: book.id,
                chapter: chapIndex + 1,
                verseNumber: num,
                text: text
              });
            }
          });
        }
      });
    } else if (bookData.chapters && Array.isArray(bookData.chapters)) {
      for (const chap of bookData.chapters) {
        if (chap.verses && Array.isArray(chap.verses)) {
          for (const verse of chap.verses) {
            if (verse.text && verse.text.toLowerCase().includes(cleanQuery)) {
              results.push({
                bookName: book.name,
                bookId: book.id,
                chapter: chap.chapter,
                verseNumber: verse.number,
                text: verse.text
              });
            }
          }
        }
      }
    }
  }

  return results;
}

/**
 * Copia o texto do versículo selecionado formatado para a área de transferência do usuário.
 *
 * @param {string} bookName - Nome do livro.
 * @param {number} chapter - Número do capítulo.
 * @param {number} verseNumber - Número do versículo.
 * @param {string} verseText - Texto do versículo.
 * @returns {Promise<boolean>} Retorna true se copiado com sucesso.
 */
export async function copyVerseToClipboard(bookName, chapter, verseNumber, verseText) {
  const formattedText = `"${verseText}" - ${bookName} ${chapter}:${verseNumber}`;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(formattedText);
      return true;
    } else {
      // Fallback para navegadores sem API navigator.clipboard
      const textArea = document.createElement('textarea');
      textArea.value = formattedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) {
    console.error('Erro ao copiar versículo:', err);
    return false;
  }
}

/**
 * Compartilha o versículo utilizando a Web Share API do dispositivo se disponível,
 * ou recorre à cópia para a área de transferência.
 *
 * @param {string} bookName - Nome do livro.
 * @param {number} chapter - Número do capítulo.
 * @param {number} verseNumber - Número do versículo.
 * @param {string} verseText - Texto do versículo.
 * @returns {Promise<boolean>} True se compartilhado ou copiado.
 */
export async function shareVerse(bookName, chapter, verseNumber, verseText) {
  const shareData = {
    title: `${bookName} ${chapter}:${verseNumber}`,
    text: `"${verseText}" - ${bookName} ${chapter}:${verseNumber}`,
    url: window.location.href
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      // Cancelado pelo usuário ou indisponível
      return false;
    }
  } else {
    // Fallback para cópia
    return await copyVerseToClipboard(bookName, chapter, verseNumber, verseText);
  }
}

/**
 * Gera uma síntese teológica ou explicação explicativa do versículo usando a estrutura da IA.
 * Estrutura preparada para integração futura com modelo Gemini API ou serviço backend.
 *
 * @param {string} bookName - Nome do livro.
 * @param {number} chapter - Capítulo.
 * @param {number} verseNumber - Versículo.
 * @param {string} verseText - Texto do versículo.
 * @returns {Promise<string>} Explicação detalhada do contexto e significado.
 */
export async function getAiVerseInsight(bookName, chapter, verseNumber, verseText) {
  // Simulação e estrutura de resposta contextual enriquecida pronta para API real
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`
        <strong>Análise Contextual (IA Estudo Bíblico):</strong><br/><br/>
        <b>Passagem:</b> ${bookName} ${chapter}:${verseNumber}<br/>
        <b>Texto:</b> "${verseText}"<br/><br/>
        <b>Contexto Histórico & Teológico:</b><br/>
        Este versículo está inserido no livro de ${bookName}, escrito no contexto do Novo Testamento para edificar a igreja primitiva e transmitir os ensinamentos de Cristo.
        <br/><br/>
        <b>Aplicação Prática:</b><br/>
        Meditar nesta passagem encoraja o leitor à reflexão diária sobre fé, amor e virtude cristã.
      `);
    }, 600);
  });
}
