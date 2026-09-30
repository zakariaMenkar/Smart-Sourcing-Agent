from flask import Blueprint, jsonify, request
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os

api = Blueprint("api", __name__)

# Connexion Google Sheets
def get_sheet():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json", scope
    )

    client = gspread.authorize(creds)
    sheet_name = os.getenv("GOOGLE_SHEET_NAME")
    sheet = client.open(sheet_name).sheet1
    return sheet

# 🔹 Test API
@api.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "OK"})

# 🔹 Lire toutes les données
@api.route("/api/data", methods=["GET"])
def get_data():
    sheet = get_sheet()
    data = sheet.get_all_records()
    return jsonify(data)

# 🔹 Ajouter une ligne
@api.route("/api/data", methods=["POST"])
def add_data():
    sheet = get_sheet()
    body = request.json

    sheet.append_row([
        body.get("machine"),
        body.get("alerte"),
        body.get("date")
    ])

    return jsonify({"message": "Ajout réussi"}), 201

# 🔹 Liste des fournisseurs
@api.route("/api/fournisseurs", methods=["GET"])
def get_fournisseurs():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json", scope
    )

    client = gspread.authorize(creds)

    # Ouvrir le fichier Google Sheet
    sheet = client.open("my_PDR_Suppliers_MarocModis").worksheet("Feuille 1")

    rows = sheet.get_all_records()

    # Filtrer uniquement les colonnes utiles
    # fournisseurs = [
    #     {
    #         "supplier_name": row.get("supplier_name"),
    #         "brand": row.get("brand")
    #     }
    #     for row in rows
    # ]
    fournisseurs = [
        {
            "supplier_name": row.get("supplier_name"),
            "website": row.get("website"),
            "description": row.get("description"),
            "brand": row.get("brand"),
            "model": row.get("model"),
            "city": row.get("city"),
            "country": row.get("country"),
            "search_date": row.get("search_date"),
            "ref": row.get("ref")
        }
        for row in rows
    ]

    return jsonify(fournisseurs)

# 🔹 Liste des fournisseurs avec contacts
@api.route("/api/contact_fournisseurs", methods=["GET"])
def get_contact_fournisseurs():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json", scope
    )

    client = gspread.authorize(creds)

    # Ouvrir la feuille "Supplier_with_contact"
    try:
        sheet = client.open("my_PDR_Suppliers").worksheet("Supplier_with_contact")
    except gspread.exceptions.WorksheetNotFound:
        return jsonify({"error": "La feuille 'Supplier_with_contact' n'existe pas"}), 404

    rows = sheet.get_all_records()

    # Filtrer les colonnes spécifiées
    contacts_fournisseurs = [
        {
            "supplier_name": row.get("supplier_name"),
            "email": row.get("email"),
            "brand": row.get("brand"),
            "model": row.get("model"),
            "telephone": row.get("telephone"),
            "website": row.get("website"),
            "search_date": row.get("search_date"),
            "has_contact": row.get("has_contact")
        }
        for row in rows
    ]

    return jsonify(contacts_fournisseurs)

# 🔹 Liste des fournisseurs sans contacts
@api.route("/api/no_contact_fournisseurs", methods=["GET"])
def get_no_contact_fournisseurs():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json", scope
    )

    client = gspread.authorize(creds)

    # Ouvrir la feuille "Supplier_no_contact"
    try:
        sheet = client.open("my_PDR_Suppliers").worksheet("Supplier_no_contact")
    except gspread.exceptions.WorksheetNotFound:
        return jsonify({"error": "La feuille 'Supplier_no_contact' n'existe pas"}), 404

    rows = sheet.get_all_records()

    # Filtrer les colonnes spécifiées
    no_contacts_fournisseurs = [
        {
            "supplier_name": row.get("supplier_name"),
            "website": row.get("website"),
            "search_date": row.get("search_date"),
            "has_contact": row.get("has_contact"),
            "_debug": row.get("_debug"),
            "email": row.get("email"),
            "telephone": row.get("telephone"),
            "brand": row.get("brand"),
            "model": row.get("model")
        }
        for row in rows
    ]

    return jsonify(no_contacts_fournisseurs)

@api.route("/api/next_search_id00", methods=["GET"])
def get_next_search_id00():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json",
        scope
    )

    client = gspread.authorize(creds)

    sheet = client.open("my_PDR_Suppliers")

    print(sheet.title)

    try:
        sheet = client.open(
            "my_PDR_Suppliers"
        ).worksheet("search_list")

    except gspread.exceptions.WorksheetNotFound:
        return jsonify({
            "next_search_id": "SRCH-0001",
            "last_search_id": None
        }), 200

    records = sheet.get_all_records()

    if not records:
        return jsonify({
            "next_search_id": "SRCH-0001",
            "last_search_id": None
        }), 200

    last_search_id = records[-1].get("search_id")

    if not last_search_id:
        next_search_id = "SRCH-0001"

    else:
        try:
            number = int(last_search_id.replace("SRCH-", ""))
            next_search_id = f"SRCH-{number + 1:04d}"

        except Exception:
            next_search_id = "SRCH-0001"

    return jsonify({
        "last_search_id": last_search_id,
        "next_search_id": next_search_id
    }), 200





@api.route("/api/next_search_id", methods=["GET"])
def get_next_search_id():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json",
        scope
    )

    client = gspread.authorize(creds)

    for s in client.openall():
        print(f"[{s.title}]")   

    try:
        worksheet = client.open(
            "my_PDR_Suppliers"
        ).worksheet("search_list")

    except gspread.exceptions.WorksheetNotFound:
        return jsonify({
            "last_search_id": None,
            "next_search_id": "SRCH-1"
        }), 200

    # Récupère toutes les lignes
    rows = worksheet.get_all_values()

    # Si uniquement l'en-tête ou feuille vide
    if len(rows) <= 1:
        return jsonify({
            "last_search_id": None,
            "next_search_id": "SRCH-1"
        }), 200

    headers = rows[0]

    try:
        search_id_col = headers.index("search_id")
    except ValueError:
        return jsonify({
            "error": "Colonne 'search_id' introuvable"
        }), 400

    # Recherche de la dernière ligne non vide
    last_search_id = None

    for row in reversed(rows[1:]):
        if len(row) > search_id_col and row[search_id_col].strip():
            last_search_id = row[search_id_col].strip()
            break

    if not last_search_id:
        return jsonify({
            "last_search_id": None,
            "next_search_id": "SRCH-1"
        }), 200

    try:
        number = int(last_search_id.replace("SRCH-", ""))
        #next_search_id = f"SRCH-{number + 1:04d}"
        next_search_id = f"SRCH-{number + 1}"
    except Exception:
        next_search_id = "SRCH-0001"

    return jsonify({
        "last_search_id": last_search_id,
        "next_search_id": next_search_id
    }), 200

