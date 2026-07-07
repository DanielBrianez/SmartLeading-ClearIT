// src/views/PDI.jsx
import React, { useState, useEffect } from 'react';
import { 
  Target, Plus, CheckCircle2, Trash2, User, Clock, 
  AlertTriangle, ShieldCheck, TrendingUp, Info
} from 'lucide-react';
import { lerLGPD, salvarLGPD } from '../utils/security';
import { DB_SQUADS } from '../dados';

export default function PDI() {
  const idLiderLogado = "daniel_nascimento";
  
  const [meuSquad, setMeuSquad] = useState([]);
  const [lideradoSelecionado, setLideradoSelecionado] = useState('');
  
  const [pdis, setPdis] = useState([]);
  const [pdisDeletados, setPdisDeletados] = useState([]);
  
  // Estado do Formulário
  const [novaAcao, setNovaAcao] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoPrazo, setNovoPrazo] = useState('');

  useEffect(() => {
    // Carrega o Squad
    let squads = lerLGPD('@clearit-squad') || [];
    if (squads.length === 0) squads = DB_SQUADS[idLiderLogado] || [];
    
    // Filtra apenas os liderados do líder logado (no nosso caso mockado, pega o time base)
    setMeuSquad(squads.filter(m => DB_SQUADS[idLiderLogado]?.find(mock => mock.id === m.id) || m.idLider === idLiderLogado) || DB_SQUADS[idLiderLogado]);

    // Carrega os PDIs
    setPdis(lerLGPD('@clearit-pdi') || []);
    setPdisDeletados(lerLGPD('@clearit-deleted-pdi') || []);
  }, []);

  // Filtra os PDIs do liderado selecionado
  const pdisDoLiderado = pdis.filter(p => p.idLiderado === lideradoSelecionado && !pdisDeletados.includes(p.id));
  const pdisAtivos = pdisDoLiderado.filter(p => p.status !== 'Concluído');
  
  // REGRA DE NEGÓCIO: Limite máximo de 3 PDIs ativos para garantir foco
  const limiteAtingido = pdisAtivos.length >= 3;

  const handleAddPDI = (e) => {
    e.preventDefault();
    if (limiteAtingido) return;

    const membro = meuSquad.find(m => m.id.toString() === lideradoSelecionado.toString());
    if (!membro) return;

    const novoPDI = {
      id: Date.now(),
      idLiderado: membro.id.toString(),
      nomeLiderado: membro.nome,
      acao: novaAcao,
      descricao: novaDescricao,
      prazo: novoPrazo,
      status: 'Em andamento',
      dataCriacao: new Date().toLocaleDateString('pt-BR')
    };

    const novaLista = [novoPDI, ...pdis];
    setPdis(novaLista);
    salvarLGPD('@clearit-pdi', novaLista);

    // Limpa o form
    setNovaAcao('');
    setNovaDescricao('');
    setNovoPrazo('');
  };

  const handleConcluir = (id) => {
    const novaLista = pdis.map(p => {
      if (p.id === id) {
        return { ...p, status: 'Concluído', dataConclusao: new Date().toLocaleDateString('pt-BR') };
      }
      return p;
    });
    setPdis(novaLista);
    salvarLGPD('@clearit-pdi', novaLista);
  };

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta de desenvolvimento?')) {
      const novaListaDeletados = [...pdisDeletados, id];
      setPdisDeletados(novaListaDeletados);
      salvarLGPD('@clearit-deleted-pdi', novaListaDeletados);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out] pb-10">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Plano de Desenvolvimento (PDI)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Crie metas de alto impacto. O sistema Agent-First garante o foco limitando a 3 metas ativas por colaborador.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LADO ESQUERDO: CONTROLES E FORMULÁRIO */}
        <div className="xl:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Selecione o Colaborador
            </h2>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
              value={lideradoSelecionado}
              onChange={(e) => setLideradoSelecionado(e.target.value)}
            >
              <option value="">Escolha um membro do squad...</option>
              {meuSquad.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          {lideradoSelecionado && (
            <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border transition-all duration-500 ${limiteAtingido ? 'border-amber-300 dark:border-amber-700/50 relative overflow-hidden' : 'border-slate-200 dark:border-slate-800'}`}>
              
              {limiteAtingido && (
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Foco Máximo Atingido</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Este colaborador já possui 3 metas ativas. Para garantir a qualidade do desenvolvimento, conclua uma meta antes de adicionar uma nova.
                  </p>
                </div>
              )}

              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nova Meta SMART
              </h2>

              <form onSubmit={handleAddPDI} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Título da Meta (Ação)</label>
                  <input 
                    type="text" 
                    required
                    value={novaAcao}
                    onChange={e => setNovaAcao(e.target.value)}
                    placeholder="Ex: Tirar certificação AWS"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Descrição / Como Medir</span>
                    <span className="text-[10px] text-blue-500">Seja específico</span>
                  </label>
                  <textarea 
                    required
                    value={novaDescricao}
                    onChange={e => setNovaDescricao(e.target.value)}
                    placeholder="Ex: Assistir 10h de curso e fazer o simulado final."
                    rows="3"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Marco Temporal (Prazo)</label>
                  <select 
                    required
                    value={novoPrazo}
                    onChange={e => setNovoPrazo(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Selecione o horizonte...</option>
                    <option value="1 Mês (Curto Prazo)">🎯 1 Mês (Tático Rápido)</option>
                    <option value="2 Meses (Curto Prazo)">🎯 2 Meses (Sprint)</option>
                    <option value="3 Meses (Médio Prazo)">🚀 3 Meses (Quarter)</option>
                    <option value="6 Meses (Longo Prazo)">🏔️ 6 Meses (Estratégico)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2 mt-2"
                >
                  Criar Meta de PDI
                </button>
              </form>
            </div>
          )}
        </div>

        {/* LADO DIREITO: DASHBOARD E LISTA DE PDIS */}
        <div className="xl:col-span-2 space-y-6">
          
          {!lideradoSelecionado ? (
             <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl shadow-sm border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
               <Target className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Painel de Metas Vazio</h3>
               <p className="text-slate-500 dark:text-slate-400 max-w-md">
                 Selecione um liderado no menu lateral para visualizar ou adicionar novas metas ao Plano de Desenvolvimento Individual.
               </p>
             </div>
          ) : (
            <>
              {/* MINI DASHBOARD DO LIDERADO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Metas Ativas</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {pdisAtivos.length} <span className="text-sm font-semibold text-slate-400">/ 3</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Metas Concluídas</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                      {pdisDoLiderado.filter(p => p.status === 'Concluído').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* LISTA DE PDIS */}
              <div className="space-y-4">
                {pdisDoLiderado.length === 0 ? (
                  <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400">Nenhum PDI registrado para este colaborador.</p>
                  </div>
                ) : (
                  pdisDoLiderado.map(pdi => (
                    <div 
                      key={pdi.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        pdi.status === 'Concluído' 
                          ? 'bg-slate-50 border-slate-200 dark:bg-slate-800/30 dark:border-slate-800 opacity-70' 
                          : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg font-bold ${pdi.status === 'Concluído' ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                              {pdi.acao}
                            </h3>
                            {pdi.status === 'Concluído' ? (
                              <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Concluído
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded">
                                Em andamento
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            {pdi.descricao}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                              <Clock className="w-3.5 h-3.5" /> Prazo: {pdi.prazo}
                            </span>
                            <span className="flex items-center gap-1.5">
                              Criado em: {pdi.dataCriacao}
                            </span>
                            {pdi.dataConclusao && (
                              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                Finalizado em: {pdi.dataConclusao}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2">
                          {pdi.status !== 'Concluído' && (
                            <button 
                              onClick={() => handleConcluir(pdi.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                              title="Marcar como Concluído"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleExcluir(pdi.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                            title="Excluir PDI"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}