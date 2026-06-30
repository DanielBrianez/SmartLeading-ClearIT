// src/views/About.jsx
import React, { useState } from 'react';
import { 
  Rocket, Code2, Database, Zap, ShieldCheck, 
  CheckCircle2, AlertTriangle, Code, Server 
} from 'lucide-react';

// Importamos o componente da equipe para dentro do Sobre!
import Equipe from './Equipe'; 

export default function About() {
  const [abaInterna, setAbaInterna] = useState('projeto');
  const [toast, setToast] = useState({ visivel: false, mensagem: '' });

  const mostrarToast = (mensagem) => {
    setToast({ visivel: true, mensagem });
    setTimeout(() => {
      setToast({ visivel: false, mensagem: '' });
      window.location.reload(); // Recarrega a página para espalhar os dados por todos os componentes!
    }, 2000);
  };

  const handleInjetarMocks = () => {
    const confirma = window.confirm("Isso vai popular sua base local com 18 atas, PDIs e XP para outros líderes. Deseja continuar?");
    if (!confirma) return;

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

    // 3. Populando PDIs e Tasks
    const pdisMock = [
      { id: 'pdimock_1', idLiderado: '1', acao: 'Certificação AWS Cloud Practitioner', prazo: 'Q4 2026', status: 'Em andamento' },
      { id: 'pdimock_2', idLiderado: '2', acao: 'Mentoria de Arquitetura Limpa', prazo: 'Q3 2026', status: 'Concluído' },
      { id: 'pdimock_3', idLiderado: '3', acao: 'Curso de Liderança e Comunicação', prazo: 'Q1 2027', status: 'No prazo' }
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

    mostrarToast("✅ 18 Logs injetados com sucesso! Recarregando sistema...");
  };

  const handleLimparBase = () => {
    const confirma = window.confirm("🚨 ATENÇÃO: Isso vai APAGAR TODAS as suas atas, PDIs e XP salvos no navegador. Tem certeza absoluta?");
    if (!confirma) return;

    localStorage.removeItem('@clearit-ranking');
    localStorage.removeItem('@clearit-atas-squad');
    localStorage.removeItem('@clearit-pdi');
    localStorage.removeItem('@clearit-tasks');
    localStorage.removeItem('@clearit-reunioes-adiadas');
    localStorage.removeItem('@clearit-notificacoes');
    localStorage.removeItem('@clearit-deleted-tasks');
    localStorage.removeItem('@clearit-deleted-pdi');

    mostrarToast("🗑️ Base de dados limpa! Recarregando sistema...");
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
          
          {/* Apresentação (Seu código) */}
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
      
      {/* TOAST NOTIFICATION */}
      {toast.visivel && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl animate-[fadeIn_0.3s_ease-out]">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toast.mensagem}</span>
        </div>
      )}

    </div>
  );
}