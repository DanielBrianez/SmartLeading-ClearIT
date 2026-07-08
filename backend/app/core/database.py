"""
╔══════════════════════════════════════════════════════════════════════════╗
║    database.py — Módulo de Conexão com PostgreSQL Serverless (Supabase) ║
║                                                                          ║
║  Este arquivo é o "coração" do banco de dados do projeto.               ║
║  Ele faz 4 coisas principais:                                            ║
║    1. Conecta com o banco Supabase usando a variável DATABASE_URL        ║
║    2. Cria as tabelas automaticamente na primeira execução               ║
║    3. Grava telemetria (antes era no CSV, agora vai para o PostgreSQL)   ║
║    4. Fornece as métricas reais para o Painel do RH                      ║
║                                                                          ║
║  LGPD (Privacidade): Apenas metadados anonimizados são guardados aqui.  ║
║  Atas, PDIs e feedbacks ficam no localStorage do navegador (ADR 0001).  ║
║  O banco só guarda hashes, timestamps e flags booleanos (ADR 0003).     ║
╚══════════════════════════════════════════════════════════════════════════╝
"""

import os
from contextlib import contextmanager
from dotenv import load_dotenv

# ─── Importação segura do driver do PostgreSQL ───────────────────────────────
# Tentamos importar o psycopg2. Se não estiver instalado, o sistema continua
# funcionando com o fallback CSV (sem quebrar a aplicação).
try:
    import psycopg2
    import psycopg2.extras   # Extensão que retorna resultados como dicionários
    _PSYCOPG2_DISPONIVEL = True
except ImportError:
    _PSYCOPG2_DISPONIVEL = False

# Carrega as variáveis do arquivo .env (DATABASE_URL, GEMINI_API_KEY etc.)
load_dotenv()

# ─── URL de conexão com o Supabase ───────────────────────────────────────────
# Lida do arquivo .env. Formato:
# postgresql://postgres:SENHA@db.PROJETO.supabase.co:5432/postgres
DATABASE_URL = os.environ.get("DATABASE_URL")


# ═══════════════════════════════════════════════════════════════════════════════
# SEÇÃO 1: VERIFICAÇÃO DE DISPONIBILIDADE
# ═══════════════════════════════════════════════════════════════════════════════

def is_db_available() -> bool:
    """
    Testa se o banco de dados está disponível e acessível.

    Essa função é chamada ANTES de qualquer operação no banco para
    garantir que a conexão existe. Se não existir, o sistema usa o CSV.

    Retorna:
        True  → banco configurado e acessível (usa PostgreSQL)
        False → DATABASE_URL não definida ou banco inacessível (usa CSV)
    """
    # Se o driver não está instalado ou a URL não foi configurada, retorna False
    if not _PSYCOPG2_DISPONIVEL or not DATABASE_URL:
        return False

    try:
        # Tenta abrir uma conexão de teste com timeout de 5 segundos
        conn = psycopg2.connect(DATABASE_URL, connect_timeout=5)
        conn.close()
        return True
    except Exception:
        # Qualquer erro (senha errada, host inacessível etc.) retorna False
        return False


# ═══════════════════════════════════════════════════════════════════════════════
# SEÇÃO 2: GERENCIADOR DE CONEXÃO
# ═══════════════════════════════════════════════════════════════════════════════

@contextmanager
def get_connection():
    """
    Gerenciador de contexto para conexões com o banco de dados.

    Um "context manager" garante que a conexão seja sempre fechada
    corretamente, mesmo se ocorrer um erro durante a operação.

    Como usar no código:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM telemetry_logs")
                resultado = cursor.fetchall()

    O que ele faz automaticamente:
        commit()   → confirma as gravações bem-sucedidas
        rollback() → desfaz tudo se houver qualquer erro
        close()    → sempre fecha a conexão ao final
    """
    conn = psycopg2.connect(DATABASE_URL)
    try:
        yield conn            # ← Entrega a conexão para quem chamou
        conn.commit()         # ✅ Confirma todas as operações (INSERT, UPDATE etc.)
    except Exception:
        conn.rollback()       # ❌ Desfaz tudo em caso de erro — evita dados corrompidos
        raise                 # Re-lança o erro para ser tratado pelo endpoint
    finally:
        conn.close()          # 🔒 Sempre fecha a conexão (libera recursos do servidor)


