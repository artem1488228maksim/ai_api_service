require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY; 

const SYSTEM_PROMPT = "Ты — помощник по трудоустройству. Отвечай только на вопросы, связанные с работой, карьерой, резюме, собеседованиями и профессиональным развитием. Если вопрос выходит за эти рамки, вежливо откажи.";

app.post('/ask', async (req, res) => {
    try {
        const { userMessage } = req.body;

        const response = await axios.post(MISTRAL_API_URL, {
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`
            }
        });

        res.json({
            answer: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error("Ошибка Mistral API:", error.response?.data || error.message);
        res.status(500).json({ error: "Ошибка обработки запроса" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});