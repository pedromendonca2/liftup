# Monetização desativada

O LiftUp não carrega anúncios no fluxo atual. A decisão reduz dependências nativas, tempo de inicialização e interrupções durante a sessão de treino.

Os componentes `AdBanner` e `AdInterstitial` permanecem apenas como stubs de compatibilidade enquanto referências de versões antigas desaparecem do histórico ativo. Não adicione IDs ou credenciais de publicidade ao repositório.

Se monetização voltar a fazer parte do produto, ela deve entrar em uma proposta separada contendo:

- consentimento e política de privacidade;
- IDs distintos por plataforma e ambiente;
- testes com unidades oficiais de desenvolvimento;
- medição do impacto sobre retenção e duração da sessão;
- remoção completa dos stubs anteriores.
