/**
 * @fileoverview Módulo responsável pelo carregamento dinâmico e leitura dos arquivos JSON da Bíblia.
 * Implementa cache em memória, tratamento de erros offline e fallbacks elegantes caso o arquivo JSON ainda não exista.
 * @module dataLoader
 */

import { getBookById } from './booksData.js';

/**
 * Cache em memória para armazenar arquivos JSON já carregados e evitar requisições redundantes.
 * @type {Map<string, Object>}
 */
const jsonCache = new Map();

/**
 * Tenta buscar um arquivo JSON no servidor ou sistema de arquivos offline.
 * @param {string} url - O caminho para o arquivo JSON (ex: '/data/mateus.json' ou '/data/mateus/1.json').
 * @returns {Promise<Object|null>} O objeto JSON parseado ou null se falhar/não existir.
 */
export async function fetchJsonFile(url) {
  let fetchUrl = url;
  if (url.startsWith('./data/')) {
    fetchUrl = url.replace('./data/', '/biblia/data/');
  } else if (url.startsWith('/data/')) {
    fetchUrl = url.replace('/data/', '/biblia/data/');
  }

  if (jsonCache.has(fetchUrl)) {
    return jsonCache.get(fetchUrl);
  }

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    jsonCache.set(fetchUrl, data);
    return data;
  } catch (error) {
    console.warn(`[dataLoader] Não foi possível carregar o arquivo JSON de ${fetchUrl}:`, error.message);
    return null;
  }
}

/**
 * Carrega dinamicamente os versículos de um capítulo específico de um livro.
 * Tenta múltiplos formatos de estrutura JSON suportados:
 * 1. Arquivo por capítulo: `/data/{bookId}/{chapter}.json`
 * 2. Arquivo por livro completo: `/data/{bookId}.json`
 * 3. Fallback estruturado com instruções se o JSON do livro ainda não foi adicionado.
 *
 * @param {string} bookId - O identificador do livro (ex: 'mateus', 'romanos').
 * @param {number} chapter - O número do capítulo (1, 2, 3...).
 * @returns {Promise<{bookName: string, bookId: string, chapter: number, totalChapters: number, verses: Array<{number: number, text: string}>, isPlaceholder?: boolean}>}
 */
export async function loadChapterVerses(bookId, chapter) {
  const bookInfo = getBookById(bookId);
  const bookName = bookInfo ? bookInfo.name : bookId;
  const totalChapters = bookInfo ? bookInfo.chapters : 1;
  const testament = bookInfo ? bookInfo.testament : 'novo';

  // 1. Tentar carregar arquivo de capítulo individual: ./data/{testament}/{bookId}/{chapter}.json
  const chapterUrl = `./data/${testament}/${bookId}/${chapter}.json`;
  const chapterData = await fetchJsonFile(chapterUrl);

  if (chapterData && chapterData.verses && Array.isArray(chapterData.verses)) {
    return {
      bookName: chapterData.book || bookName,
      bookId,
      chapter: parseInt(chapterData.chapter || chapter, 10),
      totalChapters,
      verses: chapterData.verses,
      isPlaceholder: false
    };
  }

  // 2. Tentar carregar arquivo contendo o livro completo: ./data/{testament}/{bookId}.json
  const bookUrl = `./data/${testament}/${bookId}.json`;
  const bookData = await fetchJsonFile(bookUrl);

  if (bookData) {
    // Formato Solicitado: { "livro": "Mateus", "abreviacao": "Mt", "capitulos": [ [ "v1", "v2" ], ... ] }
    if (bookData.capitulos && Array.isArray(bookData.capitulos)) {
      const chapIndex = parseInt(chapter, 10) - 1;
      const targetChapArray = bookData.capitulos[chapIndex];
      if (targetChapArray && Array.isArray(targetChapArray)) {
        const formattedVerses = targetChapArray.map((verseText, index) => {
          if (typeof verseText === 'object' && verseText !== null && verseText.text) {
            return { number: verseText.number || (index + 1), text: verseText.text };
          }
          return { number: index + 1, text: String(verseText) };
        });
        return {
          bookName: bookData.livro || bookData.book || bookName,
          bookId,
          chapter: parseInt(chapter, 10),
          totalChapters: bookData.capitulos.length || totalChapters,
          verses: formattedVerses,
          isPlaceholder: false
        };
      }
    }

    // Formato A: Objeto com array 'chapters', onde cada capítulo tem 'chapter' e 'verses'
    if (bookData.chapters && Array.isArray(bookData.chapters)) {
      const targetChap = bookData.chapters.find(c => parseInt(c.chapter, 10) === parseInt(chapter, 10));
      if (targetChap && targetChap.verses) {
        return {
          bookName: bookData.book || bookName,
          bookId,
          chapter: parseInt(chapter, 10),
          totalChapters,
          verses: targetChap.verses,
          isPlaceholder: false
        };
      }
    }
    
    // Formato B: Mapeamento direto de número do capítulo para array de versículos
    if (bookData[chapter] && Array.isArray(bookData[chapter])) {
      return {
        bookName: bookData.book || bookName,
        bookId,
        chapter: parseInt(chapter, 10),
        totalChapters,
        verses: bookData[chapter],
        isPlaceholder: false
      };
    }
  }

  // 3. Se o arquivo JSON ainda não estiver presente no diretório /data/,
  // gera uma resposta padronizada notificando que a estrutura está pronta para receber o JSON.
  return generatePlaceholderChapter(bookId, bookName, chapter, totalChapters);
}

/**
 * Gera um objeto de capítulo modelo/placeholder para testes quando o arquivo JSON físico
 * ainda não foi colocado na pasta /data/.
 *
 * @param {string} bookId - ID do livro.
 * @param {string} bookName - Nome do livro.
 * @param {number} chapter - Número do capítulo.
 * @param {number} totalChapters - Total de capítulos do livro.
 * @returns {{bookName: string, bookId: string, chapter: number, totalChapters: number, verses: Array<{number: number, text: string}>, isPlaceholder: boolean}}
 */
export function generatePlaceholderChapter(bookId, bookName, chapter, totalChapters) {
  const bookInfo = getBookById(bookId);
  const testament = bookInfo ? bookInfo.testament : 'novo';
  const sampleVerses = [
    {
      number: 1,
      text: `[Estrutura Pronta] Este capítulo (${chapter} de ${bookName}) está pronto para receber o conteúdo real do arquivo JSON em /data/${testament}/${bookId}.json ou /data/${testament}/${bookId}/${chapter}.json.`
    },
    {
      number: 2,
      text: `O aplicativo tentará carregar automaticamente os arquivos assim que forem depositados na pasta do projeto.`
    },
    {
      number: 3,
      text: `Exemplo de estrutura JSON suportada: { "book": "${bookName}", "chapter": ${chapter}, "verses": [ { "number": 1, "text": "Texto do versículo..." } ] }`
    }
  ];

  return {
    bookName,
    bookId,
    chapter,
    totalChapters,
    verses: sampleVerses,
    isPlaceholder: true
  };
}

/**
 * Limpa o cache interno de arquivos JSON já carregados.
 * Util para re-inicializações ou recarregamento forçado.
 * @returns {void}
 */
export function clearJsonCache() {
  jsonCache.clear();
}
