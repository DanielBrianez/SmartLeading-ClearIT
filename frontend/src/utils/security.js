// src/utils/security.js

/**
 * Salva dados no LocalStorage de forma ofuscada (Base64 + URI Encoding para acentos)
 */
export const salvarLGPD = (chave, dados) => {
  try {
    const texto = JSON.stringify(dados);
    const ofuscado = btoa(encodeURIComponent(texto));
    localStorage.setItem(chave, ofuscado);
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
  } catch (e) {
    // Se der erro no atob, significa que é um dado antigo (Texto Puro)
    return JSON.parse(dado);
  }
};