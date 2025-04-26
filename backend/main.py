from flask import Flask, request, jsonify 
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Backend of Code Iterator API is running.'

@app.route('/iterate', methods=['POST'])
def iterate_code():
    data = request.get_json()
    code = data.get('code')
    prompt = data.get('prompt')

    if not code or not prompt:
        return jsonify({'error': 'Code and prompt are required'}), 400

    full_prompt = f"""
You are an expert programmer. Given the following:

### Original Code:
{code}

### Task:
{prompt}

Respond strictly in this format:
Explanation: [short explanation]
Code:
[your modified code]
"""

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/mistral-7b-instruct",
                "messages": [{"role": "user", "content": full_prompt}],
                "temperature": 0.7
            }
        )

        result = response.json()
        if response.status_code != 200:
            return jsonify({'error': result.get('error', 'Unknown error')}), 500

        content = result['choices'][0]['message']['content']

        explanation = ""
        iterated_code = ""

        if "Explanation:" in content and "Code:" in content:
            explanation = content.split("Explanation:")[1].split("Code:")[0].strip()
            iterated_code = content.split("Code:")[1].strip()
        else:
            iterated_code = content.strip()

        return jsonify({
            'iterated_code': iterated_code,
            'explanation': explanation
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
