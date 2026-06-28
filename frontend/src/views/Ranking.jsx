// src/views/Ranking.jsx
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Zap } from 'lucide-react';
import minhaFoto from '../assets/daniel-foto.jpg'; // Sua foto oficial

export default function Ranking() {
  const [lideres, setLideres] = useState([]);

  useEffect(() => {
    // 1. Abre o cofre do navegador e pega o XP que você ganhou
    const rankingSalvo = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
    
    // 2. Os competidores da Liga de Ouro
    const baseCompetidores = [
      { id: 'daniel_nascimento', nome: 'Daniel Nascimento', cargo: 'Tech Lead', foto: minhaFoto, xpBase: 0 },
      { id: 'juliana_castro', nome: 'Juliana Castro', cargo: 'Agile Coach', foto: null, xpBase: 200 },
      { id: 'marcos_vinicius', nome: 'Marcos Vinícius', cargo: 'Coord. de TI', foto: null, xpBase: 100 }
    ];

    // 3. Junta os pontos! (O seu XP Base + O que você ganhou gerando atas)
    const rankingCalculado = baseCompetidores.map(lider => {
      const xpGanhoNoNavegador = rankingSalvo[lider.id] || 0;
      return {
        ...lider,
        xpTotal: lider.xpBase + xpGanhoNoNavegador
      };
    });

    // 4. Ordena do Maior para o Menor
    rankingCalculado.sort((a, b) => b.xpTotal - a.xpTotal);
    setLideres(rankingCalculado);
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.4s_ease-out]">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-500/10 rounded-full mb-4">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Liga de Ouro</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Os líderes mais engajados no desenvolvimento contínuo de suas equipes.
        </p>
      </div>

      <div className="space-y-4">
        {lideres.map((lider, index) => (
          <div key={lider.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.01]">
            
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Posição no Ranking */}
              <div className="w-10 text-center font-bold text-2xl text-slate-400 dark:text-slate-500">
                #{index + 1}
              </div>
              
              {/* Foto do Perfil */}
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                {lider.foto ? (
                  <img src={lider.foto} alt={lider.nome} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-slate-400">{lider.nome.charAt(0)}</span>
                )}
              </div>

              {/* Informações */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                  {lider.nome}
                  {index === 0 && <Medal className="w-5 h-5 text-amber-500" title="Titã das 1:1s" />}
                  {index === 1 && <Medal className="w-5 h-5 text-slate-400" title="Líder de Impacto" />}
                  {index === 2 && <Medal className="w-5 h-5 text-amber-700" title="Gestor Engajado" />}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{lider.cargo}</p>
              </div>
            </div>

            {/* O Famoso XP */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-blue-600 dark:text-blue-400 font-bold text-xl">
                <Zap className="w-5 h-5" />
                {lider.xpTotal} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">XP</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}