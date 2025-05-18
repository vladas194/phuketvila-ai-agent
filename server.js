require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Настройки CORS
const allowedOrigins = [
  'https://phuketvila.com',
  'https://your-tilda-site.tilda.ws'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Обработчик чата
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const response = await axios.post('https://api.qwen.ai/v1/chat/completions', {
      model: "qwen-3",
      messages: messages,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
