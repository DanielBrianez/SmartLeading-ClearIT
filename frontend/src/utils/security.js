// src/utils/security.js

const EVENTO_ATUALIZACAO_DADOS = 'clearit-data-updated';
const PREFIXO_CRIPTO = '__clearit__enc__';
const SEGREDO = 'smart-leading-lgpd-v2';

const deveOfuscar = (chave) => typeof chave === 'string' && chave.startsWith('@clearit-');

const obterStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return globalThis.localStorage;
};

const codificarTexto = (texto) => {
  const dados = new TextEncoder().encode(texto);
  const chave = new TextEncoder().encode(SEGREDO);
  const bytes = new Uint8Array(dados.length);

  dados.forEach((byte, index) => {
    bytes[index] = byte ^ chave[index % chave.length];
  });

  let binario = '';
  bytes.forEach((byte) => {
    binario += String.fromCharCode(byte);
  });

  return btoa(binario);
};

const decodificarTexto = (texto) => {
  const binario = atob(texto);
  const bytes = Uint8Array.from(binario, (caractere) => caractere.charCodeAt(0));
  const chave = new TextEncoder().encode(SEGREDO);
  const dados = new Uint8Array(bytes.length);

  bytes.forEach((byte, index) => {
    dados[index] = byte ^ chave[index % chave.length];
  });

  return new TextDecoder().decode(dados);
};

const aplicarOfuscamento = (chave, valor) => {
  if (!deveOfuscar(chave) || typeof valor !== 'string') return valor;
  return `${PREFIXO_CRIPTO}${codificarTexto(valor)}`;
};

const aplicarDesofuscamento = (chave, valor) => {
  if (!deveOfuscar(chave) || typeof valor !== 'string' || !valor.startsWith(PREFIXO_CRIPTO)) return valor;
  return decodificarTexto(valor.slice(PREFIXO_CRIPTO.length));
};

export const dispararAtualizacaoDados = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENTO_ATUALIZACAO_DADOS));
  }
};

export const aplicarPatchStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage || window.__clearitStoragePatched) {
    return;
  }

  const storage = window.localStorage;
  const originalGetItem = storage.getItem.bind(storage);
  const originalSetItem = storage.setItem.bind(storage);
  const originalRemoveItem = storage.removeItem.bind(storage);
  const originalClear = storage.clear.bind(storage);

  storage.getItem = function (key) {
    const valor = originalGetItem(String(key));
    if (typeof valor !== 'string') return valor;
    return aplicarDesofuscamento(String(key), valor);
  };

  storage.setItem = function (key, value) {
    const valorOfuscado = aplicarOfuscamento(String(key), String(value));
    const result = originalSetItem(String(key), valorOfuscado);
    dispararAtualizacaoDados();
    return result;
  };

  storage.removeItem = function (key) {
    const result = originalRemoveItem(String(key));
    dispararAtualizacaoDados();
    return result;
  };

  storage.clear = function () {
    const result = originalClear();
    dispararAtualizacaoDados();
    return result;
  };

  window.__clearitStoragePatched = true;
};

aplicarPatchStorage();

/**
 * Salva dados no LocalStorage de forma ofuscada para preservação da LGPD.
 */
export const salvarLGPD = (chave, dados) => {
  try {
    const storage = obterStorage();
    const texto = JSON.stringify(dados);
    storage?.setItem(chave, texto);
    dispararAtualizacaoDados();
  } catch (erro) {
    console.error('Erro ao ofuscar dados LGPD:', erro);
  }
};

/**
 * Lê dados do LocalStorage. Tenta decodificar o formato ofuscado, preservando compatibilidade com dados antigos.
 */
export const lerLGPD = (chave) => {
  const storage = obterStorage();
  const dado = storage?.getItem(chave);
  if (!dado) return null;

  try {
    return JSON.parse(dado);
  } catch {
    return dado;
  }
};