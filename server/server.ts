import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// ===== 1. Подключение к MySQL =====
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'inform_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err);
    return;
  }
  console.log('Успешное подключение к базе данных MAMP MySQL');
  connection.release();
});

const initDatabase = async (): Promise<void> => {
  try {
    await pool.promise().execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица messages создана/проверена');
  } catch (err) {
    console.error('Ошибка при создании таблицы:', err);
  }
};

initDatabase();

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env['MAIL_USER'],
    pass: process.env['MAIL_PASS']
  }
});

app.post('/api/contact', async (req: Request, res: Response): Promise<void> => {
  const { email, phone, message } = req.body;

  try {
    const [result]: any = await pool.promise().execute(
      'INSERT INTO messages (email, phone, message) VALUES (?, ?, ?)',
      [email, phone, message]
    );

    const mailOptions = {
      from: process.env['MAIL_USER'],
      to: process.env['MAIL_RECEIVER'],
      subject: 'Новое сообщение с сайта INFORM',
      html: `
        <h3>Новое сообщение с формы обратной связи</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Сообщение:</strong><br>${message}</p>
        <p><strong>ID в базе:</strong> ${result.insertId}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Письмо успешно отправлено!' });
  } catch (err) {
    console.error('Ошибка при сохранении в базу:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/admin/login', (req: Request, res: Response): void => {
  const { password } = req.body;

  if (password === process.env['ADMIN_PASSWORD']) {
    const token = jwt.sign(
      { role: 'admin' },
      process.env['JWT_SECRET'] as string,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Неверный пароль' });
  }
});

const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Требуется авторизация' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string) as { role: string };
    if (decoded.role !== 'admin') throw new Error();
    next();
  } catch {
    res.status(403).json({ error: 'Неверный токен' });
  }
};

app.get('/api/messages', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Ошибка при получении сообщений:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/messages/:id', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [result]: any = await pool.promise().execute('DELETE FROM messages WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Сообщение не найдено' });
      return;
    }

    res.status(200).json({ message: 'Сообщение удалено' });
  } catch (err) {
    console.error('Ошибка при удалении сообщения:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.patch('/api/messages/:id/status', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['new', 'done'].includes(status)) {
    res.status(400).json({ error: 'Неверный статус' });
    return;
  }

  try {
    const [result]: any = await pool.promise().execute(
      'UPDATE messages SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Сообщение не найдено' });
      return;
    }

    res.status(200).json({ message: 'Статус обновлён' });
  } catch (err) {
    console.error('Ошибка при обновлении статуса:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});