// src/views/HomeRH.jsx
import React, { useState, useEffect } from 'react';
import { 
  PieChart, Users, AlertTriangle, 
  HeartPulse, Target, Calendar, ShieldCheck, Download, 
  Search, Loader2
} from 'lucide-react';
import { lerLGPD } from '../utils/security';
import { DB_SQUADS } from '../dados';
import html2pdf from 'html2pdf.js';

export default function HomeRH() {
  const [metricas, setMetricas] = useState({
    totalColaboradores: 0,
    pdisAtivos: 0,
    atasGeradas: 0
  });

  const [cadencia, setCadencia] = useState({ emDia: 0, atrasadas: 0, total: 0 });
  const [sentimento, setSentimento] = useState({ motivado: 0, focado: 0, bloqueado: 0, sobrecarga: 0 });
  const [lideresRisco, setLideresRisco] = useState([]);
  const [busca, setBusca] = useState('');
  
  // Estado para o botão de download
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const carregarDados = () => {
      let empresaGlobal = [];
      const lideresMap = {};

      Object.keys(DB_SQUADS).forEach(idLider => {
        const nomeLider = idLider === 'daniel_nascimento' ? 'Daniel Nascimento' :
          idLider === 'juliana_castro' ? 'Juliana Castro' :
          idLider.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

        lideresMap[idLider] = { id: idLider, nome: nomeLider, totalLiderados: 0, atrasadas: 0 };

        DB_SQUADS[idLider].forEach(membro => {
          empresaGlobal.push({ ...membro, idLider, nomeLider });
        });
      });

      const squadSalvo = lerLGPD('@clearit-squad') || [];
      empresaGlobal = empresaGlobal.map(membroBase => {
        const atualizacao = squadSalvo.find(s => s.id === membroBase.id);
        return atualizacao ? { ...membroBase, ...atualizacao } : membroBase;
      });

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      let emDia = 0;
      let atrasadas = 0;
      let sMotivado = 0;
      let sFocado = 0;
      let sBloqueado = 0;
      let sSobrecarga = 0;

      empresaGlobal.forEach(membro => {
        lideresMap[membro.idLider].totalLiderados += 1;
        let status = 'em_dia';

        if (!membro.proxima_reuniao) {
          status = 'atrasada';
        } else {
          let dataCalculada;
          if (membro.proxima_reuniao.includes('/')) {
            const [d, mes, a] = membro.proxima_reuniao.split('/');
            dataCalculada = new Date(`${a}-${mes}-${d}T00:00:00`);
          } else {
            dataCalculada = new Date(membro.proxima_reuniao + 'T00:00:00');
          }
          if (dataCalculada < hoje) status = 'atrasada';
        }

        if (status === 'atrasada') {
          atrasadas++;
          lideresMap[membro.idLider].atrasadas += 1;
        } else {
          emDia++;
        }

        const idLoginFalback = membro.nome.toLowerCase().replace(/ /g, '_');
        const momentoAtual = localStorage.getItem(`@clearit-momento-${membro.id}`) ||
          localStorage.getItem(`@clearit-momento-${idLoginFalback}`);

        if (momentoAtual) {
          if (momentoAtual.includes('Motivado')) sMotivado++;
          else if (momentoAtual.includes('Focado')) sFocado++;
          else if (momentoAtual.includes('bloqueado') || momentoAtual.includes('ajuda')) sBloqueado++;
          else if (momentoAtual.includes('Sobrecarga') || momentoAtual.includes('Cansado')) sSobrecarga++;
        } else {
          sFocado++;
        }
      });

      const atas = lerLGPD('@clearit-atas-squad') || [];
      const pdis = lerLGPD('@clearit-pdi') || [];
      const pdisDeletados = lerLGPD('@clearit-deleted-pdi') || [];
      const pdisAtivosCount = pdis.filter(p => p.status !== 'Concluído' && !pdisDeletados.includes(p.id)).length;
      const pdisMockBase = empresaGlobal.length * 2;

      setCadencia({ emDia, atrasadas, total: empresaGlobal.length });
      setSentimento({ motivado: sMotivado, focado: sFocado, bloqueado: sBloqueado, sobrecarga: sSobrecarga });
      setMetricas({
        totalColaboradores: empresaGlobal.length,
        pdisAtivos: pdisAtivosCount > 0 ? pdisAtivosCount : pdisMockBase,
        atasGeradas: atas.length > 0 ? atas.length : Math.floor(empresaGlobal.length * 0.8)
      });

      const arrayLideresRisco = Object.values(lideresMap).filter(l => l.atrasadas > 0);
      arrayLideresRisco.sort((a, b) => b.atrasadas - a.atrasadas);
      setLideresRisco(arrayLideresRisco);
    };

    carregarDados();
    window.addEventListener('clearit-data-updated', carregarDados);
    window.addEventListener('storage', carregarDados);
    return () => {
      window.removeEventListener('clearit-data-updated', carregarDados);
      window.removeEventListener('storage', carregarDados);
    };
  }, []);

  const totalSentimento = sentimento.motivado + sentimento.focado + sentimento.bloqueado + sentimento.sobrecarga || 1;
  const percSobrecarga = Math.round((sentimento.sobrecarga / totalSentimento) * 100);

  // 🔥 FUNÇÃO DE DOWNLOAD DO RELATÓRIO DRE 🔥
  const handleDownloadDRE = () => {
    setIsDownloading(true);
    
    const elemento = document.getElementById('relatorio-dre');
    
    // Configuração com margens otimizadas para folha A4 e escala 2 para nitidez
    const opt = {
      margin: [15, 10, 15, 10], 
      filename: `Relatorio_DRE_ClearIT_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setTimeout(() => {
      html2pdf().set(opt).from(elemento).save().then(() => {
        setIsDownloading(false);
      });
    }, 500); 
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out] pb-10">
      
      {/* HEADER RH */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <PieChart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">People Analytics</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Visão gerencial de engajamento, risco de burnout e compliance de liderança.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleDownloadDRE}
            disabled={isDownloading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isDownloading ? 'Gerando PDF...' : 'Relatório DRE'}
          </button>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS GERAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Total na Base</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">{metricas.totalColaboradores}</p>
          </div>
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">PDIs Ativos</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">{metricas.pdisAtivos}</p>
          </div>
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Target className="w-7 h-7 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Atas de 1:1</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">{metricas.atasGeradas}</p>
          </div>
          <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-7 h-7 text-purple-500" />
          </div>
        </div>
      </div>

      {/* DASHBOARDS PRINCIPAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICO 1: SAÚDE DA CADÊNCIA */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" /> Compliance de 1:1s
              </h2>
              <p className="text-sm text-slate-500 mt-1">Taxa de aderência ao framework quinzenal.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-slate-800"></circle>
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={`${(cadencia.emDia / (cadencia.total || 1)) * 100} 100`} className="text-emerald-500"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{Math.round((cadencia.emDia / (cadencia.total || 1)) * 100)}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Saudável</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Em Dia</span>
                </div>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">{cadencia.emDia}</span>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-sm font-bold text-rose-800 dark:text-rose-400">Atrasadas / Sem Data</span>
                </div>
                <span className="text-lg font-black text-rose-700 dark:text-rose-300">{cadencia.atrasadas}</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICO 2: TERMÔMETRO DE SENTIMENTO */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse className={`w-5 h-5 ${percSobrecarga > 20 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} /> 
                Termômetro Organizacional
              </h2>
              <p className="text-sm text-slate-500 mt-1">Sincronia de momento dos colaboradores.</p>
            </div>
            {percSobrecarga > 20 && (
              <span className="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 text-xs font-bold uppercase rounded-lg border border-rose-200 dark:border-rose-500/30">
                Alerta de Burnout
              </span>
            )}
          </div>

          <div className="space-y-4 mt-8">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                <span>🚀 Motivado e Energizado</span>
                <span>{Math.round((sentimento.motivado / totalSentimento) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(sentimento.motivado / totalSentimento) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                <span>🎯 Focado nas entregas</span>
                <span>{Math.round((sentimento.focado / totalSentimento) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(sentimento.focado / totalSentimento) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                <span>🚧 Precisando de Ajuda / Bloqueado</span>
                <span>{Math.round((sentimento.bloqueado / totalSentimento) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(sentimento.bloqueado / totalSentimento) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-rose-600 dark:text-rose-400 mb-1.5">
                <span>🔋 Sobrecarga / Cansado</span>
                <span>{percSobrecarga}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${percSobrecarga}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* TABELA DE AÇÃO: LÍDERES EM RISCO */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Liderança em Risco
            </h2>
            <p className="text-sm text-slate-500">Líderes com o maior número de 1:1s atrasadas.</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar líder..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-900 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-bold">Nome do Líder</th>
                <th className="p-4 font-bold text-center">Tamanho do Time</th>
                <th className="p-4 font-bold text-center">1:1s Atrasadas</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
              {lideresRisco.filter(l => l.nome.toLowerCase().includes(busca.toLowerCase())).map(lider => (
                <tr key={lider.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      {lider.nome.charAt(0)}
                    </div>
                    {lider.nome}
                  </td>
                  <td className="p-4 text-center text-slate-600 dark:text-slate-400 font-semibold">{lider.totalLiderados}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 font-black">
                      {lider.atrasadas}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                      lider.atrasadas > 2 ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                    }`}>
                      {lider.atrasadas > 2 ? 'Crítico' : 'Atenção'}
                    </span>
                  </td>
                </tr>
              ))}
              {lideresRisco.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                      <p>Excelente! Nenhum líder com 1:1 atrasada no momento.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 TEMPLATE INVISÍVEL PARA GERAÇÃO DO PDF (DRE) - FORMATADO E ALINHADO COM FLEXBOX 🔥 */}
      <div className="absolute opacity-0 pointer-events-none" style={{ left: '-9999px', top: '-9999px' }}>
        <div id="relatorio-dre" className="bg-white text-slate-900 p-8 box-border" style={{ width: '720px' }}>
          
          {/* Header do PDF */}
          <div className="border-b-2 border-slate-300 pb-4 mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">ClearIT</h1>
              <h2 className="text-sm font-bold text-slate-500">DRE - Demonstrativo de Resultado de Engajamento</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 whitespace-nowrap">Data da Extração</p>
              <p className="text-base font-bold text-slate-800">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          {/* Seção 1: Indicadores Globais */}
          <div className="mb-8">
            <h3 className="text-sm font-black uppercase text-slate-800 border-b border-slate-200 pb-1 mb-3">1. Indicadores Globais</h3>
            <div className="flex justify-between gap-4">
              <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Colaboradores na Base</p>
                <p className="text-2xl font-black text-blue-600">{metricas.totalColaboradores}</p>
              </div>
              <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">PDIs Ativos</p>
                <p className="text-2xl font-black text-emerald-600">{metricas.pdisAtivos}</p>
              </div>
              <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Atas de Mentoria</p>
                <p className="text-2xl font-black text-purple-600">{metricas.atasGeradas}</p>
              </div>
            </div>
          </div>

          {/* Seção 2 e 3: Gráficos de Saúde (Alinhados Lado a Lado usando Flex) */}
          <div className="flex justify-between gap-6 mb-8">
            <div className="w-[48%]">
              <h3 className="text-sm font-black uppercase text-slate-800 border-b border-slate-200 pb-1 mb-3">2. Compliance de 1:1s</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="font-bold text-emerald-800 text-[10px] uppercase">Reuniões Em Dia</span>
                  <span className="font-black text-lg text-emerald-600 leading-none">{cadencia.emDia}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                  <span className="font-bold text-rose-800 text-[10px] uppercase">Atrasadas / Sem Data</span>
                  <span className="font-black text-lg text-rose-600 leading-none">{cadencia.atrasadas}</span>
                </div>
              </div>
            </div>

            <div className="w-[48%]">
              <h3 className="text-sm font-black uppercase text-slate-800 border-b border-slate-200 pb-1 mb-3">3. Termômetro (Burnout)</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1">
                  <span className="font-bold text-emerald-600 uppercase">🚀 Motivado / Energizado</span>
                  <span className="font-black text-sm leading-none">{Math.round((sentimento.motivado / totalSentimento) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1">
                  <span className="font-bold text-blue-600 uppercase">🎯 Focado nas entregas</span>
                  <span className="font-black text-sm leading-none">{Math.round((sentimento.focado / totalSentimento) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1">
                  <span className="font-bold text-amber-600 uppercase">🚧 Precisando de Ajuda</span>
                  <span className="font-black text-sm leading-none">{Math.round((sentimento.bloqueado / totalSentimento) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1">
                  <span className="font-bold text-rose-600 uppercase">🔋 Sobrecarga / Risco</span>
                  <span className="font-black text-rose-600 text-sm leading-none">{percSobrecarga}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 4: Lideranças em Risco */}
          <div>
            <h3 className="text-sm font-black uppercase text-slate-800 border-b border-slate-200 pb-1 mb-3">4. Ofensores de Cadência (Líderes)</h3>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[9px] uppercase tracking-wider text-slate-600 border-b border-slate-300">
                    <th className="p-2 w-[50%] font-bold">Nome do Líder</th>
                    <th className="p-2 w-[25%] text-center font-bold">Membros no Squad</th>
                    <th className="p-2 w-[25%] text-center font-bold">1:1s Atrasadas</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] divide-y divide-slate-200">
                  {lideresRisco.slice(0, 8).map(lider => (
                    <tr key={lider.id} className="bg-white">
                      <td className="p-2 font-bold text-slate-800">{lider.nome}</td>
                      <td className="p-2 text-center text-slate-600">{lider.totalLiderados}</td>
                      <td className="p-2 text-center font-black text-rose-600">{lider.atrasadas}</td>
                    </tr>
                  ))}
                  {lideresRisco.length === 0 && (
                    <tr><td colSpan="3" className="p-4 text-center text-slate-500 font-medium">Todos os líderes estão com a cadência em dia.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer do PDF */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[9px] text-slate-500 font-medium">
            <p className="mb-0.5">Este documento é confidencial e de uso interno do setor de Recursos Humanos e Governança.</p>
            <p>Gerado automaticamente pela plataforma ClearIT - Agent-First Leadership.</p>
          </div>

        </div>
      </div>

    </div>
  );
}