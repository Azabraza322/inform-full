import express from 'express';
import path from 'path';

const app = express();

// Динамическое определение пути
const FRONTEND_PATH = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../../public_html') // Для Beget
  : path.join(__dirname, '../../browser');   // Для локальной разработки

app.use(express.static(FRONTEND_PATH));

// Обработка API роутов
app.get('/api/data', (req, res) => {
  res.json({ status: 'ok' });
});

// Fallback для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Frontend path: ${FRONTEND_PATH}`);
});