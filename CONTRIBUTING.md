# Contribuindo com o LiftUp

Obrigado por considerar uma contribuição. Mudanças pequenas, focadas e acompanhadas de validação são mais fáceis de revisar.

## Ambiente local

Use Node.js 20 ou superior e instale os dois módulos a partir da raiz:

```bash
npm run setup
npm run check
```

Para desenvolver o aplicativo, execute `npm run mobile`. Para a API local, copie `backend/.env.example` para `backend/.env`, suba o PostgreSQL com Docker Compose e execute `npm run api`.

## Fluxo sugerido

1. Crie uma branch curta a partir de `main`, como `feat/workout-history`.
2. Mantenha cada pull request concentrado em um único problema.
3. Prefira commits objetivos no formato `tipo: resumo`, por exemplo `fix: preserve workout order`.
4. Execute `npm run check` antes de enviar.
5. Descreva no pull request o comportamento alterado e como ele foi validado.

Ao alterar uma regra de negócio, inclua ou atualize os testes correspondentes. Não versione `.env`, relatórios de cobertura, builds ou clientes gerados do Prisma.
