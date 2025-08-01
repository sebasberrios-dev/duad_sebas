from sqlalchemy import insert, select, update, delete
from db.engine import engine
from db.tables import users_table

class UserRepository:
    def __init__(self):
        self.engine = engine
    
    def create_user(self, full_name, email, username, password):
        try:
            stmt = insert(users_table).values({
                "full_name": full_name, 
                "email": email, 
                "username": username, 
                "password": password
                })
            with self.engine.connect() as conn:
                if conn.execute(stmt):
                    print('Usuario creado exitosamente.')
                    conn.commit()
        except Exception as e:
            print(f"Error al crear el usuario: {e}")


    def update_user(self, user_id, updated_fields: dict):
        try:
            stmt = (update(users_table)
                .where(users_table.c.id == user_id)
                .values(**updated_fields)
            )
            with self.engine.connect() as conn:
                conn.execute(stmt)
                conn.commit()
        except Exception as e:
            print(f"Error al modificar el usuario: {e}") 


    def delete_user(self, user_id):
        try:
            stmt = (delete(users_table)
                    .where(users_table.c.id == user_id)
            )
            with self.engine.connect() as conn:
                conn.execute(stmt)
                conn.commit()
        except Exception as e:
            print(f"Error al eliminar el usuario: {e}") 
        

    def get_all_users(self):
        try:
            stmt = select(users_table)
            with self.engine.connect() as conn:
                result = conn.execute(stmt)
                for row in result.mappings():
                    print(row)
        except Exception as e:
            print(f"Error al obtener los usuarios: {e}")

                
        
        

