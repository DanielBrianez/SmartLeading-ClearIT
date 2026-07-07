import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Sun, Moon, User, Calendar, Users, MessageSquare, 
  Settings, LogOut, Trophy, Info, Bell, Zap, BarChart3, House, Camera, BookOpen
} from 'lucide-react';

import { salvarLGPD, lerLGPD } from './utils/security';
import Login from './views/Login';
import logoImagem from './assets/logo.png';
import logoBranca from './assets/logo-branco.png';

// Import das views
import Home from './views/Home';
import HomeLiderado from './views/HomeLiderado'; // <--- Nova Home do Liderado
import HomeRH from './views/HomeRH'; // <--- Nova Home do RH
import Meus1a1 from './views/Meus1a1';
import Ranking from './views/Ranking';
import MeuSquad from './views/MeuSquad';
import PainelRH from './views/PainelRH';
import Playbook from './views/Playbook';
import About from './views/About';
import ProximasReunioes from './views/ProximasReunioes';

export default function App() {
  // 1. DECLARAÇÃO DE HOOKS
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [lideradoParaPlanejar, setLideradoParaPlanejar] = useState(null);
  
  // Estados de Menus e Notificações (Aqui estavam os que faltavam!)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificacoesOpen, setIsNotificacoesOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const notificacoesRef = useRef(null);

  // Perfil dinâmico
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    estiloLideranca: localStorage.getItem('@clearit-perfil-config') || 'Técnico'
  });
  
  // 2. EFEITOS
  useEffect(() => {
    if (user) setUserProfile(prev => ({ ...prev, displayName: user.nome }));
  }, [user]);

  useEffect(() => {
    const carregarNotificacoes = () => {
      const salvas = lerLGPD('@clearit-notificacoes') || [];
      setNotificacoes(salvas);
    };
    carregarNotificacoes();
    window.addEventListener('notificacao-atualizada', carregarNotificacoes);
    return () => window.removeEventListener('notificacao-atualizada', carregarNotificacoes);
  }, []);

  // Fecha menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setIsProfileMenuOpen(false);
      if (notificacoesRef.current && !notificacoesRef.current.contains(event.target)) setIsNotificacoesOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. FUNÇÕES DE APOIO
  const handleLogout = () => {
    localStorage.removeItem('@clearit-session');
    setUser(null);
    window.location.reload();
  };

  const allMenuItems = [
    { id: 'Home', label: 'Home', icon: House, roles: ['LIDER', 'RH', 'LIDERADO'] },
    { id: '1a1', label: 'Meus 1:1s', icon: MessageSquare, roles: ['LIDER'] },
    { id: 'squad', label: 'Meu Squad', icon: Users, roles: ['LIDER'] },
    { id: 'reunioes', label: 'Próximas Reuniões', icon: Calendar, roles: ['LIDER'] },
    { id: 'ranking', label: 'Liga de Ouro', icon: Trophy, roles: ['LIDER'] },
    { id: 'painel', label: 'Painel do RH', icon: BarChart3, roles: ['RH'] },
    { id: 'playbook', label: 'Playbook', icon: BookOpen, roles: ['LIDER'] },
    { id: 'about', label: 'Sobre', icon: Info, roles: ['LIDER', 'RH', 'LIDERADO'] },
  ];

  // 4. RENDERIZAÇÃO CONDICIONAL
  if (!user) {
    return <Login onLogin={(usuario) => setUser(usuario)} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
  }

  const menuVisivel = allMenuItems.filter(item => item.roles.includes(user.role));
  const minhasNotificacoes = notificacoes.filter(n => {
    // 1. Notificação direcionada para a Role (Ex: target: 'LIDER')
    if (n.target === user.role) return true;
    
    // 2. Notificação direcionada para o Usuário Específico (Ex: userId: 'carlos_eduardo')
    if (n.userId === user.id) return true;
    
    // 3. Notificações legadas (antigas, sem target): Mostra APENAS para o Líder
    if (!n.target && !n.userId && user.role === 'LIDER') return true;
    
    return false; // Se não se encaixar, esconde!
  }); 
  
  const notificacoesNaoLidas = minhasNotificacoes.filter(n => !n.lida).length;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-900 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-6 h-6" />
          </button>
          <img src={isDarkMode ? logoBranca : logoImagem} alt="Logo" className="h-8" />
        </div>

        <div className="flex items-center gap-4">
            {/* 🌓 BOTÃO DARK MODE (Ele Voltou!) 🌓 */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Alternar Tema"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>          
          {/* SINO DE NOTIFICAÇÕES */}
          <div className="relative" ref={notificacoesRef}>
            <button 
              onClick={() => {
                setIsNotificacoesOpen(!isNotificacoesOpen);
                if (!isNotificacoesOpen && notificacoesNaoLidas > 0) {
                  // Marca como lidas ao abrir
                  const atualizadas = notificacoes.map(n => 
                    (n.target === user.role || n.userId === user.id) ? { ...n, lida: true } : n
                  );
                  setNotificacoes(atualizadas);
                  salvarLGPD('@clearit-notificacoes', atualizadas);
                }
              }}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
            >
              <Bell className="w-5 h-5" />
              {notificacoesNaoLidas > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
              )}
            </button>

            {isNotificacoesOpen && (
              <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <div className="p-3 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-bold text-sm">Notificações</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {minhasNotificacoes.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">Sem notificações novas.</div>
                  ) : (
                    minhasNotificacoes.map(notif => (
                      <div key={notif.id} className="p-3 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <p className="text-sm font-bold">{notif.titulo}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.mensagem}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PERFIL */}
          <div className="relative" ref={profileMenuRef}>
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2">
              <span className="text-sm font-bold hidden md:block">{userProfile.displayName}</span>
              
              {localStorage.getItem(`@clearit-foto-${user.id}`) ? (
                <img src={localStorage.getItem(`@clearit-foto-${user.id}`)} alt="Avatar" className="w-10 h-10 rounded-full object-cover border dark:border-slate-700" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
                  {user.nome.charAt(0)}
                </div>
              )}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute top-14 right-0 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                <button onClick={() => { setIsProfileMenuOpen(false); setModalPerfilOpen(true); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2">
                  <Settings size={16} /> Configurar Perfil
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 mt-1">
                  <LogOut size={16} /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ROTEAMENTO */}
      <div className="flex flex-1 pt-16">
        <aside className={`fixed md:relative z-40 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
          <nav className="py-4">
            {menuVisivel.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center gap-4 px-6 py-3 ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-r-4 border-blue-600' : ''}`}>
                  <Icon className="w-5 h-5" /> {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Roteamento Inteligente da Home */}
          {activeTab === 'Home' && (
            user.role === 'LIDERADO' ? <HomeLiderado /> : 
            user.role === 'RH' ? <HomeRH /> : 
            <Home setAbaAtiva={setActiveTab} />
          )}          
          {activeTab === '1a1' && user.role === 'LIDER' && <Meus1a1 lideradoPreSelecionado={lideradoParaPlanejar} />}
          {activeTab === 'squad' && user.role === 'LIDER' && <MeuSquad />}
          {activeTab === 'reunioes' && user.role === 'LIDER' && <ProximasReunioes />}
          {activeTab === 'ranking' && user.role === 'LIDER' && <Ranking />}
          {activeTab === 'painel' && user.role === 'RH' && <PainelRH />}
          {activeTab === 'playbook' && <Playbook />}
          {activeTab === 'about' && <About />}
        </main>
      </div>

      {/* MODAL DE PERFIL PARA TODOS */}
      {modalPerfilOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm border dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Meu Perfil</h3>
              <button onClick={() => setModalPerfilOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group cursor-pointer" onClick={() => {
                const randomPhoto = `https://i.pravatar.cc/150?u=${user.id}`;
                localStorage.setItem(`@clearit-foto-${user.id}`, randomPhoto);
                window.dispatchEvent(new Event('perfil-atualizado'));
              }}>
                {localStorage.getItem(`@clearit-foto-${user.id}`) ? (
                  <img src={localStorage.getItem(`@clearit-foto-${user.id}`)} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase text-2xl">
                    {user.nome.charAt(0)}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full text-white hover:bg-blue-700 shadow-md">
                  <Camera size={14} />
                </button>
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-700 dark:text-slate-300">Foto de Perfil</p>
                <p className="text-blue-500 font-semibold cursor-pointer text-xs">Clique na câmera para alterar</p>
              </div>
            </div>

            <label className="block text-sm font-medium mb-1">Nome de Exibição:</label>
            <input 
              value={userProfile.displayName} 
              onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})} 
              className="w-full p-2.5 mb-4 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" 
            />
            
            {user.role === 'LIDER' && (
              <>
                <label className="block text-sm font-medium mb-1">Meu Estilo de Liderança:</label>
                <select 
                  value={userProfile.estiloLideranca} 
                  onChange={(e) => setUserProfile({...userProfile, estiloLideranca: e.target.value})}
                  className="w-full p-2.5 mb-6 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Técnico">Técnico</option>
                  <option value="Transição">Em Transição</option>
                  <option value="Engajado">Engajado</option>
                </select>
              </>
            )}

            <button 
              onClick={() => {
                localStorage.setItem('@clearit-perfil-config', userProfile.estiloLideranca);
                window.dispatchEvent(new Event('perfil-atualizado'));
                setModalPerfilOpen(false);
              }} 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded-xl font-bold shadow-md"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}