// src/views/About.jsx
import React, { useState } from 'react';
import { Rocket, Code2 } from 'lucide-react';

// Importamos o componente da equipe para dentro do Sobre!
import Equipe from './Equipe'; 

export default function About() {
  const [abaInterna, setAbaInterna] = useState('projeto');

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* 🚀 SUB-NAVBAR QUE VOCÊ PEDIU */}
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 animate-[fadeIn_0.3s_ease-out]">
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
      )}

      {/* CONTEÚDO 2: A EQUIPE QUE DESENVOLVEU */}
      {abaInterna === 'equipe' && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <Equipe />
        </div>
      )}
      
    </div>
  );
}