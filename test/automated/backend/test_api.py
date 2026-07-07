import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "backend"))

from fastapi.testclient import TestClient
from app import main as main_module

client = TestClient(main_module.app)


def test_gerar_roteiro_endpoint_uses_service(monkeypatch):
    monkeypatch.setattr(main_module, "gerar_roteiro_ia", lambda dados: "Roteiro teste")

    payload = {
        "perfil_lideranca": "Técnico",
        "senioridade_liderado": "Pleno",
        "tempo_casa": "2 anos",
        "perfil_comportamental": "Focado",
        "resumo_entregas": "Entrega de onboarding e revisão de fluxo"
    }

    response = client.post("/api/gerar-roteiro", json=payload)

    assert response.status_code == 200
    assert response.json() == {"roteiro": "Roteiro teste"}


def test_registrar_download_persists_anonymous_log(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    payload = {
        "lider": "Daniel Nascimento",
        "senioridade": "Pleno",
        "perfil_comportamental": "Focado"
    }

    response = client.post("/api/registrar-download", json=payload)

    assert response.status_code == 200

    log_path = tmp_path / "data" / "telemetry_logs.csv"
    assert log_path.exists()

    content = log_path.read_text(encoding="utf-8")
    assert "Sim" in content
    assert "daniel" not in content.lower()
    assert len(content.splitlines()) >= 2
