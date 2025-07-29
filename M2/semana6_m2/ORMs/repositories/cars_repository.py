from sqlalchemy import insert, select, update, delete
from db.engine import engine
from db.tables import cars_table

class CarRepository:
    def __init__(self):
        self.engine = engine
    
    def create_car(self, make, model, year, user_id):
        try:
            stmt = insert(cars_table).values({
                "make": make, 
                "model": model, 
                "year": year, 
                "user_id": user_id
                })
            with self.engine.connect() as conn:
                conn.execute(stmt)
                conn.commit()
        except Exception as e:
            print(f"Error al crear el vehículo {e}")
        
    ## Para asociar el vehículo con un usuario se modifica la columna de user_id y se inserta el id del usuario al que queremos asociar
    def update_car(self, car_id, updated_fields: dict):
        try:
            stmt = (update(cars_table)
                    .where(cars_table.c.id == car_id)
                    .values(**updated_fields)
            )
            with self.engine.connect() as conn:
                if conn.execute(stmt):
                    print('Vehículo creado exitosamente.')
                    conn.commit()
        except Exception as e:
            print(f"Error al modificar el vehículo {e}")
        
    
    def delete_car(self, car_id):
        try:
            stmt = (delete(cars_table)
                    .where(cars_table.c.id == car_id)
            )
            with self.engine.connect() as conn:
                conn.execute(stmt)
                conn.commit()
        except Exception as e:
            print(f"Error al eliminar el vehículo {e}")
        

    def get_all_cars(self):
        try:
            stmt = select(cars_table)
            with self.engine.connect() as conn:
                result = conn.execute(stmt)
                for row in result.mappings():
                    print(row)
        except Exception as e:
            print(f"Error al obtener los vehículos {e}")


    

