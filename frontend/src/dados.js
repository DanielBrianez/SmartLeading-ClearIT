import minhaFoto from './assets/daniel-foto.jpg';

export const LEADERS = [
'Selecione...', 
'Roberto Almeida', 
'Juliana Castro', 
'Marcos Vinícius',
'Thiago Mendes'
];

export const MENTEES = [
  'Selecione...', 
  'Carlos Eduardo', 
  'Ana Beatriz', 
  'João Pedro', 
  'Mariana Santos'
];

export const TEAM_MEMBERS = [
  { id: 1, name: 'Daniel Nascimento', role: 'Tech Lead', color: '2563EB', foto: minhaFoto },
  { id: 2, name: 'Bruno Costa', role: 'UX/UI Designer', color: '059669' },
  { id: 3, name: 'Carla Dias', role: 'Engenheira Front-end', color: '7C3AED' },
  { id: 4, name: 'Diego Silva', role: 'Engenheiro Back-end', color: 'DC2626' },
  { id: 5, name: 'Elena Souza', role: 'Product Manager', color: 'D97706' },
];

export const LEADERBOARD = [
  { id: 1, name: 'Roberto Almeida', role: 'Diretor de Engenharia', xp: 12500, avatar: 'RA' },
  { id: 2, name: 'Juliana Castro', role: 'Tech Lead', xp: 10200, avatar: 'JC' },
  { id: 3, name: 'Marcos Vinícius', role: 'Engineering Manager', xp: 9800, avatar: 'MV' },
  { id: 4, name: 'Fernanda Lima', role: 'Coordenadora de UX', xp: 7400, avatar: 'FL' },
  { id: 5, name: 'Thiago Mendes', role: 'Tech Lead', xp: 6100, avatar: 'TM' },
  ];

  // Adicione isso no final do seu src/dados.js

// Simulando o retorno de um Banco de Dados Relacional (Ex: PostgreSQL)
// src/dados.js (Substitua a constante DB_SQUADS)

// src/dados.js (Atualize a constante DB_SQUADS)

export const DB_SQUADS = {
  "daniel_nascimento": [
    { 
      id: 101, 
      nome: "Carlos Eduardo", 
      cargo: "Engenheiro Front-end", 
      senioridade: "Pleno", 
      time: "Squad Alpha",
      tempoCasa: "1 ano e 2 meses",
      ultimaReuniao: "2026-06-12",
      progresso: { engajamento: 85, tecnico: 70, metas: 50 },
      historicoAtas: [
        { data: "12 Jun 2026", pauta: "Alinhamento de entregas e feedback técnico." },
        { data: "28 Mai 2026", pauta: "Revisão de metas do trimestre." }
      ],
      tarefas: [
        { id: 1, descricao: "Finalizar curso de React Avançado", ddl: "2026-07-10", status: "pendente" },
        { id: 2, descricao: "Refatorar componente de Login", ddl: "2026-06-10", status: "concluida" },
        { id: 3, descricao: "Atualizar documentação do Storybook", ddl: "2026-06-25", status: "expirada" }
      ]
    },
    { 
      id: 102, 
      nome: "Ana Beatriz", 
      cargo: "Product Designer", 
      senioridade: "Sênior",
      time: "Squad Alpha",
      tempoCasa: "3 anos",
      ultimaReuniao: "2026-06-20",
      progresso: { engajamento: 95, tecnico: 85, metas: 100 },
      historicoAtas: [
        { data: "20 Jun 2026", pauta: "Apresentação do novo Design System." }
      ],
      tarefas: [
        { id: 4, descricao: "Aprovação do layout V2 com o cliente", ddl: "2026-07-05", status: "pendente" },
        { id: 5, descricao: "Testes de usabilidade da Home", ddl: "2026-06-15", status: "concluida" }
      ]
    }
  ]
};