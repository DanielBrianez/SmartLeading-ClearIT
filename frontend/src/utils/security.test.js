import test from 'node:test';
import assert from 'node:assert/strict';

class MockStorage {
  constructor() {
    this.store = new Map();
  }

  setItem(key, value) {
    this.store.set(String(key), String(value));
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

test('salvarLGPD protege dados sensíveis no navegador e permite leitura correta', async () => {
  const storage = new MockStorage();
  globalThis.window = { dispatchEvent() {} };
  globalThis.localStorage = storage;
  globalThis.Storage = MockStorage;

  const { salvarLGPD, lerLGPD } = await import('./security.js');

  salvarLGPD('@clearit-session', { id: 'daniel_nascimento', nome: 'Daniel' });

  const valorBruto = storage.getItem('@clearit-session');
  assert.notEqual(valorBruto, JSON.stringify({ id: 'daniel_nascimento', nome: 'Daniel' }));
  assert.ok(valorBruto.includes('__clearit__enc__'));

  const valorLido = lerLGPD('@clearit-session');
  assert.deepEqual(valorLido, { id: 'daniel_nascimento', nome: 'Daniel' });
});
