# BEGIN CODE HERE
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from pymongo import TEXT
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
# END CODE HERE

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/pspi"
CORS(app)
mongo = PyMongo(app)
mongo.db.products.create_index([("name", TEXT)])


@app.route("/search", methods=["GET"])
def search():
    # BEGIN CODE HERE

    name = request.args.get("name")
    # escaped_name = re.escape(name) but needs import re
    # or
    escaped_name = ""
    special_characters = r".^$*+?{}[]\|()"
    for char in name:
        if char in special_characters:
            escaped_name += "\\" + char
        else:
            escaped_name += char

    regex_pattern = f".*{escaped_name}.*"

    doc = mongo.db.products.find({"name": {"$regex": regex_pattern, "$options": "i"}}).sort("price", -1)
    doc_list = list(doc)
    for item in doc_list:
        item['_id'] = str(item['_id'])
    return jsonify(doc_list)

    # END CODE HERE

# @app.route("/search", methods=["GET"])
# def search():
#     # BEGIN CODE HERE
#
#     name = request.args.get("name")
#     #doc = mongo.db.products.find({"name": {"$regex": "^.*"+name+".*$"}}).sort("price", -1)
#     doc = mongo.db.products.find({"name": {"$regex": name, "$options": "i"}}).sort("price", -1)
#     doc_list = list(doc)
#     for item in doc_list:
#         item['_id'] = str(item['_id'])
#     return jsonify(doc_list)
#
#     # END CODE HERE


@app.route("/add-product", methods=["POST"])
def add_product():
    # BEGIN CODE HERE

    new_product = request.json
    exists = mongo.db.products.find_one({"name": new_product["name"]})
    if exists is not None:
        mongo.db.products.update_one({"name": new_product["name"]}, {"$set": {"production_year": new_product["production_year"], "price": new_product["price"], "color": new_product["color"], "size": new_product["size"]}})
        return "Updated"
    else:
        mongo.db.products.insert_one(new_product)
        return "Added"

    # END CODE HERE


@app.route("/content-based-filtering", methods=["POST"])
def content_based_filtering():
    # BEGIN CODE HERE
    
    Filter = request.get_json()

    F = np.array([
        float(Filter["price"]),
        float(Filter["production-year"]),
        float(Filter["size"]),
        float(Filter["color"])
    ])
    print(F)
    products = mongo.db.products.find()
    count = 0
    similarProducts = []

    for i in products:
        productCharacteristics = np.array([
            float(i["price"]),
            float(i["production-year"]),
            float(i["size"]),
            float(i["color"])
        ])

        Cos_Sim = np.dot(F, productCharacteristics) / (np.linalg.norm(F) * np.linalg.norm(productCharacteristics))

        if Cos_Sim > 0.7:
            print("Cos_Sim:", Cos_Sim)
            count = count + 1
            similarProducts.append(i)

    print(count)
    for i in similarProducts:
        print(i)
    return "Filtered"

    # END CODE HERE


@app.route("/crawler", methods=["GET"])
def crawler():
    # BEGIN CODE HERE
    
    try:
        semester = request.args.get("semester")
        url = "https://qa.auth.gr/el/x/studyguide/600000438/current"
        options = Options()
        # does not apper as window
        options.headless = True
        # setting a chrome browser
        driver = webdriver.Chrome(options=options)
        # goes to the specified url
        driver.get(url)
        tbodies = driver.find_elements(By.TAG_NAME, "tbody")
        all_subjects = []
        for tbody in tbodies:
            subjects = []
            tr_elements = tbody.find_elements(By.TAG_NAME, "tr")
            for tr_element in tr_elements:
                coursetitle = tr_element.get_attribute("coursetitle")
                subjects.append(coursetitle)
            all_subjects.append(subjects)
        del all_subjects[:2]
        if semester == "1":
            return jsonify(all_subjects[0]), 200
        elif semester == "2":
            return jsonify(all_subjects[1]), 200
        elif semester == "3":
            return jsonify(all_subjects[2]), 200
        elif semester == "4":
            return jsonify(all_subjects[3]), 200
        elif semester == "5":
            return jsonify(all_subjects[4]), 200
        elif semester == "6":
            return jsonify(all_subjects[5]), 200
        elif semester == "7":
            return jsonify(all_subjects[6]), 200
        elif semester == "8":
            return jsonify(all_subjects[7]), 200
        else:
            return "Λάθος εξάμηνο"
    except Exception as e:
        return "BAD REQUEST", 400
    
    # END CODE HERE

