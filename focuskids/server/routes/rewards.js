const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/rewards?profile_id=X
router.get('/', async (req, res) => {
  try {
    const { profile_id } = req.query;
    if (!profile_id) return res.status(400).json({ error: 'profile_id required' });
    const result = await pool.query(
      `SELECT * FROM rewards WHERE profile_id = $1 ORDER BY earned_at DESC LIMIT 20`,
      [profile_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rewards/badges  — full badge catalog
router.get('/badges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM badge_catalog ORDER BY requirement_value ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
