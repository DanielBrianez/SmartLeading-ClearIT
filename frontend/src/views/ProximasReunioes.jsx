// src/views/ProximasReunioes.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, CalendarClock } from 'lucide-react';
import { DB_SQUADS } from '../dados';
import { lerLGPD, salvarLGPD } from '../utils/security';

export default function ProximasReunioes({ onPlanejar }) {
  const idLiderLogado = "daniel_nascimento";
  const meuTimeBase = DB_SQUADS[idLiderLogado] || [];
  
  const [todasAtas] = useState(lerLGPD('@clearit-atas-squad') || []);
  const [adiadas, setAdiadas] = useState(lerLGPD('@clearit-reunioes-adiadas') || {});
  
  const [filtroAtivo, setFiltroAtivo] = useState('todas'); // todas, prontas, expiradas, adiadas
  const [reunioes, setReunioes] = useState([]);

  useEffect(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const listaProcessada = meuTimeBase.map(membro => {
      // 1. Acha a data real da última reunião baseada nas atas geradas
      const atasDoMembro = todasAtas.filter(a => a.idLiderado === membro.id.toString());
      let dataUltimaReal = membro.ultimaReuniao;

      if (atasDoMembro.length > 0) {
        const partes = atasDoMembro[0].data.split('/');
        if(partes.length === 3) {
          dataUltimaReal = `${partes[2]}-${partes[1]}-${partes[0]}`; // YYYY-MM-DD
        }
      }

      // 2. Calcula quando seria a próxima (+15 dias)
      let dataProx = new Date(dataUltimaReal + 'T00:00:00');
      dataProx.setDate(dataProx.getDate() + 15);
      
      let status = 'prontas';
      let dataFinal = dataProx;

      // 3. Verifica se tem adiamento no cofre
      if (adiadas[membro.id]) {
        status = 'adiadas';
        dataFinal = new Date(adiadas[membro.id] + 'T00:00:00');
      } else if (dataProx < hoje) {
        status = 'expiradas';
      }

      return {
        ...membro,
        dataCalculada: dataFinal,
        status: status
      };
    });

    // Ordena da mais atrasada/próxima para a mais distante
    listaProcessada.sort((a, b) => a.dataCalculada - b.dataCalculada);
    setReunioes(listaProcessada);
  }, [adiadas, todasAtas]);

  const handleAdiar = (membro) => {
    // Adia para +7 dias a partir da data que estava agendada
    const novaData = new Date(membro.dataCalculada);
    novaData.setDate(novaData.getDate() + 7);
    
    const ano = novaData.getFullYear();
    const mes = String(novaData.getMonth() + 1).padStart(2, '0');
    const dia = String(novaData.getDate()).padStart(2, '0');
    
    const novasAdiadas = { ...adiadas, [membro.id]: `${ano}-${mes}-${dia}` };
    setAdiadas(novasAdiadas);
    salvarLGPD('@clearit-reunioes-adiadas', novasAdiadas);
  };

  const handlePlanejarLocal = (membro) => {
    if (membro.status === 'adiadas') {
      const confirma = window.confirm(
        "Atenção: Esta reunião estava ADIADA. Ao planejar agora, você antecipará o alinhamento para o momento atual. Deseja continuar?"
      );
      if (!confirma) return;
      
      // Remove do cofre de adiadas, pois vai ser feita agora
      const novasAdiadas = { ...adiadas };
      delete novasAdiadas[membro.id];
      setAdiadas(novasAdiadas);
      salvarLGPD('@clearit-reunioes-adiadas', novasAdiadas);
    }
    
    // Grita pro App.jsx trocar de aba e injetar o cara!
    onPlanejar(membro.id);
  };

  const formatarExibicao = (dataObj) => {
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${dataObj.getFullYear()}`;
  };

  const reunioesFiltradas = reunioes.filter(r => filtroAtivo === 'todas' || r.status === filtroAtivo);

  return (
    <div className="max-w-5xl mx-auto animate-[fadeIn_0.4s_ease-out]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Radar de Reuniões
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Gerencie o cronograma de 1:1s e evite gargalos no desenvolvimento da equipe.
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => setFiltroAtivo('todas')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filtroAtivo === 'todas' ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}>
          Todas
        </button>
        <button onClick={() => setFiltroAtivo('expiradas')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${filtroAtivo === 'expiradas' ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-red-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}>
          <AlertCircle className="w-4 h-4" /> Atrasadas
        </button>
        <button onClick={() => setFiltroAtivo('prontas')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${filtroAtivo === 'prontas' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}>
          <CheckCircle2 className="w-4 h-4" /> No Prazo
        </button>
        <button onClick={() => setFiltroAtivo('adiadas')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${filtroAtivo === 'adiadas' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}>
          <Clock className="w-4 h-4" /> Adiadas
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-4">
        {reunioesFiltradas.map(membro => (
          <div key={membro.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg border border-blue-200 dark:border-blue-800/50">
                {membro.nome.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{membro.nome}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{membro.cargo}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    membro.status === 'expiradas' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                    membro.status === 'adiadas' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                  }`}>
                    {membro.status === 'expiradas' ? 'Atrasada' : membro.status === 'adiadas' ? 'Adiada (+7 Dias)' : 'No Prazo'}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Agendada para: {formatarExibicao(membro.dataCalculada)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Só pode adiar se estiver expirada ou pronta */}
              {(membro.status === 'expiradas' || membro.status === 'prontas') && (
                <button 
                  onClick={() => handleAdiar(membro)}
                  className="flex-1 md:flex-none px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                >
                  Adiar
                </button>
              )}
              
              <button 
                onClick={() => handlePlanejarLocal(membro)}
                className="flex-1 md:flex-none px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                Planejar Agora <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {reunioesFiltradas.length === 0 && (
          <div className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
            Nenhuma reunião encontrada com este filtro.
          </div>
        )}
      </div>
    </div>
  );
}