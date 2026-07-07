// src/views/ProximasReunioes.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, 
  CalendarClock, X, AlertTriangle 
} from 'lucide-react';
import { DB_SQUADS } from '../dados';
import { lerLGPD, salvarLGPD } from '../utils/security';

export default function ProximasReunioes({ onPlanejar }) {
  const idLiderLogado = "daniel_nascimento";
  
  const [adiadas, setAdiadas] = useState(lerLGPD('@clearit-reunioes-adiadas') || {});
  const [filtroAtivo, setFiltroAtivo] = useState('todas'); // todas, prontas, expiradas, adiadas
  const [reunioes, setReunioes] = useState([]);

  // 🔥 ESTADOS DE FEEDBACK VISUAL PREMIUM 🔥
  const [balaoAviso, setBalaoAviso] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });
  const [modalConfirmacao, setModalConfirmacao] = useState(null);

  const mostrarBalao = (mensagem, tipo = 'sucesso') => {
    setBalaoAviso({ visivel: true, mensagem, tipo });
    setTimeout(() => setBalaoAviso({ visivel: false, mensagem: '', tipo: 'sucesso' }), 4000);
  };

  useEffect(() => {
    let squadAtual = lerLGPD('@clearit-squad') || [];
    if (squadAtual.length === 0) {
      squadAtual = DB_SQUADS[idLiderLogado] || [];
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const listaProcessada = squadAtual.map(membro => {
      let dataCalculada = new Date();
      let status = 'prontas';
      
      if (!membro.proxima_reuniao) {
        status = 'expiradas'; 
      } else {
        if (membro.proxima_reuniao.includes('/')) {
          const [d, mes, a] = membro.proxima_reuniao.split('/');
          dataCalculada = new Date(`${a}-${mes}-${d}T00:00:00`);
        } else {
          dataCalculada = new Date(membro.proxima_reuniao + 'T00:00:00');
        }

        if (adiadas[membro.id] && adiadas[membro.id] === membro.proxima_reuniao) {
          status = 'adiadas';
        } else if (dataCalculada < hoje) {
          status = 'expiradas';
        }
      }

      return {
        ...membro,
        dataCalculada,
        status
      };
    });

    listaProcessada.sort((a, b) => a.dataCalculada - b.dataCalculada);
    setReunioes(listaProcessada);
  }, [adiadas]); 

  const handleAdiar = (membro) => {
    const novaData = new Date(membro.dataCalculada);
    novaData.setDate(novaData.getDate() + 7);
    
    const ano = novaData.getFullYear();
    const mes = String(novaData.getMonth() + 1).padStart(2, '0');
    const dia = String(novaData.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;
    
    let squadGeral = lerLGPD('@clearit-squad') || [];
    if(squadGeral.length === 0) squadGeral = DB_SQUADS[idLiderLogado] || [];
    
    const index = squadGeral.findIndex(m => m.id === membro.id);
    if(index !== -1) {
        squadGeral[index].proxima_reuniao = dataFormatada;
        salvarLGPD('@clearit-squad', squadGeral);
    }

    const novasAdiadas = { ...adiadas, [membro.id]: dataFormatada };
    setAdiadas(novasAdiadas);
    salvarLGPD('@clearit-reunioes-adiadas', novasAdiadas);

    // ✨ FeedBack Lindo ✨
    mostrarBalao(`Reunião com ${membro.nome.split(' ')[0]} adiada em +7 dias!`, 'alerta');
  };

  const handlePlanejarLocal = (membro) => {
    if (membro.status === 'adiadas') {
      // Abre o Modal Premium ao invés do window.confirm
      setModalConfirmacao(membro);
      return;
    }
    
    onPlanejar(membro.id);
  };

  const confirmarPlanejamentoAdiada = () => {
    const membro = modalConfirmacao;
    
    const novasAdiadas = { ...adiadas };
    delete novasAdiadas[membro.id];
    setAdiadas(novasAdiadas);
    salvarLGPD('@clearit-reunioes-adiadas', novasAdiadas);

    setModalConfirmacao(null);
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
                    {membro.status === 'expiradas' ? 'Atrasada' : membro.status === 'adiadas' ? 'Adiada' : 'No Prazo'}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Agendada para: {formatarExibicao(membro.dataCalculada)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {(membro.status === 'expiradas' || membro.status === 'prontas') && (
                <button 
                  onClick={() => handleAdiar(membro)}
                  className="flex-1 md:flex-none px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                >
                  Adiar (+7 Dias)
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

      {/* ✨ MODAL DE CONFIRMAÇÃO PREMIUM (Para reuniões adiadas) ✨ */}
      {modalConfirmacao && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={() => setModalConfirmacao(null)}></div>
          
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 animate-[slideUp_0.3s_ease-out] overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-50 dark:border-amber-900/10">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Atenção ao Planejamento</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Esta reunião com <strong className="text-slate-900 dark:text-white">{modalConfirmacao.nome}</strong> estava <strong>adiada</strong>. 
                <br/><br/>
                Ao planejar agora, você antecipará o alinhamento e ela sairá do status de adiada. Deseja continuar?
              </p>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex gap-3">
              <button 
                onClick={() => setModalConfirmacao(null)}
                className="flex-1 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarPlanejamentoAdiada}
                className="flex-1 py-3 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-md shadow-amber-500/20"
              >
                Sim, Planejar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✨ TOAST NOTIFICATION PREMIUM ✨ */}
      {balaoAviso.visivel && (
        <div className={`fixed bottom-6 right-6 z-[200] max-w-md px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${
          balaoAviso.tipo === 'alerta' 
            ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20' 
            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 dark:border-slate-200'
        }`}>
          {balaoAviso.tipo === 'alerta' ? (
            <Clock className="w-6 h-6 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 dark:text-emerald-500 flex-shrink-0" />
          )}
          <p className="text-sm font-semibold pr-2">{balaoAviso.mensagem}</p>
          <button 
            onClick={() => setBalaoAviso({ visivel: false, mensagem: '', tipo: 'sucesso' })}
            className={`p-1 rounded-lg transition-colors ml-auto ${
              balaoAviso.tipo === 'alerta' 
                ? 'hover:bg-amber-600 text-amber-100 hover:text-white' 
                : 'hover:bg-slate-800 dark:hover:bg-slate-100 text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}