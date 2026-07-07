// src/utils/security.js

const EVENTO_ATUALIZACAO_DADOS = 'clearit-data-updated';

export const dispararAtualizacaoDados = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENTO_ATUALIZACAO_DADOS));
  }
};

if (typeof window !== 'undefined' && !window.__clearitStoragePatched) {
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;
  const originalClear = Storage.prototype.clear;

  Storage.prototype.setItem = function (key, value) {
    const result = originalSetItem.call(this, key, value);
    dispararAtualizacaoDados();
    return result;
  };

  Storage.prototype.removeItem = function (key) {
    const result = originalRemoveItem.call(this, key);
    dispararAtualizacaoDados();
    return result;
  };

  Storage.prototype.clear = function () {
    const result = originalClear.call(this);
    dispararAtualizacaoDados();
    return result;
  };

  window.__clearitStoragePatched = true;
}

/**
 * Salva dados no LocalStorage de forma ofuscada (Base64 + URI Encoding para acentos)
 */
export const salvarLGPD = (chave, dados) => {
  try {
    const texto = JSON.stringify(dados);
    const ofuscado = btoa(encodeURIComponent(texto));
    localStorage.setItem(chave, ofuscado);
    dispararAtualizacaoDados();
  } catch (erro) {
    console.error("Erro ao ofuscar dados LGPD:", erro);
  }
};

/**
 * Lê dados do LocalStorage. Tenta decodificar Base64, se falhar, lê como texto puro (Retrocompatibilidade)
 */
export const lerLGPD = (chave) => {
  const dado = localStorage.getItem(chave);
  if (!dado) return null;
  
  try {
    // Tenta ler o formato novo (Ofuscado)
    const decodificado = decodeURIComponent(atob(dado));
    return JSON.parse(decodificado);
  } catch {
    // Se der erro no atob, significa que é um dado antigo (Texto Puro)
    return JSON.parse(dado);
  }
};