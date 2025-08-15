from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column, Integer, Float, String, Date, ForeignKey

class DBManager:
    def __init__(self):
        url = "postgresql://postgres:sebas0408@localhost:5432/postgres"
        self.engine = create_engine(url, echo=False)
        metadata_obj.create_all(self.engine)


metadata_obj = MetaData(schema="lyfter_store")

user_table = Table(
    "users",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("username", String(30), nullable=False),
    Column("password", String, nullable=False),
    Column("role", String(15), nullable=False)
)

product_table = Table(
    "products",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("name", String(50), nullable=False),
    Column("price", Float, nullable=False),
    Column("entry_date", Date, nullable=False),
    Column("quantity", Integer, nullable=False)
)

invoice_table = Table(
    "invoices",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("user_id", ForeignKey("users.id"), nullable=False),
    Column("product_id", ForeignKey("products.id"), nullable=False),
    Column("total", Float, nullable=False),
    Column("date_created", Date, nullable=False)
)



        

    

