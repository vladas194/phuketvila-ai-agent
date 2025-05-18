require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({
  origin: 'https://phuketvila.com'
}));
app.use(express.json());

// Обработчик чата
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post('https://api.qwen.ai/v1/chat/completions', {
      model: "qwen-3",
      messages: messages,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`
      }
    });

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error('Qwen API error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || 'Ошибка при запросе к Qwen API'
    });
  }
});

// Проверка работы сервера
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
