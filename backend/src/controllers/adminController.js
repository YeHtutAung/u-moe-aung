import db from '../models/db.js';

export function getAllQuestions(req, res) {
  try {
    const questions = db.prepare(`
      SELECT
        q.id,
        q.content,
        q.created_at,
        u.full_name as user_name,
        u.email as user_email,
        r.content as reply_content,
        r.created_at as reply_created_at,
        a.full_name as admin_name
      FROM questions q
      JOIN users u ON q.user_id = u.id
      LEFT JOIN replies r ON q.id = r.question_id
      LEFT JOIN admins a ON r.admin_id = a.id
      ORDER BY q.created_at DESC
    `).all();

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}

export function getAllUsers(req, res) {
  try {
    const users = db.prepare(`
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.date_of_birth,
        u.birthday,
        u.birth_time,
        u.birth_place,
        u.marital_status,
        u.created_at,
        COUNT(q.id) as question_count,
        SUM(CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END) as answered_count
      FROM users u
      LEFT JOIN questions q ON u.id = q.user_id
      LEFT JOIN replies r ON q.id = r.question_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all();

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export function replyToQuestion(req, res) {
  const questionId = req.params.id;
  const adminId = req.user.id;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Reply content is required' });
  }

  // Check if question exists
  const question = db.prepare('SELECT id FROM questions WHERE id = ?').get(questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Check if reply already exists
  const existingReply = db.prepare('SELECT id FROM replies WHERE question_id = ?').get(questionId);
  if (existingReply) {
    return res.status(400).json({ error: 'Question already has a reply' });
  }

  try {
    const stmt = db.prepare('INSERT INTO replies (question_id, admin_id, content) VALUES (?, ?, ?)');
    const result = stmt.run(questionId, adminId, content.trim());

    res.status(201).json({
      message: 'Reply submitted successfully',
      id: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit reply' });
  }
}
