// src/views/Ranking.jsx
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Zap, Filter, Target, FileText, Activity } from 'lucide-react';
import minhaFoto from '../assets/daniel-foto.jpg'; 
import { DB_SQUADS } from '../dados'; 
// 🔥 IMPORTANDO A NOSSA FUNÇÃO DE SEGURANÇA
import { lerLGPD } from '../utils/security'; 

export default function Ranking() {
  const [lideres, setLideres] = useState([]);
  const [areaFiltro, setAreaFiltro] = useState('Todas');

  useEffect(() => {
    // 1. Abre os cofres do navegador
    // O XP não identifica nomes de liderados, então não precisa de ofuscação
    const rankingSalvo = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
    
    // 🔥 Os dados confidenciais (Atas e PDIs) agora passam pela nossa lente de segurança!
    const atasSalvas = lerLGPD('@clearit-atas-squad') || [];
    const pdisSalvos = lerLGPD('@clearit-pdi') || [];
    const pdisDeletados = lerLGPD('@clearit-deleted-pdi') || []; 
    
    // 2. Calcula os dados reais do Daniel (Líder Logado) com precisão absoluta
    const xpGanho = rankingSalvo['daniel_nascimento'] || 0;
    const atasGeradas = atasSalvas.length;
    
    // 🔥 O GRANDE TRUQUE: Contar os PDIs exatamente igual à tela do MeuSquad
    const meuTime = DB_SQUADS['daniel_nascimento'] || [];
    let totalPdisAtivos = 0;

    meuTime.forEach(membro => {
      // Recria os PDIs base do membro
      const pdiBase = [
        { id: `estatico_pdi_1_${membro.id}`, status: 'Em andamento' },
        { id: `estatico_pdi_2_${membro.id}`, status: 'No prazo' }
      ];
      
      const pdiSalvosDoMembro = pdisSalvos.filter(p => p.idLiderado === membro.id.toString());
      const savedPdiMap = new Map(pdiSalvosDoMembro.map(p => [p.id, p]));

      // Combina a base com os salvos (sobrescrevendo as edições)
      let pdiCombinados = [
        ...pdiBase.map(p => savedPdiMap.has(p.id) ? savedPdiMap.get(p.id) : p),
        ...pdiSalvosDoMembro.filter(p => !pdiBase.find(bp => bp.id === p.id))
      ];

      // Filtra os que NÃO estão deletados e NÃO estão concluídos
      const pdisAtivosDesteMembro = pdiCombinados.filter(p => !pdisDeletados.includes(p.id) && p.status !== 'Concluído');
      totalPdisAtivos += pdisAtivosDesteMembro.length;
    });

    const pdisAtivos = totalPdisAtivos;
    const ritosRealizados = atasGeradas + meuTime.length; // Ritos base (Kickoffs) + Novas Atas geradas

    // 3. Base de Competidores
    const baseCompetidores = [
      { id: 'daniel_nascimento', nome: 'Daniel Nascimento', cargo: 'Tech Lead', area: 'Engenharia', foto: minhaFoto, atasBase: 0, pdisBase: 0, ritosBase: 0, xpBase: 0 },
      { id: 'juliana_castro', nome: 'Juliana Castro', cargo: 'Tech Lead', area: 'Produto', atasBase: 12, pdisBase: 4, ritosBase: 15, xpBase: 450 },
      { id: 'marcos_vinicius', nome: 'Marcos Vinícius', cargo: 'Engenheiro Sênior', area: 'Engenharia', atasBase: 25, pdisBase: 8, ritosBase: 28, xpBase: 850 },
      { id: 'sara_lima', nome: 'Sara Lima', cargo: 'Agile Coach', area: 'Operações', atasBase: 8, pdisBase: 2, ritosBase: 10, xpBase: 300 },
      { id: 'roberto_alves', nome: 'Roberto Alves', cargo: 'Tech Lead', area: 'Engenharia', atasBase: 15, pdisBase: 5, ritosBase: 18, xpBase: 550 }
    ];

    // 4. Atualiza os dados mesclando a base simulada com a realidade do Daniel
    let dadosAtualizados = baseCompetidores.map(lider => {
      const isLogado = lider.id === 'daniel_nascimento';
      
      const xpLocal = rankingSalvo[lider.id];
      const xpTotal = isLogado ? (xpLocal || xpGanho) : (xpLocal || lider.xpBase);
      
      const atasTotal = isLogado ? atasGeradas : lider.atasBase;
      const ritosTotal = isLogado ? ritosRealizados : lider.ritosBase;
      const pdisTotal = isLogado ? pdisAtivos : lider.pdisBase;

      return {
        ...lider,
        xpTotal,
        atasTotal,
        ritosTotal,
        pdisTotal
      };
    });

    // 5. Regra de Ordenação com DESEMPATE POR ATAS
    dadosAtualizados.sort((a, b) => {
      if (b.xpTotal !== a.xpTotal) {
        return b.xpTotal - a.xpTotal; 
      }
      return b.atasTotal - a.atasTotal; 
    });

    // 6. Calculadora de Nível de Maturidade
    const calcularMaturidade = (xp, atas) => {
      if (xp >= 800 && atas >= 20) return { nivel: 'Referência', cor: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' };
      if (xp >= 500 && atas >= 10) return { nivel: 'Consistente', cor: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
      if (xp >= 200) return { nivel: 'Em Desenvolvimento', cor: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' };
      return { nivel: 'Iniciante', cor: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' };
    };

    // 7. Finalmente cria o array do Ranking aplicando as posições
    const rankingFinal = dadosAtualizados.map((lider, index) => ({
      ...lider,
      posicao: index + 1,
      maturidade: calcularMaturidade(lider.xpTotal, lider.atasTotal)
    }));

    setLideres(rankingFinal);
  }, []);

  const areasUnicas = ['Todas', ...new Set(lideres.map(l => l.area))];
  const lideresFiltrados = areaFiltro === 'Todas' ? lideres : lideres.filter(l => l.area === areaFiltro);

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-500/10 rounded-full mb-4">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Liga de Ouro</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Os líderes mais engajados no desenvolvimento contínuo de suas equipes.
        </p>
      </div>

      {/* FILTRO DE ÁREA DE ATUAÇÃO */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
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

      <div className="space-y-4">
        {lideresFiltrados.map((lider, index) => (
          <div 
            key={lider.id} 
            className={`flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl border shadow-sm transition-transform hover:scale-[1.01] gap-4 ${
              index === 0 && areaFiltro === 'Todas'
                ? 'border-amber-300 dark:border-amber-500/50 shadow-amber-500/10'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Posição */}
              <div className="w-10 text-center font-black text-3xl text-slate-300 dark:text-slate-600">
                #{lider.posicao}
              </div>
              
              {/* Foto */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-4 flex-shrink-0 ${
                index === 0 && areaFiltro === 'Todas' ? 'border-amber-400' : 
                index === 1 && areaFiltro === 'Todas' ? 'border-slate-300' : 
                index === 2 && areaFiltro === 'Todas' ? 'border-orange-400' : 
                'border-slate-100 dark:border-slate-700'
              } bg-slate-100 dark:bg-slate-800`}>
                {lider.foto ? (
                  <img src={lider.foto} alt={lider.nome} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-slate-400">{lider.nome.charAt(0)}</span>
                )}
              </div>

              {/* Informações */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-none">
                    {lider.nome}
                  </h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${lider.maturidade.cor} ${lider.maturidade.bg}`}>
                    {lider.maturidade.nivel}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  {lider.cargo} <span className="mx-1">•</span> {lider.area}
                </p>
                
                {/* Títulos / Pódios */}
                {areaFiltro === 'Todas' && (
                  <div className="flex gap-2">
                    {index === 0 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-500/30">
                        <Medal className="w-4 h-4" /> Titã das 1:1s
                      </span>
                    )}
                    {index === 1 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-600">
                        <Medal className="w-4 h-4" /> Líder de Impacto
                      </span>
                    )}
                    {index === 2 && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-200 dark:border-orange-800/30">
                        <Medal className="w-4 h-4" /> Gestor Engajado
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* DRIVERS DE MATURIDADE & XP */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
              
              <div className="flex gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <div className="flex items-center gap-1" title="Ritos Realizados">
                  <Activity className="w-3.5 h-3.5" /> {lider.ritosTotal}
                </div>
                <div className="flex items-center gap-1" title="Atas Baixadas">
                  <FileText className="w-3.5 h-3.5" /> {lider.atasTotal}
                </div>
                <div className="flex items-center gap-1" title="PDIs Ativos">
                  <Target className="w-3.5 h-3.5" /> {lider.pdisTotal}
                </div>
              </div>

              <div className={`flex items-center gap-1.5 font-bold text-2xl leading-none ${
                index === 0 && areaFiltro === 'Todas' ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'
              }`}>
                <Zap className="w-6 h-6" />
                {lider.xpTotal} <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">XP</span>
              </div>
            </div>

          </div>
        ))}

        {lideresFiltrados.length === 0 && (
          <div className="text-center p-8 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            Nenhum líder encontrado nesta área.
          </div>
        )}
      </div>
    </div>
  );
}