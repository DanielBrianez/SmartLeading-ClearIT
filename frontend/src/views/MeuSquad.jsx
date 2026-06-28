// src/views/MeuSquad.jsx
import React, { useState } from 'react';
import { 
  User, Calendar, Target, Zap, Activity, X, 
  Clock, FileText, CalendarPlus, Briefcase, Hash, 
  CheckCircle2, Circle, AlertCircle, CheckSquare
} from 'lucide-react';
import { DB_SQUADS } from '../dados';

export default function MeuSquad() {
  const idLiderLogado = "daniel_nascimento";
  const meuTime = DB_SQUADS[idLiderLogado] || [];
  
  const [lideradoSelecionado, setLideradoSelecionado] = useState(null);

  const formatarDataBR = (dataString) => {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Calcula a data e devolve o texto formatado para a tela
  const calcularProximaReuniaoTexto = (dataUltima) => {
    const data = new Date(dataUltima);
    data.setDate(data.getDate() + 15);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Monta o Link oficial do Google Calendar já preenchido!
  const gerarLinkGoogleCalendar = (nome, dataUltima) => {
    const data = new Date(dataUltima);
    data.setDate(data.getDate() + 15); // +15 dias
    
    // Formato que o Google entende: YYYYMMDD
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}${mes}${dia}`;

    const titulo = encodeURIComponent(`Reunião 1:1 - ${nome}`);
    const detalhes = encodeURIComponent(`Alinhamento quinzenal de desenvolvimento e metas.\n\nGerado via Smart Leading.`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${dataFormatada}/${dataFormatada}&details=${detalhes}`;
  };

  // Função para renderizar o ícone de status da Task
  const renderIconeTask = (status) => {
    switch(status) {
      case 'concluida': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'pendente': return <Circle className="w-5 h-5 text-blue-400" />;
      case 'expirada': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.4s_ease-out]">
      
      {/* Cabeçalho */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Visão Geral do Squad
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Acompanhe o desenvolvimento contínuo dos seus liderados diretos.
        </p>
      </div>

      {/* Grid de Cards da Equipe (Seu código anterior intacto) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meuTime.map((membro) => (
          <div key={membro.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{membro.nome}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{membro.cargo}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800/50 p-2 rounded w-fit">
              <Calendar className="w-4 h-4" />
              Última 1:1: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatarDataBR(membro.ultimaReuniao)}</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Activity className="w-3 h-3 text-emerald-500"/> Engajamento</span>
                  <span className="text-slate-500">{membro.progresso.engajamento}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${membro.progresso.engajamento}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Zap className="w-3 h-3 text-amber-500"/> Nível Técnico</span>
                  <span className="text-slate-500">{membro.progresso.tecnico}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${membro.progresso.tecnico}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Target className="w-3 h-3 text-blue-500"/> Acordos & Metas</span>
                  <span className="text-slate-500">{membro.progresso.metas}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${membro.progresso.metas}%` }}></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setLideradoSelecionado(membro)}
              className="w-full mt-6 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            >
              Ver Perfil Completo
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE PERFIL COMPLETO (Agora com Tabs Internas!) */}
      {lideradoSelecionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setLideradoSelecionado(null)}></div>

          <div className="relative w-full max-w-5xl bg-slate-50 dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
            
            {/* Header Fixo do Modal */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold">
                  {lideradoSelecionado.nome.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{lideradoSelecionado.nome}</h2>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5"/> {lideradoSelecionado.cargo}</span>
                    <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5"/> ID: {lideradoSelecionado.id}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setLideradoSelecionado(null)}
                className="p-2 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Corpo Rolável do Modal */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
              
              {/* Coluna Esquerda: Info & Calendário */}
              <div className="space-y-6 lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Detalhes do Colaborador</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Senioridade:</span> <span className="font-medium text-slate-900 dark:text-white">{lideradoSelecionado.senioridade}</span></p>
                    <p className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Squad:</span> <span className="font-medium text-slate-900 dark:text-white">{lideradoSelecionado.time}</span></p>
                    <p className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Tempo de Casa:</span> <span className="font-medium text-slate-900 dark:text-white">{lideradoSelecionado.tempoCasa}</span></p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center shadow-sm">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Ciclo Quinzenal</p>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Próxima Reunião dia {calcularProximaReuniaoTexto(lideradoSelecionado.ultimaReuniao)}
                  </h4>
                  {/* Botão Oficial do Google Calendar */}
                  <a 
                    href={gerarLinkGoogleCalendar(lideradoSelecionado.nome, lideradoSelecionado.ultimaReuniao)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-600/20"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Agendar no Calendário
                  </a>
                </div>
              </div>

              {/* Coluna Direita: Tasks e Atas */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Bloco de Tarefas (Acordos Prévios) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-500" />
                    Acordos e Missões (Tasks)
                  </h3>
                  
                  <div className="space-y-3">
                    {lideradoSelecionado.tarefas?.map((task) => (
                      <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                        task.status === 'concluida' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10' :
                        task.status === 'expirada' ? 'bg-red-50/50 border-red-100 dark:bg-red-500/5 dark:border-red-500/10' :
                        'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50'
                      }`}>
                        <div className="mt-0.5 flex-shrink-0">
                          {renderIconeTask(task.status)}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${task.status === 'concluida' ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                            {task.descricao}
                          </p>
                          <p className={`text-xs mt-1 ${task.status === 'expirada' ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                            DDL: {formatarDataBR(task.ddl)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                            task.status === 'concluida' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                            task.status === 'pendente' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!lideradoSelecionado.tarefas || lideradoSelecionado.tarefas.length === 0) && (
                      <p className="text-sm text-slate-500 italic">Nenhum acordo pendente.</p>
                    )}
                  </div>
                </div>

                {/* Bloco de Histórico de Atas */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    Histórico de Reuniões (Atas)
                  </h3>
                  
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 soft-scrollbar">
                    {lideradoSelecionado.historicoAtas.map((ata, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer group">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">{ata.data}</span>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{ata.pauta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}