import React, { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck, Users, Briefcase, Loader2, ArrowRight, Moon, Sun } from 'lucide-react';
import { salvarLGPD } from '../utils/security';
import logoImagem from '../assets/logo.png';
import logoBranca from '../assets/logo-branco.png';

export default function Login({ onLogin, isDarkMode, setIsDarkMode }){ 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // 🛡️ Nosso banco de dados MOCK para a apresentação
  const usuariosMock = {
    'daniel@clearit.com': { id: 'daniel_nascimento', nome: 'Daniel Nascimento', role: 'LIDER' },
    'carlos@clearit.com': { id: 'carlos_eduardo', nome: 'Carlos Eduardo', role: 'LIDERADO' },
    'camila@clearit.com': { id: 'camila_rh', nome: 'Camila Barros', role: 'RH' }
  };

  const executarLogin = async (emailLogin, senhaLogin = '123') => {
    setLoading(true);
    setErro('');

    // Simulando um tempo de resposta do servidor (pra dar aquele tchan na UI)
    setTimeout(() => {
      const usuario = usuariosMock[emailLogin];
      
      if (usuario && senhaLogin) {
        // Salva a sessão do usuário de forma blindada!
        salvarLGPD('@clearit-session', usuario);
        // Avisa o App.jsx que alguém logou
        onLogin(usuario);
      } else {
        setErro('E-mail ou senha inválidos. Tente usar os botões de acesso rápido.');
        setLoading(false);
      }
    }, 1200); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executarLogin(email, senha);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Background Decorativo Gringo */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      {/* 🌓 BOTÃO DARK MODE FLUTUANTE 🌓 */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 shadow-lg border border-slate-200 dark:border-slate-700 transition-all z-10"
        title="Alternar Tema"
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">

        <div className="flex flex-col items-center justify-center mb-10">
          <img 
            src={isDarkMode ? logoBranca : logoImagem} 
            alt="ClearIT Logo" 
            className="h-12 mb-6 transition-all"
          />
        </div>
        
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Smart Leading
        </h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          O ecossistema de alta performance da Clear IT.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-3xl sm:px-10 animate-[fadeIn_0.5s_ease-out]">
          
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                E-mail Corporativo
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="voce@clearit.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Senha
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {erro && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl text-center border border-red-200 dark:border-red-800">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {loading ? 'Autenticando...' : 'Entrar na Plataforma'}
            </button>
          </form>

          {/* ÁREA DE TESTE / APRESENTAÇÃO */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 font-semibold text-xs uppercase tracking-wider transition-colors">
                  Modo Apresentação (Demo)
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => executarLogin('daniel@clearit.com')}
                type="button"
                className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-200 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> Entrar como Líder
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
              </button>

              <button
                onClick={() => executarLogin('carlos@clearit.com')}
                type="button"
                className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-emerald-200 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" /> Entrar como Liderado
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
              </button>

              <button
                onClick={() => executarLogin('camila@clearit.com')}
                type="button"
                className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 hover:border-amber-200 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-500" /> Entrar como RH
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}