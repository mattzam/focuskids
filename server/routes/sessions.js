const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// POST /api/sessions
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { profile_id, task_id, duration_planned, duration_actual, stars_earned, completed } = req.body;
    if (!profile_id) return res.status(400).json({ error: 'profile_id required' });

    // 1. Create the session
    const sessionRes = await client.query(
      `INSERT INTO sessions (profile_id, task_id, duration_planned, duration_actual, stars_earned, completed, ended_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [profile_id, task_id || null, duration_planned || 25, duration_actual || duration_planned || 25, stars_earned || 30, completed || false]
    );
    const session = sessionRes.rows[0];

    // 2. Update profile stats
    const profileRes = await client.query(
      `UPDATE profiles
       SET stars = stars + $1,
           level = GREATEST(1, FLOOR((stars + $1) / 100)::int + 1),
           sessions_completed = COALESCE(sessions_completed, 0) + 1,
           streak = streak + 1,
           last_active = CURRENT_DATE,
           updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [stars_earned || 30, profile_id]
    );
    const profile = profileRes.rows[0];

    // 3. Base reward (Stars)
    await client.query(
      `INSERT INTO rewards (profile_id, session_id, type, value) VALUES ($1, $2, 'stars', $3)`,
      [profile_id, session.id, stars_earned || 30]
    );

    // 4. Dynamic Badges logic
    let newBadge = null;
    if (profile.sessions_completed === 1) {
      newBadge = { emoji: '⭐', name: 'Primera Estrella' };
    } else if (profile.sessions_completed === 10) {
      newBadge = { emoji: '🏆', name: 'Campeón del Foco' };
    } else if (profile.sessions_completed === 25) {
      newBadge = { emoji: '🌟', name: 'Superestrella' };
    }

    if (newBadge) {
      await client.query(
        `INSERT INTO rewards (profile_id, session_id, type, badge_emoji, badge_name) 
         VALUES ($1, $2, 'badge', $3, $4)`,
        [profile_id, session.id, newBadge.emoji, newBadge.name]
      );
    }

    // 5. Mark task as completed if applicable
    if (task_id && completed) {
      await client.query(`UPDATE tasks SET status = 'done', completed_at = NOW() WHERE id = $1`, [task_id]);
    }

    await client.query('COMMIT');
    res.status(201).json({ session, profile, newBadge, message: 'Session saved successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// GET /api/sessions?profile_id=X&limit=10
router.get('/', async (req, res) => {
  try {
    const { profile_id, limit = 10 } = req.query;
    if (!profile_id) return res.status(400).json({ error: 'profile_id required' });
    const result = await pool.query(
      `SELECT s.*, t.title as task_title, t.emoji as task_emoji
       FROM sessions s
       LEFT JOIN tasks t ON t.id = s.task_id
       WHERE s.profile_id = $1
       ORDER BY s.started_at DESC LIMIT $2`,
      [profile_id, parseInt(limit)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
