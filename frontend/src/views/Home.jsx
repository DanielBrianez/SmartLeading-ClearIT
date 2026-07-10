// src/views/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Clock, AlertTriangle, FileText, CheckCircle2, Medal, ArrowRight,
  BrainCircuit, CalendarClock, ShieldAlert, Send, Bot, User, X
} from 'lucide-react';
import { lerLGPD, salvarLGPD } from '../utils/security';
import { DB_SQUADS } from '../dados';

// Dicionário de perfis ATUALIZADO conforme imagem oficial (Quem usa o agente?)
const PERFIS_INFO = {
  "A definir": { 
    desc: "Seu perfil de uso será mapeado pela nossa IA.", 
    cor: "text-slate-500", 
    bg: "bg-slate-100 dark:bg-slate-800" 
  },
  "Líder Técnico": { 
    desc: "Dor: Baixa tolerância à burocracia de RH. Precisa de: Roteiros diretos, rápidos e sem jargão.", 
    cor: "text-emerald-500", 
    bg: "bg-emerald-100 dark:bg-emerald-900/30" 
  },
  "Líder em Transição": { 
    desc: "Dor: Falta repertório emocional para conversas difíceis. Precisa de: Roteiro validado passo a passo.", 
    cor: "text-blue-500", 
    bg: "bg-blue-100 dark:bg-blue-900/30" 
  },
  "Líder Engajado": { 
    desc: "Dor: Acredita no processo, o gargalo é tempo. Precisa de: Agilidade, estrutura e organização.", 
    cor: "text-purple-500", 
    bg: "bg-purple-100 dark:bg-purple-900/30" 
  }
};

