# Desafio Chat Super Agentes

Como pedido pelos requisitos do desafio, a presenta aplicação foi feita utilizando Next.js para frontend e backend, utilizando-se também a biblioteca de componentes ChakraUI, e o ORM Prisma, afim de cooperar no desenvolvimento do código e entrega do projeto.

O chat desenvolvido se comunica com o modelo de linguagem da OpenAI, além de utilizar Google Vision para a interpretação de imagens enviadas pelo usuário.

Todas as conversas e mensagens são armazenadas em um banco de dados PostgreSQL, afim de prover um histórico das conversas para dar profundidade às interações do usuário.

Além disso, para o processamento de arquivos, implementou-se uma fila de processamento para arquivos .TXT utilizando-se o BullMQ, no qual armazena a interpretação do conteúdo de cada arquivo anexado para incluir no contexto da presente conversa.

A aplicação está hospedada na AWS, utilizando-se juntamente o GitHub Actions para entrega contínua da última versão estável do código implementado. O link da aplicação foi passado para o avaliador responsável.

## Como Iniciar o Projeto Localmente
1. Certifique-se que o Docker esteja instalado e em execução;
2. No diretório raiz do projeto, execute o seguinte comando:
```bash
docker-compose up
```
3. A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

## Configurações Necessárias
Para executar a aplicação localmente é necessário configurar algumas variáveis de ambientes:
- DATABASE_URL
- GOOGLE_VISION_CREDENTIALS
- OPENAI_API_KEY
- REDIS_HOST
- REDIS_PORT
- REDIS_USERNAME
- REDIS_PASSWORD

