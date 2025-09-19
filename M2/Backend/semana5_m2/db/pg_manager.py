import psycopg2

class PgManager:
    def __init__(self, db_name, user, password, host, port=5432):
        self.db_name = db_name
        self.user = user
        self.password = password
        self.host = host
        self.port = port

        self.connection = self.create_connection(db_name, user, password, host, port)
        if self.connection:
            self.cursor = self.connection.cursor()
            print("Conexión exitosa!")
        
    def create_connection(self, db_name, user, password, host, port):
        try:
            connection = psycopg2.connect(
            dbname=db_name,
            user=user,
            password=password,
            host=host,
            port=port
            )
            return connection
        except Exception as e:
            print("Error en la conexión: ", e)
            return None
    
    def close_connection(self):
        try:
            if self.cursor:
                self.cursor.close()
            if self.connection:
                self.connection.close()
            print("Conexión cerrada.")
            
        except Exception as e:
            print("Error al cerrar la conexión: ", e)

    
    def execute_query(self, query, *args):
        try:
            self.cursor.execute(query, args)
            self.connection.commit()

            if self.cursor.description:
                results = self.cursor.fetchall()
                return results
            
            return True
            
        except Exception as e:
            print("Error al ejecutar la consulta: ", e)
            return None
    