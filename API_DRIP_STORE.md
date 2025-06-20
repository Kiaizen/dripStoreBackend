# API DRIP STORE

## Autenticação

### POST /v1/user/token

Gera um token JWT.

**Headers**:  
`Content-Type: application/json`

**Payload**:
```json
{
  "email": "user@mail.com",
  "password": "123@123"
}
```

**Response**:
```json
{
  "token": "<JWT>"
}
```

---

## Usuários

### POST /v1/user

Cria um novo usuário.

**Headers**:  
`Content-Type: application/json`

**Payload**:
```json
{
  "firstname": "user firstname",
  "surname": "user surname",
  "email": "user@mail.com",
  "password": "123@123",
  "confirmPassword": "123@123"
}
```

**Status**: `201 Created`, `400 Bad Request`

### GET /v1/user/:id

Retorna informações do usuário pelo ID.

**Status**: `200 OK`, `404 Not Found`

### PUT /v1/user/:id

Atualiza dados do usuário.

**Headers**:  
`Authorization: Bearer <JWT>`

**Payload**:
```json
{
  "firstname": "updated name",
  "surname": "updated surname",
  "email": "updated@mail.com"
}
```

**Status**: `204 No Content`

### DELETE /v1/user/:id

Deleta um usuário.

**Headers**:  
`Authorization: Bearer <JWT>`

**Status**: `204 No Content`

---

## Categorias

### GET /v1/category/search

Consulta lista de categorias com filtros e paginação.

### GET /v1/category/:id

Consulta categoria pelo ID.

### POST /v1/category

Cria uma nova categoria.

**Headers**:  
`Authorization: Bearer <JWT>`

### PUT /v1/category/:id

Atualiza categoria.

**Headers**:  
`Authorization: Bearer <JWT>`

### DELETE /v1/category/:id

Remove uma categoria.

**Headers**:  
`Authorization: Bearer <JWT>`

---

## Produtos

### GET /v1/product/search

Consulta produtos com filtros por nome, categoria, faixa de preço, etc.

### GET /v1/product/:id

Consulta produto por ID.

### POST /v1/product

Cria um novo produto.

**Headers**:  
`Authorization: Bearer <JWT>`

### PUT /v1/product/:id

Atualiza um produto.

**Headers**:  
`Authorization: Bearer <JWT>`

### DELETE /v1/product/:id

Remove um produto.

**Headers**:  
`Authorization: Bearer <JWT>`