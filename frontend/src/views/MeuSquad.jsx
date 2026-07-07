// src/views/MeuSquad.jsx
import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import { 
  Users, Search, Briefcase, Clock, 
  Target, TrendingUp, X, Calendar, ChevronRight, 
  MessageSquare, CalendarPlus, CheckCircle2, Activity,
  Circle, AlertCircle, CheckSquare, Download, FileText, 
  Award, Map as MapIcon, Plus, Trash2, Pencil, Hash
} from 'lucide-react';
import { DB_SQUADS } from '../dados';
import { salvarLGPD, lerLGPD } from '../utils/security';

export default function MeuSquad({ setAbaAtiva }) {
  const idLiderLogado = "daniel_nascimento";
  
  // ESTADOS PRINCIPAIS
  const [squad, setSquad] = useState([]);
  const [busca, setBusca] = useState('');
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [abaModal, setAbaModal] = useState('visao_geral');

  // ESTADOS DE DADOS (Historicos, Tasks, PDIs)
  const [todasAtas, setTodasAtas] = useState([]);
  const [historicoAtas, setHistoricoAtas] = useState([]);
  const [ataImprimindo, setAtaImprimindo] = useState(null);

  const [tasksSalvas, setTasksSalvas] = useState([]);
  const [tasksDeletadas, setTasksDeletadas] = useState([]);
  const [formTaskVisible, setFormTaskVisible] = useState(false);
  const [novaTask, setNovaTask] = useState({ nome: '', descricao: '', status: 'pendente', ddl: '' });

  const [pdiSalvos, setPdiSalvos] = useState([]);
  const [pdiDeletados, setPdiDeletados] = useState([]);
  const [formPDIVisible, setFormPDIVisible] = useState(false);
  const [novoPDI, setNovoPDI] = useState({ acao: '', prazo: '', status: 'No prazo' });

  // ESTADO: Balãozinho de Aviso
  const [balaoAviso, setBalaoAviso] = useState({ visivel: false, mensagem: '' });

  useEffect(() => {
    const carregarDados = () => {
      let squadAtual = lerLGPD('@clearit-squad') || [];
      if (squadAtual.length === 0) squadAtual = DB_SQUADS[idLiderLogado] || [];
      
      const atas = lerLGPD('@clearit-atas-squad') || [];
      setTodasAtas(atas);

      const timeAtualizado = squadAtual.map(membro => {
        const atasDoMembro = atas.filter(a => a.idLiderado === membro.id.toString());
        let dataReal = membro.ultimaReuniao;
        if (atasDoMembro.length > 0) {
          const partes = atasDoMembro[0].data.split('/');
          if(partes.length === 3) dataReal = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
        return { ...membro, ultimaReuniao: dataReal };
      });

      setSquad(timeAtualizado);
      setTasksSalvas(lerLGPD('@clearit-tasks') || []);
      setTasksDeletadas(lerLGPD('@clearit-deleted-tasks') || []);
      setPdiSalvos(lerLGPD('@clearit-pdi') || []);
      setPdiDeletados(lerLGPD('@clearit-deleted-pdi') || []);
    };

    carregarDados();
    window.addEventListener('clearit-data-updated', carregarDados);
    return () => window.removeEventListener('clearit-data-updated', carregarDados);
  }, []);

  const mostrarBalao = (mensagem) => {
    setBalaoAviso({ visivel: true, mensagem });
    setTimeout(() => setBalaoAviso({ visivel: false, mensagem: '' }), 4000);
  };

  // --- MOTORES DE DADOS DINÂMICOS ---
  const getTasksDoMembro = (idParam) => {
    const id = idParam || (membroSelecionado ? membroSelecionado.id : null);
    if (!id) return [];
    
    const membro = squad.find(m => m.id.toString() === id.toString());
    const tasksBase = membro?.tarefas || [];
    const tasksSalvasDoMembro = tasksSalvas.filter(t => t.idLiderado === id.toString());
    const savedTasksMap = new Map(tasksSalvasDoMembro.map(t => [t.id, t]));
    
    const tasksCombinadas = [
      ...tasksBase.map(t => savedTasksMap.has(t.id) ? savedTasksMap.get(t.id) : t),
      ...tasksSalvasDoMembro.filter(t => !tasksBase.find(bt => bt.id === t.id))
    ];
    return tasksCombinadas.filter(t => !tasksDeletadas.includes(t.id));
  };

  const getPdiDoMembro = (idParam) => {
    const id = idParam || (membroSelecionado ? membroSelecionado.id : null);
    if (!id) return [];
    
    const membro = squad.find(m => m.id.toString() === id.toString());
    const pdiBase = membro ? gerarPDI(membro).planoAcao : [];
    const pdiSalvosDoMembro = pdiSalvos.filter(p => p.idLiderado === id.toString());
    const savedPdiMap = new Map(pdiSalvosDoMembro.map(p => [p.id, p]));

    let pdiCombinados = [
      ...pdiBase.map(p => savedPdiMap.has(p.id) ? savedPdiMap.get(p.id) : p),
      ...pdiSalvosDoMembro.filter(p => !pdiBase.find(bp => bp.id === p.id))
    ];
    pdiCombinados = pdiCombinados.filter(p => !pdiDeletados.includes(p.id));

    // VIGIA AUTOMÁTICO DE EXPIRAÇÃO
    const hojeTs = Date.now();
    return pdiCombinados.map(p => {
      if (p.dataExpiracaoTs && p.dataExpiracaoTs < hojeTs && p.status !== 'Concluído') {
        return { ...p, status: 'Expirado' }; 
      }
      return p;
    });
  };

  // --- AÇÕES DO MODAL ---
  const abrirPerfil = (membro) => {
    setAbaModal('visao_geral');
    setFormTaskVisible(false);
    setFormPDIVisible(false);
    
    const atasDoMembro = todasAtas.filter(a => a.idLiderado === membro.id.toString());
    setHistoricoAtas(atasDoMembro);

    const idLoginFalback = membro.nome.toLowerCase().replace(' ', '_');
    const momento = localStorage.getItem(`@clearit-momento-${membro.id}`) || 
                    localStorage.getItem(`@clearit-momento-${idLoginFalback}`) || 
                    'Aguardando preenchimento...';
    
    const pdis = getPdiDoMembro(membro.id);
    const tasks = getTasksDoMembro(membro.id);

    setMembroSelecionado({
      ...membro,
      totalPdis: pdis.length,
      pdisAtivos: pdis.filter(p => p.status !== 'Concluído').length,
      totalTasks: tasks.length,
      tasksPendentes: tasks.filter(t => t.status !== 'Concluído').length,
      momento
    });
  };

  const fecharPerfil = () => setMembroSelecionado(null);

  // --- FUNÇÕES DE SALVAR / EDITAR / EXCLUIR ---
  const handleSalvarTask = (e) => {
    e.preventDefault(); 
    const todasTasksDaTela = getTasksDoMembro();
    const outrasAtivas = todasTasksDaTela.filter(t => t.status.toLowerCase() !== 'concluida' && t.id !== novaTask.id);
    
    if (outrasAtivas.length >= 3 && novaTask.status.toLowerCase() !== 'concluida') {
      mostrarBalao("⚠️ Limite atingido! Não crie mais de 3 metas ativas por vez para manter o foco.");
      return;
    }
    
    let atualizadas = [...tasksSalvas];
    if (novaTask.id) {
      const index = atualizadas.findIndex(t => t.id === novaTask.id);
      if (index !== -1) atualizadas[index] = { ...novaTask, idLiderado: membroSelecionado.id.toString() };
      else atualizadas.push({ ...novaTask, idLiderado: membroSelecionado.id.toString() });
    } else {
      atualizadas.push({ ...novaTask, id: `task_${Date.now()}`, idLiderado: membroSelecionado.id.toString() });
    }

    setTasksSalvas(atualizadas);
    salvarLGPD('@clearit-tasks', atualizadas);
    setNovaTask({ nome: '', descricao: '', status: 'pendente', ddl: '' });
    setFormTaskVisible(false);
  };

  const handleExcluirTask = (idParaExcluir) => {
    const novasDeletadas = [...tasksDeletadas, idParaExcluir];
    setTasksDeletadas(novasDeletadas);
    salvarLGPD('@clearit-deleted-tasks', novasDeletadas);
  };

  const handleSalvarPDI = (e) => {
    e.preventDefault();
    const todosPDIsDaTela = getPdiDoMembro();
    const outrosPDIsAtivos = todosPDIsDaTela.filter(p => p.status !== 'Concluído' && p.id !== novoPDI.id);
    
    if (outrosPDIsAtivos.length >= 3 && novoPDI.status !== 'Concluído') {
      mostrarBalao("🛑 Limite atingido! O PDI foca no essencial. Conclua uma meta ativa antes de criar o 4º passo.");
      return;
    }

    const dataCalculo = new Date(); 
    let mesesParaAdicionar = 0;
    
    if (novoPDI.prazo === '1 mês') mesesParaAdicionar = 1;
    else if (novoPDI.prazo === '2 meses') mesesParaAdicionar = 2;
    else if (novoPDI.prazo === '3 meses') mesesParaAdicionar = 3;
    else if (novoPDI.prazo === '6 meses') mesesParaAdicionar = 6;

    const pdiParaSalvar = { ...novoPDI };

    if (mesesParaAdicionar > 0) {
      dataCalculo.setMonth(dataCalculo.getMonth() + mesesParaAdicionar);
      const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      pdiParaSalvar.dataExpiracaoTs = dataCalculo.getTime(); 
      pdiParaSalvar.prazoDisplay = `${pdiParaSalvar.prazo} (${nomesMeses[dataCalculo.getMonth()]}/${dataCalculo.getFullYear()})`;
    } else {
      pdiParaSalvar.prazoDisplay = pdiParaSalvar.prazo; 
    }

    let atualizados = [...pdiSalvos];
    if (pdiParaSalvar.id) {
      const index = atualizados.findIndex(p => p.id === pdiParaSalvar.id);
      if (index !== -1) atualizados[index] = { ...pdiParaSalvar, idLiderado: membroSelecionado.id.toString() };
      else atualizados.push({ ...pdiParaSalvar, idLiderado: membroSelecionado.id.toString() });
    } else {
      atualizados.push({ ...pdiParaSalvar, id: `pdi_${Date.now()}`, idLiderado: membroSelecionado.id.toString() });
    }

    setPdiSalvos(atualizados);
    salvarLGPD('@clearit-pdi', atualizados);
    setNovoPDI({ acao: '', prazo: '', status: 'No prazo' });
    setFormPDIVisible(false);
  };

  const handleExcluirPDI = (idParaExcluir) => {
    const novasDeletadas = [...pdiDeletados, idParaExcluir];
    setPdiDeletados(novasDeletadas);
    salvarLGPD('@clearit-deleted-pdi', novasDeletadas);
  };

  // --- UTILITÁRIOS ---
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
      html2pdf().set(opt).from(elemento).save().then(() => setAtaImprimindo(null));
    }, 100);
  };

  const formatarDataBR = (dataString) => {
    if (!dataString) return '';
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const calcularProximaReuniaoTexto = (dataUltima) => {
    if (!dataUltima) return 'Não agendada';
    const data = new Date(dataUltima);
    data.setDate(data.getDate() + 15);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${data.getFullYear()}`;
  };

  const gerarLinkGoogleCalendar = (nome, dataUltima) => {
    if (!dataUltima) return '#';
    const data = new Date(dataUltima);
    data.setDate(data.getDate() + 15); 
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}${mes}${dia}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Reunião 1:1 - ${nome}`)}&dates=${dataFormatada}/${dataFormatada}&details=${encodeURIComponent(`Alinhamento quinzenal de desenvolvimento e metas.\n\nGerado via Smart Leading.`)}`;
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
    const progresso = membro.progresso || { tecnico: 50, engajamento: 50, metas: 50 };
    const proxNivel = membro.senioridade === 'Júnior' ? 'Pleno' : membro.senioridade === 'Pleno' ? 'Sênior' : 'Especialista / Liderança';
    return {
      objetivo: `Evolução para nível ${proxNivel}`,
      foco: `Desenvolvimento de autonomia técnica e visão estratégica do produto.`,
      competencias: [
        { nome: 'Hard Skills (Técnico)', nivel: progresso.tecnico },
        { nome: 'Soft Skills (Liderança)', nivel: progresso.engajamento },
        { nome: 'Processos e Metas', nivel: progresso.metas }
      ],
      planoAcao: [
        { id: `estatico_pdi_1_${membro.id}`, acao: 'Certificação Técnica Relevante', prazo: 'Q3 2026', status: 'Em andamento' },
        { id: `estatico_pdi_2_${membro.id}`, acao: 'Mentoria com Tech Lead', prazo: 'Mensal', status: 'No prazo' },
      ]
    };
  };

  const squadFiltrado = squad.filter(m => m.nome.toLowerCase().includes(busca.toLowerCase()) || m.cargo.toLowerCase().includes(busca.toLowerCase()));
  const tasksDoModal = getTasksDoMembro();
  const pdiDoModal = getPdiDoMembro();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out] pb-10 relative">
      
      {/* HEADER E BUSCA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Gestão do Squad
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Visão 360º de todos os membros do seu time e histórico.</p>
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar colaborador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* GRID DE COLABORADORES (NOVA UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {squadFiltrado.map(membro => (
          <div key={membro.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl border border-blue-200 dark:border-blue-800/50 group-hover:scale-105 transition-transform">
                {membro.nome.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{membro.nome}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{membro.cargo}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <Briefcase className="w-3.5 h-3.5" /> Nível: <span className="font-semibold text-slate-900 dark:text-slate-300">{membro.senioridade}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <Calendar className="w-3.5 h-3.5" /> 1:1: <span className="font-semibold text-slate-900 dark:text-slate-300">{formatarDataBR(membro.ultimaReuniao) || 'Sem dados'}</span>
              </div>
            </div>

            <button 
              onClick={() => abrirPerfil(membro)}
              className="w-full py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-xl transition-colors border border-blue-100 dark:border-blue-900/50 flex items-center justify-center gap-2"
            >
              Ver Perfil Completo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
        {squadFiltrado.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            Nenhum colaborador encontrado.
          </div>
        )}
      </div>

      {/* MODAL DE PERFIL COMPLETO (GLASSMORPHISM + FUNÇÕES ANTIGAS) */}
      {membroSelecionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={fecharPerfil}></div>
          
          <div className="relative w-full max-w-5xl bg-slate-50 dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
            
            {/* Header Fixo do Modal */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
              <div className="flex justify-between items-center p-6 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                    {membroSelecionado.nome.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{membroSelecionado.nome}</h2>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5"/> {membroSelecionado.cargo} • {membroSelecionado.senioridade}</span>
                      <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5"/> ID: {membroSelecionado.id}</span>
                    </div>
                  </div>
                </div>
                <button onClick={fecharPerfil} className="p-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Abas */}
              <div className="flex px-6 gap-6 text-sm font-bold">
                <button 
                  onClick={() => setAbaModal('visao_geral')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${abaModal === 'visao_geral' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                  <Activity className="w-4 h-4" /> Visão e Acordos
                </button>
                <button 
                  onClick={() => setAbaModal('pdi')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${abaModal === 'pdi' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                  <TrendingUp className="w-4 h-4" /> Plano de Desenvolvimento (PDI)
                </button>
              </div>
            </div>

            {/* Corpo Rolável */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* --- ABA 1: VISÃO GERAL E ACORDOS --- */}
              {abaModal === 'visao_geral' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_0.3s]">
                  
                  {/* Coluna Esquerda: Info e Sincronia */}
                  <div className="space-y-6 lg:col-span-1">
                    
                    {/* Sincronia de Momento */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 p-4 rounded-xl flex items-start gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-500 mb-1">Status Atual</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-200 text-sm">{membroSelecionado.momento}</p>
                      </div>
                    </div>

                    {/* Cadência */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                      <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Ciclo de Mentoria</p>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 mt-1">
                        Próxima 1:1 dia {calcularProximaReuniaoTexto(membroSelecionado.ultimaReuniao)}
                      </h4>
                      <a 
                        href={gerarLinkGoogleCalendar(membroSelecionado.nome, membroSelecionado.ultimaReuniao)}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-sm"
                      >
                        <CalendarPlus className="w-4 h-4" /> Agendar no Calendário
                      </a>
                    </div>
                  </div>

                  {/* Coluna Direita: Tasks e Atas */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* BLOCO DE TASKS (ACORDOS) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <CheckSquare className="w-5 h-5 text-blue-500" /> Acordos e Missões (Tasks)
                        </h3>
                        <button 
                          onClick={() => { setNovaTask({ nome: '', descricao: '', status: 'pendente', ddl: '' }); setFormTaskVisible(!formTaskVisible); }}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Nova Task
                        </button>
                      </div>

                      {formTaskVisible && (
                        <form onSubmit={handleSalvarTask} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input type="text" placeholder="Nome da Tarefa" required value={novaTask.nome} onChange={e => setNovaTask({...novaTask, nome: e.target.value})} className="w-full bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
                            <div className="flex gap-3">
                              <input type="date" required value={novaTask.ddl} onChange={e => setNovaTask({...novaTask, ddl: e.target.value})} className="w-full bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-300" />
                              <select required value={novaTask.status} onChange={e => setNovaTask({...novaTask, status: e.target.value})} className="w-full bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white">
                                <option value="pendente">Pendente</option>
                                <option value="concluida">Concluída</option>
                                <option value="expirada">Expirada</option>
                              </select>
                            </div>
                          </div>
                          <input type="text" placeholder="Descrição detalhada..." required value={novaTask.descricao} onChange={e => setNovaTask({...novaTask, descricao: e.target.value})} className="w-full bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
                          <div className="flex justify-end gap-2 pt-1">
                            <button type="button" onClick={() => setFormTaskVisible(false)} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Cancelar</button>
                            <button type="submit" className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">{novaTask.id ? 'Salvar Edição' : 'Salvar Task'}</button>
                          </div>
                        </form>
                      )}
                      
                      <div className="space-y-3">
                        {tasksDoModal.map((task) => (
                          <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border group relative ${
                            task.status === 'concluida' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10' :
                            task.status === 'expirada' ? 'bg-red-50/50 border-red-100 dark:bg-red-500/5 dark:border-red-500/10' :
                            'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50'
                          }`}>
                            <div className="mt-0.5 flex-shrink-0">{renderIconeTask(task.status)}</div>
                            <div className="flex-1 pr-16">
                              <p className={`text-sm font-bold mb-0.5 ${task.status === 'concluida' ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>{task.nome}</p>
                              <p className={`text-sm font-medium ${task.status === 'concluida' ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{task.descricao}</p>
                              <p className={`text-xs mt-1 ${task.status === 'expirada' ? 'text-red-500 font-bold' : 'text-slate-500'}`}>DDL: {formatarDataBR(task.ddl)}</p>
                            </div>
                            <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                                task.status === 'concluida' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' :
                                task.status === 'pendente' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20' : 'bg-red-100 text-red-700 dark:bg-red-500/20'
                              }`}>{task.status}</span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                <button onClick={() => { setNovaTask({...task}); setFormTaskVisible(true); }} className="p-1 text-slate-400 hover:text-blue-500 bg-white dark:bg-slate-800 rounded-md border shadow-sm"><Pencil className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleExcluirTask(task.id)} className="p-1 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-md border shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {tasksDoModal.length === 0 && <p className="text-sm text-slate-500 italic">Nenhum acordo pendente.</p>}
                      </div>
                    </div>

                    {/* BLOCO DE ATAS REIMPRESSÃO */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" /> Histórico de Reuniões (Atas)
                      </h3>
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 soft-scrollbar">
                        {historicoAtas.length === 0 ? (
                          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-sm">
                            Nenhuma ata registrada para este colaborador ainda.
                          </div>
                        ) : (
                          historicoAtas.map((ata) => (
                            <div key={ata.idAta} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 shadow-sm">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">Ata Oficial <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{ata.data}</span></p>
                              </div>
                              <button onClick={() => handleRebaixarAta(ata)} className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-lg border transition-colors flex items-center gap-2 text-sm font-semibold">
                                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Baixar</span>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- ABA 2: PDI (NOVA UI + FUNCIONALIDADE ANTIGA) --- */}
              {abaModal === 'pdi' && (
                <div className="space-y-6 animate-[fadeIn_0.3s]">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-6 h-6 text-emerald-100" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-100">Objetivo de Carreira</h3>
                    </div>
                    <h2 className="text-2xl font-black mb-1">{gerarPDI(membroSelecionado).objetivo}</h2>
                    <p className="text-emerald-50 text-sm">{gerarPDI(membroSelecionado).foco}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Radar de Competências (Mágica Dinâmica) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" /> Radar de Competências
                      </h3>
                      <div className="space-y-5">
                        {(() => {
                          const tarefasFeitas = tasksDoModal.filter(t => t.status.toLowerCase() === 'concluida').length;
                          const pdisFeitos = pdiDoModal.filter(p => p.status === 'Concluído').length;
                          const baseComp = gerarPDI(membroSelecionado).competencias;
                          
                          const compsDinamicas = [
                            { nome: baseComp[0].nome, nivel: Math.min(100, baseComp[0].nivel + (pdisFeitos * 8)) },
                            { nome: baseComp[1].nome, nivel: baseComp[1].nivel },
                            { nome: baseComp[2].nome, nivel: Math.min(100, baseComp[2].nivel + (tarefasFeitas * 5)) }
                          ];

                          return compsDinamicas.map((comp, i) => (
                            <div key={i}>
                              <div className="flex justify-between text-sm font-medium mb-1.5">
                                <span className="text-slate-700 dark:text-slate-300">{comp.nome}</span>
                                <span className="text-slate-500">{comp.nivel}%</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                <div className={`h-2.5 rounded-full transition-all duration-1000 ${comp.nivel > 70 ? 'bg-emerald-500' : comp.nivel > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${comp.nivel}%` }}></div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 mt-6 text-sm text-slate-600 dark:text-slate-400">
                        <strong className="text-blue-700 dark:text-blue-400 block mb-1">Cálculo Smart:</strong> O algoritmo sobe "Hard Skills" ao concluir PDIs, e "Processos" ao entregar Tasks no prazo.
                      </div>
                    </div>

                    {/* Plano de Ação (CRUD de PDI) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <MapIcon className="w-5 h-5 text-blue-500" /> Plano de Ação (PDI)
                        </h3>
                        <button 
                          onClick={() => { setNovoPDI({ acao: '', prazo: '', status: 'No prazo' }); setFormPDIVisible(!formPDIVisible); }}
                          className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Novo Passo
                        </button>
                      </div>

                      {formPDIVisible && (
                        <form onSubmit={handleSalvarPDI} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                          <input type="text" placeholder="Ação (Ex: Tirar certificação AWS)" required value={novoPDI.acao} onChange={e => setNovoPDI({...novoPDI, acao: e.target.value})} className="w-full bg-white border border-slate-300 dark:bg-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white" />
                          <div className="flex gap-3">
                            <select required value={novoPDI.prazo} onChange={e => setNovoPDI({...novoPDI, prazo: e.target.value})} className="w-full bg-white border border-slate-300 dark:bg-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white">
                              <option value="" disabled>Prazo...</option>
                              <option value="1 mês">1 mês</option>
                              <option value="2 meses">2 meses</option>
                              <option value="3 meses">3 meses</option>
                              <option value="6 meses">6 meses</option>
                            </select>                            
                            <select required value={novoPDI.status} onChange={e => setNovoPDI({...novoPDI, status: e.target.value})} className="w-full bg-white border border-slate-300 dark:bg-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white">
                              <option value="No prazo">No prazo</option>
                              <option value="Em andamento">Em andamento</option>
                              <option value="Concluído">Concluído</option>
                              {novoPDI.status === 'Expirado' && <option value="Expirado">Expirado</option>}
                            </select>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button type="button" onClick={() => setFormPDIVisible(false)} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Cancelar</button>
                            <button type="submit" className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">{novoPDI.id ? 'Salvar Edição' : 'Salvar Passo'}</button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-4">
                        {pdiDoModal.map((acao, index) => (
                          <div key={acao.id} className="flex gap-4 items-start group relative">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs border">
                              {index + 1}
                            </div>
                            <div className="flex-1 pr-16">
                              <h4 className={`text-sm font-bold ${acao.status === 'Concluído' ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>{acao.acao}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {acao.prazoDisplay || acao.prazo}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  acao.status === 'Em andamento' ? 'bg-blue-100 text-blue-700' :
                                  acao.status === 'No prazo' ? 'bg-amber-100 text-amber-700' :
                                  acao.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' :
                                  acao.status === 'Expirado' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                }`}>{acao.status}</span>
                              </div>
                            </div>
                            <div className="absolute top-0 right-0 flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1 mt-1">
                                <button onClick={() => { setNovoPDI({...acao}); setFormPDIVisible(true); }} className="p-1.5 text-slate-400 hover:text-emerald-500 bg-white dark:bg-slate-800 rounded-md border shadow-sm"><Pencil className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleExcluirPDI(acao.id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-md border shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {pdiDoModal.length === 0 && <p className="text-sm text-slate-500 italic">Nenhum passo no PDI.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer do Modal (Navegação Rápida) */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button 
                onClick={() => { fecharPerfil(); if(setAbaAtiva) setAbaAtiva('pdi'); }}
                className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Target className="w-4 h-4" /> Criar Metas SMART
              </button>
              <button 
                onClick={() => { localStorage.setItem('@clearit-liderado-foco', membroSelecionado.id); fecharPerfil(); if(setAbaAtiva) setAbaAtiva('1a1'); }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> Gerar Pauta 1:1
              </button>
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

      {/* BALÃOZINHO DE AVISO */}
      {balaoAviso.visivel && (
        <div className="fixed bottom-6 right-6 z-[200] max-w-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
          <AlertCircle className="w-6 h-6 text-amber-400 dark:text-amber-500 flex-shrink-0" />
          <p className="text-sm font-semibold pr-2">{balaoAviso.mensagem}</p>
          <button onClick={() => setBalaoAviso({ visivel: false, mensagem: '' })} className="p-1 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg transition-colors ml-auto text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}