// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Trophy, Users, Info, Home as HomeIcon } from 'lucide-react';
import logoImagem from './assets/logo.png';
import logoBranca from './assets/logo-branco.png';

// Importando as nossas "peças de Lego" (As telas da aplicação)
import Home from './views/Home';
import Ranking from './views/Ranking';
import Equipe from './views/Equipe';
import About from './views/About';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Efeito para o Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Configuração das abas
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'team', label: 'Nosso Time', icon: Users },
    { id: 'about', label: 'Sobre o Projeto', icon: Info },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER FIXO */}
      <header className="fixed top-0 w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={isDarkMode ? logoBranca : logoImagem}
              alt="Logo Clear IT" 
              className="h-8 w-auto transition-all duration-300"
            />
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* NAVBAR DESKTOP */}
      <nav className="fixed top-16 w-full z-30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors hidden md:block">
        <div className="max-w-6xl mx-auto px-6">
          <ul className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                      isActive 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* NAVBAR MOBILE */}
      <nav className="fixed bottom-0 w-full z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 md:hidden pb-safe">
        <ul className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id} className="flex-1">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ÁREA CENTRAL DE CONTEÚDO (O Roteador) */}
      <main className="pt-20 md:pt-36 pb-24 md:pb-16 px-6 max-w-6xl mx-auto min-h-screen">
        <div className="animate-[fadeIn_0.4s_ease-out]">
          {activeTab === 'home' && <Home />}
          {activeTab === 'ranking' && <Ranking />}
          {activeTab === 'team' && <Equipe />}
          {activeTab === 'about' && <About />}
        </div>
      </main>
      
    </div>
  );
}