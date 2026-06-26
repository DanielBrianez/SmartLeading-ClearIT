// src/views/About.jsx
import { Rocket } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
        
        <div className="mb-10 text-center">
          <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Sobre o Smart Leading</h2>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              O Desafio
            </h3>
            <p>
              Líderes corporativos frequentemente gastam horas planejando pautas de reuniões 1:1 (One-on-One) ou acabam conduzindo conversas sem estrutura. Além disso, a ausência de registros formais dificulta a visibilidade do RH sobre o engajamento e expõe a empresa a riscos, devido à má gestão de dados sensíveis dos colaboradores.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              A Solução
            </h3>
            <p>
              O <strong>Smart Leading - Clear IT</strong> utiliza inteligência artificial paramétrica para gerar roteiros altamente eficientes baseados no perfil do liderado e do líder. Mais importante ainda: ele gera automaticamente atas seguras, anonimizadas e <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% em conformidade com a LGPD</span>. Tudo gamificado para aumentar o engajamento da própria liderança.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              Stack Tecnológica
            </h3>
            <ul className="grid grid-cols-2 gap-3 mt-4">
              <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                React (Functional)
              </li>
              <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                Tailwind CSS
              </li>
              <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                Lucide Icons
              </li>
              <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Modern UX Principles
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}