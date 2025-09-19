from sqlalchemy import MetaData, Table, Column, Integer, String, ForeignKey
from db.engine import engine

metadata_obj = MetaData(schema='lyfter_semana_6')

users_table = Table(
    "users",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("full_name", String(50)),
    Column("email", String(100), unique=True, nullable=False),
    Column("username", String(100), unique=True, nullable=False),
    Column("password", String(100), unique=True, nullable=False)
)

addresses_table = Table(
    "address",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("address", String(100), nullable=False),
    Column("user_id", ForeignKey("users.id"), nullable=False)
)

cars_table = Table(
    "cars",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("make", String(30), nullable=False),
    Column("model", String(30), nullable=False),
    Column("year", Integer, nullable=False),
    Column("user_id", ForeignKey("users.id"), nullable=True)
)

metadata_obj.create_all(engine)

