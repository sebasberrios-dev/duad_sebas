from sqlalchemy import insert, select, update, delete
from db.engine import engine
from db.tables import addresses_table

class AddressRepository:
    def __init__(self):
        self.engine = engine
    
    def create_address(self, address, user_id):
        try:
            stmt = insert(addresses_table).values({
                "address": address, 
                "user_id": user_id
                })
            with self.engine.connect() as conn:
               if conn.execute(stmt):
                    print('Dirección creada exitosamente.')
                    conn.commit()
        except Exception as e:
            print(f"Error al crear la dirección: {e}")

    
    def update_address(self, address_id, updated_fields: dict):
        try:
            stmt = (update(addresses_table)
                    .where(addresses_table.c.id == address_id)
                    .values(**updated_fields)
            )
            with self.engine.connect() as conn:
                conn.execute(stmt)
                conn.commit()
        except Exception as e:
            print(f"Error al modificar la dirección: {e}")


    def delete_address(self, address_id):
        try:
            stmt = (delete(addresses_table)
                    .where(addresses_table.c.id == address_id)
            )
            with self.engine.connect() as conn:
                conn.execute(stmt)
                conn.commit()
        except Exception as e:
            print(f"Error al eliminar la dirección: {e}")
        
    
    def get_all_addresses(self):
        try:
            stmt = select(addresses_table)
            with self.engine.connect() as conn:
                result = conn.execute(stmt)
                for row in result.mappings():
                    print(row)
        except Exception as e:
            print(f"Error al obtener las direcciones: {e}")


        
             
        