const express = require('express');
const { pool } = require('../db');
const { authenticate } = require('../middleware');

const router = express.Router();

// GET /products
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products_schema.products ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /products/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products_schema.products WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /products
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, price, unit, stock } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }

    const result = await pool.query(
      'INSERT INTO products_schema.products (name, description, price, unit, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, unit || 'pcs', stock || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /products/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, price, unit, stock } = req.body;
    const result = await pool.query(
      `UPDATE products_schema.products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           unit = COALESCE($4, unit),
           stock = COALESCE($5, stock),
           updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [name, description, price, unit, stock, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /products/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM products_schema.products WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/health/check', (req, res) => {
  res.json({ status: 'ok', service: 'products-service' });
});

module.exports = router;
