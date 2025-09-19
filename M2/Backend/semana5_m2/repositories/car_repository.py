from db.db_manager import db_manager

class CarRepository:
    def __init__(self):
        self.db_manager = db_manager
    

    def _format_car(self, car_data):
        return {
            "id": car_data[0],
            "make": car_data[1],
            "model": car_data[2],
            "year": car_data[3],
            "car_status": car_data[4]
        }
    

    def create_car(self, make, model, year, car_status):
        try:
            query = """
            INSERT INTO lyfter_car_rental.cars (make, model, year, car_status) VALUES (%s, %s, %s, %s)
            """
            if self.db_manager.execute_query(query, make, model, year, car_status):
                print("Auto creado exitosamente.")
                return True
            else:
                print("Error al crear el auto.")
                return False
        
        except Exception as e:
            print(f"Error creando el auto: {e}")
            return False
    

    def update_car_status(self, _car_id, new_status):
        try:
            query = """
            UPDATE lyfter_car_rental.cars SET car_status = %s WHERE id = %s;
            """
            if self.db_manager.execute_query(query, new_status, _car_id):
                print("Estado del auto actualizado exitosamente.")
                return True
            else:
                print("Error al actualizar el estado del auto.")
                return False
        
        except Exception as e:
            print(f"Error actualizando el estado del auto: {e}")
            return False
        
    
    def get_all_cars(self):
        try:
            results = self.db_manager.execute_query(
                "SELECT id, make, model, year, car_status FROM lyfter_car_rental.cars;"
            )
            formatted_cars = [self._format_car(result) for result in results]
            return formatted_cars
        
        except Exception as e:
            print(f"Error al obtener los autos: {e}")
            return False