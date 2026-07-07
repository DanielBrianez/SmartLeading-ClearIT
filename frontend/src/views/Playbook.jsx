// src/views/Playbook.jsx
import { useState } from 'react';
import { 
  BookOpen, PlayCircle, FileText, Search, Star, Clock, 
  ChevronRight, ShieldAlert, Target, HeartPulse, X, Play
} from 'lucide-react';

export default function Playbook() {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [conteudoAberto, setConteudoAberto] = useState(null);

  // MOCK DE CONTEÚDOS (Estilo Netflix)
  const conteudos = [
    {
      id: 1,
      titulo: 'Feedback Corretivo sem causar Burnout',
      descricao: 'Aprenda o framework radical candor adaptado para o formato Agent-First. Como corrigir rotas mantendo a segurança psicológica.',
      categoria: 'Feedbacks',
      tipo: 'video',
      duracao: '8 min',
      nivel: 'Essencial',
      icone: <PlayCircle className="w-8 h-8 text-blue-500" />,
      bg: 'from-blue-500 to-indigo-600',
      destaque: true
    },
    {
      id: 2,
      titulo: 'Como estruturar um PDI SMART',
      descricao: 'O erro mais comum dos líderes é criar metas vagas. Veja como usar o nosso radar de competências a seu favor.',
      categoria: 'PDI',
      tipo: 'artigo',
      duracao: '5 min',
      nivel: 'Avançado',
      icone: <Target className="w-6 h-6 text-emerald-500" />,
      bg: 'from-emerald-500 to-teal-600'
    },
    {
      id: 3,
      titulo: 'Sinais de Burnout no Time',
      descricao: 'Como interpretar o termômetro de humor da plataforma e intervir antes que o colaborador peça demissão.',
      categoria: 'Saúde Mental',
      tipo: 'artigo',
      duracao: '4 min',
      nivel: 'Crítico',
      icone: <HeartPulse className="w-6 h-6 text-rose-500" />,
      bg: 'from-rose-500 to-red-600'
    },
    {
      id: 4,
      titulo: 'O Guia Definitivo da 1:1',
      descricao: 'Scripts e perguntas poderosas para arrancar insights verdadeiros dos seus liderados, fugindo do status report.',
      categoria: '1:1s',
      tipo: 'video',
      duracao: '12 min',
      nivel: 'Essencial',
      icone: <PlayCircle className="w-6 h-6 text-amber-500" />,
      bg: 'from-amber-500 to-orange-600'
    },
    {
      id: 5,
      titulo: 'Lidando com Baixa Performance (Underperformers)',
      descricao: 'Passo a passo legal e humano para fazer PIP (Performance Improvement Plan) sem burocracia desnecessária.',
      categoria: 'Casos Difíceis',
      tipo: 'artigo',
      duracao: '7 min',
      nivel: 'Avançado',
      icone: <ShieldAlert className="w-6 h-6 text-purple-500" />,
      bg: 'from-purple-500 to-fuchsia-600'
    }
  ];

  const categorias = ['Todos', '1:1s', 'Feedbacks', 'PDI', 'Saúde Mental', 'Casos Difíceis'];

  const conteudosFiltrados = conteudos.filter(c => {
    const matchBusca = c.titulo.toLowerCase().includes(busca.toLowerCase()) || c.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoriaAtiva === 'Todos' || c.categoria === categoriaAtiva;
    return matchBusca && matchCat;
  });

  const destaque = conteudos.find(c => c.destaque);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out] pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Playbook da Liderança
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Guias rápidos, frameworks e microlearning para você liderar com excelência.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar conteúdos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* HERO / CONTEÚDO EM DESTAQUE */}
      {destaque && busca === '' && categoriaAtiva === 'Todos' && (
        <div className={`w-full bg-gradient-to-br ${destaque.bg} rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group cursor-pointer`} onClick={() => setConteudoAberto(destaque)}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-1/2 -translate-y-1/4"></div>
          
          <div className="relative z-10 md:w-2/3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-4">
              <Star className="w-3.5 h-3.5 fill-white" /> Recomendado para você
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              {destaque.titulo}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              {destaque.descricao}
            </p>
            
            <div className="flex items-center gap-4">
              <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-transform active:scale-95 shadow-lg">
                <Play className="w-5 h-5 fill-blue-900" /> Assistir Agora
              </button>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-white/80">
                <Clock className="w-4 h-4" /> {destaque.duracao}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FILTROS DE CATEGORIA */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              categoriaAtiva === cat 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DE CONTEÚDOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {conteudosFiltrados.filter(c => c.id !== destaque?.id || busca !== '' || categoriaAtiva !== 'Todos').map(conteudo => (
          <div 
            key={conteudo.id} 
            onClick={() => setConteudoAberto(conteudo)}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${conteudo.bg} shadow-inner`}>
                {conteudo.tipo === 'video' ? <PlayCircle className="w-6 h-6 text-white" /> : <FileText className="w-6 h-6 text-white" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {conteudo.categoria}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {conteudo.titulo}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
              {conteudo.descricao}
            </p>
            
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Clock className="w-3.5 h-3.5" /> {conteudo.duracao}
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Acessar <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}

        {conteudosFiltrados.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            Nenhum conteúdo encontrado. Tente buscar por outros termos.
          </div>
        )}
      </div>

      {/* MODAL DO LEITOR / PLAYER VIRTUAL */}
      {conteudoAberto && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setConteudoAberto(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] flex flex-col max-h-[90vh]">
            
            <div className={`h-32 md:h-48 w-full bg-gradient-to-r ${conteudoAberto.bg} flex items-center justify-center relative`}>
              <button 
                onClick={() => setConteudoAberto(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              {conteudoAberto.tipo === 'video' ? <PlayCircle className="w-16 h-16 text-white/50" /> : <FileText className="w-16 h-16 text-white/50" />}
            </div>

            <div className="p-6 md:p-10 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase rounded-lg border border-slate-200 dark:border-slate-700">
                  {conteudoAberto.categoria}
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-slate-500">
                  <Clock className="w-4 h-4" /> {conteudoAberto.duracao}
                </span>
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                {conteudoAberto.titulo}
              </h2>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 font-medium leading-relaxed">
                  {conteudoAberto.descricao}
                </p>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500">
                  <p>Área reservada para a renderização do vídeo interativo ou artigo rico no banco de dados corporativo.</p>
                  <p className="text-xs mt-2 text-slate-400">Conteúdo simulado para a versão de demonstração.</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <button 
                onClick={() => setConteudoAberto(null)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                Concluir Estudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}