# ═══════════════════════════════════════════════════════════════════════════════
# SEÇÃO 3: CRIAÇÃO AUTOMÁTICA DAS TABELAS
# ═══════════════════════════════════════════════════════════════════════════════

def criar_tabelas():
    """
    Cria todas as tabelas do Smart Leading no banco Supabase.

    Usa o comando SQL "CREATE TABLE IF NOT EXISTS" — isso significa:
    - Na PRIMEIRA execução: cria as tabelas do zero
    - Nas execuções SEGUINTES: não faz nada (tabelas já existem)

    Esta função é chamada automaticamente quando a API FastAPI inicia,
    então você nunca precisa chamar ela manualmente.

    Tabelas criadas:
        1. telemetry_logs → Substitui o arquivo data/telemetry_logs.csv
        2. ritos          → Sessões de 1:1 com validação bilateral (ADR 0004)
        3. usuarios       → Perfis de acesso para autenticação futura (F-23)
        4. risk_signals   → Alertas de risco para o Painel do RH
    """

    # SQL DDL (Data Definition Language) — define a estrutura das tabelas
    sql_criar_tabelas = """

    -- ══════════════════════════════════════════════════════════════
    -- TABELA 1: telemetry_logs
    -- ══════════════════════════════════════════════════════════════
    -- Substitui e migra o arquivo CSV data/telemetry_logs.csv para o banco.
    -- Guarda apenas metadados anonimizados — SEM nomes, SEM textos de atas.
    -- Conforme ADR 0003: Telemetria de Metadados e Pseudonimização.
    CREATE TABLE IF NOT EXISTS telemetry_logs (

        -- SERIAL = número inteiro que cresce automaticamente (1, 2, 3...)
        -- PRIMARY KEY = identifica cada linha de forma única
        id                    SERIAL       PRIMARY KEY,

        -- TIMESTAMPTZ = data + hora + fuso horário
        -- DEFAULT NOW() = preenche automaticamente com a hora atual
        timestamp             TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

        -- Hash SHA-256 truncado do ID do líder — identifica padrões, não pessoas
        -- VARCHAR(12) = texto de até 12 caracteres
        lider_hash            VARCHAR(12)  NOT NULL,

        -- Nível profissional do liderado: 'Júnior', 'Pleno', 'Sênior', 'Trainee' etc.
        senioridade           VARCHAR(50)  NOT NULL,

        -- Perfil comportamental DISC: 'Dominante', 'Influente', 'Estável', 'Cauteloso'
        perfil_comportamental VARCHAR(50)  NOT NULL,

        -- BOOLEAN = verdadeiro/falso. Sempre TRUE quando registrado via download.
        ata_baixada           BOOLEAN      NOT NULL DEFAULT TRUE,

        -- Data de inserção no banco (diferente do timestamp do evento)
        criado_em             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    -- ══════════════════════════════════════════════════════════════
    -- TABELA 2: ritos
    -- ══════════════════════════════════════════════════════════════
    -- Registra cada sessão de reunião 1:1 com seu status de validação.
    -- O liderado confirma se a reunião foi clara e relevante para a carreira.
    -- Conforme ADR 0004 e especificações F-06 / F-16.
    CREATE TABLE IF NOT EXISTS ritos (

        -- UUID = identificador universal único (ex: "550e8400-e29b-41d4-a716...")
        -- gen_random_uuid() = gera automaticamente um UUID aleatório
        id                 UUID         DEFAULT gen_random_uuid() PRIMARY KEY,

        -- Hash único gerado para identificar este rito no frontend
        -- UNIQUE = não permite dois ritos com o mesmo hash
        rito_hash          VARCHAR(64)  UNIQUE NOT NULL,

        lider_hash         VARCHAR(12)  NOT NULL,  -- Hash do líder (sem nome real)
        liderado_hash      VARCHAR(12)  NOT NULL,  -- Hash do liderado (sem nome real)

        -- Status do fluxo bilateral:
        -- 'pendente'  = rito criado, aguardando validação do liderado
        -- 'concluido' = liderado respondeu as perguntas de validação
        status             VARCHAR(20)  NOT NULL DEFAULT 'pendente',

        -- NULL = ainda não respondido. TRUE/FALSE = resposta do liderado.
        sentiu_clareza     BOOLEAN      NULL,  -- Entendeu os combinados da reunião?
        relevante_carreira BOOLEAN      NULL,  -- A reunião foi útil para a carreira?

        criado_em          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        validado_em        TIMESTAMPTZ  NULL    -- Preenchido quando o liderado valida
    );

    -- ══════════════════════════════════════════════════════════════
    -- TABELA 3: usuarios
    -- ══════════════════════════════════════════════════════════════
    -- Perfis de acesso ao sistema para autenticação futura (F-23).
    -- A senha NUNCA é guardada em texto puro — sempre como hash bcrypt.
    -- Por segurança (OWASP), mesmo que o banco seja comprometido,
    -- as senhas originais não podem ser descobertas.
    CREATE TABLE IF NOT EXISTS usuarios (

        id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
        username      VARCHAR(100) UNIQUE NOT NULL,  -- Login único (ex: 'daniel_nascimento')
        password_hash VARCHAR(255) NOT NULL,         -- Senha como hash — NUNCA texto puro

        -- Papel do usuário no sistema:
        -- 'lider'    = acessa Home, MeuSquad, PDI, Ranking
        -- 'liderado' = acessa HomeLiderado para validação bilateral
        -- 'rh'       = acessa PainelRH com métricas agregadas
        role          VARCHAR(20)  NOT NULL DEFAULT 'lider',

        area          VARCHAR(100) NULL,             -- Área da empresa (ex: 'Engenharia')
        criado_em     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    -- ══════════════════════════════════════════════════════════════
    -- TABELA 4: risk_signals
    -- ══════════════════════════════════════════════════════════════
    -- Sinalizações de risco geradas pelo sistema para o Painel do RH.
    -- Permite que o RH identifique áreas com problemas de liderança
    -- sem acessar o conteúdo privado das reuniões.
    CREATE TABLE IF NOT EXISTS risk_signals (

        id           SERIAL       PRIMARY KEY,
        area         VARCHAR(100) NOT NULL,   -- Área da empresa (ex: 'Engenharia Backend')
        lider_hash   VARCHAR(12)  NOT NULL,   -- Hash do líder (sem identificar quem é)

        -- Tipo de risco detectado pelo sistema:
        -- 'cadencia_baixa'       = líder sem reuniões há mais de 15 dias
        -- 'pdi_inativo'          = PDI sem atualização há muito tempo
        -- 'validacao_pendente'   = rito aguardando validação do liderado
        tipo_risco   VARCHAR(100) NOT NULL,

        -- Nível de urgência do risco para o RH
        severidade   VARCHAR(20)  NOT NULL DEFAULT 'medio',  -- 'baixo' | 'medio' | 'alto'

        criado_em    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        resolvido_em TIMESTAMPTZ  NULL  -- Preenchido quando o risco é solucionado
    );

    """

    # Executa o SQL de criação das tabelas no banco
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql_criar_tabelas)

    print("✅ Tabelas do PostgreSQL (Supabase) verificadas/criadas com sucesso.")
    print("   → telemetry_logs | ritos | usuarios | risk_signals")


