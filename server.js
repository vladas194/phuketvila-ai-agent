const express = require('express');
const app = express();
app.use(express.json());

app.post('/ai-query', async (req, res) => {
  const { message } = req.body;
  // Здесь будет логика Qwen3 (пока заглушка)
  res.json({ response: "Привет! Я AI-менеджер PhuketVila. Какой объект вас интересует?" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started!'));
