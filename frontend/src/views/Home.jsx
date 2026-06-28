// src/views/Home.jsx
import React, { useState } from 'react';
import { 
  Bot, Send, FileText, Download, Loader2, 
  User, CheckCircle2, AlertCircle, Briefcase, Clock, Eye, EyeOff
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import { DB_SQUADS } from '../dados';

export default function Home() {
  const idLiderLogado = "daniel_nascimento";
  const nomeLiderLogado = "DANIEL NASCIMENTO DOS SANTOS FILHO";
  
  const meuSquad = DB_SQUADS[idLiderLogado] || [];

  const [lideradoSelecionado, setLideradoSelecionado] = useState(null);
  const [senioridade, setSenioridade] = useState('');
  const [tempoCasa, setTempoCasa] = useState('');
  
  const [perfilLider, setPerfilLider] = useState('');
  const [perfilLiderado, setPerfilLiderado] = useState('');
  const [entregas, setEntregas] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState('');
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState({ visivel: false, mensagem: '' });
  
  // Controle das abas do documento (Confidencial vs RH)
  const [abaDocumento, setAbaDocumento] = useState('roteiro');

  const mostrarToast = (mensagem) => {
    setToast({ visivel: true, mensagem });
    setTimeout(() => {
      setToast({ visivel: false, mensagem: '' });
    }, 4000);
  };

  const handleLideradoChange = (e) => {
    const id = e.target.value;
    if (!id) {
      setLideradoSelecionado(null);
      setSenioridade('');
      setTempoCasa('');
      return;
    }
    const liderado = meuSquad.find(m => m.id.toString() === id);
    setLideradoSelecionado(liderado);
    setSenioridade(liderado.senioridade);
    setTempoCasa(liderado.tempoCasa);
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

    try {
      const response = await fetch('http://localhost:8000/api/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfil_lideranca: perfilLider,
          senioridade_liderado: senioridade,
          tempo_casa: tempoCasa,
          perfil_comportamental: perfilLiderado,
          resumo_entregas: entregas
        })
      });

      if (!response.ok) throw new Error('Erro ao conectar com a inteligência artificial.');
      
      const data = await response.json();
      setResultado(data.roteiro);
      setAbaDocumento('roteiro'); // Força a aba inicial
    } catch (err) {
      setErro(err.message || 'Erro inesperado ao gerar roteiro.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!lideradoSelecionado) {
      mostrarToast("Erro de segurança: Liderado não identificado.");
      return;
    }

    // Pega SOMENTE a div da Ata Oficial
    const elemento = document.getElementById('conteudo-ata');
    const opt = {
      margin: 15,
      filename: `Ata_1a1_${lideradoSelecionado.nome.replace(' ', '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Gera o PDF
    html2pdf().set(opt).from(elemento).save();

    // XP em primeiro lugar
    const rankingSalvo = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
    const xpAtual = rankingSalvo[idLiderLogado] || 0;
    rankingSalvo[idLiderLogado] = xpAtual + 100;
    localStorage.setItem('@clearit-ranking', JSON.stringify(rankingSalvo));
    
    const novaNotificacao = {
      id: Date.now(),
      titulo: 'Você ganhou +100 XP! ⚡',
      mensagem: `Ata oficial gerada para ${lideradoSelecionado.nome}.`,
      tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: false
    };
    
    const notsSalvas = JSON.parse(localStorage.getItem('@clearit-notificacoes')) || [];
    notsSalvas.unshift(novaNotificacao); // Coloca no começo da lista
    localStorage.setItem('@clearit-notificacoes', JSON.stringify(notsSalvas));
    
    // Dispara o alarme pro App.jsx atualizar o sino na hora!
    window.dispatchEvent(new Event('notificacao-atualizada'));
    // 👆 --- FIM DA NOVA LÓGICA --- 👆

    mostrarToast('✅ Ata baixada com sucesso e 100 XP creditados!');

    try {
      await fetch('http://localhost:8000/api/registrar-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lider: nomeLiderLogado,
          senioridade: senioridade,
          perfil_comportamental: perfilLiderado
        })
      });
    } catch (e) {
      console.log('Aviso: Log de auditoria falhou, mas PDF gerado.', e);
    }
  };

  // --- O TRUQUE DE MESTRE: Separando a IA em duas partes ---
  // A Regex pega a tag mesmo se a IA colocar "###" ou espaços na frente
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
          Prepare pautas altamente personalizadas utilizando inteligência artificial.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* === LADO ESQUERDO: CONTROLES === */}
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
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  onChange={handleLideradoChange}
                  value={lideradoSelecionado ? lideradoSelecionado.id : ''}
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              <Bot className="w-4 h-4" /> Parâmetros da Reunião
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Senioridade</label>
                <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {senioridade || 'Aguardando...'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tempo de Casa</label>
                <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {tempoCasa || 'Aguardando...'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Seu Perfil (Líder)</label>
                <select className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white" value={perfilLider} onChange={e => setPerfilLider(e.target.value)} required>
                  <option value="">Selecione...</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Transição">Em Transição</option>
                  <option value="Engajado">Engajado</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Momento do Liderado</label>
                <select className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white" value={perfilLiderado} onChange={e => setPerfilLiderado(e.target.value)} required>
                  <option value="">Selecione...</option>
                  <option value="Motivado e entregando acima do esperado">Alta Performance</option>
                  <option value="Consistente, mas precisa de novos desafios">Zona de Conforto</option>
                  <option value="Abaixo do esperado ou desmotivado">Abaixo do Esperado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Foco / Entregas Recentes</label>
              <textarea 
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white resize-none"
                rows="3"
                placeholder="Ex: Entregou o projeto X com atraso."
                value={entregas}
                onChange={e => setEntregas(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !lideradoSelecionado}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 shadow-sm shadow-blue-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Processando com IA...' : 'Gerar Roteiro Estratégico'}
            </button>
            {erro && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{erro}</p>}
          </form>
        </div>

        {/* === LADO DIREITO: RESULTADO (ABAS) === */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col min-h-[600px] overflow-hidden">
          
          {/* Header com as Abas */}
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

            {/* CONTEÚDO 1: ROTEIRO CONFIDENCIAL */}
            {resultado && abaDocumento === 'roteiro' && (
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none animate-[fadeIn_0.3s]">
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm m-0"><strong>Atenção Líder:</strong> Este roteiro contém dicas de mentoria baseadas no seu perfil e no momento do seu liderado. Ele <strong>não</strong> aparecerá no PDF final do RH.</p>
                </div>
                <ReactMarkdown>{roteiroConfidencial}</ReactMarkdown>
              </div>
            )}

            {/* CONTEÚDO 2: ATA OFICIAL (ÁREA DE IMPRESSÃO) */}
            <div className={`${abaDocumento === 'ata' && resultado ? 'block animate-[fadeIn_0.3s]' : 'hidden'}`}>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-white font-bold">Documento Pronto para Assinatura</h3>
                <button onClick={handleDownloadPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all">
                  <Download className="w-4 h-4" /> Gerar PDF
                </button>
              </div>

              {/* MÁGICA DO PDF: Fundo branco e texto preto FORÇADO para impressão perfeita */}
              <div 
                id="conteudo-ata" 
                className="bg-white text-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm"
              >
                {/* Cabeçalho Bonito */}
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
                
                {/* O Markdown renderizado sem influências do Dark Mode */}
                <div className="prose prose-sm max-w-none prose-slate text-slate-800">
                  <ReactMarkdown>{ataParaRH}</ReactMarkdown>
                </div>
                
                {/* Rodapé de Assinaturas */}
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

            </div>

          </div>
        </div>
      </div>

      {toast.visivel && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl shadow-emerald-500/30 animate-[fadeIn_0.3s_ease-out]">
          <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
          <span className="font-semibold">{toast.mensagem}</span>
        </div>
      )}
    </div>
  );
}