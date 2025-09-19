db.py
Insertar url de la base de datos de postgresql en la variable url que contiene
un "PLACEHOLDER_FOR_DB_URL". La db y sus modelos se inicializan al momento de ejecutar el app 
Con la clase DBManager ejecutamos todos los queries de los repositorios con el .engine
-------------------------------------------------------------------------------------------------
cache_manager.py
Con la clase CacheManager operamos lo que es el cache. Se instancia en las rutas a utilizar
y como parametros insertamos el host, port y password de nuestra db en Redis.
-------------------------------------------------------------------------------------------------
app.py 
Ejecutamos el app que contiene los blueprints de las rutas.
