import redis 
import json 

class CacheManager:
    def __init__(self, host, port, password, *args, **kwargs):
        self.redis_client = redis.Redis(
            host=host,
            port=port,
            password=password,
            *args, 
            **kwargs
        )
        if self.redis_client.ping():
            print("Conexión a Redis exitosa.")
        
    def store_data(self, key, value, expiration=None):
        try:
            if expiration is None:
                self.redis_client.set(key, value)
                print(f"Clave '{key}' creada con el valor '{value}'.")
            else:
                self.redis_client.setex(key, expiration, value)
                print(f"Clave '{key}' creada con el valor '{value}' y expiración de {expiration} segundos.")
        except redis.RedisError as e:
            print(f"Error al almacenar datos en Redis: {e}")
        
    def check_key(self, key):
        try:
            key_exists = self.redis_client.exists(key)
            if key_exists:
                print(f"La clave '{key}' existe en Redis.")
                exp = self.redis_client.ttl(key)
                if exp:
                    print(f"La clave '{key}' tiene una expiración de {exp} segundos.")
                
                return True, exp
            
            print(f"La clave '{key}' no existe en Redis.")
            return False, None
        except redis.RedisError as e:
            print(f"Error al verificar la clave '{key}' en Redis: {e}")
            return False, None
    
    def get_data(self, key):
        try:
            output = self.redis_client.get(key)
            if output is not None:
                result = output.decode('utf-8')
                print(f"Valor obtenido de Redis para la clave '{key}': {result}")
                return result
            else:
                print(f"No se encontró ningún valor para la clave '{key}'.")
                return None
        except redis.RedisError as e:
            print(f"Error al obtener datos de Redis: {e}")
            return None
    
    def delete_data(self, key):
        try:
            output = self.redis_client.delete(key)
            if output > 0:
                print(f"La clave '{key}' ha sido eliminada de Redis.")
            else:
                print(f"La clave '{key}' no existe en Redis o ya ha sido eliminada.")
            
            return output == 1
        except redis.RedisError as e:
            print(f"Error al eliminar la clave '{key}' de Redis: {e}")
            return False
    
    def delete_data_with_pattern(self, pattern):
        try:
            for key in self.redis_client.scan_iter(match=pattern):
                self.delete_data(key)
        except redis.RedisError as e:
            print(f"Error al eliminar claves con el patrón '{pattern}': {e}")

    def cache_or_query(self, key, query, expiration=None):
        try:
            cached = self.get_data(key)
            if cached:
                return json.loads(cached)
            
            result = query()
            if result is not None:
                self.store_data(key, json.dumps(result), expiration)
            
            return result

        except Exception as e:
            print(f"Error en cache_or_query: {e}")
            return None
