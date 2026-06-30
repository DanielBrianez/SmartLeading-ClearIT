// src/views/Ranking.jsx
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Zap, Filter, Target, FileText, Activity } from 'lucide-react';
import minhaFoto from '../assets/daniel-foto.jpg'; // Sua foto oficial

export default function Ranking() {
  const [lideres, setLideres] = useState([]);
  const [areaFiltro, setAreaFiltro] = useState('Todas');

  useEffect(() => {
    // 1. Abre os cofres do navegador
    const rankingSalvo = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
    const atasSalvas = JSON.parse(localStorage.getItem('@clearit-atas-squad')) || [];
    const pdisSalvos = JSON.parse(localStorage.getItem('@clearit-pdi')) || [];
    
    // Calcula os dados reais do Daniel (Líder Logado)
    const xpGanho = rankingSalvo['daniel_nascimento'] || 0;
    const atasGeradas = atasSalvas.length;
    const pdisAtivos = pdisSalvos.length;
    // Ritos = Atas geradas + 1 (reunião inicial)
    const ritosRealizados = atasGeradas > 0 ? atasGeradas + 1 : 0;

    // 2. Base de Competidores (Mocks + Dados Iniciais)
    const baseCompetidores = [
      { 
        id: 'daniel_nascimento', nome: 'Daniel Nascimento', cargo: 'Tech Lead', area: 'Engenharia', foto: minhaFoto, 
        xpBase: 0, ritosBase: 0, atasBase: 0, pdisBase: 0 
      },
      { 
        id: 'juliana_castro', nome: 'Juliana Castro', cargo: 'Agile Coach', area: 'Produto', foto: null, 
        xpBase: 450, ritosBase: 5, atasBase: 4, pdisBase: 2 
      },
      { 
        id: 'marcos_vinicius', nome: 'Marcos Vinícius', cargo: 'Coord. de TI', area: 'Engenharia', foto: null, 
        xpBase: 850, ritosBase: 12, atasBase: 10, pdisBase: 8 
      },
      { 
        id: 'sara_lima', nome: 'Sara Lima', cargo: 'Design Lead', area: 'Design', foto: null, 
        xpBase: 300, ritosBase: 3, atasBase: 2, pdisBase: 1 
      },
      { 
        id: 'carlos_eduardo', nome: 'Carlos Eduardo', cargo: 'Engenheiro Sênior', area: 'Engenharia', foto: null, 
        xpBase: 450, ritosBase: 4, atasBase: 2, pdisBase: 1 // Mesmo XP da Juliana, mas perde no desempate de Atas
      }
    ];

    // 3. Processa o Motor de Maturidade
    const rankingCalculado = baseCompetidores.map(lider => {
      // Se for o Daniel, injeta os dados reais do sistema. Se não, usa o base.
      const isLogado = lider.id === 'daniel_nascimento';
      const xpTotal = lider.xpBase + (isLogado ? xpGanho : 0);
      const atasTotal = lider.atasBase + (isLogado ? atasGeradas : 0);
      const ritosTotal = lider.ritosBase + (isLogado ? ritosRealizados : 0);
      const pdisTotal = lider.pdisBase + (isLogado ? pdisAtivos : 0);

      // Calculadora de Nível de Maturidade (Dor 1)
      let maturidade = { nivel: 'Iniciante', cor: 'bg-slate-100 text-slate-600 border-slate-200' };
      if (xpTotal >= 800) maturidade = { nivel: 'Referência', cor: 'bg-purple-100 text-purple-700 border-purple-200' };
      else if (xpTotal >= 500) maturidade = { nivel: 'Consistente', cor: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      else if (xpTotal >= 200) maturidade = { nivel: 'Em Desenvolvimento', cor: 'bg-blue-100 text-blue-700 border-blue-200' };

      return {
        ...lider, xpTotal, atasTotal, ritosTotal, pdisTotal, maturidade
      };
    });

    // 4. Regra de Ordenação com DESEMPATE POR ATAS (Dor 1)
    rankingCalculado.sort((a, b) => {
      if (b.xpTotal !== a.xpTotal) {
        return b.xpTotal - a.xpTotal; // Maior XP primeiro
      }
      return b.atasTotal - a.atasTotal; // Desempate: Maior taxa de Atas
    });

    setLideres(rankingCalculado);
  }, []);

  // Extrai as áreas únicas para o filtro
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
                #{index + 1}
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
                  {/* BADGE DE MATURIDADE DINÂMICA */}
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${lider.maturidade.cor}`}>
                    {lider.maturidade.nivel}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  {lider.cargo} <span className="mx-1">•</span> {lider.area}
                </p>
                
                {/* Títulos / Pódios (Só aparecem se não tiver filtro) */}
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
              
              {/* DRIVERS: Ritos, Atas, PDI */}
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

              {/* XP */}
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