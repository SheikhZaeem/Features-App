import express from 'express';
import multer from 'multer';
import cors from 'cors';
import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 4000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Beerwah@77',
  database: 'mobivisor_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());
app.use('/attachments', express.static(path.join(__dirname, 'attachments')));

const attachmentsDir = path.join(__dirname, 'attachments');
if (!fs.existsSync(attachmentsDir)) {
  fs.mkdirSync(attachmentsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, attachmentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    
    const userId = Date.now().toString();
    const avatar = `https://i.pravatar.cc/150?u=${email}`;
    
    await pool.query(
      `INSERT INTO users (id, name, username, email, password, avatar, isAdmin)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, username, email, password, avatar, 0]
    );
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/features', async (req, res) => {
  try {
    const [features] = await pool.query(`
      SELECT f.*, u.name, u.username, u.avatar 
      FROM features f
      JOIN users u ON f.userId = u.id
    `);
    res.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/features', upload.array('attachments'), async (req, res) => {
  const { title, description, userId } = req.body;
  const upvotes = parseInt(req.body.upvotes) || 0;
  const exists = req.body.exists === 'true' ? 1 : 0; // convert to mysql boolean (0/1)
  
  try {
    const featureId = Date.now().toString();
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const attachments = req.files?.map(file => ({
      name: file.originalname,
      type: file.mimetype,
      url: `http://localhost:${PORT}/attachments/${file.filename}`
    })) || [];

    await pool.query(
      `INSERT INTO features 
        (id, title, description, userId, upvotes, \`exists\`, createdAt, attachments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        featureId,
        title,
        description,
        userId,
        upvotes,
        exists,
        createdAt,
        JSON.stringify(attachments)
      ]
    );

    const [newFeature] = await pool.query(
      `SELECT f.*, u.name, u.username, u.avatar 
       FROM features f
       JOIN users u ON f.userId = u.id
       WHERE f.id = ?`,
      [featureId]
    );

    res.status(201).json(newFeature[0]);
  } catch (error) {
    console.error('Error creating feature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/features/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    // converting json fields to strings
    if (updates.upvotedBy) updates.upvotedBy = JSON.stringify(updates.upvotedBy);
    if (updates.mergedFrom) updates.mergedFrom = JSON.stringify(updates.mergedFrom);
    if (updates.attachments) updates.attachments = JSON.stringify(updates.attachments);
    
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), id];
    
    await pool.query(
      `UPDATE features SET ${setClause} WHERE id = ?`,
      values
    );
    
    const [updatedFeature] = await pool.query(
      `SELECT f.*, u.name, u.username, u.avatar 
       FROM features f
       JOIN users u ON f.userId = u.id
       WHERE f.id = ?`,
      [id]
    );
    
    res.json(updatedFeature[0]);
  } catch (error) {
    console.error('Error updating feature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/features/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM features WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting feature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/comments', async (req, res) => {
  const { featureId } = req.query;
  
  try {
    let query = `
      SELECT c.*, u.username, u.name, u.avatar 
      FROM comments c
      JOIN users u ON c.userId = u.id
    `;
    
    let params = [];
    
    if (featureId) {
      query += ' WHERE c.featureId = ?';
      params.push(featureId);
    }
    
    const [comments] = await pool.query(query, params);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/comments', async (req, res) => {
  const { text, featureId, userId, isAdmin = false } = req.body;
  
  try {
    const commentId = Date.now().toString();
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await pool.query(
      `INSERT INTO comments (id, text, featureId, userId, isAdmin, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [commentId, text, featureId, userId, isAdmin, createdAt]
    );
    
    const [newComment] = await pool.query(
      `SELECT c.*, u.username, u.name, u.avatar 
       FROM comments c
       JOIN users u ON c.userId = u.id
       WHERE c.id = ?`,
      [commentId]
    );
    
    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});