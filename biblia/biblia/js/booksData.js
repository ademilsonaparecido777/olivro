/**
 * @fileoverview Módulo com informações e dados catalogados dos 66 livros da Bíblia.
 * @module booksData
 */

export const OLD_TESTAMENT_BOOKS = [
  { id: 'genesis', name: 'Gênesis', abbreviation: 'Gn', chapters: 50, group: 'Pentateuco', testament: 'antigo' },
  { id: 'exodo', name: 'Êxodo', abbreviation: 'Êx', chapters: 40, group: 'Pentateuco', testament: 'antigo' },
  { id: 'levitico', name: 'Levítico', abbreviation: 'Lv', chapters: 27, group: 'Pentateuco', testament: 'antigo' },
  { id: 'numeros', name: 'Números', abbreviation: 'Nm', chapters: 36, group: 'Pentateuco', testament: 'antigo' },
  { id: 'deuteronomio', name: 'Deuteronômio', abbreviation: 'Dt', chapters: 34, group: 'Pentateuco', testament: 'antigo' },
  { id: 'josue', name: 'Josué', abbreviation: 'Js', chapters: 24, group: 'Histórico', testament: 'antigo' },
  { id: 'juizes', name: 'Juízes', abbreviation: 'Jz', chapters: 21, group: 'Histórico', testament: 'antigo' },
  { id: 'rute', name: 'Rute', abbreviation: 'Rt', chapters: 4, group: 'Histórico', testament: 'antigo' },
  { id: '1samuel', name: '1 Samuel', abbreviation: '1Sm', chapters: 31, group: 'Histórico', testament: 'antigo' },
  { id: '2samuel', name: '2 Samuel', abbreviation: '2Sm', chapters: 24, group: 'Histórico', testament: 'antigo' },
  { id: '1reis', name: '1 Reis', abbreviation: '1Rs', chapters: 22, group: 'Histórico', testament: 'antigo' },
  { id: '2reis', name: '2 Reis', abbreviation: '2Rs', chapters: 25, group: 'Histórico', testament: 'antigo' },
  { id: '1cronicas', name: '1 Crônicas', abbreviation: '1Cr', chapters: 29, group: 'Histórico', testament: 'antigo' },
  { id: '2cronicas', name: '2 Crônicas', abbreviation: '2Cr', chapters: 36, group: 'Histórico', testament: 'antigo' },
  { id: 'esdras', name: 'Esdras', abbreviation: 'Ed', chapters: 10, group: 'Histórico', testament: 'antigo' },
  { id: 'neemias', name: 'Neemias', abbreviation: 'Ne', chapters: 13, group: 'Histórico', testament: 'antigo' },
  { id: 'ester', name: 'Ester', abbreviation: 'Et', chapters: 10, group: 'Histórico', testament: 'antigo' },
  { id: 'job', name: 'Jó', abbreviation: 'Jó', chapters: 42, group: 'Poético', testament: 'antigo' },
  { id: 'salmos', name: 'Salmos', abbreviation: 'Sl', chapters: 150, group: 'Poético', testament: 'antigo' },
  { id: 'proverbios', name: 'Provérbios', abbreviation: 'Pv', chapters: 31, group: 'Poético', testament: 'antigo' },
  { id: 'eclesiastes', name: 'Eclesiastes', abbreviation: 'Ec', chapters: 12, group: 'Poético', testament: 'antigo' },
  { id: 'canticos', name: 'Cânticos', abbreviation: 'Ct', chapters: 8, group: 'Poético', testament: 'antigo' },
  { id: 'isaias', name: 'Isaías', abbreviation: 'Is', chapters: 66, group: 'Profetas Maiores', testament: 'antigo' },
  { id: 'jeremias', name: 'Jeremias', abbreviation: 'Jr', chapters: 52, group: 'Profetas Maiores', testament: 'antigo' },
  { id: 'lamentacoes', name: 'Lamentações', abbreviation: 'Lm', chapters: 5, group: 'Profetas Maiores', testament: 'antigo' },
  { id: 'ezequiel', name: 'Ezequiel', abbreviation: 'Ez', chapters: 48, group: 'Profetas Maiores', testament: 'antigo' },
  { id: 'daniel', name: 'Daniel', abbreviation: 'Dn', chapters: 12, group: 'Profetas Maiores', testament: 'antigo' },
  { id: 'oseias', name: 'Oséias', abbreviation: 'Os', chapters: 14, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'joel', name: 'Joel', abbreviation: 'Jl', chapters: 3, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'amos', name: 'Amós', abbreviation: 'Am', chapters: 9, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'obadias', name: 'Obadias', abbreviation: 'Ob', chapters: 1, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'jonas', name: 'Jonas', abbreviation: 'Jn', chapters: 4, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'miqueias', name: 'Miquéias', abbreviation: 'Mq', chapters: 7, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'naum', name: 'Naum', abbreviation: 'Na', chapters: 3, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'habacuque', name: 'Habacuque', abbreviation: 'Hc', chapters: 3, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'sofonias', name: 'Sofonias', abbreviation: 'Sf', chapters: 3, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'ageu', name: 'Ageu', abbreviation: 'Ag', chapters: 2, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'zacarias', name: 'Zacarias', abbreviation: 'Zc', chapters: 14, group: 'Profetas Menores', testament: 'antigo' },
  { id: 'malaquias', name: 'Malaquias', abbreviation: 'Ml', chapters: 4, group: 'Profetas Menores', testament: 'antigo' }
];

