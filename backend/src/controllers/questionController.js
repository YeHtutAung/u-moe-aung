import db from '../models/db.js';

export function submitQuestion(req, res) {
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Question content is required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO questions (user_id, content) VALUES (?, ?)');
    const result = stmt.run(userId, content.trim());

    res.status(201).json({
      message: 'Question submitted successfully',
      id: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit question' });
  }
}

export function getUserQuestions(req, res) {
  const userId = req.user.id;

  try {
    const questions = db.prepare(`
      SELECT
        q.id,
        q.content,
        q.created_at,
        r.content as reply_content,
        r.created_at as reply_created_at,
        a.full_name as admin_name
      FROM questions q
      LEFT JOIN replies r ON q.id = r.question_id
      LEFT JOIN admins a ON r.admin_id = a.id
      WHERE q.user_id = ?
      ORDER BY q.created_at DESC
    `).all(userId);

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}
