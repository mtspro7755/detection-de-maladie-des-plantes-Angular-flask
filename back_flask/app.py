from flask import Flask, render_template, request, redirect, url_for, jsonify, \
    send_from_directory  # <-- Ajout de send_from_directory
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from PIL import Image
import json  # N'oublie pas d'importer json si ce n’est pas fait



# Initialiser Flask
app = Flask(__name__)
CORS(app)  # Active CORS pour toutes les routes, essentiel pour la communication avec Angular

# Dossier pour enregistrer les images uploadées
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

HISTORY_FILE = 'history.json'  # Assure-toi que ce fichier existe et contient des données JSON valides


# Assurez-vous que le dossier d'upload existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Charger le modèle entraîné
# Assurez-vous que le modèle 'MobileNetV2_best_model.h5' est bien dans le même répertoire que votre script Flask
model = None  # Initialiser à None
try:
    model = load_model('MobileNetV2_best_model.h5')
    print("Modèle MobileNetV2_best_model.h5 chargé avec succès.")
except Exception as e:
    print(f"Erreur lors du chargement du modèle : {e}")
    # Le modèle restera None si le chargement échoue, ce qui sera géré dans la route /predict

# Les noms des classes dans le bon ordre
class_names = ['Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
               'Tomato___Target_Spot']


# Route principale (peut rester pour un test initial si besoin, mais Angular gérera l'interface)
@app.route('/')
def index():
    return "Bienvenue sur l'API PlantPal. Utilisez la route /predict pour les prédictions."


# Route pour gérer l'envoi de l'image et la prédiction
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Le modèle de prédiction n\'a pas pu être chargé sur le serveur.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier fourni dans la requête.'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné.'}), 400

    if file:
        try:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            # Sauvegarder le fichier uploadé
            file.save(file_path)

            # Prétraitement de l'image
            img = image.load_img(file_path, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array /= 255.0  # Normalisation

            # Prédiction
            predictions = model.predict(img_array)
            predicted_class_index = np.argmax(predictions)

            # Vérifier si l'index est valide pour éviter les erreurs d'index hors limites
            if predicted_class_index < len(class_names):
                predicted_class = class_names[predicted_class_index].replace('Tomato___', 'Tomate : ')





            else:
                predicted_class = "Classe inconnue"  # Fallback si l'index est inattendu

            # URL relative pour l'image uploadée, accessible depuis Angular
            # Assurez-vous que 'localhost:5000' correspond à l'adresse de votre serveur Flask
            image_url = f"http://localhost:5000/uploads/{filename}"

            from datetime import datetime  # à ajouter tout en haut du fichier si pas déjà fait

            # 🔁 Charger l'historique existant
            if os.path.exists(HISTORY_FILE):
                with open(HISTORY_FILE, 'r') as f:
                    try:
                        history = json.load(f)
                    except json.JSONDecodeError:
                        history = []
            else:
                history = []

            # 🔍 Vérifier si la plante existe déjà
            plant_name = filename.split('.')[0]  # ou extraire depuis le nom du fichier/image
            found = False

            for entry in history:
                if entry['plant_name'] == plant_name:
                    # Plante existante : on met à jour le nombre d'analyses
                    entry['analysis_count'] += 1
                    entry['confidence'] = float(np.max(predictions))  # mise à jour
                    entry['disease_name'] = predicted_class
                    entry['image_url'] = image_url
                    entry['date'] = datetime.now().strftime('%Y-%m-%d')
                    found = True
                    break

            # 🆕 Si la plante n'existe pas encore, ajouter une nouvelle entrée
            if not found:
                history.append({
                    'plant_name': plant_name,
                    'analysis_count': 1,
                    'confidence': float(np.max(predictions)),
                    'disease_name': predicted_class,
                    'image_url': image_url,
                    'date': datetime.now().strftime('%Y-%m-%d')
                })

            # 💾 Sauvegarder dans le fichier JSON
            with open(HISTORY_FILE, 'w') as f:
                json.dump(history, f, indent=4)

            return jsonify({
                'prediction': predicted_class,
                'confidence': float(np.max(predictions)),  # Ajout de la confiance
                'image_url': image_url  # L'URL de l'image pour l'affichage côté client
            })

        except Exception as e:
            # En cas d'erreur lors du traitement de l'image ou de la prédiction
            print(f"Erreur lors de la prédiction : {e}")
            # Tente de supprimer le fichier en cas d'erreur pour éviter les orphelins
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': f'Erreur lors du traitement du fichier ou de la prédiction: {str(e)}'}), 500

    return jsonify({'error': 'Une erreur inattendue est survenue.'}), 500


# Nouvelle route pour servir les images uploadées
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    # send_from_directory sert un fichier depuis un répertoire spécifié
    # Il est sécurisé et empêche l'accès à des fichiers en dehors de UPLOAD_FOLDER
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)



# Route API pour récupérer les analyses avec image, nom de plante, nombre d'analyses et score
@app.route('/api/analyses', methods=['GET'])
def get_analyses_data():
    try:
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r') as f:
                try:
                    history = json.load(f)
                except json.JSONDecodeError:
                    history = []

            # Formater les données
            analyses_data = []
            for entry in history:
                analyses_data.append({
                    'image_url': entry.get('image_url', ''),
                    'plant_name': entry.get('plant_name', 'Nom inconnu'),
                    'plant_family': entry.get('plant_family', 'Nom inconnu'),
                    'analysis_count': entry.get('analysis_count', 0),
                    'score': entry.get('confidence', 0.0),
                    'disease_name': entry.get('disease_name', 'Inconnu'),
                    'date': entry.get('date', '')
                })
            return jsonify(analyses_data)
        else:
            return jsonify([])
    except Exception as e:
        print(f"Erreur lors de la récupération des données d'analyses : {e}")
        return jsonify({'error': f'Erreur : {str(e)}'}), 500



# Lancer l'application
if __name__ == '__main__':
    # Utilisez host='0.0.0.0' pour rendre l'application accessible depuis d'autres machines sur le réseau
    # et port pour spécifier le port (ex: 5000)
    app.run(debug=True, host='0.0.0.0', port=5000)