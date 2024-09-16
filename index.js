app.post('/webhook', async (req, res) => {
    const { message, number } = req.body;

    // سجل الرسالة والرقم للتأكد من استقبال الرسالة
    console.log("Received message:", message);
    console.log("From number:", number);

    // تحقق من صحة الرسالة والرقم
    if (!message || !number) {
        return res.status(400).send("Invalid request");
    }

    // يمكنك هنا متابعة معالجة الرسالة أو إرسال الرد
    res.status(200).send("Message received");
});
