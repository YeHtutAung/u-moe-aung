import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/db.js';

export function registerAdmin(req, res) {
  const { full_name, email, phone, password } = req.body;

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      'INSERT INTO admins (full_name, email, phone, password) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(full_name, email, phone, hashedPassword);

    res.status(201).json({
      message: 'Admin registered successfully',
      id: result.lastInsertRowid
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
}

export function loginAdmin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);

  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: admin.id,
      full_name: admin.full_name,
      email: admin.email,
      role: 'admin'
    }
  });
}

export function registerUser(req, res) {
  const {
    full_name, email, phone, date_of_birth, birthday,
    birth_time, birth_place, marital_status, password
  } = req.body;

  if (!full_name || !email || !phone || !date_of_birth || !birthday ||
      !birth_time || !birth_place || !marital_status || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (full_name, email, phone, date_of_birth, birthday,
        birth_time, birth_place, marital_status, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      full_name, email, phone, date_of_birth, birthday,
      birth_time, birth_place, marital_status, hashedPassword
    );

    res.status(201).json({
      message: 'User registered successfully',
      id: result.lastInsertRowid
    });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
}

export function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: 'user'
    }
  });
}
