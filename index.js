const express = require('express');
const axios = require('axios');

// إنشاء تطبيق Express
const app = express();
app.use(express.json());

const openaiApiKey = 'sk-9rzmTq5-6lyrF5eNtt7InbF5oFpgeBuctqIW-CWj8GT3BlbkFJBQOklDUCe0K8lBeQpNHWYbiwbNMBVOyjqEkSDA8fEA';

// وظيفة للحصول على الرد من OpenAI API
async function getOpenAIResponse(userMessage) {
    try {
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
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        return "Error: Could not get response from AI.";
    }
}

// Webhook لاستقبال الرسائل من WhatsApp API
app.post('/webhook', async (req, res) => {
    const { message, number } = req.body;

    // سجل الرسالة للتحقق من أنها تصل
    console.log("Received message:", message);
    console.log("From number:", number);

    // تحقق إذا كانت الرسالة والرقم موجودين
    if (!message || !number) {
        return res.status(400).send("Invalid request");
    }

    // الحصول على الرد من OpenAI
    const reply = await getOpenAIResponse(message);

    // إرسال الرد إلى WhatsApp API
    try {
        const whatsappResponse = await axios.post(`https://whats.nuqtai.com/api/send`, {
            number,
            type: 'text',
            message: encodeURIComponent(reply),
            instance_id: '66E7BC3A0A4FD',
            access_token: '66d2bc8fe5492'
        });

        console.log("WhatsApp Response:", whatsappResponse.data);
        res.json({ reply });
    } catch (error) {
        console.error("Error sending response to WhatsApp:", error);
        res.status(500).send("Failed to send response to WhatsApp.");
    }
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
