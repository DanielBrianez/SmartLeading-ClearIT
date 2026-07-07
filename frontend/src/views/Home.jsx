// src/views/Home.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, AlertTriangle, FileText, CheckCircle2, Medal, ArrowRight 
} from 'lucide-react';
import { lerLGPD, salvarLGPD } from '../utils/security';
import { DB_SQUADS } from '../dados';

export default function Home({ setAbaAtiva }) {
  const idLider = "daniel_nascimento";
  const user = lerLGPD('@clearit-session') || { nome: 'Daniel Nascimento' };
  
  const [squad, setSquad] = useState([]);
  const [metricas, setMetricas] = useState({ atrasadas: 0, noPrazo: 0, atasMes: 0, xp: 0 });

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
    };

    carregarDados();
    window.addEventListener('clearit-data-updated', carregarDados);
    return () => window.removeEventListener('clearit-data-updated', carregarDados);
  }, [idLider]);

  const patente = metricas.xp >= 3000 ? 'Líder Referência 💎' : 'Líder Engajado 🚀';

  const iniciarReuniao = (idLiderado) => {
    localStorage.setItem('@clearit-liderado-foco', idLiderado);
    if (setAbaAtiva) setAbaAtiva('1a1');
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
    </div>
  );
}