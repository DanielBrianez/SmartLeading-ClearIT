from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path
import os
import hashlib  # <--- IMPORTANTE: Importamos a lib de hashing

# 👇 Importando a nossa inteligência encapsulada!
from app.core.gemini import gerar_roteiro_ia

# ─── Importação do Módulo de Banco de Dados (NOVO) ───────────────────────────
# database.py gerencia toda a comunicação com o PostgreSQL Serverless (Supabase)
from app.core import database as db


# ═══════════════════════════════════════════════════════════════════════
# INICIALIZAÇÃO DA APLICAÇÃO FASTAPI
# ═══════════════════════════════════════════════════════════════════════
app = FastAPI(
    title="Smart Leading API — Clear IT",
    description=(
        "API backend do Smart Leading V2. "
        "Gerencia IA (Gemini), telemetria anonimizada e banco PostgreSQL (Supabase)."
    ),
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção trocar pelo domínio do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════════════
# EVENTO DE INICIALIZAÇÃO
# ═══════════════════════════════════════════════════════════════════════
@app.on_event("startup")
def ao_iniciar():
    """
    Executado automaticamente quando o servidor FastAPI é iniciado.
    Conecta ao PostgreSQL (Supabase) e cria as tabelas automaticamente.
    Se DATABASE_URL não estiver no .env, continua com fallback CSV.
    """
    print("🚀 Iniciando Smart Leading API v2.0...")
    if db.is_db_available():
        db.criar_tabelas()  # Cria as 4 tabelas se ainda não existirem
        print("🗄️  PostgreSQL (Supabase) conectado. Banco de dados pronto.")
    else:
        print("⚠️  DATABASE_URL não configurada. Usando fallback: data/telemetry_logs.csv")


# ═══════════════════════════════════════════════════════════════════════
# MODELOS DE DADOS (Pydantic)
# ═══════════════════════════════════════════════════════════════════════
# O FastAPI valida automaticamente o JSON recebido usando esses modelos.
# Se um campo estiver errado ou faltando, retorna erro 422 com detalhes.

class RoteiroRequest(BaseModel):
    perfil_lideranca: str
    senioridade_liderado: str
    tempo_casa: str
    perfil_comportamental: str
    resumo_entregas: str

class DownloadLogRequest(BaseModel):
    """Dados enviados quando um líder baixa uma ata de reunião em PDF."""
    lider: str                 # ID ou nome do líder — será convertido em hash antes de gravar
    senioridade: str           # Nível do liderado (ex: 'Pleno', 'Sênior')
    perfil_comportamental: str # Perfil DISC do liderado


class RitoRequest(BaseModel):
    """Dados para registrar o início de um novo rito de 1:1."""
    lider: str    # Será convertido em hash SHA-256 antes de gravar
    liderado: str # Será convertido em hash SHA-256 antes de gravar


class ValidarRitoRequest(BaseModel):
    """Respostas do liderado na validação bilateral do rito."""
    sentiu_clareza: bool       # Entendeu os combinados da reunião? True/False
    relevante_carreira: bool   # A reunião foi útil para o desenvolvimento? True/False


# ═══════════════════════════════════════════════════════════════════════
# FUNÇÃO AUXILIAR: CSV FALLBACK
# ═══════════════════════════════════════════════════════════════════════

def salvar_linha_log(linha_texto: str):
    """
    Grava uma linha no CSV data/telemetry_logs.csv.
    Usado como FALLBACK quando o banco PostgreSQL não está disponível.
    """
    pasta_logs = Path("data")
    os.makedirs("data", exist_ok=True)
    filepath = pasta_logs / "telemetry_logs.csv"
    
    if not filepath.exists():
        # Cabeçalho atualizado: Note que mudamos 'Lider' para 'Lider_Hash'
        cabecalho = "timestamp;lider_hash;senioridade;perfil_comportamental;ata_baixada\n"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(cabecalho)
            
    with open(filepath, "a", encoding="utf-8") as f:
        f.write(linha_texto)

# ═══════════════════════════════════════════════════════════════════════
# ENDPOINTS DA API
# ═══════════════════════════════════════════════════════════════════════


# ─── GET /api/health — Verificação de Status ───────────────────────────
@app.get("/api/health")
def health_check():
    """
    Verifica se a API e o banco de dados estão funcionando.
    Acesse no navegador: http://localhost:8000/api/health
    """
    banco_ok = db.is_db_available()
    return {
        "status"         : "online",
        "api_versao"     : "2.0.0",
        "banco_conectado": banco_ok,
        "banco_dados"    : "postgresql_supabase" if banco_ok else "csv_fallback",
    }


# ─── POST /api/gerar-roteiro — Geração de Roteiro com IA ───────────────
@app.post("/api/gerar-roteiro")
async def gerar_roteiro(dados: RoteiroRequest):
    try:
        texto_gerado = gerar_roteiro_ia(dados.model_dump())
        return {"roteiro": texto_gerado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── POST /api/registrar-download — Telemetria de Download de Ata ─────
@app.post("/api/registrar-download")
async def registrar_download(dados: DownloadLogRequest):
    """
    Registra a telemetria quando um líder baixa uma ata em PDF.
    1. Converte o nome do líder em hash SHA-256 (LGPD — sem dados pessoais)
    2. Tenta gravar no PostgreSQL (Supabase) — fonte primária
    3. Se o banco não estiver disponível → grava no CSV como fallback
    Conforme ADR 0003: apenas timestamp, hash, senioridade e perfil DISC são persistidos.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # LGPD: Converte o ID do líder em hash de 12 chars — identifica padrões sem revelar identidade
    lider_hash = hashlib.sha256(dados.lider.encode()).hexdigest()[:12]
    
    # Monta a linha usando o HASH em vez do nome original
    log_line = f"{timestamp};{lider_hash};{dados.senioridade};{dados.perfil_comportamental};Sim\n"
    salvar_linha_log(log_line)
        
    return {"status": "sucesso"}