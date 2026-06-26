// src/views/Home.jsx

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import { 
  FileText, 
  ChevronDown, 
  Loader2, 
  RefreshCw, 
  Rocket, 
  Star, 
  CheckCircle2, 
  Download 
} from 'lucide-react';
import { LEADERS, MENTEES } from '../dados'; // 👈 Bebendo da mesma caixa d'água!

  export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [roteiroDoGemini, setRoteiroDoGemini] = useState("");
  const [parametrosIniciais, setParametrosIniciais] = useState(null);

 const handleGenerate = async (e) => {
    e.preventDefault();

    if (isGenerated) {
      setIsGenerated(false);
      setRoteiroDoGemini("");
      setParametrosIniciais(null); // Limpa ao resetar
      e.target.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const formData = new FormData(e.target);
    const dadosFormulario = Object.fromEntries(formData.entries());

    if (!dadosFormulario.pauta || !dadosFormulario.pauta.trim()) {
      alert("⚠️ A pauta não pode ficar vazia!");
      return;
    }

    // Salva os dados para usarmos no download
    setParametrosIniciais(dadosFormulario);
    setIsGenerating(true);

    try {
      const response = await fetch("http://localhost:8000/api/gerar-roteiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosFormulario),
      });

      if (!response.ok) throw new Error("Erro no servidor Python");

      const data = await response.json();
      
      setRoteiroDoGemini(data.roteiro_gerado);
      setIsGenerated(true);

    } catch (error) {
      console.error(error);
      alert("Houve um erro ao gerar o roteiro com a IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const htmlLider = document.getElementById("lider-select");
    const htmlLiderado = document.getElementById("liderado-select");

    if (!htmlLider || !htmlLiderado) return;

    const liderSelecionado = htmlLider.value;
    const lideradoSelecionado = htmlLiderado.value;

    if (!liderSelecionado || liderSelecionado === "") {
      alert("⚠️ Por favor, assine a ata escolhendo seu nome em 'Líder Responsável'!");
      return;
    }
    if (!lideradoSelecionado || lideradoSelecionado === "") {
      alert("⚠️ Por favor, escolha o nome do 'Liderado(a)'!");
      return;
    }

    const elementoParaPDF = document.getElementById("conteudo-ata");
    const opcoesPDF = {
      margin:       15,
      filename:     `Ata_ClearIT_${liderSelecionado.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoesPDF).from(elementoParaPDF).save().then(() => {
      
      // 🚀 Dispara UMA única vez para o Back-end montando o Log perfeito
      if (parametrosIniciais) {
        fetch("http://localhost:8000/api/registrar-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lider_nome: liderSelecionado,
            perfil_lider: parametrosIniciais.perfil_lider,
            senioridade: parametrosIniciais.senioridade,
            tempo_empresa: parametrosIniciais.tempo_empresa,
            perfil_comportamental: parametrosIniciais.perfil_comportamental
          })
        }).catch(err => console.error("Erro ao gravar log:", err));
      }

      const rankingAtual = JSON.parse(localStorage.getItem("@clearit-ranking")) || {};
      rankingAtual[liderSelecionado] = (rankingAtual[liderSelecionado] || 0) + 100;
      localStorage.setItem("@clearit-ranking", JSON.stringify(rankingAtual));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Smart Leading <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Clear IT</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Seu assistente inteligente para estruturar reuniões 1:1 de alto impacto e gerar atas automáticas adequadas à LGPD.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Parâmetros da 1:1</h2>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Perfil de Liderança</label>
                <div className="relative">
                  <select name="perfil_lider" disabled={isGenerating} className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    <option>Líder Técnico</option>
                    <option>Líder Inspiracional</option>
                    <option>Líder em Transição (Novo)</option>
                    <option>Líder Facilitador</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Senioridade do Liderado</label>
                <div className="relative">
                  <select name="senioridade" disabled={isGenerating} className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    <option>Estagiário / Aprendiz</option>
                    <option>Júnior</option>
                    <option>Pleno</option>
                    <option>Sênior / Especialista</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tempo de Empresa</label>
                <div className="relative">
                  <select name="tempo_empresa" disabled={isGenerating} className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    <option>Menos de 6 meses (Onboarding)</option>
                    <option>6 meses a 1 ano</option>
                    <option>1 a 3 anos</option>
                    <option>Mais de 3 anos</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Perfil Comportamental</label>
                <div className="relative">
                  <select name="perfil_comportamental" disabled={isGenerating} className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    <option>Analítico / Detalhista</option>
                    <option>Comunicador / Extrovertido</option>
                    <option>Executor / Prático</option>
                    <option>Planejador / Metódico</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Resumo das últimas entregas / Pauta <span className="text-red-500">*</span></label>
              <textarea 
                name="pauta"
                required
                disabled={isGenerating}
                rows={3} 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Ex: Entregou a API de pagamentos com 2 dias de antecedência. Precisamos falar sobre o novo épico..."
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Acordos prévios (Opcional)</label>
              <textarea 
                name="acordos"
                disabled={isGenerating}
                rows={2} 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Ex: Focar em testes unitários neste sprint."
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isGenerating}
                className={`w-full font-semibold py-4 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                  isGenerated 
                    ? 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-slate-900/20' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' 
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando com IA...
                  </>
                ) : isGenerated ? (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Gerar Novo Roteiro
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Gerar Roteiro Personalizado
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Resultados Gerados */}
      {isGenerated && (
        <div className="animate-[fadeIn_0.5s_ease-out] space-y-6">
          
          {/* Roteiro da IA */}
          <div id="conteudo-ata" className="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-800">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Sugestão de Roteiro (Smart AI)
            </h3>
            <div className="prose prose-invert prose-blue max-w-none text-slate-300">
              <ReactMarkdown>
                {roteiroDoGemini}
              </ReactMarkdown>
            </div>
          </div>

          {/* Registro Oficial / LGPD */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-emerald-100 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4"></div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Registro Oficial (Ata LGPD)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Líder Responsável <span className="text-red-500">*</span></label>
                <select id="lider-select" defaultValue="" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium">
                  <option value="" disabled>Selecione seu nome...</option>
                  {LEADERS.filter(nome => !nome.toLowerCase().includes("selecione")).map((l, i) => <option key={i} value={l}>{l}</option>)}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Liderado(a) <span className="text-red-500">*</span></label>
                <select id="liderado-select" defaultValue="" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                  <option value="" disabled>Selecione o liderado...</option>
                  {MENTEES.filter(nome => !nome.toLowerCase().includes("selecione")).map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </div>

            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Nota de Privacidade:</span> Os dados gerados nesta ata são anonimizados e não retêm PII sensíveis, estando em total conformidade com as diretrizes de LGPD corporativas da Clear IT.
            </p>

            <button 
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold rounded-xl transition-colors flex justify-center items-center gap-2 border border-emerald-200 dark:border-emerald-500/30"
            >
              <Download className="w-5 h-5" />
              Baixar Ata Oficial em PDF
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-20 md:bottom-10 right-6 md:right-10 z-50 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-semibold">Ata baixada com sucesso!</p>
            <p className="text-emerald-100 text-sm">+100 XP no Ranking da Liga!</p>
          </div>
        </div>
      </div>
    </div>
  );
}