# ═══════════════════════════════════════════════════════════════════════════════
# SEÇÃO 4: FUNÇÕES DE ESCRITA (gravar dados no banco)
# ═══════════════════════════════════════════════════════════════════════════════

def salvar_telemetria_db(lider_hash: str, senioridade: str, perfil_comportamental: str):
    """
    Grava um registro de telemetria no banco PostgreSQL.

    Substitui a gravação no arquivo CSV data/telemetry_logs.csv.
    É chamada pelo endpoint POST /api/registrar-download no main.py.

    Parâmetros:
        lider_hash (str)            : Hash SHA-256 truncado (12 chars) do ID do líder
        senioridade (str)           : Nível do liderado (ex: 'Pleno', 'Sênior')
        perfil_comportamental (str) : Perfil DISC (ex: 'Dominante', 'Influente')
    """
    # %s são "placeholders" — o psycopg2 preenche com segurança os valores
    # Isso evita SQL Injection (ataque OWASP A03) automaticamente
    sql = """
        INSERT INTO telemetry_logs (lider_hash, senioridade, perfil_comportamental, ata_baixada)
        VALUES (%s, %s, %s, TRUE)
    """
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, (lider_hash, senioridade, perfil_comportamental))


def criar_rito_db(rito_hash: str, lider_hash: str, liderado_hash: str) -> str:
    """
    Cria um novo registro de rito de 1:1 com status 'pendente'.

    É chamada pelo endpoint POST /api/ritos quando o líder finaliza a reunião
    e solicita a validação bilateral do liderado.

    Parâmetros:
        rito_hash     (str): Hash único gerado para identificar este rito
        lider_hash    (str): Hash do líder (sem nome real)
        liderado_hash (str): Hash do liderado (sem nome real)

    Retorna:
        rito_hash (str): O mesmo hash de entrada, para uso pelo frontend
    """
    sql = """
        INSERT INTO ritos (rito_hash, lider_hash, liderado_hash, status)
        VALUES (%s, %s, %s, 'pendente')
        ON CONFLICT (rito_hash) DO NOTHING
    """
    # ON CONFLICT DO NOTHING = se o rito_hash já existir, não faz nada
    # Isso evita duplicatas se o endpoint for chamado duas vezes por acidente
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, (rito_hash, lider_hash, liderado_hash))
    return rito_hash


