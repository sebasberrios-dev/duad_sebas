from db.db_manager import db_manager

class UserRepository:
    def __init__(self):
        self.db_manager = db_manager
    
    def _format_user(self, user_data):
        return {
            "id": user_data[0],
            "full_name": user_data[1],
            "email": user_data[2],
            "username": user_data[3],
            "password": user_data[4],
            "birthdate": user_data[5],
            "user_status": user_data[6]
        }
    

    def create_user(self, full_name, email, username, password, birthdate, user_status):
        try:
            query = """
            INSERT INTO lyfter_car_rental.users (full_name, email, username, password, birthdate, user_status) VALUES (%s, %s, %s, %s, %s, %s);
            """
            if self.db_manager.execute_query(query, full_name, email, username, password, birthdate, user_status):
                print("Usuario creado exitosamente.")
                return True
            else:
                print("Error al crear el usuario.")
                return False
        
        except Exception as e:
            print(f"Error creando el usuario: {e}")
            return False
    

    def update_user_status(self, _user_id, new_status):
        try:
            query = """
            UPDATE lyfter_car_rental.users SET user_status = %s WHERE id = %s;
            """
            if self.db_manager.execute_query(query, new_status, _user_id):
                print("Estado del usuario actualizado exitosamente.")
                return True
            else:
                print("Error al actualizar el estado del usuario.")
                return False
        
        except Exception as e:
            print(f"Error actualizando el estado del usuario: {e}")
            return False
    

    def get_all_users(self):
        try:
            results = self.db_manager.execute_query(
                "SELECT id, full_name, email, username, password, birthdate, user_status FROM lyfter_car_rental.users;"
                )
            formatted_users = [self._format_user(result) for result in results]
            return formatted_users
        
        except Exception as e:
            print(f"Error al obtener los usuarios: {e}")
            return False

    
        

        