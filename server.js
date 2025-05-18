
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Настройки CORS для вашего домена
const corsOptions = {
  origin: [
    'https://phuketvila.com',
    'http://localhost:3000' // для тестирования
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Обработка preflight запросов
app.use(express.json());

const QWEN_API_KEY = process.env.QWEN_API_KEY;

app.post('/api/qwen-proxy', async (req, res) => {
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: "qwen-turbo",
        input: req.body.input,
        parameters: req.body.parameters || { result_format: "message" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QWEN_API_KEY}`
        },
        timeout: 10000
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
