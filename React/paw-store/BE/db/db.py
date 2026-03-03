from sqlalchemy import create_engine
from sqlalchemy import Table, Column, Integer, String
from sqlalchemy import MetaData

class DBManager:
    def __init__(self):
        url = "postgresql://postgres:sebas0408@localhost:5432/postgres"
        self.engine = create_engine(url)
        metadata_obj.create_all(self.engine)

metadata_obj = MetaData(schema="paw_store")

users_table  = Table(
    "users",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("full_name", String(100), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("role", String(20), nullable=False)
)

products_table = Table(
    "products",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("name", String(100), nullable=False),
    Column("description", String(255), nullable=False),
    Column("price", Integer, nullable=False),
    Column("category", String(50), nullable=True),
    Column("stock", Integer, nullable=False),
    Column("image_url", String(255), nullable=True)
)