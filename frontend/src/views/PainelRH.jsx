// src/views/PainelRH.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, TrendingUp, Users, Target, 
  FileText, Activity, HeartPulse, ShieldCheck, FilterX, MousePointerClick
} from 'lucide-react';

export default function PainelRH() {
  const [metricas, setMetricas] = useState({
    atasGeradas: 0,
    pdisAtivos: 0,
    tasksConcluidas: 0
  });

  // Estado mágico do "Power BI": Qual mês está clicado? (null = visão geral)
  const [mesSelecionado, setMesSelecionado] = useState(null);
  const chartRef = useRef(null);

  const carregarDados = () => {
    const atas = JSON.parse(localStorage.getItem('@clearit-atas-squad')) || [];
    const pdis = JSON.parse(localStorage.getItem('@clearit-pdi')) || [];
    const pdisDeletados = JSON.parse(localStorage.getItem('@clearit-deleted-pdi')) || [];
    const pdisValidos = pdis.filter(p => !pdisDeletados.includes(p.id));

    const tasks = JSON.parse(localStorage.getItem('@clearit-tasks')) || [];
    const tasksDeletadas = JSON.parse(localStorage.getItem('@clearit-deleted-tasks')) || [];
    const tasksValidas = tasks.filter(t => !tasksDeletadas.includes(t.id));

    const tasksFeitas = tasksValidas.filter(t => t.status.toLowerCase() === 'concluida').length;

    setMetricas({
      atasGeradas: atas.length,
      pdisAtivos: pdisValidos.length,
      tasksConcluidas: tasksFeitas
    });
  };

  useEffect(() => {
    carregarDados();
    window.addEventListener('storage', carregarDados);
    return () => window.removeEventListener('storage', carregarDados);
  }, []);

  // Clique fora do gráfico para limpar o filtro (Efeito Power BI)
  useEffect(() => {
    function handleClickOutside(event) {
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        // Se quiser que clique em qualquer lugar da tela limpe o filtro, descomente a linha abaixo:
        // setMesSelecionado(null); 
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Base de Dados Simulada (Mocks) + Seus Dados Reais no Mês Atual (Junho)
  const historicoMeses = [
    { nome: 'Jan', atas: 32, pdis: 12, tasks: 45, enps: 71, adocao: 65 },
    { nome: 'Fev', atas: 45, pdis: 15, tasks: 52, enps: 73, adocao: 68 },
    { nome: 'Mar', atas: 58, pdis: 18, tasks: 60, enps: 75, adocao: 72 },
    { nome: 'Abr', atas: 52, pdis: 14, tasks: 55, enps: 74, adocao: 70 },
    { nome: 'Mai', atas: 70, pdis: 20, tasks: 75, enps: 76, adocao: 78 },
    { 
      nome: 'Jun', 
      atas: 85 + metricas.atasGeradas, 
      pdis: 22 + metricas.pdisAtivos, 
      tasks: 80 + metricas.tasksConcluidas, 
      enps: 78, 
      adocao: 82 
    }
  ];

  // Calculadora da Visão Geral (Soma o semestre inteiro)
  const visaoGeral = {
    nome: 'Visão Geral (Semestre)',
    atas: historicoMeses.reduce((acc, curr) => acc + curr.atas, 0),
    pdis: historicoMeses.reduce((acc, curr) => acc + curr.pdis, 0),
    tasks: historicoMeses.reduce((acc, curr) => acc + curr.tasks, 0),
    enps: Math.round(historicoMeses.reduce((acc, curr) => acc + curr.enps, 0) / 6),
    adocao: Math.round(historicoMeses.reduce((acc, curr) => acc + curr.adocao, 0) / 6),
  };

  // Se um mês foi clicado, exibe os dados dele. Se não, exibe a Visão Geral.
  const dadosExibidos = mesSelecionado !== null ? historicoMeses[mesSelecionado] : visaoGeral;
  
  // Para o gráfico escalar bonito, precisamos do maior valor de Atas
  const maiorValorAtas = Math.max(...historicoMeses.map(m => m.atas));

  const handleBarClick = (index) => {
    // Se clicar na mesma barra que já tá selecionada, ele deseleciona (limpa)
    if (mesSelecionado === index) {
      setMesSelecionado(null);
    } else {
      setMesSelecionado(index);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.4s_ease-out]">
      
      {/* Cabeçalho */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            People Analytics
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Visão gerencial dinâmica. Clique no gráfico para filtrar os dados.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
          
          {/* BOTÃO LIMPAR FILTRO (Só aparece se um mês estiver selecionado) */}
          {mesSelecionado !== null && (
            <button 
              onClick={() => setMesSelecionado(null)}
              className="flex items-center gap-1.5 bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl shadow-md text-sm font-bold transition-transform hover:scale-105 animate-[fadeIn_0.2s_ease-out]"
            >
              <FilterX className="w-4 h-4" />
              Limpar Filtro ({historicoMeses[mesSelecionado].nome})
            </button>
          )}

          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm text-sm font-bold">
            <ShieldCheck className="w-4 h-4" />
            LGPD Ativa
          </div>
        </div>
      </div>

      {/* Título de Contexto Dinâmico */}
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2 transition-all">
        Exibindo Dados: <span className="text-indigo-600 dark:text-indigo-400">{dadosExibidos.nome}</span>
      </h3>

      {/* 4 Cards Principais de KPI (AGORA 100% DINÂMICOS!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
              <HeartPulse className="w-6 h-6" />
            </div>
            {/* Um charminho visual: só mostra o "+ pts" se for visão geral ou meses de alta */}
            {dadosExibidos.enps >= 74 && (
              <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md animate-[fadeIn_0.3s]">
                <TrendingUp className="w-3 h-3" /> Alta
              </span>
            )}
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 transition-all">
            {dadosExibidos.enps}
          </h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score de eNPS</p>
          <p className="text-xs text-slate-400 mt-2">{dadosExibidos.enps >= 75 ? 'Zona de Excelência' : 'Zona de Atenção'}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 transition-all">
            {dadosExibidos.adocao}%
          </h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Adoção da Liderança</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${dadosExibidos.adocao}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 transition-all">
            {dadosExibidos.atas}
          </h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Atas Geradas {mesSelecionado !== null ? `(${historicoMeses[mesSelecionado].nome})` : ''}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {mesSelecionado === 5 || mesSelecionado === null 
              ? `Inclui suas ${metricas.atasGeradas} atas no mês atual.` 
              : 'Dados consolidados e auditados.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 transition-all">
            {dadosExibidos.pdis}
          </h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PDIs Ativos</p>
          <p className="text-xs text-emerald-500 font-medium mt-2">{dadosExibidos.tasks} passos concluídos com sucesso</p>
        </div>

      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GRÁFICO DE BARRAS INTERATIVO */}
        <div 
          ref={chartRef}
          className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Volume de 1:1s (Histórico)
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
              <MousePointerClick className="w-3 h-3" /> Clique nas barras
            </span>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-2 mb-4 mt-8">
            {historicoMeses.map((mes, index) => {
              const altura = (mes.atas / maiorValorAtas) * 100;
              
              // Lógica de visual do Power BI (opacidade cai pros não-selecionados)
              const isSelected = mesSelecionado === index;
              const isDimmed = mesSelecionado !== null && !isSelected;
              
              return (
                <div 
                  key={index} 
                  onClick={() => handleBarClick(index)}
                  className={`flex flex-col items-center flex-1 group h-full cursor-pointer transition-opacity duration-300 ${isDimmed ? 'opacity-40 hover:opacity-70' : 'opacity-100'}`}
                >
                  <div className="w-full relative flex justify-center items-end h-full">
                    {/* Tooltip */}
                    <span className={`absolute -top-8 text-xs font-bold transition-all duration-200 ${isSelected ? 'opacity-100 text-indigo-600 dark:text-indigo-400 scale-110' : 'opacity-0 group-hover:opacity-100 text-slate-600 dark:text-slate-300'}`}>
                      {mes.atas}
                    </span>
                    
                    <div 
                      className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out ${
                        isSelected 
                        ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                        : 'bg-indigo-400/60 hover:bg-indigo-500 dark:bg-indigo-500/50 dark:hover:bg-indigo-500/80'
                      }`}
                      style={{ height: `${altura}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs mt-3 font-bold transition-colors ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                    {mes.nome}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BARRAS DE PROGRESSO (Adesão por Área) */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Saúde e Adesão por Área
          </h3>
          
          <div className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-800 dark:text-slate-200">Engenharia e Tech</span>
                <span className="text-emerald-500">92%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-800 dark:text-slate-200">Produto (PMs e POs)</span>
                <span className="text-blue-500">75%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-800 dark:text-slate-200">Design e UX</span>
                <span className="text-amber-500">60%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 mt-4 text-sm text-slate-600 dark:text-slate-400">
              <strong>Insight de IA:</strong> A área de Design apresenta queda de engajamento em PDIs neste trimestre. Recomenda-se um workshop de alinhamento com as lideranças do setor.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}