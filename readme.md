# eits-ng-starter

Instale o pacote globalmente: `npm install -g eits-ng-starter`

## Migrar um package.json para o eits-ng-starter

Para substituir todas as dependências automaticamente, execute: (use o "Node.js command prompt" se você usar Windows)
```bash
eits-ng-starter caminho/para/package.json
```

(eits only) para atualizar todos os microserviços, execute este comando em sua pasta `microservices/functional`:
```bash
find . -path "*/ts/package.json" -exec eits-ng-starter {} +
```

O script só atualizará um package.json se ele já estiver usando Angular 4, então os projetos legado, com Angular 2, não
serão afetados. Você precisa atualizá-los manualmente para o Angular 4 antes.