export default function Home({ setAbaAtiva }) {
  const idLider = "daniel_nascimento";
  
  // Resgatando a sessão de forma segura (garantindo tempoCasa default 2.5 anos)
  const sessionSalva = lerLGPD('@clearit-session') || {};
  const user = { 
    ...sessionSalva,
    nome: sessionSalva.nome || 'Daniel Nascimento', 
    tempoCasa: sessionSalva.tempoCasa !== undefined ? sessionSalva.tempoCasa : 2.5 
  };
  
  const [squad, setSquad] = useState([]);
  const [metricas, setMetricas] = useState({ atrasadas: 0, noPrazo: 0, atasMes: 0, xp: 0 });

  // Estados Gerais do Teste
  const [perfilLider, setPerfilLider] = useState('A definir');
  const [statusTeste, setStatusTeste] = useState('none'); 

  // Estados do Chatbot
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const carregarDados = () => {
      let squadAtual = lerLGPD('@clearit-squad') || [];
      
      if (squadAtual.length === 0) {
        squadAtual = DB_SQUADS[idLider] || [];
        salvarLGPD('@clearit-squad', squadAtual);
      }
      
      const hoje = new Date();
      hoje.setHours(0,0,0,0);
      
      let atrasadas = 0;
      let noPrazo = 0;

      const squadProcessado = squadAtual.map(m => {
        let dataReuniao;
        let status = 'em_dia';
        
        if (!m.proxima_reuniao) {
          status = 'atrasada';
          atrasadas++;
        } else {
          if (m.proxima_reuniao.includes('/')) {
            const [d, mes, a] = m.proxima_reuniao.split('/');
            dataReuniao = new Date(`${a}-${mes}-${d}T00:00:00`);
          } else {
            dataReuniao = new Date(m.proxima_reuniao + 'T00:00:00');
          }
          
          if (dataReuniao < hoje) {
            status = 'atrasada';
            atrasadas++;
          } else {
            noPrazo++;
          }
        }
        return { ...m, status, dataObjeto: dataReuniao };
      });

      setSquad(squadProcessado);

      const atas = lerLGPD('@clearit-atas-squad') || [];
      const ranking = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
      const meuXp = ranking[idLider] || 0;

      setMetricas({ atrasadas, noPrazo, atasMes: atas.length, xp: meuXp });

      // LÓGICA DE TEMPO/VENCIMENTO DO ASSESSMENT
      const perfilSalvo = localStorage.getItem('@clearit-perfil-lider');
      let dataProximoTesteTs = localStorage.getItem('@clearit-data-proximo-teste');

      // Regra de Negócio: Liderança com menos de 1 ano de casa.
      if (user.tempoCasa < 1) {
        setPerfilLider('Líder em Transição');
        localStorage.setItem('@clearit-perfil-lider', 'Líder em Transição');
      } else {
        if (perfilSalvo) {
          setPerfilLider(perfilSalvo);
        }

        if (!dataProximoTesteTs) {
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + 3);
          dataProximoTesteTs = deadline.getTime();
          localStorage.setItem('@clearit-data-proximo-teste', dataProximoTesteTs);
        }

        const diasParaVencer = Math.ceil((dataProximoTesteTs - hoje.getTime()) / (1000 * 60 * 60 * 24));

        if (diasParaVencer <= 0) {
          setStatusTeste('mandatory');
          // Força a abertura do chat se estourou o prazo (excluindo os que já caíram na regra do Júnior)
          if (!perfilSalvo || perfilSalvo === 'A definir' || (perfilSalvo && diasParaVencer <= 0)) {
            abrirChatbot();
          }
        } else if (diasParaVencer <= 3) {
          setStatusTeste('warning');
          // Se for o primeiro acesso e estiver na janela de aviso, o sistema sugere a abertura, mas não tranca.
          if (!perfilSalvo || perfilSalvo === 'A definir') {
             abrirChatbot();
          }
        }
      }
    };

    carregarDados();
    window.addEventListener('clearit-data-updated', carregarDados);
    return () => window.removeEventListener('clearit-data-updated', carregarDados);
  }, [idLider, user.tempoCasa]);

  // Auto-scroll do chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  const patente = metricas.xp >= 3000 ? 'Líder Referência 💎' : 'Líder Engajado 🚀';

  const formatarDataISO = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const iniciarReuniao = (idLiderado) => {
    localStorage.setItem('@clearit-liderado-foco', idLiderado);
    let squads = lerLGPD('@clearit-squad') || [];
    if (squads.length === 0) squads = DB_SQUADS[idLider] || [];
    const index = squads.findIndex(m => m.id.toString() === idLiderado.toString());
    if (index !== -1) {
      const hoje = new Date();
      const dataHoje = formatarDataISO(hoje);
      squads[index].ultimaReuniao = dataHoje;
      squads[index].proxima_reuniao = dataHoje;
      salvarLGPD('@clearit-squad', squads);
    }
    const liderado = squad.find(m => m.id.toString() === idLiderado.toString()) || null;
    const nomeLiderado = liderado?.nome || 'o colaborador';
    const notificacoesSalvas = lerLGPD('@clearit-notificacoes') || [];
    notificacoesSalvas.unshift({
      id: Date.now(),
      target: 'LIDER',
      titulo: '1:1 iniciada',
      mensagem: `${nomeLiderado} teve a reunião reagendada para hoje.`,
      tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: false
    });
    salvarLGPD('@clearit-notificacoes', notificacoesSalvas);
    window.dispatchEvent(new Event('notificacao-atualizada'));
    if (setAbaAtiva) setAbaAtiva('1a1');
  };

  // ------- LÓGICA DO CHATBOT DE ASSESSMENT -------
  const abrirChatbot = () => {
    // Evita abrir múltiplos chats
    if (chatOpen) return; 
    
    setChatOpen(true);
    setChatStep(0);
    setChatHistory([
      { sender: 'ia', text: `Olá, ${user.nome.split(' ')[0]}! Sou a IA da ClearIT. Vamos mapear o seu perfil para eu poder gerar agentes e roteiros de 1:1 perfeitamente adaptados para você.` },
      { sender: 'ia', text: 'Para começar: Como é a sua relação com os ritos de gestão de pessoas? Você acha os processos muito burocráticos, ou o seu maior problema é a falta de tempo/organização na correria do dia a dia?' }
    ]);
  };

  const enviarMensagemChat = () => {
    if (chatInput.trim() === '') return;

    const novaMensagemUsuario = { sender: 'user', text: chatInput };
    const novoHistorico = [...chatHistory, novaMensagemUsuario];
    setChatHistory(novoHistorico);
    setChatInput('');
    setIsTyping(true);

    if (chatStep === 0) {
      setTimeout(() => {
        setChatHistory([...novoHistorico, { sender: 'ia', text: 'Entendido. E quando o assunto é dar um feedback difícil ou negativo: você prefere um roteiro bem direto e rápido, ou sente que um passo a passo detalhado te ajudaria a ter mais repertório emocional?' }]);
        setIsTyping(false);
        setChatStep(1);
      }, 1500);
    } else if (chatStep === 1) {
      setTimeout(() => {
        setChatHistory([...novoHistorico, { sender: 'ia', text: 'Perfeito! Analisando suas respostas e cruzando com nossos perfis da ClearIT...' }]);
        setChatStep(2);
        
        // Simula processamento final e define perfil
        setTimeout(() => {
          let perfilDesignado = "Líder em Transição"; // Padrão base
          const tudoMinusculo = novoHistorico.map(h => h.text).join(' ').toLowerCase();
          
          // Lógica simplificada de Mock para refletir as dores e necessidades
          if (tudoMinusculo.includes('direto') || tudoMinusculo.includes('rápido') || tudoMinusculo.includes('burocra') || tudoMinusculo.includes('técnico') || tudoMinusculo.includes('prático')) {
            perfilDesignado = "Líder Técnico";
          } else if (tudoMinusculo.includes('tempo') || tudoMinusculo.includes('organiza') || tudoMinusculo.includes('estrutura') || tudoMinusculo.includes('dia a dia') || tudoMinusculo.includes('agilidade')) {
             perfilDesignado = "Líder Engajado";
          } else if (tudoMinusculo.includes('difícil') || tudoMinusculo.includes('repertório') || tudoMinusculo.includes('detalhado') || tudoMinusculo.includes('passo')) {
             perfilDesignado = "Líder em Transição";
          }

          setPerfilLider(perfilDesignado);
          localStorage.setItem('@clearit-perfil-lider', perfilDesignado);
          
          const proximaData = new Date();
          proximaData.setDate(proximaData.getDate() + 90);
          localStorage.setItem('@clearit-data-proximo-teste', proximaData.getTime());

          setChatHistory(prev => [...prev, { sender: 'ia', text: `Calibração concluída! Mapeei que seu perfil atual é: **${perfilDesignado}**. Meus roteiros a partir de agora vão focar em mitigar suas principais dores. O sistema foi atualizado!` }]);
          setIsTyping(false);
          setStatusTeste('none'); // Libera o usuário do fluxo obrigatório
          
          // Fecha automaticamente depois de 4 segundos
          setTimeout(() => setChatOpen(false), 4000);
        }, 2500);
      }, 1200);
    }
  };

  const fecharChat = () => {
    // Só deixa fechar se não for obrigatório ou se já acabou o passo 2
    if (statusTeste !== 'mandatory' || chatStep === 2) {
      setChatOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Olá, {user.nome.split(' ')[0]}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Aqui está o resumo da cadência do seu time hoje.</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-purple-200 dark:border-purple-800">
          <Medal className="w-5 h-5" /> {patente} ({metricas.xp} XP)
        </div>
      </div>

      {/* OVERVIEW DO NÍVEL DE LIDERANÇA */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${PERFIS_INFO[perfilLider]?.bg} ${PERFIS_INFO[perfilLider]?.cor}`}>
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Seu Perfil de Líder</h2>
            {statusTeste === 'mandatory' && perfilLider === 'A definir' && (
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">Ação Obrigatória Pendente</span>
            )}
          </div>
          <p className={`text-2xl font-black ${PERFIS_INFO[perfilLider]?.cor}`}>
            {perfilLider}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {PERFIS_INFO[perfilLider]?.desc}
          </p>
        </div>
        
        {/* Lado Direito do Overview (Datas e Botão Restaurado) */}
        {user.tempoCasa >= 1 && (
          <div className="flex-shrink-0 border-l border-slate-200 dark:border-slate-800 pl-6 flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-500 uppercase">Próxima Calibração</p>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white mt-1 mb-3 font-bold">
              <CalendarClock className="w-4 h-4 text-blue-500" />
              {new Date(Number(localStorage.getItem('@clearit-data-proximo-teste') || Date.now())).toLocaleDateString('pt-BR')}
            </div>
            
            <button 
              onClick={abrirChatbot}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                statusTeste === 'mandatory' 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800'
              }`}
            >
              <Bot className="w-4 h-4" /> 
              {perfilLider === 'A definir' ? 'Iniciar Mapeamento' : 'Refazer Mapeamento'}
            </button>
          </div>
        )}
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-center ${metricas.atrasadas > 0 ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50' : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'}`}>
          <div className={`flex items-center gap-2 mb-2 ${metricas.atrasadas > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500'}`}>
            <AlertTriangle className="w-5 h-5" /> <span className="text-sm font-bold uppercase tracking-wider">Atrasadas (Risco)</span>
          </div>
          <p className={`text-4xl font-black ${metricas.atrasadas > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{metricas.atrasadas}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <CheckCircle2 className="w-5 h-5" /> <span className="text-sm font-bold uppercase tracking-wider">No Prazo (Saudáveis)</span>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white">{metricas.noPrazo}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <FileText className="w-5 h-5" /> <span className="text-sm font-bold uppercase tracking-wider">Atas Documentadas</span>
          </div>
          <p className="text-4xl font-black text-slate-900 dark:text-white">{metricas.atasMes}</p>
        </div>
      </div>

      {/* LISTA DE SQUAD DINÂMICA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Membros do Squad
          </h2>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {squad.map(membro => (
            <div key={membro.id} className="p-5 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{membro.nome}</p>
                <p className="text-sm text-slate-500">{membro.cargo} • {membro.senioridade}</p>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 font-semibold uppercase mb-1">Próxima 1:1</span>
                  {membro.status === 'atrasada' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      <Clock className="w-3.5 h-3.5" /> Atrasada ({membro.proxima_reuniao ? membro.proxima_reuniao.split('-').reverse().join('/') : 'S/ Data'})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Clock className="w-3.5 h-3.5" /> {membro.proxima_reuniao.split('-').reverse().join('/')}
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={() => iniciarReuniao(membro.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
                >
                  Fazer 1:1 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MÁSCARA E MODAL DO CHATBOT */}
      {chatOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-[fadeIn_0.3s_ease-out]">
            
            {/* Header do Chat */}
            <div className={`p-4 text-white flex justify-between items-center ${statusTeste === 'mandatory' ? 'bg-red-600' : 'bg-blue-600'}`}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">ClearIT AI</h2>
                  <p className="text-xs opacity-90">Calibração de Performance</p>
                </div>
              </div>
              
              {/* Só deixa fechar se não for obrigatório, ou se já terminou */}
              {(statusTeste !== 'mandatory' || chatStep === 2) && (
                <button onClick={fecharChat} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Corpo do Chat (Mensagens) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <div className={`p-3 text-sm rounded-2xl shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm'
                    }`}>
                      {/* Tratamento simples para negrito na msg da IA */}
                      <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>

                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input do Chat */}
            {chatStep < 2 && (
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enviarMensagemChat()}
                    placeholder="Responda para a IA..."
                    disabled={isTyping}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button 
                    onClick={enviarMensagemChat}
                    disabled={chatInput.trim() === '' || isTyping}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white p-3 rounded-xl transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {statusTeste === 'warning' && (
                  <div className="mt-3 text-center">
                    <button onClick={fecharChat} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-semibold">
                      Responder ao mapeamento depois
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}