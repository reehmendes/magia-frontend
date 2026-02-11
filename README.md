# magia-frontend

POC frontend em Angular (standalone component) para o atendimento MAGIA de solicitação de benefício por falecimento.

## Como rodar

```bash
npm install
npm start
```

A aplicação sobe em `http://localhost:4200`.

## O que está implementado

- Tela única em dark mode com identidade corporativa
- Fase 1: conversa empática sem coleta de dados sensíveis
- Fase 2: evento de anexo com bloqueio de chat durante validação
- Estados visuais: aguardando documento, validando, válido e inválido
- Mock de backend com resposta no formato:

```json
{
  "valid": true,
  "score": 96,
  "messages": ["..."]
}
```
