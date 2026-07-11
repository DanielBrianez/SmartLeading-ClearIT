// src/views/HomeLiderado.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, Clock, MessageSquare, Briefcase, 
  Star, ThumbsUp, Send, Target, ListTodo, Award, TrendingUp
} from 'lucide-react';
import { lerLGPD, salvarLGPD } from '../utils/security';
import { DB_SQUADS } from '../dados';

export default function HomeLiderado() {
  const user = lerLGPD('@clearit-session') || { id: 'carlos_eduardo', nome: 'Carlos Eduardo' };
  
  const [meuMomento, setMeuMomento] = useState('');
  const [pautaPrevia, setPautaPrevia] = useState('');
  const [dataReuniao, setDataReuniao] = useState('Buscando...');
  const [statusReuniao, setStatusReuniao] = useState('em_dia');
  const [atasPendentes, setAtasPendentes] = useState([]);
  
  // Métricas de Carreira
  const [meusPdis, setMeusPdis] = useState(0);
  const [minhasTarefas, setMinhasTarefas] = useState(0);
  
  // Detalhes de Carreira (PDI e Acordos)
  const [meusDados, setMeusDados] = useState(null);
  const [detalhePdi, setDetalhePdi] = useState({ objetivo: '', foco: '', competencias: [] });
  const [listaPdis, setListaPdis] = useState([]);
  const [listaTarefas, setListaTarefas] = useState([]);
  
  // Estados para o form de feedback
  const [notaAtual, setNotaAtual] = useState(5);
  const [relevante, setRelevante] = useState('sim');

  const [enviandoTeams, setEnviandoTeams] = useState(false);
  const [teamsEnviado, setTeamsEnviado] = useState(false);

  // Estado para notificações customizadas
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Função para disparar a notificação bonitinha
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleSalvarPautaPrevia = (e) => {
    const valor = e.target.value;
    setPautaPrevia(valor);
    localStorage.setItem(`@clearit-pauta-previa-${user.id}`, valor);
  };

  const notificarPautaNoTeams = async () => {
    setEnviandoTeams(true);
    try {
      const dataReuniaoExibicao = dataReuniao || 'Hoje';
      
      const response = await fetch('https://smartleading-clearit.onrender.com/notificar-teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lider_nome: "DANIEL NASCIMENTO",
          liderado_nome: user.nome,
          data_reuniao: dataReuniaoExibicao,
          sentimento: meuMomento,
          pauta_liderado: pautaPrevia,
          pdis_ativos: listaPdis.length,
          acordos_ativos: listaTarefas.length
        })
      });
      if (response.ok) {
        setTeamsEnviado(true);
        setTimeout(() => setTeamsEnviado(false), 5000);
      }
    } catch (err) {
      console.log('Erro ao enviar Teams:', err);
    } finally {
      setEnviandoTeams(false);
    }
  };

  useEffect(() => {
    const carregarDados = () => {
      const chave = `@clearit-momento-${user.id}`;
      const momentoSalvo = localStorage.getItem(chave);
      if (momentoSalvo) setMeuMomento(momentoSalvo);

      const pautaSalva = localStorage.getItem(`@clearit-pauta-previa-${user.id}`);
      if (pautaSalva) setPautaPrevia(pautaSalva);

      let squads = lerLGPD('@clearit-squad') || [];
      if (squads.length === 0) squads = Object.values(DB_SQUADS).flat();

      const dadosMembro = squads.find(m => m.id.toString() === user.id.toString() || m.nome.includes(user.nome.split(' ')[0]));
      setMeusDados(dadosMembro);
      
      if (dadosMembro && dadosMembro.proxima_reuniao) {
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        
        let objData;
        if (dadosMembro.proxima_reuniao.includes('/')) {
          const [d, mes, a] = dadosMembro.proxima_reuniao.split('/');
          objData = new Date(`${a}-${mes}-${d}T00:00:00`);
        } else {
          objData = new Date(dadosMembro.proxima_reuniao + 'T00:00:00');
        }

        setDataReuniao(dadosMembro.proxima_reuniao.includes('-') ? dadosMembro.proxima_reuniao.split('-').reverse().join('/') : dadosMembro.proxima_reuniao);
        setStatusReuniao(objData < hoje ? 'atrasada' : 'em_dia');
      } else {
        setDataReuniao('Não Agendada');
        setStatusReuniao('atrasada');
      }

      const todasAtas = lerLGPD('@clearit-atas-squad') || [];
      const pendentes = todasAtas.filter(a => a.idLiderado.toString() === user.id.toString() && a.feedbackPendente === true);
      setAtasPendentes(pendentes);

      if (dadosMembro) {
        const pdisTotais = lerLGPD('@clearit-pdi') || [];
        const pdisDeletados = lerLGPD('@clearit-deleted-pdi') || [];
        
        // PDI Base do Liderado
        const progresso = dadosMembro.progresso || { tecnico: 50, engajamento: 50, metas: 50 };
        const proxNivel = dadosMembro.senioridade === 'Júnior' ? 'Pleno' : dadosMembro.senioridade === 'Pleno' ? 'Sênior' : 'Especialista / Liderança';
        const pdiInfo = {
          objetivo: `Evolução para nível ${proxNivel}`,
          foco: `Desenvolvimento de autonomia técnica e visão estratégica do produto.`,
          competencias: [
            { nome: 'Hard Skills (Técnico)', nivel: progresso.tecnico },
            { nome: 'Soft Skills (Liderança)', nivel: progresso.engajamento },
            { nome: 'Processos e Metas', nivel: progresso.metas }
          ],
          planoAcao: [
            { id: `estatico_pdi_1_${dadosMembro.id}`, acao: 'Certificação Técnica Relevante', prazo: 'Q3 2026', status: 'Em andamento' },
            { id: `estatico_pdi_2_${dadosMembro.id}`, acao: 'Mentoria com Tech Lead', prazo: 'Mensal', status: 'No prazo' },
          ]
        };

        const pdiSalvosDoMembro = pdisTotais.filter(p => p.idLiderado === dadosMembro.id.toString());
        const savedPdiMap = new Map(pdiSalvosDoMembro.map(p => [p.id, p]));

        let pdiCombinados = [
          ...pdiInfo.planoAcao.map(p => savedPdiMap.has(p.id) ? savedPdiMap.get(p.id) : p),
          ...pdiSalvosDoMembro.filter(p => !pdiInfo.planoAcao.find(bp => bp.id === p.id))
        ];
        const pdisAtivos = pdiCombinados.filter(p => !pdisDeletados.includes(p.id));

        const tarefasTotais = lerLGPD('@clearit-tasks') || [];
        const tarefasDeletadas = lerLGPD('@clearit-deleted-tasks') || [];
        
        const tasksBase = dadosMembro.tarefas || [];
        const tasksSalvasDoMembro = tarefasTotais.filter(t => t.idLiderado === dadosMembro.id.toString());
        const savedTasksMap = new Map(tasksSalvasDoMembro.map(t => [t.id, t]));
        
        const tasksCombinadas = [
          ...tasksBase.map(t => savedTasksMap.has(t.id) ? savedTasksMap.get(t.id) : t),
          ...tasksSalvasDoMembro.filter(t => !tasksBase.find(bt => bt.id === t.id))
        ];
        const tasksAtivas = tasksCombinadas.filter(t => !tarefasDeletadas.includes(t.id));

        // Expiração automática de PDIs
        const hojeTs = Date.now();
        const pdisComExpiracao = pdisAtivos.map(p => {
          if (p.dataExpiracaoTs && p.dataExpiracaoTs < hojeTs && p.status !== 'Concluído') {
            return { ...p, status: 'Expirado' }; 
          }
          return p;
        });

        // Competências dinâmicas baseadas na entrega de PDI/Tasks
        const tarefasFeitas = tasksAtivas.filter(t => t.status.toLowerCase() === 'concluida').length;
        const pdisFeitos = pdisComExpiracao.filter(p => p.status === 'Concluído').length;
        const compsDinamicas = pdiInfo.competencias.map(comp => {
          if (comp.nome.includes('Hard Skills')) return { ...comp, nivel: Math.min(100, comp.nivel + (pdisFeitos * 8)) };
          if (comp.nome.includes('Processos')) return { ...comp, nivel: Math.min(100, comp.nivel + (tarefasFeitas * 5)) };
          return comp;
        });

        setDetalhePdi({
          objetivo: pdiInfo.objetivo,
          foco: pdiInfo.foco,
          competencias: compsDinamicas
        });

        setListaPdis(pdisComExpiracao);
        setListaTarefas(tasksAtivas);

        setMeusPdis(pdisComExpiracao.filter(p => p.status !== 'Concluído').length);
        setMinhasTarefas(tasksAtivas.filter(t => t.status.toLowerCase() !== 'concluida').length);
      }
    };

    carregarDados();
    window.addEventListener('clearit-data-updated', carregarDados);
    return () => window.removeEventListener('clearit-data-updated', carregarDados);
  }, [user.id, user.nome]);

  const handleSalvarMomento = (e) => {
    const valor = e.target.value;
    setMeuMomento(valor);
    localStorage.setItem(`@clearit-momento-${user.id}`, valor);
  };

  const solicitarMentoria = () => {
    const novaNotificacao = {
      id: Date.now(),
      target: 'LIDER',
      titulo: '⚠️ Reunião Atrasada',
      mensagem: `${user.nome} está solicitando o agendamento da 1:1.`,
      tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: false
    };
    const notsSalvas = lerLGPD('@clearit-notificacoes') || [];
    notsSalvas.unshift(novaNotificacao);
    salvarLGPD('@clearit-notificacoes', notsSalvas);
    window.dispatchEvent(new Event('notificacao-atualizada'));
    
    showToast("Seu líder foi notificado no sistema com sucesso!", "success");
  };

  const enviarFeedback = (ataId, idLider) => {
    const xpGanho = 50 + (notaAtual * 10) + (relevante === 'sim' ? 50 : 0);

    const rankingSalvo = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
    const liderTarget = idLider || 'daniel_nascimento'; 
    rankingSalvo[liderTarget] = (rankingSalvo[liderTarget] || 0) + xpGanho;
    localStorage.setItem('@clearit-ranking', JSON.stringify(rankingSalvo));

    const todasAtas = lerLGPD('@clearit-atas-squad') || [];
    const indexAta = todasAtas.findIndex(a => a.idAta === ataId);
    if(indexAta !== -1) {
      todasAtas[indexAta].feedbackPendente = false;
      salvarLGPD('@clearit-atas-squad', todasAtas);
    }

    const novaNotificacao = {
      id: Date.now(),
      target: 'LIDER',
      titulo: '🎉 Feedback Recebido!',
      mensagem: `${user.nome} avaliou a última 1:1. Você ganhou +${xpGanho} XP!`,
      tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: false
    };
    const notsSalvas = lerLGPD('@clearit-notificacoes') || [];
    notsSalvas.unshift(novaNotificacao);
    salvarLGPD('@clearit-notificacoes', notsSalvas);
    window.dispatchEvent(new Event('notificacao-atualizada'));

    setAtasPendentes(prev => prev.filter(a => a.idAta !== ataId));
  };

  // 🔥 HACK PARA A APRESENTAÇÃO: Força uma ata a aparecer para mostrar a banca
  const forcarAtaMock = () => {
    setAtasPendentes([{
      idAta: Date.now(),
      idLider: 'daniel_nascimento',
      idLiderado: user.id,
      feedbackPendente: true
    }]);
  };

  const simularDisparoAlertaTeams = async () => {
    try {
      await fetch('https://smartleading-clearit.onrender.com/disparar-alerta-teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          liderado_nome: user.nome,
          lider_nome: "DANIEL NASCIMENTO",
          data_reuniao: dataReuniao || "Em 3 dias"
        })
      });
      showToast('🤖 Alerta de 3 dias com Adaptive Card disparado para o Teams!', 'info');
    } catch (e) {
      console.log(e);
    }
  };

  const simularRespostaTeams = async () => {
    try {
      const sentimentoMock = "🚀 Motivado e Energizado";
      const pautaMock = "Alinhamento de carreira e transição de squad (Enviado direto do Teams)";
      
      const response = await fetch('https://smartleading-clearit.onrender.com/receber-resposta-teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          liderado_nome: user.nome,
          sentimento: sentimentoMock,
          pauta_liderado: pautaMock
        })
      });
      if (response.ok) {
        setMeuMomento(sentimentoMock);
        setPautaPrevia(pautaMock);
        localStorage.setItem(`@clearit-momento-${user.id}`, sentimentoMock);
        localStorage.setItem(`@clearit-pauta-previa-${user.id}`, pautaMock);
        window.dispatchEvent(new Event('clearit-data-updated'));
        showToast('✅ Resposta enviada do Teams integrada localmente!', 'success');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out] pb-10">
      
      {/* HEADER DO LIDERADO */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Olá, {user.nome.split(' ')[0]}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Seu portal pessoal de acompanhamento e carreira.</p>
          </div>
        </div>
      </div>

      {/* MÉTRICAS DE CARREIRA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">PDIs Ativos</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{meusPdis}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Acordos Pendentes</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{minhasTarefas}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
            <ListTodo className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${statusReuniao === 'atrasada' ? 'bg-red-50 border-red-200 dark:bg-red-900/10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
          <div>
            <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${statusReuniao === 'atrasada' ? 'text-red-600' : 'text-slate-500'}`}>Status da Cadência</p>
            <p className={`text-xl font-black ${statusReuniao === 'atrasada' ? 'text-red-600' : 'text-emerald-500'}`}>
              {statusReuniao === 'atrasada' ? 'Atrasada' : 'Em Dia'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusReuniao === 'atrasada' ? 'bg-red-100 text-red-500' : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20'}`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ÁREA DE FEEDBACK PENDENTE */}
      {atasPendentes.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/50 p-6 rounded-2xl shadow-sm animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-500">
            <Star className="w-6 h-6 fill-amber-500 animate-pulse" />
            <h2 className="text-lg font-black uppercase tracking-tight">Avalie sua última 1:1</h2>
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-400/80 mb-6 font-medium">
            Seu líder registrou a ata do último alinhamento. Como parte da nossa cultura de governança, o XP dele só será liberado após a sua avaliação sincera.
          </p>

          {atasPendentes.map((ata, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-800/30 p-5 rounded-xl flex flex-col md:flex-row gap-6 items-center mb-4">
              
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nota da Reunião</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(estrela => (
                      <button 
                        key={estrela}
                        onClick={() => setNotaAtual(estrela)}
                        className={`p-2 rounded-lg transition-all ${notaAtual >= estrela ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-amber-50'}`}
                      >
                        <Star className={`w-6 h-6 ${notaAtual >= estrela ? 'fill-amber-500' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Foi relevante para o seu PDI?</label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setRelevante('sim')}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${relevante === 'sim' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 hover:bg-emerald-50/50'}`}
                    >
                      <ThumbsUp className="w-4 h-4" /> Sim, muito
                    </button>
                    <button 
                      onClick={() => setRelevante('nao')}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${relevante === 'nao' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 hover:bg-red-50/50'}`}
                    >
                      Não muito
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <button 
                  onClick={() => enviarFeedback(ata.idAta, ata.idLider)}
                  className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Send className="w-5 h-5" /> Enviar Avaliação
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COMPONENTE DE SINC INTELIGENTE (MOMENTO) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Sincronia de Momento
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Como você está se sentindo nesta sprint? Seu líder verá essa informação ao planejar a próxima 1:1.</p>
            
            <select 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              value={meuMomento}
              onChange={handleSalvarMomento}
            >
              <option value="">Compartilhe seu status...</option>
              <option value="Motivado e Energizado">🚀 Motivado e Energizado</option>
              <option value="Focado nas entregas">🎯 Focado nas entregas</option>
              <option value="Precisando de ajuda/bloqueado">🚧 Precisando de ajuda/bloqueado</option>
              <option value="Sobrecarga/Cansado">🔋 Sobrecarga / Cansado</option>
            </select>

            {/* Tema da 1:1 */}
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                Tema / Pauta sugerida para a 1:1
              </label>
              <textarea 
                value={pautaPrevia}
                onChange={handleSalvarPautaPrevia}
                rows="2"
                placeholder="O que você quer garantir que a gente aborde hoje? Ex: Alinhamento de PDI..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* Botão de Envio/Notificação Teams (COM VALIDAÇÃO DE CAMPO VAZIO) */}
            <button
              onClick={notificarPautaNoTeams}
              disabled={enviandoTeams || pautaPrevia.trim() === ''}
              className={`mt-4 w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                enviandoTeams || pautaPrevia.trim() === ''
                  ? 'bg-slate-200 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-800 dark:text-slate-500 cursor-not-allowed'
                  : teamsEnviado 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 shadow-md transition-transform active:scale-95'
              }`}
            >
              {enviandoTeams ? 'Notificando Teams...' : teamsEnviado ? '✅ Resumo Enviado para o Teams!' : '🚀 Confirmar Pauta e Receber Resumo no Teams'}
            </button>
          </div>
          
          {meuMomento && (
             <div className="mt-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-800/50">
               <CheckCircle2 className="w-4 h-4" /> Status atualizado e sincronizado com a Liderança.
             </div>
          )}
        </div>

        {/* COMPONENTE DE CADÊNCIA VIVA */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" /> Próxima Reunião (1:1)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Acompanhe a cadência dos seus alinhamentos e solicite horários caso precise.</p>
            
            <div className={`p-4 rounded-xl border flex items-center gap-4 ${statusReuniao === 'atrasada' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${statusReuniao === 'atrasada' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'}`}>
                {statusReuniao === 'atrasada' ? <AlertTriangle className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
              </div>
              <div>
                <p className={`text-sm font-bold uppercase tracking-wide ${statusReuniao === 'atrasada' ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {statusReuniao === 'atrasada' ? 'Reunião Atrasada' : 'Agendada para'}
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{dataReuniao}</p>
              </div>
            </div>
          </div>

          {statusReuniao === 'atrasada' && (
            <button 
              onClick={solicitarMentoria}
              className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Avisar Líder e Solicitar Mentoria
            </button>
          )}
        </div>

      </div>

      {/* SEÇÃO DETALHADA DE PDI E TAREFAS (ALINHAMENTO COM A JORNADA) */}
      {meusDados && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-[fadeIn_0.5s_ease-out] mt-6">
          
          {/* COLUNA ESQUERDA: PDI E COMPETÊNCIAS */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Meu Plano de Desenvolvimento (PDI)</h2>
              </div>

              {/* Card de Foco */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white shadow-md mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-100">Objetivo de Carreira</h3>
                <h4 className="text-xl font-black mt-1">{detalhePdi.objetivo}</h4>
                <p className="text-blue-50 text-xs mt-1.5 leading-relaxed">{detalhePdi.foco}</p>
              </div>

              {/* Progresso de Competências */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Radar de Competências</h3>
              <div className="space-y-4 mb-6">
                {detalhePdi.competencias.map((comp, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>{comp.nome}</span>
                      <span>{comp.nivel}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${comp.nivel > 70 ? 'bg-emerald-500' : comp.nivel > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                        style={{ width: `${comp.nivel}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Passos do PDI */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Plano de Ação</h3>
              <div className="space-y-3">
                {listaPdis.map((acao, index) => (
                  <div key={acao.id} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold truncate ${acao.status === 'Concluído' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                        {acao.acao}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {acao.prazoDisplay || acao.prazo}</span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          acao.status === 'Em andamento' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                          acao.status === 'No prazo' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                          acao.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                          'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        }`}>{acao.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {listaPdis.length === 0 && <p className="text-xs text-slate-500 italic">Nenhum passo definido no PDI.</p>}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: ACORDOS E MISSÕES */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-4">
                <ListTodo className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Acordos e Missões (Tasks)</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Acompanhe as metas táticas combinadas com o seu gestor na última 1:1.</p>

              <div className="space-y-3">
                {listaTarefas.map((task) => (
                  <div key={task.id} className={`flex items-start gap-3 p-4 rounded-xl border ${
                    task.status.toLowerCase() === 'concluida' ? 'bg-emerald-50/30 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10' :
                    task.status.toLowerCase() === 'expirada' ? 'bg-red-50/30 border-red-100 dark:bg-red-500/5 dark:border-red-500/10' :
                    'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50'
                  }`}>
                    <div className="mt-0.5 flex-shrink-0">
                      {task.status.toLowerCase() === 'concluida' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : task.status.toLowerCase() === 'expirada' ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${task.status.toLowerCase() === 'concluida' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.nome || task.descricao}
                      </p>
                      {task.nome && task.descricao && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{task.descricao}</p>
                      )}
                      <p className="text-[10px] text-slate-500 mt-2 font-semibold">Prazo (DDL): {task.ddl ? task.ddl.split('-').reverse().join('/') : 'Sem prazo'}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md self-start ${
                      task.status.toLowerCase() === 'concluida' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' :
                      task.status.toLowerCase() === 'pendente' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20' : 'bg-red-100 text-red-700 dark:bg-red-500/20'
                    }`}>{task.status}</span>
                  </div>
                ))}
                {listaTarefas.length === 0 && (
                  <p className="text-xs text-slate-500 italic">Nenhum acordo registrado pelo gestor.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* BOTÃO MOCK PARA APRESENTAÇÃO */}
      <div className="text-center mt-12 flex flex-col items-center gap-2">
        <button 
          onClick={forcarAtaMock}
          className="text-xs text-slate-300 dark:text-slate-700 hover:text-amber-500 transition-colors"
          title="Clique aqui durante a demo para simular que o líder acabou de gerar uma ata"
        >
          [Demo Hack: Forçar Ata Pendente]
        </button>
        <div className="flex gap-4 mt-2">
          <button 
            onClick={simularDisparoAlertaTeams}
            className="text-xs text-slate-300 dark:text-slate-700 hover:text-blue-500 transition-colors"
            title="Simula o robô disparando um formulário no Teams 3 dias antes da reunião"
          >
            [Demo Hack: Disparo Teams (3 Dias Antes)]
          </button>
          <button 
            onClick={simularRespostaTeams}
            className="text-xs text-slate-300 dark:text-slate-700 hover:text-emerald-500 transition-colors"
            title="Simula o colaborador respondendo e enviando a pauta de dentro do Teams"
          >
            [Demo Hack: Resposta Direto do Teams]
          </button>
        </div>
      </div>

      {/* COMPONENTE FLUTUANTE DE TOAST (NOTIFICAÇÃO) */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-[fadeIn_0.3s_ease-out]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${
            toast.type === 'info' 
              ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300'
          }`}>
            {toast.type === 'info' ? <MessageSquare className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}