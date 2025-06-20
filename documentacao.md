Documentação da API Drip Store
Base URL: http://localhost:3000/v1

Usuários
1. Obter usuário por ID
GET /user/:id

Response 200 OK

json
Copiar
Editar
{
  "id": 1,
  "firstname": "user firstname",
  "surname": "user surname",
  "email": "user@mail.com"
}
Response 404 Not Found
Usuário não encontrado.

2. Criar usuário
POST /user

Headers
Content-Type: application/json

Body

json
Copiar
Editar
{
  "firstname": "user firstname",
  "surname": "user surname",
  "email": "user@mail.com",
  "password": "123@123",
  "confirmPassword": "123@123"
}
Response 201 Created
Usuário criado com sucesso.

Response 400 Bad Request
Dados inválidos ou campos faltando.

3. Atualizar usuário
PUT /user/:id

Headers
Content-Type: application/json
Authorization: Bearer <token>

Body

json
Copiar
Editar
{
  "firstname": "user firstname",
  "surname": "user surname",
  "email": "user@mail.com"
}
Response 204 No Content
Atualização realizada com sucesso, sem corpo de resposta.

Response 400 Bad Request
Dados inválidos.

Response 401 Unauthorized
Token faltando ou inválido.

Response 404 Not Found
Usuário não encontrado.

4. Deletar usuário
DELETE /user/:id

Headers
Content-Type: application/json
Authorization: Bearer <token>

Response 204 No Content
Usuário deletado com sucesso.

Response 401 Unauthorized
Token faltando ou inválido.

Response 404 Not Found
Usuário não encontrado.

5. Gerar token JWT
POST /user/token

Headers
Content-Type: application/json

Body

json
Copiar
Editar
{
  "email": "user@mail.com",
  "password": "123@123"
}
Response 200 OK

json
Copiar
Editar
{
  "token": "<JWT>"
}
Response 400 Bad Request
Dados inválidos ou faltando.

Categorias
1. Buscar categorias
GET /category/search

Query Params (opcionais):

Param	Descrição	Padrão
limit	Número de itens por página (-1 para todos)	12
page	Página da busca	1
fields	Campos a retornar (ex: name,slug)	Todos
use_in_menu	Filtra categorias visíveis no menu	Todos

Response 200 OK

json
Copiar
Editar
{
  "data": [
    {
      "id": 1,
      "name": "Shoes",
      "slug": "shoes",
      "use_in_menu": true
    }
  ],
  "total": 10,
  "limit": 12,
  "page": 1
}
Response 400 Bad Request
Parâmetros inválidos.

2. Obter categoria por ID
GET /category/:id

Response 200 OK

json
Copiar
Editar
{
  "id": 1,
  "name": "Shoes",
  "slug": "shoes",
  "use_in_menu": true
}
Response 404 Not Found

3. Criar categoria
POST /category

Headers
Content-Type: application/json
Authorization: Bearer <token>

Body

json
Copiar
Editar
{
  "name": "Shoes",
  "slug": "shoes",
  "use_in_menu": true
}
Response 201 Created

Response 400 Bad Request

Response 401 Unauthorized

4. Atualizar categoria
PUT /category/:id

Headers
Content-Type: application/json
Authorization: Bearer <token>

Body

json
Copiar
Editar
{
  "name": "Shoes Atualizado",
  "slug": "shoes-atualizado",
  "use_in_menu": true
}
Response 204 No Content

Response 400 Bad Request

Response 401 Unauthorized

Response 404 Not Found

5. Deletar categoria
DELETE /category/:id

Headers
Content-Type: application/json
Authorization: Bearer <token>

Response 204 No Content

Response 401 Unauthorized

Response 404 Not Found

Produtos
1. Buscar produtos
GET /product/search

Query Params (opcionais):

Param	Descrição	Padrão
limit	Número de itens por página (-1 para todos)	12
page	Página	1
fields	Campos a retornar (ex: name,images,price)	Todos
match	Filtra pelo nome ou descrição	-
category_ids	Filtra por IDs de categorias (ex: 1,2,3)	-
price-range	Filtra por preço (ex: 100-200)	-
option[id]	Filtra por opções (ex: option[45]=GG,PP)	-

Response 200 OK

json
Copiar
Editar
{
  "data": [
    {
      "id": 1,
      "enabled": true,
      "name": "Produto 01",
      "slug": "produto-01",
      "stock": 10,
      "description": "Descrição do produto 01",
      "price": 119.9,
      "price_with_discount": 99.9,
      "category_ids": [1, 15, 24],
      "images": [
        { "id": 1, "content": "https://store.com/media/product-01/image-01.png" }
      ],
      "options": [
        { "id": 1, "title": "Cor", "values": ["PP", "GG"] }
      ]
    }
  ],
  "total": 120,
  "limit": 12,
  "page": 1
}
2. Obter produto por ID
GET /product/:id

Response 200 OK
Produto completo com imagens, categorias e opções.

Response 404 Not Found

3. Criar produto
POST /product

Headers
Content-Type: application/json
Authorization: Bearer <token>

Body

json
Copiar
Editar
{
  "enabled": true,
  "name": "Produto 01",
  "slug": "produto-01",
  "stock": 10,
  "description": "Descrição do produto 01",
  "price": 119.90,
  "price_with_discount": 99.90,
  "category_ids": [1, 15, 24],
  "images": [
    { "type": "image/png", "content": "base64string" }
  ],
  "options": [
    { "title": "Cor", "shape": "square", "radius": 4, "type": "text", "values": ["PP", "GG", "M"] }
  ]
}
Response 201 Created

Response 400 Bad Request

Response 401 Unauthorized

4. Atualizar produto
PUT /product/:id

Headers
Content-Type: application/json
Authorization: Bearer <token>

Body
Mesma estrutura do POST, podendo incluir também imagens e opções para deletar (exemplo: "deleted": true).

Response 204 No Content

Response 400 Bad Request

Response 401 Unauthorized

Response 404 Not Found

5. Deletar produto
DELETE /product/:id

Headers
Content-Type: application/json
Authorization: Bearer <token>

Response 204 No Content

Response 401 Unauthorized

Response 404 Not Found

Autenticação JWT
Todos os endpoints que exigem autenticação usam o header:

makefile
Copiar
Editar
Authorization: Bearer <token>
Gere o token com o endpoint /user/token enviando email e senha válidos.

