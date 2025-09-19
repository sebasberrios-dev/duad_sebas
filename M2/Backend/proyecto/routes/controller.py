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