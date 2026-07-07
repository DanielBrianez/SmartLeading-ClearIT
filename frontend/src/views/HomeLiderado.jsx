// src/views/HomeLiderado.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, Clock, MessageSquare, Briefcase, 
  Star, ThumbsUp, Send, Target, ListTodo, Award, TrendingUp
} from 'lucide-react';
import { lerLGPD, salvarLGPD } from '../utils/security';
import { DB_SQUADS } from '../dados';

export default function HomeLiderado() {
  const user = lerLGPD('@clearit-session') || { id: 'carlos_eduardo', nome: 'Carlos Eduardo' };
  
  const [meuMomento, setMeuMomento] = useState('');
  const [dataReuniao, setDataReuniao] = useState('Buscando...');
  const [statusReuniao, setStatusReuniao] = useState('em_dia');
  const [atasPendentes, setAtasPendentes] = useState([]);
  
  // Métricas de Carreira
  const [meusPdis, setMeusPdis] = useState(0);
  const [minhasTarefas, setMinhasTarefas] = useState(0);
  
  // Estados para o form de feedback
  const [notaAtual, setNotaAtual] = useState(5);
  const [relevante, setRelevante] = useState('sim');

  useEffect(() => {
    const carregarDados = () => {
      const chave = `@clearit-momento-${user.id}`;
      const momentoSalvo = localStorage.getItem(chave);
      if (momentoSalvo) setMeuMomento(momentoSalvo);

      let squads = lerLGPD('@clearit-squad') || [];
      if (squads.length === 0) squads = Object.values(DB_SQUADS).flat();

      const meusDados = squads.find(m => m.id.toString() === user.id.toString() || m.nome.includes(user.nome.split(' ')[0]));
      
      if (meusDados && meusDados.proxima_reuniao) {
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        
        let objData;
        if (meusDados.proxima_reuniao.includes('/')) {
          const [d, mes, a] = meusDados.proxima_reuniao.split('/');
          objData = new Date(`${a}-${mes}-${d}T00:00:00`);
        } else {
          objData = new Date(meusDados.proxima_reuniao + 'T00:00:00');
        }

        setDataReuniao(meusDados.proxima_reuniao.includes('-') ? meusDados.proxima_reuniao.split('-').reverse().join('/') : meusDados.proxima_reuniao);
        setStatusReuniao(objData < hoje ? 'atrasada' : 'em_dia');
      } else {
        setDataReuniao('Não Agendada');
        setStatusReuniao('atrasada');
      }

      const todasAtas = lerLGPD('@clearit-atas-squad') || [];
      const pendentes = todasAtas.filter(a => a.idLiderado.toString() === user.id.toString() && a.feedbackPendente === true);
      setAtasPendentes(pendentes);

      const pdisTotais = lerLGPD('@clearit-pdi') || [];
      const pdisDeletados = lerLGPD('@clearit-deleted-pdi') || [];
      const pdisAtivos = pdisTotais.filter(p => p.idLiderado.toString() === user.id.toString() && !pdisDeletados.includes(p.id));
      setMeusPdis(pdisAtivos.length);

      const tarefasTotais = lerLGPD('@clearit-tasks') || [];
      const tarefasDeletadas = lerLGPD('@clearit-deleted-tasks') || [];
      const tarefasAtivas = tarefasTotais.filter(t => t.idLiderado.toString() === user.id.toString() && !tarefasDeletadas.includes(t.id) && t.status !== 'Concluído');
      setMinhasTarefas(tarefasAtivas.length);
    };

    carregarDados();
    window.addEventListener('clearit-data-updated', carregarDados);
    return () => window.removeEventListener('clearit-data-updated', carregarDados);
  }, [user.id, user.nome]);

  const handleSalvarMomento = (e) => {
    const valor = e.target.value;
    setMeuMomento(valor);
    localStorage.setItem(`@clearit-momento-${user.id}`, valor);
  };

  const solicitarMentoria = () => {
    const novaNotificacao = {
      id: Date.now(),
      target: 'LIDER',
      titulo: '⚠️ Reunião Atrasada',
      mensagem: `${user.nome} está solicitando o agendamento da 1:1.`,
      tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: false
    };
    const notsSalvas = lerLGPD('@clearit-notificacoes') || [];
    notsSalvas.unshift(novaNotificacao);
    salvarLGPD('@clearit-notificacoes', notsSalvas);
    window.dispatchEvent(new Event('notificacao-atualizada'));
    alert("Seu líder foi notificado no sistema com sucesso!");
  };

  const enviarFeedback = (ataId, idLider) => {
    const xpGanho = 50 + (notaAtual * 10) + (relevante === 'sim' ? 50 : 0);

    const rankingSalvo = JSON.parse(localStorage.getItem('@clearit-ranking')) || {};
    const liderTarget = idLider || 'daniel_nascimento'; 
    rankingSalvo[liderTarget] = (rankingSalvo[liderTarget] || 0) + xpGanho;
    localStorage.setItem('@clearit-ranking', JSON.stringify(rankingSalvo));

    const todasAtas = lerLGPD('@clearit-atas-squad') || [];
    const indexAta = todasAtas.findIndex(a => a.idAta === ataId);
    if(indexAta !== -1) {
      todasAtas[indexAta].feedbackPendente = false;
      salvarLGPD('@clearit-atas-squad', todasAtas);
    }

    const novaNotificacao = {
      id: Date.now(),
      target: 'LIDER',
      titulo: '🎉 Feedback Recebido!',
      mensagem: `${user.nome} avaliou a última 1:1. Você ganhou +${xpGanho} XP!`,
      tempo: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: false
    };
    const notsSalvas = lerLGPD('@clearit-notificacoes') || [];
    notsSalvas.unshift(novaNotificacao);
    salvarLGPD('@clearit-notificacoes', notsSalvas);
    window.dispatchEvent(new Event('notificacao-atualizada'));

    setAtasPendentes(prev => prev.filter(a => a.idAta !== ataId));
  };

  // 🔥 HACK PARA A APRESENTAÇÃO: Força uma ata a aparecer para mostrar a banca
  const forcarAtaMock = () => {
    setAtasPendentes([{
      idAta: Date.now(),
      idLider: 'daniel_nascimento',
      idLiderado: user.id,
      feedbackPendente: true
    }]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out] pb-10">
      
      {/* HEADER DO LIDERADO */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Olá, {user.nome.split(' ')[0]}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Seu portal pessoal de acompanhamento e carreira.</p>
          </div>
        </div>
      </div>

      {/* MÉTRICAS DE CARREIRA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">PDIs Ativos</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{meusPdis}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Acordos Pendentes</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{minhasTarefas}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
            <ListTodo className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${statusReuniao === 'atrasada' ? 'bg-red-50 border-red-200 dark:bg-red-900/10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
          <div>
            <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${statusReuniao === 'atrasada' ? 'text-red-600' : 'text-slate-500'}`}>Status da Cadência</p>
            <p className={`text-xl font-black ${statusReuniao === 'atrasada' ? 'text-red-600' : 'text-emerald-500'}`}>
              {statusReuniao === 'atrasada' ? 'Atrasada' : 'Em Dia'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusReuniao === 'atrasada' ? 'bg-red-100 text-red-500' : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20'}`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ÁREA DE FEEDBACK PENDENTE */}
      {atasPendentes.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/50 p-6 rounded-2xl shadow-sm animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-500">
            <Star className="w-6 h-6 fill-amber-500 animate-pulse" />
            <h2 className="text-lg font-black uppercase tracking-tight">Avalie sua última 1:1</h2>
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-400/80 mb-6 font-medium">
            Seu líder registrou a ata do último alinhamento. Como parte da nossa cultura de governança, o XP dele só será liberado após a sua avaliação sincera.
          </p>

          {atasPendentes.map((ata, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-800/30 p-5 rounded-xl flex flex-col md:flex-row gap-6 items-center mb-4">
              
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nota da Reunião</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(estrela => (
                      <button 
                        key={estrela}
                        onClick={() => setNotaAtual(estrela)}
                        className={`p-2 rounded-lg transition-all ${notaAtual >= estrela ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-amber-50'}`}
                      >
                        <Star className={`w-6 h-6 ${notaAtual >= estrela ? 'fill-amber-500' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Foi relevante para o seu PDI?</label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setRelevante('sim')}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${relevante === 'sim' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 hover:bg-emerald-50/50'}`}
                    >
                      <ThumbsUp className="w-4 h-4" /> Sim, muito
                    </button>
                    <button 
                      onClick={() => setRelevante('nao')}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all ${relevante === 'nao' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 hover:bg-red-50/50'}`}
                    >
                      Não muito
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <button 
                  onClick={() => enviarFeedback(ata.idAta, ata.idLider)}
                  className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Send className="w-5 h-5" /> Enviar Avaliação
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COMPONENTE DE SINC INTELIGENTE (MOMENTO) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Sincronia de Momento
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Como você está se sentindo nesta sprint? Seu líder verá essa informação ao planejar a próxima 1:1.</p>
            
            <select 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              value={meuMomento}
              onChange={handleSalvarMomento}
            >
              <option value="">Compartilhe seu status...</option>
              <option value="Motivado e Energizado">🚀 Motivado e Energizado</option>
              <option value="Focado nas entregas">🎯 Focado nas entregas</option>
              <option value="Precisando de ajuda/bloqueado">🚧 Precisando de ajuda/bloqueado</option>
              <option value="Sobrecarga/Cansado">🔋 Sobrecarga / Cansado</option>
            </select>
          </div>
          
          {meuMomento && (
             <div className="mt-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-800/50">
               <CheckCircle2 className="w-4 h-4" /> Status atualizado e sincronizado com a Liderança.
             </div>
          )}
        </div>

        {/* COMPONENTE DE CADÊNCIA VIVA */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" /> Próxima Reunião (1:1)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Acompanhe a cadência dos seus alinhamentos e solicite horários caso precise.</p>
            
            <div className={`p-4 rounded-xl border flex items-center gap-4 ${statusReuniao === 'atrasada' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${statusReuniao === 'atrasada' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'}`}>
                {statusReuniao === 'atrasada' ? <AlertTriangle className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
              </div>
              <div>
                <p className={`text-sm font-bold uppercase tracking-wide ${statusReuniao === 'atrasada' ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {statusReuniao === 'atrasada' ? 'Reunião Atrasada' : 'Agendada para'}
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{dataReuniao}</p>
              </div>
            </div>
          </div>

          {statusReuniao === 'atrasada' && (
            <button 
              onClick={solicitarMentoria}
              className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Avisar Líder e Solicitar Mentoria
            </button>
          )}
        </div>

      </div>

      {/* BOTÃO MOCK PARA APRESENTAÇÃO */}
      <div className="text-center mt-12">
        <button 
          onClick={forcarAtaMock}
          className="text-xs text-slate-300 dark:text-slate-700 hover:text-amber-500 transition-colors"
          title="Clique aqui durante a demo para simular que o líder acabou de gerar uma ata"
        >
          [Demo Hack: Forçar Ata Pendente]
        </button>
      </div>

    </div>
  );
}