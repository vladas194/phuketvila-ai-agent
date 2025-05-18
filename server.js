require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({
  origin: ['https://phuketvila.com', 'https://your-tilda-site.tilda.ws'] // Укажите ваш домен Tilda
}));
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await axios.post('https://api.qwen.ai/v1/chat/completions', {
      model: "qwen-3",
      messages: [{
        role: "system",
        content: "Ты консультант phuketvila.com. Отвечай только о недвижимости на Пхукете. Будь вежливым и кратким."
      }, {
        role: "user",
        content: message
      }],
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
