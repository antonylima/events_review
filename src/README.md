# Sistema de Revisão de Eventos

## Descrição
Este sistema permite revisar eventos armazenados na tabela `events_raw` antes de serem publicados na tabela de produção `events`. Ele oferece uma interface web para aprovar ou rejeitar eventos com edição inline dos campos.

## Estrutura do Projeto
```
/src/
  ├── index.html          # Página principal
  ├── styles.css          # Estilos CSS
  ├── script.js           # Lógica frontend
  ├── api/
  │   ├── config.php      # Configuração do banco de dados
  │   ├── get_pending_events.php   # Obtém eventos pendentes
  │   ├── reject_event.php         # Rejeita um evento
  │   └── publish_events.php       # Publica eventos aprovados
  └── database.sql        # Schema do banco de dados
```

## Funcionalidades

### Frontend
- Carregamento de eventos com status PENDING
- Exibição em cards responsivos
- Edição inline dos campos
- Visualização do JSON original
- Aprovação/Rejeição individual de eventos
- Publicação em lote de eventos aprovados

### Backend
- Endpoints RESTful para todas as operações
- Conexão segura com MySQL via PDO
- Prepared statements para segurança
- Respostas JSON consistentes

## Configuração

1. **Importar o banco de dados**:
   Execute o script `database.sql` no seu servidor MySQL

2. **Configurar acesso ao banco**:
   Edite as constantes em `api/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'eventos_db');
   define('DB_USER', 'seu_usuario');
   define('DB_PASS', 'sua_senha');
   ```

3. **Servir os arquivos**:
   Coloque todos os arquivos em um servidor web com suporte a PHP

## Uso

1. Acesse `index.html` no navegador
2. Os eventos pendentes serão carregados automaticamente
3. Clique nos campos para editar informações
4. Use os botões "✅ Aprovar" ou "❌ Rejeitar" conforme necessário
5. Clique em "📤 Enviar Oficial" para publicar todos os eventos aprovados

## Endpoints da API

### GET `/api/get_pending_events.php`
Retorna todos os eventos com status PENDING

### POST `/api/reject_event.php`
Rejeita um evento específico
```json
{
  "id": 123
}
```

### POST `/api/publish_events.php`
Publica eventos aprovados
```json
{
  "events": [
    {
      "id": 123,
      "local": "Novo Local",
      ...
    }
  ]
}
```

## Segurança
- Todos os endpoints usam prepared statements
- Validação de dados no backend
- Sanitização de saída HTML
- Proteção contra XSS e SQL Injection

## Personalização
Para uso em produção:
1. Implementar autenticação de usuários
2. Substituir 'admin' pelo usuário logado
3. Adicionar logs de auditoria
4. Implementar paginação para grandes volumes de dados