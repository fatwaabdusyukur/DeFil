from SlangWord import SlangWord
import pickle
import re
import pandas as pd
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = pickle.load(open('./assets/model/model.pkl', 'rb'))

TEXT_CLEANING_RE = "@\S+|https?:\S+|http?:\S|[^A-Za-z0-9]+"
slap_word = SlangWord()
stopwordFactory = StopWordRemoverFactory()
stopwords = stopwordFactory.get_stop_words()

wanted_words = ["aku", "anda", "kamu", "kami", "engkau", "beliau", "kau", "dia", "ia", "mereka", "kita", "kalian", "orang", 
                "ini", "itu", "begini", "begitu", "anak", "bapak", "ibu", "suami", "istri", "ingin", "tidak", 'bukan', 'bukankah', 'bukanlah', 'bukannya',
                "apa", "dimana", "apakah", "siapa", "mengapa", "kapan", "berapa", "kenapa", "bagaimana", "ya" 
                ]



stopwords = [word for word in stopwords if word not in wanted_words]
stopwordFactory = StopWordRemoverFactory().create_stop_word_remover(stopwords)
stemmingFactory = StemmerFactory().create_stemmer()

def slap_remove(word):
    for idx in range(len(slap_word.informalWord)):
        if slap_word.informalWord[idx] == word:
            word = slap_word.formalWord[idx]
    return word

def cleaning(text):
    text = re.sub(TEXT_CLEANING_RE, " ", text.lower()).strip()
    text = [slap_remove(word) for word in text.split(" ")]
    text = " ".join(text)
    text = stopwordFactory.remove(text)
    text = stemmingFactory.stem(text)
    return text

@app.route("/predict", methods=['POST'])
def predict():
    text = cleaning(request.form.get('text'))
    pred = model.predict([text])
    return jsonify({"tweet": request.form.get('text'), "result": pred[0]})

if __name__ == "__main__":
    app.run()