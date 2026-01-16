from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from  database import client

overlays_bp = Blueprint("overlays", __name__)

def get_collection(mongo):
    return client.rstp.overlays


# CREATE overlay
@overlays_bp.route("/", methods=["POST"])
def create_overlay():
    data = request.json

    overlay = {
        "type": data["type"],  # text | image
        "content": data["content"],
        "position": data.get("position", {"x": 0, "y": 0}),
        "size": data.get("size", {"width": 100, "height": 50}),
        "created_at": datetime.now()
    }

    # mongo = request.app.mongo
    result = get_collection(client).insert_one(overlay)

    return jsonify({"id": str(result.inserted_id)}), 201


# READ all overlays
@overlays_bp.route("/", methods=["GET"])
def get_overlays():
    overlays = list(get_collection(client).find())

    for o in overlays:
        o["_id"] = str(o["_id"])

    return jsonify(overlays)


# READ single overlay
@overlays_bp.route("/<id>", methods=["GET"])
def get_overlay(id): 
    overlay = get_collection(client).find_one({"_id": ObjectId(id)})

    if not overlay:
        return jsonify({"error": "Overlay not found"}), 404

    overlay["_id"] = str(overlay["_id"])
    return jsonify(overlay)


# UPDATE overlay
@overlays_bp.route("/<id>", methods=["PUT"])
def update_overlay(id):
    data = request.json

    update_data = {
        "type": data.get("type"),
        "content": data.get("content"),
        "position": data.get("position"),
        "size": data.get("size")
    }

    update_data = {k: v for k, v in update_data.items() if v is not None}

    result = get_collection(client).update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Overlay not found"}), 404

    return jsonify({"message": "Overlay updated", "data" : {
       "_id" : str(ObjectId(id)) 
    }})


# DELETE overlay
@overlays_bp.route("/<id>", methods=["DELETE"])
def delete_overlay(id): 

    result = get_collection(client).delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Overlay not found"}), 404

    return jsonify({"message": "Overlay deleted", "data" : {
       "_id" : str(ObjectId(id)) 
    }})

