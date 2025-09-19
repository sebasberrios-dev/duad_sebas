from db.db_manager import db_manager

class RentalsRepository:
    def __init__(self, car_repo, user_repo):
        self.db_manager = db_manager
        self.car_repo = car_repo
        self.user_repo = user_repo
    
    def _format_rental(self, rental):
        return {
            "id": rental[0],
            "user_id": rental[1],
            "car_id": rental[2],
            "rental_date": rental[3],
            "rental_status": rental[4]
        }

    def create_rental(self, user_id, car_id, rental_date, rental_status='in time'):
        try:
            query = """
            INSERT INTO lyfter_car_rental.rentals (user_id, car_id, rental_date, rental_status) VALUES (%s, %s, %s, %s);
            """
            if self.db_manager.execute_query(query, user_id, car_id, rental_date, rental_status):
                print("Alquiler creado correctamente.")
                self.car_repo.update_car_status(car_id, 'rented')
                return True
            else:
                print("Error al crear el alquiler.")
                return False         

        except Exception as e:
            print(f"Error creando la renta: {e}")
        
    def update_rental_status(self, rental_id, new_status):
        try:
            query = """
            UPDATE lyfter_car_rental.rentals SET rental_status = %s WHERE id = %s;
            """
            car_id_query = """
            SELECT car_id FROM lyfter_car_rental.rentals WHERE id = %s;
            """
            user_id_query = """
            SELECT user_id FROM lyfter_car_rental.rentals WHERE id = %s;
            """

            if self.db_manager.execute_query(query, new_status, rental_id):
                print("Estado del alquiler actualizado exitosamente.")
                if new_status == 'returned':
                    car_result = self.db_manager.execute_query(car_id_query, rental_id)
                    if car_result:
                        car_id = car_result[0][0]
                        self.car_repo.update_car_status(car_id,'available')
                    user_result = self.db_manager.execute_query(user_id_query, rental_id)
                    if user_result:
                        user_id = user_result[0][0]
                        self.user_repo.update_user_status(user_id, 'per day')

                elif new_status == 'overdue':
                    result = self.db_manager.execute_query(user_id_query, rental_id)
                    if result:
                        user_id = result[0][0]
                        self.user_repo.update_user_status(user_id, 'defaulter')  

                return True
            else:
                print("Error al actualizar el estado del alquiler.")
                return False
            
        except Exception as e:
            print(f"Error actualizando el estado del alquiler: {e}")
            return False
    
    def get_all_rentals(self):
        try:
            results = self.db_manager.execute_query(
                "SELECT id, user_id, car_id, rental_date, rental_status FROM lyfter_car_rental.rentals;"
            )
            if results:
                formatted_rentals = [self._format_rental(result) for result in results]
                return formatted_rentals
            else:
                print("No se encontraron alquileres.")
                return False
        
        except Exception as e:
            print(f"Error al obtener los alquileres: {e}")
            return False
