from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# إعداد مفتاح API لـ OpenAI
openai.api_key = "sk-9rzmTq5-6lyrF5eNtt7InbF5oFpgeBuctqIW-CWj8GT3BlbkFJBQOklDUCe0K8lBeQpNHWYbiwbNMBVOyjqEkSDA8fEA"

# وظيفة للحصول على الرد من OpenAI
def get_openai_response(user_message):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": user_message}]
    )
    return response['choices'][0]['message']['content']

# نقطة نهاية webhook لاستقبال الرسائل
@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    message = data.get('message', '')
    sender = data.get('number', '')

    # الحصول على الرد من OpenAI
    reply = get_openai_response(message)

    # الرد على المستخدم
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)
