import { TEAM_MEMBERS } from '../dados';

export default function Equipe() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Nosso Time de Operações</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Conheça as pessoas por trás da tecnologia e estratégia da Clear IT.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member) => (
          <div 
            key={member.id} 
            className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 mb-4 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 group-hover:scale-105 transition-transform">
              <img 
                src={member.foto || `https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=${member.color}&color=fff&size=128&bold=true`}
                alt={member.name}
                className="w-full h-full rounded-full border-4 border-white dark:border-slate-800 object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {member.name}
            </h3>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}