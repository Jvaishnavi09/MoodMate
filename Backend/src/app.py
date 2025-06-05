from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

@app.route("/")
def index():
    return "Homepage of Backend Moodmate"

@app.route("/api/analyze-moods", methods=["POST"])
def analyze_moods():
    data = request.json
    mood_entries = data.get("moods") # Renamed for clarity, as it's a list of entries

    if not mood_entries:
        return jsonify({"error": "No moods provided."}), 400

    mood_logs_formatted = []
    for i, entry in enumerate(mood_entries):
        emoji = entry.get('emoji', 'Unknown')
        note = entry.get('note', 'No specific note.')
        mood_logs_formatted.append(f"Entry {i+1}: Emoji: {emoji}, Note: {note}")

    mood_log_string = chr(10).join(mood_logs_formatted)

    prompt = f"""
You are a mood coach. Analyze the following mood logs and give a gentle, helpful emotional summary in 3-4 sentences.

Moods:
{mood_log_string}
"""
    try:
        print("Prompt being sent to OpenAI API:\n", prompt)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an empathetic mental wellness coach."},
                {"role": "user", "content": prompt}
            ]
        )

        print("OpenAI API full response:", response)

        summary = response.choices[0].message.content.strip()
        return jsonify({"summary": summary})

    except Exception as e:
        print(f"Error during OpenAI API call: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)