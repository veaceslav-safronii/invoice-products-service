const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'invoices_db',
  user: process.env.DB_USER || 'invoice_user',
  password: process.env.DB_PASSWORD || 'invoice_pass',
});

const initDb = async () => {
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS products_schema;

    CREATE TABLE IF NOT EXISTS products_schema.products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      unit VARCHAR(50) DEFAULT 'pcs',
      stock INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Products DB schema initialized');
};

module.exports = { pool, initDb };
