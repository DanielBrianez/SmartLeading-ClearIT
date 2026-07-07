// src/views/PainelRH.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, ShieldCheck, CalendarDays, FilterX, HeartPulse, TrendingUp, Users, Target, FileText, Activity, MousePointerClick
} from 'lucide-react';
import { DB_SQUADS } from '../dados';
import { lerLGPD } from '../utils/security';

export default function PainelRH() {
  const calcularMetricas = () => {
    const atas = lerLGPD('@clearit-atas-squad') || [];
    const pdisSalvos = lerLGPD('@clearit-pdi') || [];    
    const pdisDeletados = lerLGPD('@clearit-deleted-pdi') || [];
    const tasksSalvas = lerLGPD('@clearit-tasks') || [];
    const tasksDeletadas = lerLGPD('@clearit-deleted-tasks') || [];

    const meuTime = DB_SQUADS['daniel_nascimento'] || [];
    let totalPdisAtivos = 0;
    let totalTasksConcluidas = 0;

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

      const tasksBase = membro.tarefas || [];
      const tasksSalvasDoMembro = tasksSalvas.filter(t => t.idLiderado === membro.id.toString());
      const savedTasksMap = new Map(tasksSalvasDoMembro.map(t => [t.id, t]));
      let tasksCombinadas = [
        ...tasksBase.map(t => savedTasksMap.has(t.id) ? savedTasksMap.get(t.id) : t),
        ...tasksSalvasDoMembro.filter(t => !tasksBase.find(bt => bt.id === t.id))
      ];
      const tasksConcluidasDesteMembro = tasksCombinadas.filter(t => !tasksDeletadas.includes(t.id) && t.status.toLowerCase() === 'concluida');
      totalTasksConcluidas += tasksConcluidasDesteMembro.length;
    });

    return {
      atasGeradas: atas.length,
      pdisAtivos: totalPdisAtivos,
      tasksConcluidas: totalTasksConcluidas
    };
  };

  const [metricas, setMetricas] = useState(calcularMetricas);

  // ESTADOS DOS FILTROS (DASHBOARD)
  const [tipoFiltroTempo, setTipoFiltroTempo] = useState('ANO'); // 'ANO', 'SEMESTRE', 'TRIMESTRE'
  const [subFiltroTempo, setSubFiltroTempo] = useState('1'); // '1','2' para S; '1' a '4' para Q
  const [mesSelecionado, setMesSelecionado] = useState(null); // Clique direto na barra
  const chartRef = useRef(null);

  const carregarDados = () => {
    setMetricas(calcularMetricas());
  };

  useEffect(() => {
    carregarDados();
    window.addEventListener('storage', carregarDados);
    window.addEventListener('clearit-data-updated', carregarDados);
    return () => {
      window.removeEventListener('storage', carregarDados);
      window.removeEventListener('clearit-data-updated', carregarDados);
    };
  }, []);

  // Lógica para mudar a visualização do Dashboard
  const mudarFiltroPrincipal = (tipo) => {
    setTipoFiltroTempo(tipo);
    setMesSelecionado(null); // Reseta a barra selecionada
    
    // Auto-seleciona o momento atual pra facilitar a vida do usuário
    const mesAtual = new Date().getMonth();
    if (tipo === 'SEMESTRE') {
      setSubFiltroTempo(mesAtual < 6 ? '1' : '2');
    } else if (tipo === 'TRIMESTRE') {
      setSubFiltroTempo(String(Math.floor(mesAtual / 3) + 1));
    }
  };

  const mudarSubFiltro = (sub) => {
    setSubFiltroTempo(sub);
    setMesSelecionado(null);
  };

  // Clique fora do gráfico para limpar o filtro de mês
  useEffect(() => {
    function handleClickOutside(event) {
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        // Opcional: Descomente para clicar fora e limpar seleção da barra
        // setMesSelecionado(null); 
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 BASE MOCK DO ANO INTEIRO (Agora com os dados das áreas separados por mês)
  const baseMock = [
    { nome: 'Jan', atas: 32, pdis: 12, tasks: 45, enps: 71, adocao: 65, areas: { engenharia: 70, produto: 62, design: 55 } },
    { nome: 'Fev', atas: 45, pdis: 15, tasks: 52, enps: 73, adocao: 68, areas: { engenharia: 75, produto: 68, design: 58 } },
    { nome: 'Mar', atas: 58, pdis: 18, tasks: 60, enps: 75, adocao: 72, areas: { engenharia: 80, produto: 72, design: 60 } },
    { nome: 'Abr', atas: 52, pdis: 14, tasks: 55, enps: 74, adocao: 70, areas: { engenharia: 82, produto: 70, design: 62 } },
    { nome: 'Mai', atas: 70, pdis: 20, tasks: 75, enps: 76, adocao: 78, areas: { engenharia: 88, produto: 76, design: 65 } },
    { nome: 'Jun', atas: 85, pdis: 22, tasks: 80, enps: 78, adocao: 82, areas: { engenharia: 92, produto: 80, design: 68 } },
    { nome: 'Jul', atas: 15, pdis: 5,  tasks: 12, enps: 79, adocao: 85, areas: { engenharia: 94, produto: 82, design: 70 } }, 
    { nome: 'Ago', atas: 0,  pdis: 0,  tasks: 0,  enps: 0,  adocao: 0,  areas: { engenharia: 0,  produto: 0,  design: 0 } },
    { nome: 'Set', atas: 0,  pdis: 0,  tasks: 0,  enps: 0,  adocao: 0,  areas: { engenharia: 0,  produto: 0,  design: 0 } },
    { nome: 'Out', atas: 0,  pdis: 0,  tasks: 0,  enps: 0,  adocao: 0,  areas: { engenharia: 0,  produto: 0,  design: 0 } },
    { nome: 'Nov', atas: 0,  pdis: 0,  tasks: 0,  enps: 0,  adocao: 0,  areas: { engenharia: 0,  produto: 0,  design: 0 } },
    { nome: 'Dez', atas: 0,  pdis: 0,  tasks: 0,  enps: 0,  adocao: 0,  areas: { engenharia: 0,  produto: 0,  design: 0 } }
  ];

  const mesAtual = new Date().getMonth();

  // 1. Injeta os dados do usuário no mês exato em que estamos hoje
  const dadosDoAno = baseMock.map((mes, index) => {
    if (index === mesAtual) {
      return {
        ...mes,
        atas: mes.atas + metricas.atasGeradas,
        pdis: mes.pdis + metricas.pdisAtivos,
        tasks: mes.tasks + metricas.tasksConcluidas,
        enps: mes.enps || 75,
        adocao: mes.adocao || 70,
        areas: mes.areas.engenharia > 0 ? mes.areas : { engenharia: 85, produto: 75, design: 65 }
      };
    }
    return mes;
  });

  // 2. Fatiador de Tempo (O que o usuário vai ver no gráfico)
  let mesesFiltrados = [];
  let tituloFiltro = '';

  if (tipoFiltroTempo === 'ANO') {
    mesesFiltrados = dadosDoAno.slice(0, Math.max(mesAtual + 1, 6)); // Mostra até o presente, garantindo mínimo 1S
    tituloFiltro = `Ano de ${new Date().getFullYear()}`;
  } else if (tipoFiltroTempo === 'SEMESTRE') {
    if (subFiltroTempo === '1') { mesesFiltrados = dadosDoAno.slice(0, 6); tituloFiltro = '1º Semestre (Jan-Jun)'; }
    else { mesesFiltrados = dadosDoAno.slice(6, 12); tituloFiltro = '2º Semestre (Jul-Dez)'; }
  } else if (tipoFiltroTempo === 'TRIMESTRE') {
    if (subFiltroTempo === '1') { mesesFiltrados = dadosDoAno.slice(0, 3); tituloFiltro = 'Q1 (Jan-Mar)'; }
    else if (subFiltroTempo === '2') { mesesFiltrados = dadosDoAno.slice(3, 6); tituloFiltro = 'Q2 (Abr-Jun)'; }
    else if (subFiltroTempo === '3') { mesesFiltrados = dadosDoAno.slice(6, 9); tituloFiltro = 'Q3 (Jul-Set)'; }
    else if (subFiltroTempo === '4') { mesesFiltrados = dadosDoAno.slice(9, 12); tituloFiltro = 'Q4 (Out-Dez)'; }
  }

  const historicoMeses = mesesFiltrados;

  // 3. Calculadora de Médias para a Visão Geral
  // (Filtramos meses > 0 pra média não despencar em meses não vividos)
  const mesesComDados = historicoMeses.filter(m => m.enps > 0);
  const div = mesesComDados.length || 1;

  const visaoAgrupada = {
    nome: tituloFiltro,
    atas: historicoMeses.reduce((acc, curr) => acc + curr.atas, 0),
    pdis: historicoMeses.reduce((acc, curr) => acc + curr.pdis, 0),
    tasks: historicoMeses.reduce((acc, curr) => acc + curr.tasks, 0),
    enps: Math.round(mesesComDados.reduce((acc, curr) => acc + curr.enps, 0) / div),
    adocao: Math.round(mesesComDados.reduce((acc, curr) => acc + curr.adocao, 0) / div),
    areas: {
      engenharia: Math.round(mesesComDados.reduce((acc, curr) => acc + curr.areas.engenharia, 0) / div),
      produto: Math.round(mesesComDados.reduce((acc, curr) => acc + curr.areas.produto, 0) / div),
      design: Math.round(mesesComDados.reduce((acc, curr) => acc + curr.areas.design, 0) / div),
    }
  };

  const dadosExibidos = mesSelecionado !== null ? historicoMeses[mesSelecionado] : visaoAgrupada;
  const maiorValorAtas = Math.max(...historicoMeses.map(m => m.atas), 10);

  return (
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.4s_ease-out]">
      
      {/* Cabeçalho Fixo */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            People Analytics
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Visão gerencial dinâmica. Filtre os períodos abaixo.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm text-sm font-bold">
          <ShieldCheck className="w-4 h-4" />
          LGPD Ativa
        </div>
      </div>

      {/* CONTROLES DE TEMPO (DASHBOARD) */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        <div className="flex items-center gap-2 text-slate-400 border-r border-slate-200 dark:border-slate-700 pr-4">
          <CalendarDays className="w-5 h-5" />
          <span className="text-sm font-bold">Período:</span>
        </div>

        {/* Botões Principais (Pills) */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl inline-flex gap-1 self-start">
          <button 
            onClick={() => mudarFiltroPrincipal('ANO')} 
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${tipoFiltroTempo === 'ANO' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Ano Inteiro
          </button>
          <button 
            onClick={() => mudarFiltroPrincipal('SEMESTRE')} 
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${tipoFiltroTempo === 'SEMESTRE' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Semestre
          </button>
          <button 
            onClick={() => mudarFiltroPrincipal('TRIMESTRE')} 
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${tipoFiltroTempo === 'TRIMESTRE' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            Quarter
          </button>
        </div>

        {/* Sub-Filtros Dinâmicos */}
        {tipoFiltroTempo === 'SEMESTRE' && (
          <div className="flex gap-2 animate-[fadeIn_0.2s_ease-out]">
            <button onClick={() => mudarSubFiltro('1')} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${subFiltroTempo === '1' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50'}`}>S1 (Jan-Jun)</button>
            <button onClick={() => mudarSubFiltro('2')} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${subFiltroTempo === '2' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50'}`}>S2 (Jul-Dez)</button>
          </div>
        )}

        {tipoFiltroTempo === 'TRIMESTRE' && (
          <div className="flex gap-2 animate-[fadeIn_0.2s_ease-out] overflow-x-auto hide-scrollbar">
            {['1', '2', '3', '4'].map(q => (
              <button key={q} onClick={() => mudarSubFiltro(q)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex-shrink-0 ${subFiltroTempo === q ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50'}`}>
                Q{q}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex-1"></div>

        {mesSelecionado !== null ? (
          <button 
            onClick={() => setMesSelecionado(null)}
            className="flex items-center gap-1.5 bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-1.5 rounded-lg shadow-sm text-xs font-bold transition-transform hover:scale-105 animate-[fadeIn_0.2s_ease-out]"
          >
            <FilterX className="w-3.5 h-3.5" />
            Limpar Filtro ({historicoMeses[mesSelecionado].nome})
          </button>
        ) : (
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
            Visão: <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">{dadosExibidos.nome}</span>
          </h3>
        )}
      </div>

      {/* 4 Cards Principais de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
              <HeartPulse className="w-6 h-6" />
            </div>
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
            Atas Geradas
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {mesSelecionado === mesAtual || mesSelecionado === null 
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
          <p className="text-xs text-emerald-500 font-medium mt-2">{dadosExibidos.tasks} tarefas concluídas pela base</p>
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
              const isSelected = mesSelecionado === index;
              const isDimmed = mesSelecionado !== null && !isSelected;
              
              return (
                <div 
                  key={index} 
                  onClick={() => setMesSelecionado(mesSelecionado === index ? null : index)}
                  className={`flex flex-col items-center flex-1 group h-full cursor-pointer transition-opacity duration-300 ${isDimmed ? 'opacity-40 hover:opacity-70' : 'opacity-100'}`}
                >
                  <div className="w-full relative flex justify-center items-end h-full">
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

        {/* BARRAS DE PROGRESSO */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Saúde e Adesão por Área
          </h3>
          
          <div className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-800 dark:text-slate-200">Engenharia e Tech</span>
                <span className="text-emerald-500">{dadosExibidos.areas?.engenharia || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${dadosExibidos.areas?.engenharia || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-800 dark:text-slate-200">Produto (PMs e POs)</span>
                <span className="text-blue-500">{dadosExibidos.areas?.produto || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${dadosExibidos.areas?.produto || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-800 dark:text-slate-200">Design e UX</span>
                <span className="text-amber-500">{dadosExibidos.areas?.design || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${dadosExibidos.areas?.design || 0}%` }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 mt-4 text-sm text-slate-600 dark:text-slate-400">
              <strong>Insight de IA:</strong> A área de Design apresenta queda de engajamento em PDIs neste período. Recomenda-se um workshop de alinhamento com as lideranças do setor.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}