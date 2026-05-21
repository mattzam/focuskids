const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/tasks?profile_id=X
router.get('/', async (req, res) => {
  try {
    const { profile_id } = req.query;
    const q = profile_id
      ? 'SELECT * FROM tasks WHERE profile_id = $1 AND status != $2 ORDER BY sort_order, created_at LIMIT 3'
      : 'SELECT * FROM tasks ORDER BY created_at DESC';
    const params = profile_id ? [profile_id, 'done'] : [];
    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { profile_id, title, emoji = '📚', duration = 25 } = req.body;
    if (!profile_id || !title) return res.status(400).json({ error: 'profile_id and title required' });

    // Enforce max 3 active tasks per profile
    const count = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE profile_id = $1 AND status = 'pending'",
      [profile_id]
    );
    if (parseInt(count.rows[0].count) >= 3) {
      return res.status(409).json({ error: 'Max 3 active tasks per profile' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (profile_id, title, emoji, duration)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [profile_id, title, emoji, duration]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/tasks/:id/complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE tasks SET status = 'done', completed_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