export const NEW_TESTAMENT_BOOKS = [
  { id: 'mateus', name: 'Mateus', abbreviation: 'Mt', chapters: 28, group: 'Evangelhos', testament: 'novo' },
  { id: 'marcos', name: 'Marcos', abbreviation: 'Mc', chapters: 16, group: 'Evangelhos', testament: 'novo' },
  { id: 'lucas', name: 'Lucas', abbreviation: 'Lc', chapters: 24, group: 'Evangelhos', testament: 'novo' },
  { id: 'joao', name: 'João', abbreviation: 'Jo', chapters: 21, group: 'Evangelhos', testament: 'novo' },
  { id: 'atos', name: 'Atos', abbreviation: 'At', chapters: 28, group: 'Histórico', testament: 'novo' },
  { id: 'romanos', name: 'Romanos', abbreviation: 'Rm', chapters: 16, group: 'Cartas Paulinas', testament: 'novo' },
  { id: '1corintios', name: '1 Coríntios', abbreviation: '1Co', chapters: 16, group: 'Cartas Paulinas', testament: 'novo' },
  { id: '2corintios', name: '2 Coríntios', abbreviation: '2Co', chapters: 13, group: 'Cartas Paulinas', testament: 'novo' },
  { id: 'galatas', name: 'Gálatas', abbreviation: 'Gl', chapters: 6, group: 'Cartas Paulinas', testament: 'novo' },
  { id: 'efesios', name: 'Efésios', abbreviation: 'Ef', chapters: 6, group: 'Cartas Paulinas', testament: 'novo' },
  { id: 'filipenses', name: 'Filipenses', abbreviation: 'Fp', chapters: 4, group: 'Cartas Paulinas', testament: 'novo' },
  { id: 'colossenses', name: 'Colossenses', abbreviation: 'Cl', chapters: 4, group: 'Cartas Paulinas', testament: 'novo' },
  { id: '1tessalonicenses', name: '1 Tessalonicenses', abbreviation: '1Ts', chapters: 5, group: 'Cartas Paulinas', testament: 'novo' },
  { id: '2tessalonicenses', name: '2 Tessalonicenses', abbreviation: '2Ts', chapters: 3, group: 'Cartas Paulinas', testament: 'novo' },
  { id: '1timoteo', name: '1 Timóteo', abbreviation: '1Tm', chapters: 6, group: 'Cartas Paulinas', testament: 'novo' },
  { id: '2timoteo', name: '2 Timóteo', abbreviation: '2Tm', chapters: 4, group: 'Cartas Paulinas', testament: 'novo' },
  { id: 'tito', name: 'Tito', abbreviation: 'Tt', chapters: 3, group: 'Cartas Paulinas', testament: 'novo' },
  { id: 'filemom', name: 'Filemom', abbreviation: 'Fm', chapters: 1, group: 'Cartas Paulinas', testament: 'novo' },
  { id: 'hebreus', name: 'Hebreus', abbreviation: 'Hb', chapters: 13, group: 'Cartas Gerais', testament: 'novo' },
  { id: 'tiago', name: 'Tiago', abbreviation: 'Tg', chapters: 5, group: 'Cartas Gerais', testament: 'novo' },
  { id: '1pedro', name: '1 Pedro', abbreviation: '1Pe', chapters: 5, group: 'Cartas Gerais', testament: 'novo' },
  { id: '2pedro', name: '2 Pedro', abbreviation: '2Pe', chapters: 3, group: 'Cartas Gerais', testament: 'novo' },
  { id: '1joao', name: '1 João', abbreviation: '1Jo', chapters: 5, group: 'Cartas Gerais', testament: 'novo' },
  { id: '2joao', name: '2 João', abbreviation: '2Jo', chapters: 1, group: 'Cartas Gerais', testament: 'novo' },
  { id: '3joao', name: '3 João', abbreviation: '3Jo', chapters: 1, group: 'Cartas Gerais', testament: 'novo' },
  { id: 'judas', name: 'Judas', abbreviation: 'Jd', chapters: 1, group: 'Cartas Gerais', testament: 'novo' },
  { id: 'apocalipse', name: 'Apocalipse', abbreviation: 'Ap', chapters: 22, group: 'Profecia', testament: 'novo' }
];

export const ALL_BOOKS = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];

export function getAllBooks() {
  return NEW_TESTAMENT_BOOKS;
}

export function getBooksByTestament(testament) {
  if (testament === 'antigo') return OLD_TESTAMENT_BOOKS;
  return NEW_TESTAMENT_BOOKS;
}

export function getBookById(bookId) {
  if (!bookId) return null;
  const normalizedId = bookId.toLowerCase().trim();
  return ALL_BOOKS.find(book => book.id === normalizedId) || null;
}

export function getBooksByGroup(groupName, testament = 'novo') {
  const books = getBooksByTestament(testament);
  if (!groupName || groupName === 'Todos') {
    return books;
  }
  return books.filter(book => book.group === groupName);
}

export function searchBooks(query, testament = 'novo') {
  const books = getBooksByTestament(testament);
  if (!query) return books;
  const cleanQuery = query.toLowerCase().trim();
  return books.filter(book =>
    book.name.toLowerCase().includes(cleanQuery) ||
    book.abbreviation.toLowerCase().includes(cleanQuery)
  );
}

export function searchAllBooks(query) {
  if (!query) return ALL_BOOKS;
  const cleanQuery = query.toLowerCase().trim();
  return ALL_BOOKS.filter(book =>
    book.name.toLowerCase().includes(cleanQuery) ||
    book.abbreviation.toLowerCase().includes(cleanQuery)
  );
}
