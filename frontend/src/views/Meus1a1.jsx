// src/views/Meus1a1.jsx
import { useState, useEffect } from 'react';
import { 
  Bot, Send, FileText, Download, Loader2, 
  User, CheckCircle2, AlertCircle, Briefcase, TrendingUp, Lock, ShieldCheck, EyeOff, MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import { DB_SQUADS } from '../dados';

import { salvarLGPD, lerLGPD } from '../utils/security';

export default function Meus1a1({ setAbaAtiva }) { 
  const idLiderLogado = "daniel_nascimento";
  const nomeLiderLogado = "DANIEL NASCIMENTO DOS SANTOS FILHO";
  
  const meuSquad = DB_SQUADS[idLiderLogado] || [];

  const buscarMomentoDoLiderado = (liderado) => {
    if (!liderado) return '';
    const idLoginFalback = liderado.nome.toLowerCase().replace(' ', '_');
    
    return localStorage.getItem(`@clearit-momento-${liderado.id}`) || 
           localStorage.getItem(`@clearit-momento-${idLoginFalback}`) || 
           'Aguardando preenchimento...';
  };

  const obterSelecaoInicial = () => {
    const idFoco = localStorage.getItem('@clearit-liderado-foco');
    const idParaBuscar = idFoco || null;
    if (!idParaBuscar || meuSquad.length === 0) return null;
    return meuSquad.find(m => m.id.toString() === idParaBuscar.toString()) || null;
  };

  const [lideradoSelecionado, setLideradoSelecionado] = useState(obterSelecaoInicial);
  
  // Variáveis ocultas da UI, mas enviadas para a IA (Contexto Preservado)
  const [senioridade, setSenioridade] = useState(() => {
    const liderado = obterSelecaoInicial();
    return liderado?.senioridade || '';
  });
  const [tempoCasa, setTempoCasa] = useState(() => {
    const liderado = obterSelecaoInicial();
    return liderado?.tempoCasa || '';
  });
  const [perfilLider, setPerfilLider] = useState(localStorage.getItem('@clearit-perfil-config') || 'Técnico');
  
  const [perfilLiderado, setPerfilLiderado] = useState(() => {
    const liderado = obterSelecaoInicial();
    return liderado ? buscarMomentoDoLiderado(liderado) : '';
  }); 
  const [pautaPrevia, setPautaPrevia] = useState(() => {
    const liderado = obterSelecaoInicial();
    return liderado ? (localStorage.getItem(`@clearit-pauta-previa-${liderado.id}`) || '') : '';
  });
  const [ataEditada, setAtaEditada] = useState('');
  const [modoEdicaoAta, setModoEdicaoAta] = useState(false);
  const [entregas, setEntregas] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState('');
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState({ visivel: false, mensagem: '', icone: null });
  const [abaDocumento, setAbaDocumento] = useState('roteiro');

  useEffect(() => {
    const atualizarPerfil = () => {
      const perfilSalvo = localStorage.getItem('@clearit-perfil-config');
      if (perfilSalvo) setPerfilLider(perfilSalvo);
    };

    const atualizarDados = () => {
      const lideradoAtual = obterSelecaoInicial();
      setPerfilLiderado(lideradoAtual ? buscarMomentoDoLiderado(lideradoAtual) : '');
      setPautaPrevia(lideradoAtual ? (localStorage.getItem(`@clearit-pauta-previa-${lideradoAtual.id}`) || '') : '');
    };

    atualizarPerfil();
    atualizarDados();
    window.addEventListener('perfil-atualizado', atualizarPerfil);
    window.addEventListener('clearit-data-updated', atualizarDados);
    return () => {
      window.removeEventListener('perfil-atualizado', atualizarPerfil);
      window.removeEventListener('clearit-data-updated', atualizarDados);
    };
  }, []);

  const mostrarToast = (mensagem, icone = 'check') => {
    setToast({ visivel: true, mensagem, icone });
    setTimeout(() => { setToast({ visivel: false, mensagem: '', icone: null }); }, 5000);
  };

  const handleLideradoChange = (e) => {
    const id = e.target.value;
    if (!id) {
      setLideradoSelecionado(null);
      setSenioridade('');
      setTempoCasa('');
      setPerfilLiderado('');
      setPautaPrevia('');
      return;
    }
    const liderado = meuSquad.find(m => m.id.toString() === id);
    setLideradoSelecionado(liderado);
    setSenioridade(liderado.senioridade);
    setTempoCasa(liderado.tempoCasa);
    setPerfilLiderado(buscarMomentoDoLiderado(liderado)); 
    setPautaPrevia(localStorage.getItem(`@clearit-pauta-previa-${liderado.id}`) || '');
  };

  // 🔥 O ESCUDO DE PRIVACIDADE (SEMANTIC FIREWALL LGPD) 🔥
  const aplicarFiltroLGPD = (texto) => {
    let textoFiltrado = texto;
    
    // Captura CPF (Ex: 123.456.789-00 ou 12345678900)
    textoFiltrado = textoFiltrado.replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b\d{11}\b/g, '[CPF_PROTEGIDO]');
    
    // Captura Valores Financeiros (Ex: R$ 5000, R$ 5.000,00)
    textoFiltrado = textoFiltrado.replace(/R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?\b/gi, '[SALÁRIO_PROTEGIDO]');
    
    // Captura E-mails
    textoFiltrado = textoFiltrado.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_PROTEGIDO]');
    
    // Captura Telefones (Ex: 11 99999-9999)
    textoFiltrado = textoFiltrado.replace(/\b\(?\d{2}\)?\s?\d{4,5}-?\d{4}\b/g, '[TELEFONE_PROTEGIDO]');

    return textoFiltrado;
  };

  const handleGerar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setResultado('');

    if (!lideradoSelecionado) {
      setErro('Por favor, selecione um liderado do seu Squad.');
      setLoading(false);
      return;
    }

    // 1. Aplica o Firewall LGPD nas observações do líder
    const textoLimpo = aplicarFiltroLGPD(entregas);
    
    // Dispara aviso visual se o Firewall precisou atuar
    if (textoLimpo !== entregas) {
      mostrarToast('🛡️ Firewall LGPD Ativado: Dados sensíveis (CPF/Salário) foram anonimizados antes do envio para a IA.', 'shield');
    }

    try {
      const idStr = lideradoSelecionado.id.toString();
      
      const pdisSalvos = lerLGPD('@clearit-pdi') || [];
      const pdisDeletados = lerLGPD('@clearit-deleted-pdi') || [];
      const pdisDoMembro = pdisSalvos.filter(p => p.idLiderado === idStr && !pdisDeletados.includes(p.id));

      const tasksSalvas = lerLGPD('@clearit-tasks') || [];
      const tasksDeletadas = lerLGPD('@clearit-deleted-tasks') || [];
      const tasksDoMembro = tasksSalvas.filter(t => t.idLiderado === idStr && !tasksDeletadas.includes(t.id));

      const formatarLista = (lista, tipo) => {
        if (lista.length === 0) return `Nenhum ${tipo} registrado no sistema.`;
        return lista.map(item => `- ${item.acao || item.nome} (Status atual: ${item.status})`).join('\n');
      };

      const resumoPdis = formatarLista(pdisDoMembro, 'PDI');
      const resumoTasks = formatarLista(tasksDoMembro, 'Acordo');

      const momentoParaIA = perfilLiderado === 'Aguardando preenchimento...' ? 'Focado nas entregas' : perfilLiderado;
      const pautaDoColaborador = localStorage.getItem(`@clearit-pauta-previa-${idStr}`) || 'Nenhum tema específico proposto.';

      const historicoOculto = `
[INFORMAÇÃO DE SISTEMA PARA A IA - CONTEXTO OBRIGATÓRIO DA MENTORIA]:
Abaixo está o histórico real do liderado extraído do banco de dados e a pauta proposta por ele. Use essas informações para personalizar a pauta:

>> Tema/Pauta proposta pelo Colaborador:
"${pautaDoColaborador}"

>> Histórico de PDIs:
${resumoPdis}

>> Histórico de Acordos e Tarefas:
${resumoTasks}

[OBSERVAÇÕES DO LÍDER PARA ESSA REUNIÃO]:
${textoLimpo} 
      `;

      // Envia também os dados ocultos da UI (tempoCasa e perfilLider)
      const response = await fetch('http://localhost:8000/api/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfil_lideranca: perfilLider,
          senioridade_liderado: senioridade,
          tempo_casa: tempoCasa,
          perfil_comportamental: momentoParaIA, 
          resumo_entregas: historicoOculto
        })
      });

      if (!response.ok) throw new Error('Erro ao conectar com a inteligência artificial.');
      
      const data = await response.json();
      setResultado(data.roteiro);

      const partes = data.roteiro.split(/--- ATA OFICIAL ---|- ATA OFICIAL -|ATA OFICIAL/);
      const ataTexto = partes.length > 1 ? partes[1].trim() : data.roteiro;
      setAtaEditada(ataTexto);
      setModoEdicaoAta(false);

      setAbaDocumento('roteiro'); 
    } catch (err) {
      setErro(err.message || 'Erro inesperado ao gerar roteiro.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!lideradoSelecionado) return mostrarToast("Erro de segurança: Liderado não identificado.");

    setModoEdicaoAta(false);

    setTimeout(async () => {
      const elemento = document.getElementById('conteudo-ata');
      if (!elemento) return;

      const opt = {
        margin: 15,
        filename: `Ata_1a1_${lideradoSelecionado.nome.replace(' ', '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(elemento).save();
      
      // DISPARA A NOTIFICAÇÃO DE FEEDBACK PENDENTE
      const novaNotificacao = {
        id: Date.now(),
        target: 'LIDER',
        titulo: 'Aguardando Feedback ⏳',
        mensagem: `Ata de ${lideradoSelecionado.nome} gerada! O XP será liberado após a avaliação dele.`,
        tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        lida: false
      };
      const notsSalvas = lerLGPD('@clearit-notificacoes') || [];
      notsSalvas.unshift(novaNotificacao);
      salvarLGPD('@clearit-notificacoes', notsSalvas);
      window.dispatchEvent(new Event('notificacao-atualizada'));

      const atasSalvas = lerLGPD('@clearit-atas-squad') || [];
      atasSalvas.unshift({
        idAta: Date.now(),
        idLiderado: lideradoSelecionado.id.toString(),
        nomeLiderado: lideradoSelecionado.nome,
        cargo: lideradoSelecionado.cargo,
        senioridade: senioridade,
        tempoCasa: tempoCasa,
        data: new Date().toLocaleDateString('pt-BR'), 
        conteudoRH: ataEditada,
        idLider: idLiderLogado,
        feedbackPendente: true
      }); 
      salvarLGPD('@clearit-atas-squad', atasSalvas);

      // RESETAR O ALARME DE CADÊNCIA (+15 DIAS)
      let squads = lerLGPD('@clearit-squad') || [];
      if (squads.length === 0) squads = DB_SQUADS[idLiderLogado] || [];
      
      const indexMembro = squads.findIndex(m => m.id.toString() === lideradoSelecionado.id.toString());
      
      if (indexMembro !== -1) {
        const hoje = new Date();
        const proxima = new Date(hoje);
        proxima.setDate(hoje.getDate() + 15);

        const formatarData = (data) => {
          const ano = data.getFullYear();
          const mes = String(data.getMonth() + 1).padStart(2, '0');
          const dia = String(data.getDate()).padStart(2, '0');
          return `${ano}-${mes}-${dia}`;
        };

        squads[indexMembro].ultimaReuniao = formatarData(hoje);
        squads[indexMembro].proxima_reuniao = formatarData(proxima);
        salvarLGPD('@clearit-squad', squads);
      }

      mostrarToast('✅ Ata baixada! Aguardando o Liderado avaliar a reunião.');

      setTimeout(() => { if (setAbaAtiva) setAbaAtiva('Home'); }, 2000);

      try {
        await fetch('http://localhost:8000/api/registrar-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lider: nomeLiderLogado, senioridade: senioridade, perfil_comportamental: perfilLiderado })
        });
      } catch (e) {
        console.log('Aviso: Log de auditoria falhou, mas PDF gerado.', e);
      }
    }, 100);
  };

  const partesTexto = resultado.split(/--- ATA OFICIAL ---|- ATA OFICIAL -|ATA OFICIAL/);
  const roteiroConfidencial = partesTexto.length > 1 ? partesTexto[0].trim() : 'Roteiro em processamento...';
  const ataParaRH = partesTexto.length > 1 ? partesTexto[1].trim() : resultado;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 animate-[fadeIn_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Gerador de Roteiro Inteligente
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Prepare pautas altamente personalizadas utilizando inteligência artificial com proteção LGPD.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* LADO ESQUERDO: CONTROLES */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Autenticação e Vínculo
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Líder Responsável</label>
                <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-2 cursor-not-allowed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {nomeLiderLogado}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Selecione o Liderado</label>
                <select 
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  onChange={handleLideradoChange}
                  value={lideradoSelecionado ? lideradoSelecionado.id : ''}
                  disabled={loading}
                  required
                >
                  <option value="">Selecione um membro do seu Squad...</option>
                  {meuSquad.map(m => (
                    <option key={m.id} value={m.id}>{m.nome} - {m.cargo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <form onSubmit={handleGerar} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Bot className="w-4 h-4" /> Parâmetros da Reunião
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" /> LGPD Ativo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Senioridade</label>
                <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 cursor-not-allowed">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {senioridade || 'Aguardando...'}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex justify-between items-center">
                  <span>Status do Liderado</span>
                  <span className="text-[10px] text-blue-500 font-semibold bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Sinc.
                  </span>
                </label>
                <div 
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2 cursor-not-allowed transition-all ${
                    perfilLiderado === 'Aguardando preenchimento...' || !lideradoSelecionado
                    ? 'bg-slate-50 border-slate-200 text-slate-400' 
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                  title="Apenas o liderado pode alterar o próprio momento na tela dele."
                >
                  <TrendingUp className="w-4 h-4 opacity-70" />
                  <span className="truncate">{lideradoSelecionado ? perfilLiderado : 'Selecione acima'}</span>
                </div>
              </div>
            </div>

            {pautaPrevia && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Pauta Proposta pelo Colaborador
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic">
                  "{pautaPrevia}"
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 mt-1 flex justify-between">
                Foco / Entregas Recentes
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  Valores financeiros e CPFs serão anonimizados
                </span>
              </label>
              <textarea 
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Ex: Entregou o projeto X com atraso. Solicitar aumento de R$ 2.000 (O Firewall vai censurar automaticamente)."
                value={entregas}
                onChange={e => setEntregas(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !lideradoSelecionado}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-sm shadow-blue-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Processando com IA...' : 'Gerar Roteiro Estratégico'}
            </button>
            {erro && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{erro}</p>}
          </form>
        </div>

        {/* LADO DIREITO: RESULTADO */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col min-h-[500px] overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <button 
              disabled={!resultado}
              onClick={() => setAbaDocumento('roteiro')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${abaDocumento === 'roteiro' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-slate-900' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 disabled:opacity-50'}`}
            >
              <EyeOff className="w-4 h-4" /> Roteiro Confidencial
            </button>
            <button 
              disabled={!resultado}
              onClick={() => setAbaDocumento('ata')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${abaDocumento === 'ata' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white dark:bg-slate-900' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 disabled:opacity-50'}`}
            >
              <FileText className="w-4 h-4" /> Ata Oficial (RH)
            </button>
          </div>

          <div className="flex-1 p-6 relative">
            {!resultado && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-50">
                <Bot className="w-16 h-16 mb-4" />
                <p>Preencha os dados e gere o roteiro.</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="animate-pulse font-medium">A IA está analisando o perfil...</p>
              </div>
            )}

            {resultado && abaDocumento === 'roteiro' && (
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none animate-[fadeIn_0.3s]">
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm m-0"><strong>Atenção Líder:</strong> Este roteiro contém dicas de mentoria baseadas no seu perfil oculto e no momento do seu liderado. Ele <strong>não</strong> aparecerá no PDF final.</p>
                </div>
                <ReactMarkdown>{roteiroConfidencial}</ReactMarkdown>
              </div>
            )}

            <div className={`${abaDocumento === 'ata' && resultado ? 'block animate-[fadeIn_0.3s]' : 'hidden'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-white font-bold">Documento Pronto para Assinatura</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setModoEdicaoAta(!modoEdicaoAta)} 
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all"
                  >
                    {modoEdicaoAta ? "👁️ Ver Visualização" : "✍️ Ajustar Ata Manualmente"}
                  </button>
                  <button onClick={handleDownloadPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all">
                    <Download className="w-4 h-4" /> Gerar PDF e Aguardar Avaliação
                  </button>
                </div>
              </div>

              {modoEdicaoAta ? (
                <div className="mb-6 animate-[fadeIn_0.2s]">
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                    Edite o conteúdo da Ata Oficial (suporta formatação Markdown):
                  </label>
                  <textarea
                    value={ataEditada}
                    onChange={(e) => setAtaEditada(e.target.value)}
                    rows="15"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <div id="conteudo-ata" className="bg-white text-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
                  <div className="mb-8 border-b-2 border-slate-200 pb-6">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Ata Oficial de Alinhamento 1:1</h2>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                      <div>
                        <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Líder Conduzindo</span>
                        <span className="font-semibold text-slate-900">{nomeLiderLogado}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Colaborador</span>
                        <span className="font-semibold text-slate-900">{lideradoSelecionado?.nome}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Cargo e Nível</span>
                        <span className="font-semibold text-slate-900">{lideradoSelecionado?.cargo} ({senioridade})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Tempo de Empresa</span>
                        <span className="font-semibold text-slate-900">{tempoCasa}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none prose-slate text-slate-800">
                    <ReactMarkdown>{ataEditada}</ReactMarkdown>
                  </div>
                  
                  <div className="mt-16 pt-8 grid grid-cols-2 gap-8 text-center">
                    <div>
                      <div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assinatura do Líder</p>
                    </div>
                    <div>
                      <div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assinatura do Liderado</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {toast.visivel && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 text-white px-6 py-4 rounded-xl shadow-2xl animate-[fadeIn_0.3s_ease-out] ${
          toast.icone === 'shield' ? 'bg-amber-500 shadow-amber-500/30' : 'bg-emerald-500 shadow-emerald-500/30'
        }`}>
          {toast.icone === 'shield' ? <ShieldCheck className="w-6 h-6 flex-shrink-0" /> : <CheckCircle2 className="w-6 h-6 flex-shrink-0" />}
          <span className="font-semibold text-sm max-w-md leading-tight">{toast.mensagem}</span>
        </div>
      )}
    </div>
  );
}