const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const openaiApiKey = 'sk-9rzmTq5-6lyrF5eNtt7InbF5oFpgeBuctqIW-CWj8GT3BlbkFJBQOklDUCe0K8lBeQpNHWYbiwbNMBVOyjqEkSDA8fEA';

// استدعاء OpenAI API للحصول على الرد
async function getOpenAIResponse(userMessage) {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [{ role: 'user', content: userMessage }]
    }, {
        headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data.choices[0].message.content;
}

// Webhook لاستقبال الرسائل
app.post('/webhook', async (req, res) => {
    const { message, number } = req.body;

    // الحصول على الرد من OpenAI
    const reply = await getOpenAIResponse(message);

    // إرسال الرد
    res.json({ reply });
});

// مسار الصفحة الرئيسية "/"
app.get('/', (req, res) => {
    res.send('WhatsApp AI bot is running!');
});

// إعداد المنفذ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
