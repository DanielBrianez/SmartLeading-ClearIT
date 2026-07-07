Feature: Smart Leading API behavior

  Scenario: generate a leadership roadmap from valid input
    Given a leader provides profile and delivery context
    When the /api/gerar-roteiro endpoint is called
    Then the API returns a structured roadmap text

  Scenario: register a download without exposing personal data
    Given a leader name and context are provided
    When the /api/registrar-download endpoint is called
    Then the log file stores an anonymized record and a confirmation status
