// src/views/About.jsx
import React, { useState } from 'react';
import { 
  Rocket, Code2, Database, Zap, ShieldCheck, 
  CheckCircle2, AlertTriangle, Code, Server, X
} from 'lucide-react';

// Importamos o componente da equipe para dentro do Sobre!
import Equipe from './Equipe'; 

export default function About() {
  const [abaInterna, setAbaInterna] = useState('projeto');
  
  // 🔥 ESTADO DO BALÃOZINHO PREMIUM (TOAST)
  const [balaoAviso, setBalaoAviso] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });
  
  // 🔥 ESTADO DO MODAL DE CONFIRMAÇÃO
  const [modalConfirm, setModalConfirm] = useState({
    visivel: false,
    titulo: '',
    mensagem: '',
    textoBotao: '',
    corBotao: '',
    acaoConfirmar: null
  });

  const mostrarBalao = (mensagem, tipo = 'sucesso') => {
    setBalaoAviso({ visivel: true, mensagem, tipo });
    setTimeout(() => {
      setBalaoAviso({ visivel: false, mensagem: '', tipo: 'sucesso' });
      window.location.reload(); // Recarrega a página para espalhar os dados por todos os componentes!
    }, 2500); 
  };

  // --- FUNÇÕES DE INJEÇÃO (SEPARADAS DA CONFIRMAÇÃO) ---
  const executarInjetarMocks = () => {
    setModalConfirm({ ...modalConfirm, visivel: false }); // Fecha o modal

    // 1. Populando o Ranking (XP dos Líderes)
    const rankingMock = {
      'daniel_nascimento': 350,
      'juliana_castro': 450,
      'marcos_vinicius': 850,
      'sara_lima': 300,
      'carlos_eduardo': 450
    };
    localStorage.setItem('@clearit-ranking', JSON.stringify(rankingMock));

    // 2. Populando as 18 Atas
    const atasMock = Array.from({ length: 18 }).map((_, i) => {
      const dataAta = new Date();
      dataAta.setMonth(dataAta.getMonth() - (i % 5)); 
      
      return {
        idAta: 1700000000000 + i,
        idLiderado: (i % 3) + 1,
        nomeLiderado: i % 2 === 0 ? "Ana Clara" : "Bruno Costa",
        cargo: i % 2 === 0 ? "Dev Frontend Pleno" : "Dev Backend Sênior",
        senioridade: i % 2 === 0 ? "Pleno" : "Sênior",
        tempoCasa: "2 anos",
        data: dataAta.toLocaleDateString('pt-BR'),
        conteudoRH: `Nesta reunião de alinhamento, conversamos sobre os avanços do trimestre. O colaborador demonstrou excelente aderência às metas (Registro Histórico #${i + 1}).`
      };
    });
    localStorage.setItem('@clearit-atas-squad', JSON.stringify(atasMock));

    // 3. Populando PDIs e Tasks (🔥 FORMATO DO FRAMEWORK)
    const pdisMock = [
      { id: 'pdimock_1', idLiderado: '1', acao: 'Certificação AWS Cloud Practitioner', prazo: '3 meses', prazoDisplay: '3 meses (Out/2026)', status: 'Em andamento' },
      { id: 'pdimock_2', idLiderado: '2', acao: 'Mentoria de Arquitetura Limpa', prazo: '1 mês', prazoDisplay: '1 mês (Ago/2026)', status: 'Concluído' },
      { id: 'pdimock_3', idLiderado: '3', acao: 'Curso de Liderança e Comunicação', prazo: '6 meses', prazoDisplay: '6 meses (Jan/2027)', status: 'No prazo' }
    ];
    localStorage.setItem('@clearit-pdi', JSON.stringify(pdisMock));

    const tasksMock = [
      { id: 'taskmock_1', idLiderado: '1', nome: 'Refatorar módulo de login', descricao: 'Remover código legado', status: 'concluida', ddl: '2026-06-15' },
      { id: 'taskmock_2', idLiderado: '2', nome: 'Otimizar queries do banco', descricao: 'Analisar slow queries', status: 'pendente', ddl: '2026-07-20' },
      { id: 'taskmock_3', idLiderado: '1', nome: 'Documentar API REST', descricao: 'Atualizar Swagger', status: 'expirada', ddl: '2026-05-10' }
    ];
    localStorage.setItem('@clearit-tasks', JSON.stringify(tasksMock));

    localStorage.setItem('@clearit-deleted-tasks', JSON.stringify([]));
    localStorage.setItem('@clearit-deleted-pdi', JSON.stringify([]));

    mostrarBalao("18 Logs injetados com sucesso! Recarregando sistema...", "sucesso");
  };

  const executarLimparBase = () => {
    setModalConfirm({ ...modalConfirm, visivel: false }); // Fecha o modal

    localStorage.removeItem('@clearit-ranking');
    localStorage.removeItem('@clearit-atas-squad');
    localStorage.removeItem('@clearit-pdi');
    localStorage.removeItem('@clearit-tasks');
    localStorage.removeItem('@clearit-reunioes-adiadas');
    localStorage.removeItem('@clearit-notificacoes');
    localStorage.removeItem('@clearit-deleted-tasks');
    localStorage.removeItem('@clearit-deleted-pdi');

    mostrarBalao("Base de dados totalmente limpa! Recarregando...", "alerta");
  };

  // --- DISPARADORES DE MODAL ---
  const handleInjetarMocks = () => {
    setModalConfirm({
      visivel: true,
      titulo: 'Injetar Dados Demo',
      mensagem: 'Isso vai popular sua base local com 18 atas, PDIs e XP para outros líderes. Deseja continuar?',
      textoBotao: 'Injetar Dados',
      corBotao: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
      acaoConfirmar: executarInjetarMocks
    });
  };

  const handleLimparBase = () => {
    setModalConfirm({
      visivel: true,
      titulo: 'Resetar Ambiente (Danger Zone)',
      mensagem: 'Isso vai APAGAR TODAS as suas atas, PDIs e XP salvos no navegador. Tem certeza absoluta?',
      textoBotao: 'Sim, Limpar Tudo',
      corBotao: 'bg-red-600 hover:bg-red-700 shadow-red-600/20',
      acaoConfirmar: executarLimparBase
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      {/* 🚀 SUB-NAVBAR */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8">
        <button
          onClick={() => setAbaInterna('projeto')}
          className={`px-6 py-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all duration-200 ${
            abaInterna === 'projeto' 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Rocket className="w-4 h-4" />
          O Projeto
        </button>
        
        <button
          onClick={() => setAbaInterna('equipe')}
          className={`px-6 py-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all duration-200 ${
            abaInterna === 'equipe' 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Desenvolvedores
        </button>
      </div>

      {/* CONTEÚDO 1: SOBRE O PROJETO */}
      {abaInterna === 'projeto' && (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
          
          {/* Apresentação */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="mb-10 text-center">
              <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Sobre o Smart Leading</h2>
            </div>

            <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
              <section className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  O Desafio
                </h3>
                <p>
                  Líderes corporativos frequentemente gastam horas planejando pautas de reuniões 1:1 (One-on-One) ou acabam conduzindo conversas sem estrutura. Além disso, a ausência de registros formais dificulta a visibilidade do RH sobre o engajamento e expõe a empresa a riscos, devido à má gestão de dados sensíveis dos colaboradores.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  A Solução
                </h3>
                <p>
                  O <strong>Smart Leading - Clear IT</strong> utiliza inteligência artificial paramétrica para gerar roteiros altamente eficientes baseados no perfil do liderado e do líder. Mais importante ainda: ele gera automaticamente atas seguras, anonimizadas e <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% em conformidade com a LGPD</span>. Tudo gamificado para aumentar o engajamento da própria liderança.
                </p>
              </section>
            </div>
          </div>

          {/* CARDS DE INFORMAÇÃO TÉCNICA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 w-fit mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Stack Tecnológica</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Construído com React, Tailwind CSS e Lucide Icons. O backend utiliza Python com o modelo Gemini Flash 1.5 da Google.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Segurança (LGPD)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Blindagem ativa no motor de IA para anonimização de PIIs. Arquivos e logs locais ignorados no versionamento (.gitignore).
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 w-fit mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Metodologia CRIA</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Roteiros guiados pelas verticais: Contexto, Redirecionamento, Impacto e Alinhamento. Nuggets comportamentais dinâmicos.
              </p>
            </div>
          </div>

          {/* ÁREA DE DESENVOLVEDOR (MOCKS) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Server className="w-5 h-5 text-slate-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Ferramentas de Demonstração (Dev)</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                    <Database className="w-4 h-4" /> Autopopular Base de Dados (Story 5)
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 max-w-xl">
                    Injeta 18 logs reais simulados na telemetria local (Atas, PDIs e Tasks) para validação imediata do ranking e dos gráficos do Painel RH.
                  </p>
                </div>
                <button 
                  onClick={handleInjetarMocks}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-blue-600/20 whitespace-nowrap flex-shrink-0"
                >
                  Injetar Dados Demo
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Resetar Ambiente (Danger Zone)
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1 max-w-xl">
                    Limpa todo o localStorage do navegador. Todas as atas geradas, XP, configurações e reuniões adiadas serão perdidas permanentemente.
                  </p>
                </div>
                <button 
                  onClick={handleLimparBase}
                  className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex-shrink-0"
                >
                  Limpar Banco Local
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* CONTEÚDO 2: A EQUIPE QUE DESENVOLVEU */}
      {abaInterna === 'equipe' && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <Equipe />
        </div>
      )}

      {/* 🔥 MODAL DE CONFIRMAÇÃO (Substitui o window.confirm) */}
      {modalConfirm.visivel && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setModalConfirm({ ...modalConfirm, visivel: false })}
          ></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out] border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              {modalConfirm.corBotao.includes('red') ? (
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                  <Database className="w-6 h-6" />
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {modalConfirm.titulo}
              </h3>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-8 leading-relaxed">
              {modalConfirm.mensagem}
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalConfirm({ ...modalConfirm, visivel: false })}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={modalConfirm.acaoConfirmar}
                className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-sm ${modalConfirm.corBotao}`}
              >
                {modalConfirm.textoBotao}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* BALÃOZINHO DE AVISO PREMIUM (TOAST FLUTUANTE) */}
      {balaoAviso.visivel && (
        <div className="fixed bottom-6 right-6 z-[200] max-w-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
          {balaoAviso.tipo === 'sucesso' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 dark:text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-400 dark:text-red-500 flex-shrink-0" />
          )}
          <p className="text-sm font-semibold pr-2">{balaoAviso.mensagem}</p>
          <button 
            onClick={() => setBalaoAviso({ visivel: false, mensagem: '', tipo: 'sucesso' })}
            className="p-1 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg transition-colors ml-auto text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}