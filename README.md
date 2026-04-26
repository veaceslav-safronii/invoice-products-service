# invoice-products-service

Products management microservice for the Invoice System

## Endpoints

| Method | Path | Description | Auth required |
|--------|------|-------------|---------------|
| GET | /products | List all products | Yes |
| GET | /products/:id | Get product by ID | Yes |
| POST | /products | Create product | Yes |
| PUT | /products/:id | Update product | Yes |
| DELETE | /products/:id | Delete product | Yes |

## Example requests

```bash
# Create product
curl -X POST http://localhost:3003/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Laptop Dell XPS","description":"15 inch, 32GB RAM","price":5999.99,"unit":"pcs","stock":5}'

# List products
curl http://localhost:3003/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update stock
curl -X PUT http://localhost:3003/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"stock":3}'
```

## Environment variables

```
PORT=3003
DB_HOST=postgres
DB_NAME=invoices_db
DB_USER=invoice_user
DB_PASSWORD=invoice_pass
AUTH_SERVICE_URL=http://auth:3001
```

## Tech stack

- Node.js + Express.js
- PostgreSQL (schema: `products_schema`)
- JWT validation via Auth Service (HTTP call)
