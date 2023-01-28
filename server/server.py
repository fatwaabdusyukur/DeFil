import pickle
import re

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = pickle.load(open('./assets/model/model.pkl', 'rb'))

TEXT_CLEANING_RE = "@\S+|https?:\S+|http?:\S|[^A-Za-z0-9]+"
clean_and_transform = lambda tweet: re.sub(TEXT_CLEANING_RE, ' ', tweet.lower()).strip()

@app.route("/predict", methods=['POST'])
def predict():
    text = clean_and_transform(request.form.get('text'))
    pred = model.predict([text])
    return jsonify({"tweet": text, "result": pred[0]})

if __name__ == "__main__":
    app.run()