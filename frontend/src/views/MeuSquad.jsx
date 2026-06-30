// src/views/MeuSquad.jsx
import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import { 
  User, Calendar, Target, Zap, Activity, X, 
  Clock, CalendarPlus, Briefcase, Hash, 
  CheckCircle2, Circle, AlertCircle, CheckSquare,
  Download, FileText, TrendingUp, Award, Map as MapIcon, Plus, Trash2, Pencil
} from 'lucide-react';
import { DB_SQUADS } from '../dados';

export default function MeuSquad() {
  const idLiderLogado = "daniel_nascimento";
  const meuTimeBase = DB_SQUADS[idLiderLogado] || [];
  
  const todasAtas = JSON.parse(localStorage.getItem('@clearit-atas-squad')) || [];
  
  const meuTime = meuTimeBase.map(membro => {
    const atasDoMembro = todasAtas.filter(a => a.idLiderado === membro.id.toString());
    let dataReal = membro.ultimaReuniao;

    if (atasDoMembro.length > 0) {
      const dataBR = atasDoMembro[0].data; 
      const partes = dataBR.split('/');
      if(partes.length === 3) {
        const [dia, mes, ano] = partes;
        dataReal = `${ano}-${mes}-${dia}`;
      }
    }
    return { ...membro, ultimaReuniao: dataReal };
  });
  
  const [lideradoSelecionado, setLideradoSelecionado] = useState(null);
  const [historicoAtas, setHistoricoAtas] = useState([]);
  const [ataImprimindo, setAtaImprimindo] = useState(null);
  const [abaModal, setAbaModal] = useState('visao_geral');

  // ESTADOS: Gerenciamento Dinâmico de Tasks e PDI
  const [tasksSalvas, setTasksSalvas] = useState(JSON.parse(localStorage.getItem('@clearit-tasks')) || []);
  const [formTaskVisible, setFormTaskVisible] = useState(false);
  const [novaTask, setNovaTask] = useState({ nome: '', descricao: '', status: 'pendente', ddl: '' });

  const [pdiSalvos, setPdiSalvos] = useState(JSON.parse(localStorage.getItem('@clearit-pdi')) || []);
  const [formPDIVisible, setFormPDIVisible] = useState(false);
  const [novoPDI, setNovoPDI] = useState({ acao: '', prazo: '', status: 'Pendente' });

  // ESTADOS: Lixeira Inteligente
  const [tasksDeletadas, setTasksDeletadas] = useState(JSON.parse(localStorage.getItem('@clearit-deleted-tasks')) || []);
  const [pdiDeletados, setPdiDeletados] = useState(JSON.parse(localStorage.getItem('@clearit-deleted-pdi')) || []);

  const handleAbrirModal = (membro) => {
    setLideradoSelecionado(membro);
    setAbaModal('visao_geral');
    setFormTaskVisible(false);
    setFormPDIVisible(false);
    
    const atasDoMembro = todasAtas.filter(a => a.idLiderado === membro.id.toString());
    setHistoricoAtas(atasDoMembro);
  };

  // FUNÇÕES DE SALVAR / EDITAR TASKS
  const handleSalvarTask = (e) => {

    const tarefasAtuais = tasks.filter(t => t.idLiderado === idSelecionado && t.status !== 'concluida');
    if (tarefasAtuais.length >= 3) {
      alert("⚠️ Limite atingido! O Framework da Clear IT foca no essencial. Não crie mais de 3 metas ativas por vez para este liderado.");
      return;
    }
    
    e.preventDefault();
    let atualizadas = [...tasksSalvas];

    if (novaTask.id) {
      const index = atualizadas.findIndex(t => t.id === novaTask.id);
      if (index !== -1) {
        atualizadas[index] = { ...novaTask, idLiderado: lideradoSelecionado.id.toString() };
      } else {
        atualizadas.push({ ...novaTask, idLiderado: lideradoSelecionado.id.toString() });
      }
    } else {
      const taskCompleta = { ...novaTask, id: `task_${Date.now()}`, idLiderado: lideradoSelecionado.id.toString() };
      atualizadas.push(taskCompleta);
    }

    setTasksSalvas(atualizadas);
    localStorage.setItem('@clearit-tasks', JSON.stringify(atualizadas));
    setNovaTask({ nome: '', descricao: '', status: 'pendente', ddl: '' });
    setFormTaskVisible(false);
  };

  // FUNÇÕES DE SALVAR / EDITAR PDI
  const handleSalvarPDI = (e) => {
    e.preventDefault();
    let atualizados = [...pdiSalvos];

    if (novoPDI.id) {
      const index = atualizados.findIndex(p => p.id === novoPDI.id);
      if (index !== -1) {
        atualizados[index] = { ...novoPDI, idLiderado: lideradoSelecionado.id.toString() };
      } else {
        atualizados.push({ ...novoPDI, idLiderado: lideradoSelecionado.id.toString() });
      }
    } else {
      const pdiCompleto = { ...novoPDI, id: `pdi_${Date.now()}`, idLiderado: lideradoSelecionado.id.toString() };
      atualizados.push(pdiCompleto);
    }

    setPdiSalvos(atualizados);
    localStorage.setItem('@clearit-pdi', JSON.stringify(atualizados));
    setNovoPDI({ acao: '', prazo: '', status: 'Pendente' });
    setFormPDIVisible(false);
  };

  // FUNÇÕES DE ABRIR EDIÇÃO
  const handleEditarTask = (task) => {
    setNovaTask({ ...task });
    setFormTaskVisible(true);
  };

  const handleEditarPDI = (pdi) => {
    setNovoPDI({ ...pdi });
    setFormPDIVisible(true);
  };

  // FUNÇÕES DE EXCLUIR
  const handleExcluirTask = (idParaExcluir) => {
    const novasDeletadas = [...tasksDeletadas, idParaExcluir];
    setTasksDeletadas(novasDeletadas);
    localStorage.setItem('@clearit-deleted-tasks', JSON.stringify(novasDeletadas));
  };

  const handleExcluirPDI = (idParaExcluir) => {
    const novasDeletadas = [...pdiDeletados, idParaExcluir];
    setPdiDeletados(novasDeletadas);
    localStorage.setItem('@clearit-deleted-pdi', JSON.stringify(novasDeletadas));
  };

  const handleRebaixarAta = (ata) => {
    setAtaImprimindo(ata); 
    setTimeout(() => {
      const elemento = document.getElementById('conteudo-ata-reimpressao');
      const opt = {
        margin: 15,
        filename: `Ata_Reimpressao_${ata.nomeLiderado.replace(' ', '_')}_${ata.data.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(elemento).save().then(() => {
        setAtaImprimindo(null); 
      });
    }, 100);
  };

  const formatarDataBR = (dataString) => {
    if (!dataString) return '';
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const calcularProximaReuniaoTexto = (dataUltima) => {
    const data = new Date(dataUltima);
    data.setDate(data.getDate() + 15);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const gerarLinkGoogleCalendar = (nome, dataUltima) => {
    const data = new Date(dataUltima);
    data.setDate(data.getDate() + 15); 
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}${mes}${dia}`;
    const titulo = encodeURIComponent(`Reunião 1:1 - ${nome}`);
    const detalhes = encodeURIComponent(`Alinhamento quinzenal de desenvolvimento e metas.\n\nGerado via Smart Leading.`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${dataFormatada}/${dataFormatada}&details=${detalhes}`;
  };

  const renderIconeTask = (status) => {
    switch(status.toLowerCase()) {
      case 'concluida': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'pendente': return <Circle className="w-5 h-5 text-blue-400" />;
      case 'expirada': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  const gerarPDI = (membro) => {
    const proxNivel = membro.senioridade === 'Júnior' ? 'Pleno' : membro.senioridade === 'Pleno' ? 'Sênior' : 'Especialista / Liderança';
    return {
      objetivo: `Evolução para nível ${proxNivel}`,
      foco: `Desenvolvimento de autonomia técnica e visão estratégica do produto.`,
      competencias: [
        { nome: 'Hard Skills (Técnico)', nivel: membro.progresso.tecnico },
        { nome: 'Soft Skills (Comunicação/Liderança)', nivel: membro.progresso.engajamento },
        { nome: 'Processos e Metodologias', nivel: membro.progresso.metas }
      ],
      planoAcao: [
        { id: `estatico_pdi_1_${membro.id}`, acao: 'Certificação Técnica Relevante', prazo: 'Q3 2026', status: 'Em andamento' },
        { id: `estatico_pdi_2_${membro.id}`, acao: 'Mentoria com Tech Lead (Pair Programming)', prazo: 'Mensal', status: 'No prazo' },
      ]
    };
  };

  // 🔥 AGORA COM O JAVASCRIPT NATIVO FUNCIONANDO PERFEITAMENTE
  const getTasksDoMembro = () => {
    if (!lideradoSelecionado) return [];
    const tasksBase = lideradoSelecionado.tarefas || [];
    const tasksSalvasDoMembro = tasksSalvas.filter(t => t.idLiderado === lideradoSelecionado.id.toString());
    const savedTasksMap = new Map(tasksSalvasDoMembro.map(t => [t.id, t]));
    
    const tasksCombinadas = [
      ...tasksBase.map(t => savedTasksMap.has(t.id) ? savedTasksMap.get(t.id) : t),
      ...tasksSalvasDoMembro.filter(t => !tasksBase.find(bt => bt.id === t.id))
    ];
    return tasksCombinadas.filter(t => !tasksDeletadas.includes(t.id));
  };

  const getPdiDoMembro = () => {
    if (!lideradoSelecionado) return [];
    const pdiBase = gerarPDI(lideradoSelecionado).planoAcao;
    const pdiSalvosDoMembro = pdiSalvos.filter(p => p.idLiderado === lideradoSelecionado.id.toString());
    const savedPdiMap = new Map(pdiSalvosDoMembro.map(p => [p.id, p]));

    const pdiCombinados = [
      ...pdiBase.map(p => savedPdiMap.has(p.id) ? savedPdiMap.get(p.id) : p),
      ...pdiSalvosDoMembro.filter(p => !pdiBase.find(bp => bp.id === p.id))
    ];
    return pdiCombinados.filter(p => !pdiDeletados.includes(p.id));
  };

  const tasksDoMembro = getTasksDoMembro();
  const pdiDoMembro = getPdiDoMembro();

  return (
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.4s_ease-out]">
      
      {/* Cabeçalho */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Visão Geral do Squad
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Acompanhe o desenvolvimento contínuo dos seus liderados diretos.
        </p>
      </div>

      {/* Grid de Cards da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meuTime.map((membro) => (
          <div key={membro.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{membro.nome}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{membro.cargo}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800/50 p-2 rounded w-fit">
              <Calendar className="w-4 h-4" />
              Última 1:1: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatarDataBR(membro.ultimaReuniao)}</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Activity className="w-3 h-3 text-emerald-500"/> Engajamento</span>
                  <span className="text-slate-500">{membro.progresso.engajamento}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${membro.progresso.engajamento}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Zap className="w-3 h-3 text-amber-500"/> Nível Técnico</span>
                  <span className="text-slate-500">{membro.progresso.tecnico}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${membro.progresso.tecnico}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Target className="w-3 h-3 text-blue-500"/> Acordos & Metas</span>
                  <span className="text-slate-500">{membro.progresso.metas}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${membro.progresso.metas}%` }}></div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleAbrirModal(membro)}
              className="w-full mt-6 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            >
              Ver Perfil Completo
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE PERFIL COMPLETO */}
      {lideradoSelecionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setLideradoSelecionado(null)}></div>

          <div className="relative w-full max-w-5xl bg-slate-50 dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
            
            {/* Header Fixo do Modal */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
              <div className="flex justify-between items-center p-6 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold">
                    {lideradoSelecionado.nome.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{lideradoSelecionado.nome}</h2>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5"/> {lideradoSelecionado.cargo}</span>
                      <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5"/> ID: {lideradoSelecionado.id}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setLideradoSelecionado(null)}
                  className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex px-6 gap-6 text-sm font-bold">
                <button 
                  onClick={() => setAbaModal('visao_geral')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${abaModal === 'visao_geral' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                  <Activity className="w-4 h-4" /> Visão Geral
                </button>
                <button 
                  onClick={() => setAbaModal('pdi')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${abaModal === 'pdi' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                  <TrendingUp className="w-4 h-4" /> Plano de Desenvolvimento (PDI)
                </button>
              </div>
            </div>

            {/* Corpo Rolável do Modal */}
            <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex-1">
              
              {/* --- ABA 1: VISÃO GERAL --- */}
              {abaModal === 'visao_geral' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_0.3s]">
                  
                  <div className="space-y-6 lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Detalhes do Colaborador</h3>
                      <div className="space-y-3 text-sm">
                        <p className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Senioridade:</span> <span className="font-medium text-slate-900 dark:text-white">{lideradoSelecionado.senioridade}</span></p>
                        <p className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Squad:</span> <span className="font-medium text-slate-900 dark:text-white">{lideradoSelecionado.time}</span></p>
                        <p className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Tempo de Casa:</span> <span className="font-medium text-slate-900 dark:text-white">{lideradoSelecionado.tempoCasa}</span></p>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center shadow-sm">
                      <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Ciclo Quinzenal</p>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        Próxima Reunião dia {calcularProximaReuniaoTexto(lideradoSelecionado.ultimaReuniao)}
                      </h4>
                      <a 
                        href={gerarLinkGoogleCalendar(lideradoSelecionado.nome, lideradoSelecionado.ultimaReuniao)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-600/20"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        Agendar no Calendário
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Bloco de Tarefas */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <CheckSquare className="w-5 h-5 text-blue-500" />
                          Acordos e Missões (Tasks)
                        </h3>
                        <button 
                          onClick={() => {
                            setNovaTask({ nome: '', descricao: '', status: 'pendente', ddl: '' });
                            setFormTaskVisible(!formTaskVisible);
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Nova Task
                        </button>
                      </div>

                      {formTaskVisible && (
                        <form onSubmit={handleSalvarTask} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-[fadeIn_0.2s]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input type="text" placeholder="Nome da Tarefa" required value={novaTask.nome} onChange={e => setNovaTask({...novaTask, nome: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                            <div className="flex gap-3">
                              <input type="date" required value={novaTask.ddl} onChange={e => setNovaTask({...novaTask, ddl: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-300" />
                              <select required value={novaTask.status} onChange={e => setNovaTask({...novaTask, status: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="pendente">Pendente</option>
                                <option value="concluida">Concluída</option>
                                <option value="expirada">Expirada</option>
                              </select>
                            </div>
                          </div>
                          <input type="text" placeholder="Descrição detalhada..." required value={novaTask.descricao} onChange={e => setNovaTask({...novaTask, descricao: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                          <div className="flex justify-end gap-2 pt-1">
                            <button type="button" onClick={() => setFormTaskVisible(false)} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
                            <button type="submit" className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">{novaTask.id ? 'Salvar Edição' : 'Salvar Task'}</button>
                          </div>
                        </form>
                      )}
                      
                      <div className="space-y-3">
                        {tasksDoMembro.map((task) => (
                          <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border group relative ${
                            task.status === 'concluida' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10' :
                            task.status === 'expirada' ? 'bg-red-50/50 border-red-100 dark:bg-red-500/5 dark:border-red-500/10' :
                            'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50'
                          }`}>
                            <div className="mt-0.5 flex-shrink-0">
                              {renderIconeTask(task.status)}
                            </div>
                            <div className="flex-1 pr-16">
                              {task.nome && <p className={`text-sm font-bold mb-0.5 ${task.status === 'concluida' ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>{task.nome}</p>}
                              <p className={`text-sm font-medium ${task.status === 'concluida' ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                {task.descricao}
                              </p>
                              <p className={`text-xs mt-1 ${task.status === 'expirada' ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                                DDL: {formatarDataBR(task.ddl)}
                              </p>
                            </div>
                            <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                                task.status === 'concluida' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                task.status === 'pendente' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                              }`}>
                                {task.status}
                              </span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                <button 
                                  onClick={() => handleEditarTask(task)}
                                  className="p-1 text-slate-400 hover:text-blue-500 transition-colors bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                                  title="Editar"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleExcluirTask(task.id)}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {tasksDoMembro.length === 0 && (
                          <p className="text-sm text-slate-500 italic">Nenhum acordo pendente.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        Histórico de Reuniões (Atas)
                      </h3>
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 soft-scrollbar">
                        {historicoAtas.length === 0 ? (
                          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-sm">
                            Nenhuma ata registrada para este colaborador ainda. <br/> Vá na aba "Meus 1:1s" para gerar a primeira!
                          </div>
                        ) : (
                          historicoAtas.map((ata) => (
                            <div key={ata.idAta} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-hover hover:border-blue-300">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  Ata de Alinhamento
                                  <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{ata.data}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">
                                  Ref. Cargo: {ata.cargo} ({ata.senioridade})
                                </p>
                              </div>
                              <button 
                                onClick={() => handleRebaixarAta(ata)}
                                className="p-2 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-900/30 text-slate-600 hover:text-emerald-600 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2 text-sm font-semibold"
                                title="Baixar Cópia"
                              >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Baixar</span>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- ABA 2: PDI --- */}
              {abaModal === 'pdi' && (
                <div className="space-y-6 animate-[fadeIn_0.3s]">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-6 h-6 text-emerald-100" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-100">Objetivo de Carreira</h3>
                    </div>
                    <h2 className="text-2xl font-black mb-1">{gerarPDI(lideradoSelecionado).objetivo}</h2>
                    <p className="text-emerald-50 text-sm">{gerarPDI(lideradoSelecionado).foco}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        Radar de Competências
                      </h3>
                      <div className="space-y-5">
                        {gerarPDI(lideradoSelecionado).competencias.map((comp, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm font-medium mb-1.5">
                              <span className="text-slate-700 dark:text-slate-300">{comp.nome}</span>
                              <span className="text-slate-500">{comp.nivel}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full transition-all duration-1000 ${comp.nivel > 70 ? 'bg-emerald-500' : comp.nivel > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                style={{ width: `${comp.nivel}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PLANO DE AÇÃO */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <MapIcon className="w-5 h-5 text-blue-500" />
                          Plano de Ação (Próximos Passos)
                        </h3>
                        <button 
                          onClick={() => {
                            setNovoPDI({ acao: '', prazo: '', status: 'Pendente' });
                            setFormPDIVisible(!formPDIVisible);
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Novo Passo
                        </button>
                      </div>

                      {formPDIVisible && (
                        <form onSubmit={handleSalvarPDI} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-[fadeIn_0.2s]">
                          <input type="text" placeholder="Ação de Desenvolvimento (Ex: Tirar certificação AWS)" required value={novoPDI.acao} onChange={e => setNovoPDI({...novoPDI, acao: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                          <div className="flex gap-3">
                            <input type="text" placeholder="Prazo (Ex: Dez/2026)" required value={novoPDI.prazo} onChange={e => setNovoPDI({...novoPDI, prazo: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-600 dark:text-slate-300" />
                            <select required value={novoPDI.status} onChange={e => setNovoPDI({...novoPDI, status: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                              <option value="Pendente">Pendente</option>
                              <option value="Em andamento">Em andamento</option>
                              <option value="No prazo">No prazo</option>
                              <option value="Concluído">Concluído</option>
                            </select>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button type="button" onClick={() => setFormPDIVisible(false)} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
                            <button type="submit" className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">{novoPDI.id ? 'Salvar Edição' : 'Salvar Passo'}</button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-4">
                        {pdiDoMembro.map((acao, index) => (
                          <div key={acao.id} className="flex gap-4 items-start group relative">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs border border-slate-200 dark:border-slate-700">
                              {index + 1}
                            </div>
                            <div className="flex-1 pr-16">
                              <h4 className={`text-sm font-bold ${acao.status === 'Concluído' ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{acao.acao}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {acao.prazo}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  acao.status === 'Em andamento' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                  acao.status === 'No prazo' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                  acao.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}>{acao.status}</span>
                              </div>
                            </div>
                            <div className="absolute top-0 right-0 flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1 mt-1">
                                <button 
                                  onClick={() => handleEditarPDI(acao)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                                  title="Editar"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleExcluirPDI(acao.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {pdiDoMembro.length === 0 && (
                          <p className="text-sm text-slate-500 italic">Nenhum passo no PDI.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE INVISÍVEL PARA RE-IMPRESSÃO DO PDF */}
      <div className="hidden">
        {ataImprimindo && (
          <div id="conteudo-ata-reimpressao" className="bg-white text-slate-900 p-8">
            <div className="mb-8 border-b-2 border-slate-200 pb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Ata Oficial de Alinhamento 1:1</h2>
              <p className="text-xs text-slate-500 mb-4">* Cópia recuperada do histórico do sistema</p>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div><span className="text-slate-500 text-xs font-bold uppercase block mb-1">Colaborador</span><span className="font-semibold text-slate-900">{ataImprimindo.nomeLiderado}</span></div>
                <div><span className="text-slate-500 text-xs font-bold uppercase block mb-1">Data do Documento</span><span className="font-semibold text-slate-900">{ataImprimindo.data}</span></div>
                <div><span className="text-slate-500 text-xs font-bold uppercase block mb-1">Cargo e Nível</span><span className="font-semibold text-slate-900">{ataImprimindo.cargo} ({ataImprimindo.senioridade})</span></div>
                <div><span className="text-slate-500 text-xs font-bold uppercase block mb-1">Tempo de Empresa</span><span className="font-semibold text-slate-900">{ataImprimindo.tempoCasa}</span></div>
              </div>
            </div>
            <div className="prose prose-sm max-w-none prose-slate text-slate-800">
              <ReactMarkdown>{ataImprimindo.conteudoRH}</ReactMarkdown>
            </div>
            <div className="mt-16 pt-8 grid grid-cols-2 gap-8 text-center">
              <div><div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assinatura do Líder</p></div>
              <div><div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assinatura do Liderado</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}