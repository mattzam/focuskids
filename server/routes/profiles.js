const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/profiles  — list all profiles (demo: no auth)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM profiles ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profiles/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profiles
router.post('/', async (req, res) => {
  try {
    const { name, avatar_emoji = '🦄', avatar_bg = 'bg-orange-100', parent_id } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const result = await pool.query(
      `INSERT INTO profiles (name, avatar_emoji, avatar_bg, parent_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, avatar_emoji, avatar_bg, parent_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/profiles/:id/stars  — add stars after session
router.patch('/:id/stars', async (req, res) => {
  try {
    const { id } = req.params;
    const { stars } = req.body;
    if (typeof stars !== 'number') return res.status(400).json({ error: 'stars must be a number' });

    const result = await pool.query(
      `UPDATE profiles
       SET stars = stars + $1,
           level = GREATEST(1, FLOOR((stars + $1) / 100)::int + 1),
           updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [stars, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/profiles/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM profiles WHERE id = $1', [req.params.id]);
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
