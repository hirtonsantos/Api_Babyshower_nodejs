<h1 align="center">API - BabyShower (node*)</h1>

<h2 align="center">Este é um backend complementar da aplicação BabyShower, que é uma plataforma em que os pais podem se cadastrar e interagir com outros pais que passam por fases de vida similares as suas. Nessa plataforma eles se cadastram e também cadastram produtos que não precisam mais.</h2>
<h3 align="center">Esta api é utilizada para cadastro de empresas e anúncios, upload de imagens na AWS, banco de dados para chat com socket.io** e cadastro de administradores de sistema da babyshower. Entretanto, as rotas para chat inicialmente desenvolvidas em python também foram mantidas nesta api.</h2>

\*Esta api foi desenvolvida em Node e funciona em conjunto com uma api principal desenvolvida em Python.

\*\*A implementação do socket.io nas rotas do chat ainda está em desenvolvimento.

Url base da API-python no heroku: [baseUrl](https://share-babyshower.herokuapp.com/api)

Url base da API-node no heroku: [baseUrlNode](https://share-babyshower-node.herokuapp.com)

Repositório da api principal em Python:[Api_Babyshower_nodejs](https://github.com/danielmsatiro/babyshower)

## Devs participantes:

- Daniel Mateus Satiro (Product Owner),
- Guilherme Couto (Scrum Master),
- Hirton Silva Evangelista Santos (Tech Lead),
- Pedro Basilio.

## Tecnologias Utilizadas

- Express;
- Typescript;
- ORM e PostgreSQL para relacionamentos entre tabelas;
- Criptografia e hashing;
- AWS (aws-sdk, multer, multer-S3);
- Swagger;
- Jest (Mais de 100 testes de integração entre as principais rotas);
- GitHub Actions (A cada pull request para a development ou a main os testes eram rodados mais uma vez);
- Heroku;
- socket.io (feature ainda em desenvolvimento).

<h2 align="center">Documentação</h2>

Link da documentação desta api: [Swagger](https://share-babyshower-node.herokuapp.com/api-documentation)
