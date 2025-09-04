from sqlalchemy import create_engine 
from sqlalchemy import MetaData
from sqlalchemy import Table, Column
from sqlalchemy import String, Integer, Float, DateTime, BigInteger, ForeignKey
from datetime import datetime

class DBManager:
    def __init__(self):
        url = "PLACEHOLDER_FOR_DB_URL"
        self.engine = create_engine(url, echo=False)
        metadata_obj.create_all(self.engine)

metadata_obj = MetaData(schema="lyfter_ecommerce")

user_table = Table(
    "users",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("username", String(100), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(50), nullable=False),
    Column("role", String(20), nullable=False)
)

product_table = Table(
    "products",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("name", String(100), nullable=False),
    Column("price", Float, nullable=False),
    Column("stock", Integer, nullable=False),
    Column("entry_date", DateTime, nullable=False, default=datetime.now())
)

cart_table = Table(
    "carts",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("user_id", ForeignKey("users.id"), nullable=False),
    Column("creation_date", DateTime, nullable=False, default=datetime.now()),
    Column("status", String(20), nullable=False)
)

product_cart_table = Table(
    "product_carts",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("cart_id", ForeignKey("carts.id"), nullable=False),
    Column("product_id", ForeignKey("products.id"), nullable=False),
    Column("quantity", Integer, nullable=False)
)

invoice_table = Table(
    "invoices",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("cart_id", ForeignKey("carts.id"), nullable=False),
    Column("address", String(255), nullable=False),
    Column("payment_details", BigInteger, nullable=False),
    Column("issue_date", DateTime, nullable=False, default=datetime.now()),
    Column("total", Float, nullable=False)
)