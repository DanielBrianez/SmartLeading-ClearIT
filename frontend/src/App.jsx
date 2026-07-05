// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Sun, Moon, 
  User, Calendar, Users, MessageSquare, Settings, LogOut, Trophy, Info, Search, Bell, Zap, BarChart3,
  House
} from 'lucide-react';
import { salvarLGPD, lerLGPD } from './utils/security';

import logoImagem from './assets/logo.png';
import logoBranca from './assets/logo-branco.png';
import minhaFoto from './assets/daniel-foto.jpg';

import Home from './views/Home';
import Meus1a1 from './views/Meus1a1';
import Ranking from './views/Ranking';
import MeuSquad from './views/MeuSquad';
import About from './views/About';
import ProximasReunioes from './views/ProximasReunioes';
import PainelRH from './views/PainelRH';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  
  // 🔥 ESTADOS DO ROTEAMENTO E BUSCA
  const [lideradoParaPlanejar, setLideradoParaPlanejar] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🔥 ESTADOS DE MENUS DROPDOWN
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificacoesOpen, setIsNotificacoesOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);

  // 🔥 ESTADOS DO MEU PERFIL (NOVO)
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [perfilConfig, setPerfilConfig] = useState(localStorage.getItem('@clearit-perfil-config') || 'Técnico');

  const profileMenuRef = useRef(null);
  const notificacoesRef = useRef(null);

  // MOCK: Usuário logado
  const supervisorLogado = {
    nome: "DANIEL NASCIMENTO DOS SANTOS FILHO",
    cargo: "Tech Lead",
    ambiente: "Clear IT",
    foto: minhaFoto
  };

  // Carrega notificações e escuta os eventos do sistema
  const carregarNotificacoes = () => {
    const salvas = lerLGPD('@clearit-notificacoes') || [];
    setNotificacoes(salvas);
  };

  useEffect(() => {
    carregarNotificacoes();
    window.addEventListener('notificacao-atualizada', carregarNotificacoes);
    return () => window.removeEventListener('notificacao-atualizada', carregarNotificacoes);
  }, []);

  // Fechar menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificacoesRef.current && !notificacoesRef.current.contains(event.target)) {
        setIsNotificacoesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  const handleAbrirNotificacoes = () => {
    setIsNotificacoesOpen(!isNotificacoesOpen);
    
    // Zera o contador visual (Marca todas como lidas no banco)
    if (!isNotificacoesOpen && notificacoesNaoLidas > 0) {
      const atualizadas = notificacoes.map(n => ({ ...n, lida: true }));
      setNotificacoes(atualizadas);
      salvarLGPD('@clearit-notificacoes', atualizadas);
    }
  };

  const menuItems = [
    { id: 'Home', label: 'Home', icon: House, status: 'ready' },
    { id: '1a1', label: 'Meus 1:1s', icon: MessageSquare, status: 'ready' },
    { id: 'squad', label: 'Meu Squad', icon: Users, status: 'ready' },
    { id: 'reunioes', label: 'Próximas Reuniões', icon: Calendar, status: 'ready' },
    { id: 'ranking', label: 'Liga de Ouro', icon: Trophy, status: 'ready' },
    { id: 'about', label: 'Sobre o Sistema', icon: Info, status: 'ready' },
    { id: 'painel', label: 'Painel do RH', icon: BarChart3, status: 'ready' },
    { id: 'config', label: 'Ferramentas', icon: Settings, status: 'wip' },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 lg:px-6">
        
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <img src={isDarkMode ? logoBranca : logoImagem} alt="Logo" className="h-8 w-auto ml-2" />
        </div>

        <div className="flex items-center gap-4">
          
          {/* SINO DE NOTIFICAÇÃO FUNCIONAL */}
          <div className="relative" ref={notificacoesRef}>
            <button 
              onClick={handleAbrirNotificacoes}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {notificacoesNaoLidas > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950">
                  {notificacoesNaoLidas}
                </span>
              )}
            </button>

            {/* DROPDOWN DE NOTIFICAÇÕES */}
            {isNotificacoesOpen && (
              <div className="absolute top-14 right-[-60px] md:right-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notificações</h3>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  {notificacoes.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      Nenhuma notificação por enquanto.
                    </div>
                  ) : (
                    notificacoes.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{notif.titulo}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{notif.mensagem}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.tempo}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* PERFIL */}
          <div className="relative" ref={profileMenuRef}>
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={supervisorLogado.foto} alt="Avatar" className="w-10 h-10 object-cover" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute top-14 right-0 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="px-5 pb-3">
                  <p className="font-bold text-sm text-slate-900 dark:text-white uppercase leading-tight">{supervisorLogado.nome}</p>
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Ambiente: {supervisorLogado.ambiente}</p>
                    <p>{supervisorLogado.cargo}</p>
                  </div>
                </div>
                
                <hr className="border-slate-100 dark:border-slate-700 my-1" />
                
                {/* 🔥 NOVO BOTÃO: MEU PERFIL */}
                <button 
                  onClick={() => { setIsProfileMenuOpen(false); setModalPerfilOpen(true); }}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <User className="w-4 h-4" /> Meu Perfil
                </button>

                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />} 
                  {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                </button>
                
                <hr className="border-slate-100 dark:border-slate-700 my-1" />
                
                <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ÁREA CENTRAL */}
      <div className="flex flex-1 pt-16 h-full overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className={`fixed md:relative z-40 h-[calc(100vh-4rem)] bg-[#f5f5f5] dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col flex-shrink-0 ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-0 md:w-0'}`}>
          <nav className="flex-1 overflow-y-auto py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => { 
                    setActiveTab(item.id); 
                    if (window.innerWidth < 768) setIsSidebarOpen(false); 
                    // Limpa o cross-routing se o cara clicar num menu aleatório
                    if (item.id !== '1a1') setLideradoParaPlanejar(null);
                  }} 
                  className={`w-full flex items-center justify-between px-5 py-3.5 transition-all text-sm group ${isActive ? 'bg-white dark:bg-slate-800 border-l-4 border-blue-600 font-semibold text-slate-900 dark:text-white shadow-sm' : 'border-l-4 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'}`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-slate-900/50 z-30 top-16" onClick={() => setIsSidebarOpen(false)} />}

        {/* MAIN (ROTAS) */}
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-6 md:p-10 relative bg-slate-50 dark:bg-slate-950 w-full">
          <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out]">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase">Olá, {supervisorLogado.nome}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Que bom ver você aqui.</p>
            </div>

            {/* ROTEAMENTO */}
            {activeTab === 'Home' && (
              <Home 
                setAbaAtiva={(aba) => {
                  if (aba === 'Meus1a1' || aba === 'atas' || aba === '1a1') setActiveTab('1a1');
                  else if (aba === 'Meu squad' || aba === 'squad') setActiveTab('squad');
                  else setActiveTab(aba);
                }} 
              />
            )}
            
            {activeTab === '1a1' && <Meus1a1 lideradoPreSelecionado={lideradoParaPlanejar} />}
            {activeTab === 'squad' && <MeuSquad />}

            {activeTab === 'reunioes' && (
              <ProximasReunioes 
                onPlanejar={(id_membro) => { 
                  setLideradoParaPlanejar(id_membro); 
                  setActiveTab('1a1'); 
                }} 
              />
            )}

            {activeTab === 'ranking' && <Ranking />}
            {activeTab === 'painel' && <PainelRH />}
            {activeTab === 'about' && <About />}
            
            {(['config'].includes(activeTab)) && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 space-y-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                <Settings className="w-16 h-16 animate-spin-slow opacity-20" />
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Em Construção</h2>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 🔥 MODAL DE MEU PERFIL (FLUTUANTE) */}
      {modalPerfilOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl animate-[fadeIn_0.2s]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Configurar Perfil
              </h3>
              <button onClick={() => setModalPerfilOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Meu Estilo de Liderança:</label>
            <select 
              value={perfilConfig} 
              onChange={(e) => {
                setPerfilConfig(e.target.value);
                localStorage.setItem('@clearit-perfil-config', e.target.value);
                // 🔥 A MÁGICA: Avisa o sistema inteiro que o perfil mudou na mesma hora!
                window.dispatchEvent(new Event('perfil-atualizado'));
              }}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 outline-none rounded-xl mb-6 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              <option value="Técnico">Técnico</option>
              <option value="Transição">Em Transição</option>
              <option value="Engajado">Engajado</option>
            </select>
            
            <button 
              onClick={() => setModalPerfilOpen(false)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm"
            >
              Salvar Perfil
            </button>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Esse perfil será carregado automaticamente ao gerar seus roteiros de 1:1.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}