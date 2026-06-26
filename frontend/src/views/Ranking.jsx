import { useState, useEffect } from 'react';
import { Trophy, Award } from 'lucide-react';
import { LEADERS } from '../dados';

export default function Ranking() {
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    const xpSalvo = JSON.parse(localStorage.getItem("@clearit-ranking")) || {};

    const dadosProcessados = LEADERS
      .filter(nome => !nome.toLowerCase().includes("selecione"))
      .map(nome => ({
        nome: nome,
        xp: xpSalvo[nome] || 0,
      }));

    dadosProcessados.sort((a, b) => b.xp - a.xp);
    setRankingData(dadosProcessados);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Cabeçalho do Ranking */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-500/10 rounded-2xl mb-2">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Liga de Ouro - Liderança
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Gere atas oficiais para ganhar <span className="font-bold text-amber-500">100 XP</span> e subir no ranking.
        </p>
      </div>

      {/* Tabela (Card) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-0 sm:p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400">Posição</th>
                <th className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400">Líder</th>
                <th className="py-4 px-6 font-semibold text-slate-500 dark:text-slate-400 text-right">XP Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {rankingData.map((lider, index) => {
                // Lógica visual para o Top 3
                const isTop1 = index === 0 && lider.xp > 0;
                const isTop2 = index === 1 && lider.xp > 0;
                const isTop3 = index === 2 && lider.xp > 0;

                // Títulos customizados
                let titulo = "";
                if (isTop1) titulo = "👑 Titã das 1:1s";
                else if (isTop2) titulo = "🚀 Líder de Impacto";
                else if (isTop3) titulo = "⭐ Gestor Engajado";

                return (
                  <tr 
                    key={index} 
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${isTop1 ? 'bg-amber-50/50 dark:bg-amber-500/5' : ''}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {isTop1 ? <Award className="w-6 h-6 text-amber-500" /> :
                         isTop2 ? <Award className="w-6 h-6 text-slate-400" /> :
                         isTop3 ? <Award className="w-6 h-6 text-amber-700" /> :
                         <span className="text-slate-400 dark:text-slate-500 font-medium w-6 text-center">{index + 1}º</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`font-medium ${isTop1 ? 'text-amber-600 dark:text-amber-400 font-bold text-lg' : 'text-slate-700 dark:text-slate-300'}`}>
                          {lider.nome}
                        </span>
                        {titulo && (
                          <span className={`text-xs font-semibold mt-0.5 ${
                            isTop1 ? 'text-amber-500' :
                            isTop2 ? 'text-slate-500 dark:text-slate-400' :
                            'text-amber-700/70 dark:text-amber-600/70'
                          }`}>
                            {titulo}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold ${
                        isTop1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}>
                        {lider.xp} <span className="text-xs opacity-70">XP</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}