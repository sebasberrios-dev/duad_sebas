from flask import request, jsonify
class Controller:
    @staticmethod
    def serialize_row(row, date_fields=None):
        d = dict(row)
        if date_fields:
            for field in date_fields:
                if field in d and hasattr(d[field], "strftime"):
                    d[field] = d[field].strftime("%Y-%m-%d")
        return d

    @staticmethod
    def serialize_list(rows, date_fields=None):
        return [Controller.serialize_row(row, date_fields) for row in rows]

    @staticmethod
    def filter_by_id(items, id_filter):
        if id_filter:
            items = [item for item in items if str(item['id']) == str(id_filter)]
        return items

    @staticmethod
    def filter_by_field(items, field_name, field_value):
        if field_value:
            items = [item for item in items if str(item.get(field_name)) == str(field_value)]
        return items
    
    @staticmethod
    def filter_request_params(items, filterable_fields):
        for field in filterable_fields:
            field_value = request.args.get(field)
            if field_value:
                items = Controller.filter_by_field(items, field, field_value)
        return items
    
    def execute_get_method(self, item_repo, fields_list, entity_name):
        items = item_repo.read()
        filtered_data = self.filter_request_params(items, fields_list)

        if not filtered_data:
            return jsonify({"error": f"No {entity_name} available"}), 404
        
        return jsonify(filtered_data), 200
    
    def execute_post_method(self, item_repo, required_fields, entity_name, **data):
        for field in required_fields:
            if field not in data or data[field] is None:
                return jsonify({"error": f"Missing data to create {entity_name}"}), 400
        
        new_item = item_repo.create(**data)
        if new_item:
            return jsonify({"message": f"{entity_name} created successfully.", f"{entity_name.lower()}_id": new_item.id}), 201
        else:
            return jsonify({"error": f"could not create {entity_name}"}), 400
    
    def execute_put_method(self, item_repo, item_id, updated_fields, entity_name):
        if not updated_fields:
            return jsonify({"error": "No data provided to update"}), 400
        
        success = item_repo.update(item_id, **updated_fields)
        if success:
            return jsonify({"message": f"{entity_name} updated successfully."}), 200
        else:
            return jsonify({"error": f"Could not update {entity_name} with ID {item_id}"}), 400
        
    def execute_delete_method(self, item_repo, item_id, entity_name):
        success = item_repo.delete(item_id)
        if success:
            return jsonify({"message": f"{entity_name} deleted successfully."}), 200
        else:
            return jsonify({"error": f"could not delete {entity_name} with ID {item_id}"}), 400
        