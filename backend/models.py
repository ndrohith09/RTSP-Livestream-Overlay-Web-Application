def overlay_schema(overlay):
    return {
        "id": str(overlay["_id"]),  
        "type": overlay["type"],
        "content": overlay["content"],
        "position": overlay["position"],
        "size": overlay["size"],
        "created_at": overlay["created_at"]
    }
