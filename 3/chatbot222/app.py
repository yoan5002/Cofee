from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests

app = Flask(__name__, static_folder="frontend")
CORS(app)

# === ROUTES STATIQUES POUR LE FRONT ===
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/style.css")
def css():
    return send_from_directory(app.static_folder, "style.css")

@app.route("/script.js")
def js():
    return send_from_directory(app.static_folder, "script.js")

# === ROUTE DE CHATBOT SANS STREAMING ===
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").strip()

    if not user_input:
        return jsonify({"response": " Pose-moi une question sur StarCoffe."}), 400

    try:
        # 🔁 Appel à Ollama local (Mistral)
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                 "prompt": f"""Tu es un assistant du site StarCoffe. Réponds brièvement et clairement aux questions des clients sur les produits, les commandes, les paiements, les livraisons ou les retours. Ne fais pas la conversation tout seul. Réponds uniquement à la question posée ci-dessous.\n\nQuestion : {user_input}\nRéponse :""",
                 "stream": False
            }
        )

        if response.status_code != 200:
            print(" Réponse Ollama invalide :", response.status_code)
            return jsonify({"response": " Erreur côté assistant (Ollama)."}), 500

        data = response.json()
        message = data.get("response", "").strip()

        return jsonify({"response": message or "😅 Je n'ai pas bien compris. Réessaye."})

    except Exception as e:
        print(" Erreur serveur Flask :", e)
        return jsonify({"response": " Erreur serveur. Vérifie que Ollama tourne bien."}), 500

# === LANCEMENT DU SERVEUR ===
if __name__ == "__main__":
    app.run(debug=True)
