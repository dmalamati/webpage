# BEGIN CODE HERE
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from pymongo import TEXT

from flask import jsonify, request
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
    doc = mongo.db.products.find({"name": {"$regex": "^.*"+name+".*$"}}).sort("price", -1)
    doc_list = list(doc)
    for item in doc_list:
        item['_id'] = str(item['_id'])
    return jsonify(doc_list)
    # if doc is not None:
    #     for x in doc:
    #         print(x)
    #     return "found"
    # return "not found"

    # END CODE HERE


@app.route("/add-product", methods=["POST"])
def add_product():
    # BEGIN CODE HERE

    new_product = request.json
    print(new_product)
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
    return ""
    # END CODE HERE


@app.route("/crawler", methods=["GET"])
def crawler():
    # BEGIN CODE HERE
    return ""
    # END CODE HERE