def validar_rito_db(rito_hash: str, sentiu_clareza: bool, relevante_carreira: bool) -> bool:
    """
    Atualiza o status de um rito para 'concluido' após a resposta do liderado.

    É chamada pelo endpoint PUT /api/ritos/{rito_hash}/validar.

    Parâmetros:
        rito_hash          (str) : Identificador do rito a ser validado
        sentiu_clareza     (bool): Liderado entendeu os combinados? True/False
        relevante_carreira (bool): Reunião foi útil para a carreira? True/False

    Retorna:
        True  → rito encontrado e atualizado com sucesso
        False → rito não encontrado ou já foi validado anteriormente
    """
    sql = """
        UPDATE ritos
        SET
            status             = 'concluido',
            sentiu_clareza     = %s,
            relevante_carreira = %s,
            validado_em        = NOW()
        WHERE rito_hash = %s
          AND status = 'pendente'
    """
    # A cláusula AND status = 'pendente' garante que um rito já validado
    # não possa ser alterado novamente (imutabilidade da validação)
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, (sentiu_clareza, relevante_carreira, rito_hash))
            # cursor.rowcount indica quantas linhas foram modificadas pelo UPDATE
            return cursor.rowcount > 0


# ═══════════════════════════════════════════════════════════════════════════════
# SEÇÃO 5: FUNÇÕES DE LEITURA (consultar dados para o Painel do RH)
# ═══════════════════════════════════════════════════════════════════════════════

