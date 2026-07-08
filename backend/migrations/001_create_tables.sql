-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  001_create_tables.sql — Schema do Smart Leading V2 (ClearIT)  ║
-- ║                                                                  ║
-- ║  Como usar este arquivo:                                         ║
-- ║    Opção A (Automático): As tabelas são criadas automaticamente  ║
-- ║    quando a API FastAPI inicia (função criar_tabelas() em        ║
-- ║    backend/app/core/database.py).                                ║
-- ║                                                                  ║
-- ║    Opção B (Manual): Cole este SQL no Supabase SQL Editor        ║
-- ║    → Dashboard do projeto → SQL Editor → New Query              ║
-- ║    → Cole o conteúdo abaixo → Clique em Run                     ║
-- ╚══════════════════════════════════════════════════════════════════╝


-- ════════════════════════════════════════════════════════════════════
-- TABELA 1: telemetry_logs
-- ════════════════════════════════════════════════════════════════════
-- Substitui o arquivo CSV data/telemetry_logs.csv
-- Persiste metadados anonimizados de cada ata de 1:1 baixada.
-- Conforme ADR 0003: Telemetria de Metadados e Pseudonimização
-- Campos:
--   id                    → ID auto-incrementado
--   timestamp             → Data/hora do evento de download
--   lider_hash            → SHA-256 truncado (12 chars) do ID do líder — sem PII
--   senioridade           → Nível do liderado (Júnior, Pleno, Sênior, Trainee)
--   perfil_comportamental → Perfil DISC do liderado (Dominante, Influente, Estável, Cauteloso)
--   ata_baixada           → Flag booleano — sempre TRUE quando inserido via download
--   criado_em             → Timestamp de inserção no banco
CREATE TABLE IF NOT EXISTS telemetry_logs (
    id                    SERIAL       PRIMARY KEY,
    timestamp             TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    lider_hash            VARCHAR(12)  NOT NULL,
    senioridade           VARCHAR(50)  NOT NULL,
    perfil_comportamental VARCHAR(50)  NOT NULL,
    ata_baixada           BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Índice para acelerar consultas por líder (Painel do RH)
CREATE INDEX IF NOT EXISTS idx_telemetry_lider_hash
    ON telemetry_logs (lider_hash);

-- Índice para consultas por período de tempo
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp
    ON telemetry_logs (timestamp DESC);


-- ════════════════════════════════════════════════════════════════════
-- TABELA 2: ritos
-- ════════════════════════════════════════════════════════════════════
-- Registra cada sessão de reunião 1:1 com seu ciclo de validação bilateral.
-- O líder cria o rito → o liderado valida → sistema libera XP.
-- Conforme ADR 0004 e especificações F-06 / F-16.
-- Campos:
--   id                 → UUID gerado automaticamente
--   rito_hash          → Identificador único enviado ao frontend (32 chars)
--   lider_hash         → Hash do líder — sem nome real
--   liderado_hash      → Hash do liderado — sem nome real
--   status             → 'pendente' (aguardando validação) | 'concluido' (validado)
--   sentiu_clareza     → Resposta do liderado: entendeu os combinados? (NULL até validar)
--   relevante_carreira → Resposta do liderado: foi útil para carreira? (NULL até validar)
--   criado_em          → Quando o rito foi criado
--   validado_em        → Quando o liderado validou (NULL enquanto pendente)
CREATE TABLE IF NOT EXISTS ritos (
    id                 UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
    rito_hash          VARCHAR(64)  UNIQUE NOT NULL,
    lider_hash         VARCHAR(12)  NOT NULL,
    liderado_hash      VARCHAR(12)  NOT NULL,
    status             VARCHAR(20)  NOT NULL DEFAULT 'pendente',
    sentiu_clareza     BOOLEAN      NULL,
    relevante_carreira BOOLEAN      NULL,
    criado_em          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    validado_em        TIMESTAMPTZ  NULL,

    -- Restrição: status só pode ser 'pendente' ou 'concluido'
    CONSTRAINT chk_status CHECK (status IN ('pendente', 'concluido'))
);

-- Índice para buscar ritos por líder
CREATE INDEX IF NOT EXISTS idx_ritos_lider_hash
    ON ritos (lider_hash);

-- Índice para buscar ritos por liderado (usado no HomeLiderado.jsx)
CREATE INDEX IF NOT EXISTS idx_ritos_liderado_hash
    ON ritos (liderado_hash);

-- Índice para filtrar ritos pendentes rapidamente
CREATE INDEX IF NOT EXISTS idx_ritos_status
    ON ritos (status);


-- ════════════════════════════════════════════════════════════════════
-- TABELA 3: usuarios
-- ════════════════════════════════════════════════════════════════════
-- Perfis de acesso ao sistema para autenticação RBAC futura (F-23).
-- Implementação atual: hardcoded como 'daniel_nascimento'.
-- Esta tabela é a base para o próximo sprint de autenticação.
-- Campos:
--   id            → UUID gerado automaticamente
--   username      → Login único no sistema (ex: 'daniel_nascimento')
--   password_hash → Senha como hash bcrypt — NUNCA armazenar senha em texto puro!
--   role          → Papel: 'lider', 'liderado' ou 'rh'
--   area          → Área da empresa (ex: 'Engenharia', 'Produto', 'Design')
--   criado_em     → Data de criação da conta
CREATE TABLE IF NOT EXISTS usuarios (
    id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
    username      VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'lider',
    area          VARCHAR(100) NULL,
    criado_em     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- Restrição: role só pode ser um dos três valores definidos
    CONSTRAINT chk_role CHECK (role IN ('lider', 'liderado', 'rh'))
);


-- ════════════════════════════════════════════════════════════════════
-- TABELA 4: risk_signals
-- ════════════════════════════════════════════════════════════════════
-- Sinalizações de risco para o Painel do RH.
-- Permite que o RH identifique áreas problemáticas sem acessar
-- o conteúdo privado das reuniões (ADR 0003).
-- Campos:
--   id           → ID auto-incrementado
--   area         → Área da empresa onde o risco foi detectado
--   lider_hash   → Hash do líder em risco (sem identificar quem é)
--   tipo_risco   → Categoria do risco detectado
--   severidade   → Nível de urgência: 'baixo', 'medio', 'alto'
--   criado_em    → Quando o risco foi detectado
--   resolvido_em → Quando o risco foi resolvido (NULL se ainda ativo)
CREATE TABLE IF NOT EXISTS risk_signals (
    id           SERIAL       PRIMARY KEY,
    area         VARCHAR(100) NOT NULL,
    lider_hash   VARCHAR(12)  NOT NULL,
    tipo_risco   VARCHAR(100) NOT NULL,
    severidade   VARCHAR(20)  NOT NULL DEFAULT 'medio',
    criado_em    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    resolvido_em TIMESTAMPTZ  NULL,

    -- Restrição: severidade só pode ser um dos três valores
    CONSTRAINT chk_severidade CHECK (severidade IN ('baixo', 'medio', 'alto'))
);

-- Índice para buscar sinais ativos (não resolvidos) rapidamente
CREATE INDEX IF NOT EXISTS idx_risk_signals_ativo
    ON risk_signals (resolvido_em)
    WHERE resolvido_em IS NULL;
