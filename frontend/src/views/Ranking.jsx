// src/views/Ranking.jsx
import { useEffect, useMemo, useState } from 'react';
import { 
  Filter, Crown, Star, Lock, TrendingUp, Activity, FileText, Target, Zap 
} from 'lucide-react';
import minhaFoto from '../assets/daniel-foto.jpg'; 
import { DB_SQUADS } from '../dados'; 
import { lerLGPD } from '../utils/security'; 

export default function Ranking() {
  const user = lerLGPD('@clearit-session') || { id: 'daniel_nascimento', nome: 'Daniel Nascimento', role: 'LIDER' };

  const [areaFiltro, setAreaFiltro] = useState('Todas');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const atualizarDados = () => setRefreshKey(prev => prev + 1);
    window.addEventListener('clearit-data-updated', atualizarDados);
    return () => window.removeEventListener('clearit-data-updated', atualizarDados);
  }, []);

  const calcularPatente = (xp) => {
    if (xp >= 3000) return { nome: 'Diamante 💎', cor: 'text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30', border: 'border-cyan-200 dark:border-cyan-800', prox: 99999 };
    if (xp >= 1500) return { nome: 'Ouro 🏆', cor: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800', prox: 3000 };
    if (xp >= 500) return { nome: 'Prata 🥈', cor: 'text-slate-500 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700', prox: 1500 };
    return { nome: 'Bronze 🥉', cor: 'text-orange-700 dark:text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-900/50', prox: 500 };
  };

  const rankingData = useMemo(() => {
    const rankingSalvo = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
    const atasSalvas = lerLGPD('@clearit-atas-squad') || [];
    const pdisSalvos = lerLGPD('@clearit-pdi') || [];
    const pdisDeletados = lerLGPD('@clearit-deleted-pdi') || []; 
    
    const xpGanho = rankingSalvo['daniel_nascimento'] || 0;
    const atasGeradas = atasSalvas.filter(a => a.idLider === 'daniel_nascimento' || !a.idLider).length;
    
    const meuTime = DB_SQUADS['daniel_nascimento'] || [];
    let totalPdisAtivos = 0;

    meuTime.forEach(membro => {
      const pdiBase = [
        { id: `estatico_pdi_1_${membro.id}`, status: 'Em andamento' },
        { id: `estatico_pdi_2_${membro.id}`, status: 'No prazo' }
      ];
      
      const pdiSalvosDoMembro = pdisSalvos.filter(p => p.idLiderado === membro.id.toString());
      const savedPdiMap = new Map(pdiSalvosDoMembro.map(p => [p.id, p]));

      let pdiCombinados = [
        ...pdiBase.map(p => savedPdiMap.has(p.id) ? savedPdiMap.get(p.id) : p),
        ...pdiSalvosDoMembro.filter(p => !pdiBase.find(bp => bp.id === p.id))
      ];

      const pdisAtivosDesteMembro = pdiCombinados.filter(p => !pdisDeletados.includes(p.id) && p.status !== 'Concluído');
      totalPdisAtivos += pdisAtivosDesteMembro.length;
    });

    const pdisAtivos = totalPdisAtivos;
    const ritosRealizados = atasGeradas + meuTime.length; 

    const baseCompetidores = [
      { id: 'daniel_nascimento', nome: 'Daniel Nascimento', cargo: 'Tech Lead', area: 'Engenharia', foto: minhaFoto, atasBase: 0, pdisBase: 0, ritosBase: 0, xpBase: 0 },
      { id: 'juliana_castro', nome: 'Juliana Castro', cargo: 'Tech Lead', area: 'Produto', atasBase: 12, pdisBase: 4, ritosBase: 15, xpBase: 1450 },
      { id: 'marcos_vinicius', nome: 'Marcos Vinícius', cargo: 'Engenheiro Sênior', area: 'Engenharia', atasBase: 25, pdisBase: 8, ritosBase: 28, xpBase: 3100 },
      { id: 'sara_lima', nome: 'Sara Lima', cargo: 'Agile Coach', area: 'Operações', atasBase: 8, pdisBase: 2, ritosBase: 10, xpBase: 850 },
      { id: 'roberto_alves', nome: 'Roberto Alves', cargo: 'Tech Lead', area: 'Engenharia', atasBase: 15, pdisBase: 5, ritosBase: 18, xpBase: 2150 }
    ];

    let dadosAtualizados = baseCompetidores.map(lider => {
      const isLogado = lider.id === 'daniel_nascimento';
      const xpLocal = rankingSalvo[lider.id];
      const xpTotal = isLogado ? (xpLocal !== undefined ? xpLocal : xpGanho) : (xpLocal || lider.xpBase);
      
      const atasTotal = isLogado ? atasGeradas : lider.atasBase;
      const ritosTotal = isLogado ? ritosRealizados : lider.ritosBase;
      const pdisTotal = isLogado ? pdisAtivos : lider.pdisBase;

      return {
        ...lider,
        xpTotal,
        atasTotal,
        ritosTotal,
        pdisTotal,
        isMe: isLogado
      };
    });

    dadosAtualizados.sort((a, b) => {
      if (b.xpTotal !== a.xpTotal) return b.xpTotal - a.xpTotal; 
      return b.atasTotal - a.atasTotal; 
    });

    const rankingFinal = dadosAtualizados.map((lider, index) => ({
      ...lider,
      posicao: index + 1,
      patente: calcularPatente(lider.xpTotal)
    }));

    const meusDados = rankingFinal.find(l => l.id === user.id) || { xpTotal: 0, patente: calcularPatente(0) };
    const porcentagem = (meusDados.xpTotal / meusDados.patente.prox) * 100;

    return {
      lideres: rankingFinal,
      meuProgresso: {
        xp: meusDados.xpTotal,
        patente: meusDados.patente,
        porcentagem: Math.min(100, porcentagem),
        xpProxNivel: meusDados.patente.prox
      }
    };
  }, [user.id, refreshKey]);

  const lideres = rankingData.lideres;
  const meuProgresso = rankingData.meuProgresso;

  if (user.role === 'LIDERADO') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-[fadeIn_0.5s_ease-out]">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-slate-950 shadow-xl">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Acesso Restrito à Liderança</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          A Liga de Ouro é um ambiente gamificado exclusivo para avaliação de líderes. Continue focando no seu PDI e logo você estará aqui!
        </p>
      </div>
    );
  }

  const areasUnicas = ['Todas', ...new Set(lideres.map(l => l.area))];
  const lideresFiltrados = areaFiltro === 'Todas' ? lideres : lideres.filter(l => l.area === areaFiltro);
  
  const top3 = lideresFiltrados.slice(0, 3);
  const resto = lideresFiltrados.slice(3);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out] pb-10">
      
      {/* HEADER DA LIGA (NOVA UI PREMIUM) */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-950 dark:to-blue-950 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <h1 className="text-3xl font-black tracking-tight break-words">Liga de Ouro</h1>
            </div>
            <p className="text-slate-300 font-medium max-w-md">
              Os líderes mais engajados no desenvolvimento contínuo de suas equipes.
            </p>
          </div>

          {/* MEU CARD DE PROGRESSO */}
          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Sua Patente Atual</p>
            <div className="flex justify-between items-end mb-4">
              <span className={`text-2xl font-black ${meuProgresso.patente.cor}`}>{meuProgresso.patente.nome}</span>
              <span className="font-bold text-white text-lg">{meuProgresso.xp} <span className="text-sm font-medium text-slate-400">XP</span></span>
            </div>
            
            {meuProgresso.xpProxNivel < 99999 ? (
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5 text-slate-300">
                  <span>Progresso pro próximo nível</span>
                  <span>{meuProgresso.xp} / {meuProgresso.xpProxNivel}</span>
                </div>
                <div className="w-full bg-slate-900/50 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-400 to-cyan-400" style={{ width: `${meuProgresso.porcentagem}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="text-xs font-bold text-cyan-400 bg-cyan-900/30 px-3 py-1.5 rounded-lg border border-cyan-500/30 text-center">
                Você atingiu o Rank Máximo!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FILTRO DE ÁREA DE ATUAÇÃO (MANTIDO DO SEU CÓDIGO) */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-blue-500" />
          Filtrar por Área:
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {areasUnicas.map(area => (
            <button
              key={area}
              onClick={() => setAreaFiltro(area)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                areaFiltro === area 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* PÓDIO DOS TOP 3 (NOVA UI ANIMADA) */}
      {top3.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-12 flex items-center justify-center gap-2">
            <Star className="w-4 h-4" /> Top 3 Lideranças
          </h2>
          
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 px-4 h-auto md:h-64">
            
            {/* SEGUNDO LUGAR */}
            {top3[1] && (
              <div className="w-full md:w-1/3 flex flex-col items-center order-2 md:order-1 animate-[slideUp_0.5s_ease-out]">
                <div className={`text-center mb-4 ${top3[1].isMe ? 'scale-110' : ''}`}>
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center font-black text-2xl mb-2 shadow-lg border-4 overflow-hidden ${top3[1].isMe ? 'bg-blue-600 text-white border-blue-200' : 'bg-slate-200 text-slate-600 border-white dark:border-slate-800'}`}>
                    {top3[1].foto ? <img src={top3[1].foto} alt={top3[1].nome} className="w-full h-full object-cover"/> : top3[1].nome.charAt(0)}
                  </div>
                  <p className={`font-bold truncate w-32 mx-auto ${top3[1].isMe ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {top3[1].nome} {top3[1].isMe && '(Você)'}
                  </p>
                  <p className="text-sm font-black text-slate-500">{top3[1].xpTotal} XP</p>
                </div>
                <div className="w-full h-32 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-2xl flex items-start justify-center pt-4 border-t-4 border-slate-300">
                  <span className="text-3xl font-black text-slate-400">2</span>
                </div>
              </div>
            )}

            {/* PRIMEIRO LUGAR */}
            {top3[0] && (
              <div className="w-full md:w-1/3 flex flex-col items-center order-1 md:order-2 animate-[slideUp_0.4s_ease-out]">
                <div className={`text-center mb-4 ${top3[0].isMe ? 'scale-110' : ''}`}>
                  <Crown className="w-8 h-8 text-amber-500 mx-auto mb-1 animate-bounce" />
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center font-black text-3xl mb-2 shadow-xl border-4 overflow-hidden ${top3[0].isMe ? 'bg-blue-600 text-white border-blue-200' : 'bg-amber-100 text-amber-600 border-amber-300'}`}>
                    {top3[0].foto ? <img src={top3[0].foto} alt={top3[0].nome} className="w-full h-full object-cover"/> : top3[0].nome.charAt(0)}
                  </div>
                  <p className={`font-bold truncate w-40 mx-auto ${top3[0].isMe ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                    {top3[0].nome} {top3[0].isMe && '(Você)'}
                  </p>
                  <p className="text-base font-black text-amber-500">{top3[0].xpTotal} XP</p>
                </div>
                <div className="w-full h-40 bg-gradient-to-t from-amber-200 to-amber-100 dark:from-amber-900/60 dark:to-amber-900/30 rounded-t-2xl flex items-start justify-center pt-4 border-t-4 border-amber-400">
                  <span className="text-4xl font-black text-amber-500">1</span>
                </div>
              </div>
            )}

            {/* TERCEIRO LUGAR */}
            {top3[2] && (
              <div className="w-full md:w-1/3 flex flex-col items-center order-3 md:order-3 animate-[slideUp_0.6s_ease-out]">
                <div className={`text-center mb-4 ${top3[2].isMe ? 'scale-110' : ''}`}>
                  <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center font-black text-xl mb-2 shadow-md border-4 overflow-hidden ${top3[2].isMe ? 'bg-blue-600 text-white border-blue-200' : 'bg-orange-100 text-orange-700 border-orange-200 dark:border-slate-800'}`}>
                    {top3[2].foto ? <img src={top3[2].foto} alt={top3[2].nome} className="w-full h-full object-cover"/> : top3[2].nome.charAt(0)}
                  </div>
                  <p className={`font-bold truncate w-32 mx-auto ${top3[2].isMe ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {top3[2].nome} {top3[2].isMe && '(Você)'}
                  </p>
                  <p className="text-sm font-black text-orange-600">{top3[2].xpTotal} XP</p>
                </div>
                <div className="w-full h-24 bg-gradient-to-t from-orange-200 to-orange-100 dark:from-orange-900/50 dark:to-orange-900/20 rounded-t-2xl flex items-start justify-center pt-4 border-t-4 border-orange-300">
                  <span className="text-2xl font-black text-orange-500">3</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* RESTANTE DO RANKING (TABELA DETALHADA - MANTIDA DO SEU CÓDIGO) */}
      {resto.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Top Desafiantes
            </h2>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {resto.map((lider) => {
              return (
                <div key={lider.id} className={`flex flex-col md:flex-row md:items-center justify-between p-5 transition-colors gap-4 ${lider.isMe ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                  
                  <div className="flex items-center gap-4 lg:gap-6">
                    <div className="w-8 text-center font-black text-2xl text-slate-300 dark:text-slate-600">
                      #{lider.posicao}
                    </div>
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 flex-shrink-0 ${lider.isMe ? 'border-blue-400' : 'border-slate-200 dark:border-slate-700'}`}>
                      {lider.foto ? <img src={lider.foto} alt={lider.nome} className="w-full h-full object-cover"/> : <span className="font-bold text-slate-500">{lider.nome.charAt(0)}</span>}
                    </div>
                    
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={`font-bold text-lg leading-none ${lider.isMe ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                          {lider.nome} {lider.isMe && '(Você)'}
                        </h3>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${lider.patente.cor} ${lider.patente.bg} ${lider.patente.border}`}>
                          {lider.patente.nome.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {lider.cargo} <span className="mx-1">•</span> {lider.area}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                    <div className="flex gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      <div className="flex items-center gap-1" title="Ritos Realizados"><Activity className="w-3.5 h-3.5" /> {lider.ritosTotal}</div>
                      <div className="flex items-center gap-1" title="Atas Baixadas"><FileText className="w-3.5 h-3.5" /> {lider.atasTotal}</div>
                      <div className="flex items-center gap-1" title="PDIs Ativos"><Target className="w-3.5 h-3.5" /> {lider.pdisTotal}</div>
                    </div>

                    <div className={`flex items-center gap-1.5 font-bold text-2xl leading-none ${lider.isMe ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      <Zap className="w-6 h-6" />
                      {lider.xpTotal} <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">XP</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}
      
    </div>
  );
}