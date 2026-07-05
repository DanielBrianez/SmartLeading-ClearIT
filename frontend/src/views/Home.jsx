// src/views/Home.jsx
import React, { useState, useEffect } from 'react';
import { 
  Zap, Calendar, AlertCircle, ArrowRight, 
  Activity, Target, FileText, Clock, CheckCircle2 
} from 'lucide-react';
import { DB_SQUADS } from '../dados';
import { lerLGPD } from '../utils/security';

export default function Home({ setAbaAtiva }) {
  const [saudacao, setSaudacao] = useState('Olá');
  // 🔥 CORREÇÃO: Adicionei "membros" aqui no estado!
  const [metricas, setMetricas] = useState({ xp: 0, atas: 0, pdis: 0, tasksConcluidas: 0, membros: 0 });
  const [proximasReunioes, setProximasReunioes] = useState([]);
  const [radarAtencao, setRadarAtencao] = useState([]);

  const idLiderLogado = "daniel_nascimento";

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) setSaudacao('Bom dia');
    else if (hora < 18) setSaudacao('Boa tarde');
    else setSaudacao('Boa noite');

    const rankingSalvo = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
    const reunioesAdiadas = JSON.parse(localStorage.getItem('@clearit-reunioes-adiadas')) || {};
    const atasSalvas = lerLGPD('@clearit-atas-squad') || [];
    const pdisSalvos = lerLGPD('@clearit-pdi') || [];
    const pdisDeletados = lerLGPD('@clearit-deleted-pdi') || [];
    const tasksSalvas = lerLGPD('@clearit-tasks') || [];
    const tasksDeletadas = lerLGPD('@clearit-deleted-tasks') || [];

    const meuTimeBase = DB_SQUADS[idLiderLogado] || [];
    const xpGanho = rankingSalvo[idLiderLogado] || 0;
    
    let totalPdisAtivos = 0;
    let totalTasksConcluidas = 0;
    let alertas = [];
    
    const hojeTsZero = new Date().setHours(0,0,0,0);

    meuTimeBase.forEach(membro => {
      // --- CÁLCULO DE PDIs ---
      const pdiBase = [
        { id: `estatico_pdi_1_${membro.id}`, acao: 'Certificação Técnica Relevante', status: 'Em andamento' },
        { id: `estatico_pdi_2_${membro.id}`, acao: 'Mentoria com Tech Lead', status: 'No prazo' }
      ];
      const pdiSalvosDoMembro = pdisSalvos.filter(p => p.idLiderado === membro.id.toString());
      const savedPdiMap = new Map(pdiSalvosDoMembro.map(p => [p.id, p]));
      
      let pdiCombinados = [
        ...pdiBase.map(p => savedPdiMap.has(p.id) ? savedPdiMap.get(p.id) : p),
        ...pdiSalvosDoMembro.filter(p => !pdiBase.find(bp => bp.id === p.id))
      ];
      
      const pdisAtivosDesteMembro = pdiCombinados.filter(p => !pdisDeletados.includes(p.id) && p.status !== 'Concluído');
      totalPdisAtivos += pdisAtivosDesteMembro.length;

      pdisAtivosDesteMembro.forEach(pdi => {
        const statusPdi = pdi.status ? pdi.status.toLowerCase() : '';
        const isStatusExpirado = statusPdi === 'expirado' || statusPdi === 'atrasado';
        const isTempoExpirado = pdi.dataExpiracaoTs && pdi.dataExpiracaoTs < hojeTsZero;

        if ((isStatusExpirado || isTempoExpirado) && statusPdi !== 'concluído' && statusPdi !== 'concluido') {
          alertas.push({
            id: pdi.id,
            tipo: 'pdi',
            mensagem: `PDI Expirado: ${membro.nome}`,
            detalhe: pdi.acao || 'Ação de desenvolvimento',
            cor: 'red'
          });
        }
      });

      // --- CÁLCULO DE TASKS ---
      const tasksBase = membro.tarefas || [];
      const tasksSalvasDoMembro = tasksSalvas.filter(t => t.idLiderado === membro.id.toString());
      const savedTasksMap = new Map(tasksSalvasDoMembro.map(t => [t.id, t]));
      
      let tasksCombinadas = [
        ...tasksBase.map(t => savedTasksMap.has(t.id) ? savedTasksMap.get(t.id) : t),
        ...tasksSalvasDoMembro.filter(t => !tasksBase.find(bt => bt.id === t.id))
      ];
      
      const tasksAtivasDesteMembro = tasksCombinadas.filter(t => !tasksDeletadas.includes(t.id));
      const tasksConcluidasDesteMembro = tasksAtivasDesteMembro.filter(t => t.status.toLowerCase() === 'concluida');
      totalTasksConcluidas += tasksConcluidasDesteMembro.length;

      tasksAtivasDesteMembro.forEach(task => {
        const statusTask = task.status ? task.status.toLowerCase() : '';
        const isStatusExpirada = statusTask === 'expirada' || statusTask === 'atrasada';
        let isTempoExpirada = false;
        
        if (task.ddl && statusTask !== 'concluida') {
          const taskTs = new Date(`${task.ddl}T00:00:00`).getTime();
          if (taskTs < hojeTsZero) isTempoExpirada = true;
        }

        if ((isStatusExpirada || isTempoExpirada) && statusTask !== 'concluida') {
          alertas.push({
            id: `task_exp_${task.id}`,
            tipo: 'task',
            mensagem: `Acordo Atrasado: ${membro.nome}`,
            detalhe: task.nome || 'Tarefa sem nome',
            cor: 'red'
          });
        }
      });
    });

    setMetricas({
      xp: xpGanho,
      atas: atasSalvas.length,
      pdis: totalPdisAtivos,
      tasksConcluidas: totalTasksConcluidas,
      membros: meuTimeBase.length // 🔥 CORREÇÃO: Agora puxa o tamanho real do array!
    });

    // --- CÁLCULO DE PRÓXIMAS REUNIÕES ---
    const reunioesCalculadas = meuTimeBase.map(membro => {
      const idStr = membro.id.toString();
      const atasDoMembro = atasSalvas.filter(a => a.idLiderado === idStr);
      let dataProximaObj;

      if (reunioesAdiadas[idStr]) {
        dataProximaObj = new Date(`${reunioesAdiadas[idStr]}T00:00:00`);
      } else {
        let dataUltima = membro.ultimaReuniao;
        if (atasDoMembro.length > 0) {
          const dataBR = atasDoMembro[0].data; 
          const partes = dataBR.split('/');
          if(partes.length === 3) {
            dataUltima = `${partes[2]}-${partes[1]}-${partes[0]}`;
          }
        }
        dataProximaObj = new Date(`${dataUltima}T00:00:00`);
        dataProximaObj.setDate(dataProximaObj.getDate() + 15);
      }

      const proximaTsZero = dataProximaObj.getTime();
      const diasFaltando = Math.round((proximaTsZero - hojeTsZero) / (1000 * 60 * 60 * 24));

      return { ...membro, dataProxima: dataProximaObj, diasFaltando };
    });

    reunioesCalculadas.sort((a, b) => a.diasFaltando - b.diasFaltando);
    setProximasReunioes(reunioesCalculadas.slice(0, 3));

    reunioesCalculadas.forEach(reuniao => {
      if (reuniao.diasFaltando < 0) {
        const textoAtraso = reuniao.diasFaltando === -1 ? 'Ontem' : `Há ${Math.abs(reuniao.diasFaltando)} dias`;
        alertas.push({
          id: `atraso_${reuniao.id}`,
          tipo: 'reuniao',
          mensagem: `1:1 Atrasada (${textoAtraso})`,
          detalhe: `Agende com ${reuniao.nome} urgente.`,
          cor: 'amber'
        });
      }
    });

    setRadarAtencao(alertas);
  }, []);

  const handleIrParaSquad = () => {
    if (setAbaAtiva) setAbaAtiva('Meu squad');
  };

  const handleIniciar1a1 = (idLiderado) => {
    lerLGPD('@clearit-liderado-foco', idLiderado);
    if (setAbaAtiva) setAbaAtiva('1a1'); 
  };

  const renderStatus = (diasFaltando) => {
    if (diasFaltando === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">
          <Clock className="w-4 h-4" /> Hoje
        </span>
      );
    } else if (diasFaltando === 1) {
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
          <Clock className="w-4 h-4" /> Amanhã
        </span>
      );
    } else if (diasFaltando > 1 && diasFaltando <= 5) {
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
          <Clock className="w-4 h-4" /> Em {diasFaltando} dias
        </span>
      );
    } else if (diasFaltando > 5) {
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
          <CheckCircle2 className="w-4 h-4" /> No prazo
        </span>
      );
    } else if (diasFaltando === -1) {
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg">
          <AlertCircle className="w-4 h-4" /> Ontem
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg">
          <AlertCircle className="w-4 h-4" /> Há {Math.abs(diasFaltando)} dias
        </span>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.4s_ease-out] pb-10">
      
      {/* 🚀 HERO SECTION (Saudação e XP) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 shadow-lg text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
              {saudacao}, Daniel! 👋
            </h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Aqui está o resumo do seu squad hoje. Você tem {proximasReunioes.filter(r => r.diasFaltando <= 5 && r.diasFaltando >= 0).length} reuniões importantes no radar dos próximos dias.
            </p>
          </div>

          <div 
            onClick={() => setAbaAtiva && setAbaAtiva('ranking')}
            className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/30 transition-colors"
            title="Ir para Liga de Ouro"
          >
            <div className="p-3 bg-amber-400 rounded-xl text-amber-900 shadow-inner">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-0.5">Seu Nível Atual</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">{metricas.xp}</span>
                <span className="text-sm font-semibold text-blue-200">XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 MINI CARDS (KPIs de Execução) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          onClick={handleIrParaSquad}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Squad</p>
            {/* 🔥 CORREÇÃO: Variável dinâmica + pluralização */}
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {metricas.membros} Membro{metricas.membros !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div 
          onClick={() => setAbaAtiva && setAbaAtiva('1a1')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400"><FileText className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Atas Geradas</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{metricas.atas}</p>
          </div>
        </div>

        <div 
          onClick={handleIrParaSquad}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400"><Target className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">PDIs Ativos</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{metricas.pdis}</p>
          </div>
        </div>

        <div 
          onClick={handleIrParaSquad}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Missões Feitas</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{metricas.tasksConcluidas}</p>
          </div>
        </div>
      </div>

      {/* 🎯 ÁREA PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ESQUERDA: Próximos Alinhamentos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Próximos Alinhamentos (1:1)
            </h2>
            <button 
              onClick={handleIrParaSquad}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              Ver Squad <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {proximasReunioes.map(reuniao => (
              <div key={reuniao.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg border border-slate-200 dark:border-slate-700">
                    {reuniao.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{reuniao.nome}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{reuniao.cargo}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    {renderStatus(reuniao.diasFaltando)}
                  </div>

                  <button 
                    onClick={() => handleIniciar1a1(reuniao.id.toString())}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 dark:bg-white dark:hover:bg-blue-500 text-white dark:text-slate-900 transition-colors text-sm font-bold rounded-xl shadow-sm"
                  >
                    Iniciar 1:1
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* DIREITA: Radar de Atenção */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-red-500" /> Radar de Atenção
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-2">
            {radarAtencao.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Tudo sob controle!</p>
                <p className="text-sm">Nenhum PDI, Acordo expirado ou reunião atrasada.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {radarAtencao.map(alerta => (
                  <div key={alerta.id} className={`p-4 rounded-xl border ${
                    alerta.cor === 'red' ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${alerta.cor === 'red' ? 'text-red-500' : 'text-amber-500'}`} />
                      <div>
                        <h4 className={`text-sm font-bold ${alerta.cor === 'red' ? 'text-red-900 dark:text-red-300' : 'text-amber-900 dark:text-amber-300'}`}>
                          {alerta.mensagem}
                        </h4>
                        <p className={`text-xs mt-1 ${alerta.cor === 'red' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                          {alerta.detalhe}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">Insight da Semana</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              "Líderes que concluem PDIs no prazo têm <span className="text-emerald-600 dark:text-emerald-400 font-bold">+40% de retenção</span> na equipe. Fique de olho no seu Radar de Atenção!"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}