def get_metricas_rh() -> dict:
    """
    Consulta o banco e retorna métricas agregadas para o Painel do RH.

    Conforme ADR 0003: o RH vê APENAS estatísticas e porcentagens.
    Nenhum nome real, ata ou PDI textual é exposto nesta função.

    Retorna um dicionário com:
        total_atas              : Total de atas baixadas por todos os líderes
        total_lideres_ativos    : Quantidade de líderes únicos no sistema
        atas_por_senioridade    : Lista com contagem por nível (Júnior, Pleno, Sênior...)
        atas_por_perfil_disc    : Lista com contagem por perfil comportamental DISC
        taxa_validacao_bilateral: Percentual de ritos com validação do liderado concluída
        irc_medio               : Índice de Relevância de Carreira (% de ritos relevantes)
        fonte                   : 'postgresql_supabase' (confirma que veio do banco)
    """
    with get_connection() as conn:
        # RealDictCursor faz os resultados virem como dicionários Python
        # Em vez de tuplas (0, 'Pleno', 5), recebemos {'senioridade': 'Pleno', 'quantidade': 5}
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:

            # ── Métrica 1: Total de atas baixadas ──
            cursor.execute("SELECT COUNT(*) AS total FROM telemetry_logs")
            total_atas = cursor.fetchone()["total"]

            # ── Métrica 2: Líderes únicos ativos ──
            # COUNT(DISTINCT ...) conta valores diferentes — cada líder conta uma vez
            cursor.execute(
                "SELECT COUNT(DISTINCT lider_hash) AS total FROM telemetry_logs"
            )
            total_lideres = cursor.fetchone()["total"]

            # ── Métrica 3: Atas por nível de senioridade ──
            # GROUP BY agrupa as linhas iguais e COUNT conta quantas há em cada grupo
            cursor.execute("""
                SELECT senioridade, COUNT(*) AS quantidade
                FROM telemetry_logs
                GROUP BY senioridade
                ORDER BY quantidade DESC
            """)
            atas_por_senioridade = [dict(row) for row in cursor.fetchall()]

            # ── Métrica 4: Atas por perfil comportamental DISC ──
            cursor.execute("""
                SELECT perfil_comportamental, COUNT(*) AS quantidade
                FROM telemetry_logs
                GROUP BY perfil_comportamental
                ORDER BY quantidade DESC
            """)
            atas_por_perfil = [dict(row) for row in cursor.fetchall()]

            # ── Métrica 5: Taxa de validação bilateral dos ritos ──
            # FILTER (WHERE ...) conta apenas as linhas que atendem à condição
            cursor.execute("""
                SELECT
                    COUNT(*) FILTER (WHERE status = 'concluido') AS concluidos,
                    COUNT(*)                                      AS total
                FROM ritos
            """)
            linha_ritos  = cursor.fetchone()
            total_ritos  = linha_ritos["total"]     or 0
            concluidos   = linha_ritos["concluidos"] or 0
            # Cálculo da taxa: (concluídos / total) * 100, com 1 casa decimal
            taxa_validacao = (
                round((concluidos / total_ritos * 100), 1) if total_ritos > 0 else 0.0
            )

            # ── Métrica 6: IRC — Índice de Relevância de Carreira ──
            # Percentual de ritos em que o liderado considerou relevante para a carreira
            cursor.execute("""
                SELECT
                    COUNT(*) FILTER (WHERE relevante_carreira = TRUE) AS relevantes,
                    COUNT(*) FILTER (WHERE relevante_carreira IS NOT NULL) AS respondidos
                FROM ritos
            """)
            linha_irc   = cursor.fetchone()
            respondidos = linha_irc["respondidos"] or 0
            relevantes  = linha_irc["relevantes"]  or 0
            irc_medio   = (
                round((relevantes / respondidos * 100), 1) if respondidos > 0 else 0.0
            )

    return {
        "total_atas"              : total_atas,
        "total_lideres_ativos"    : total_lideres,
        "atas_por_senioridade"    : atas_por_senioridade,
        "atas_por_perfil_disc"    : atas_por_perfil,
        "taxa_validacao_bilateral": taxa_validacao,
        "irc_medio"               : irc_medio,
        "fonte"                   : "postgresql_supabase"
    }
