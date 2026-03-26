from sqlalchemy import create_engine
from sqlalchemy import Table, Column, Integer, String, ForeignKey, Float, DateTime, UniqueConstraint
from sqlalchemy import MetaData
from datetime import datetime, timezone

def utc_now():
    return datetime.now(timezone.utc)

class DBManager:
    def __init__(self):
        url = "postgresql://postgres:sebas0408@localhost:5432/postgres"
        self.engine = create_engine(url)
        metadata_obj.create_all(self.engine)

metadata_obj = MetaData(schema="paw_store")

users = Table(
    "users",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("full_name", String(100), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("role", String(20), nullable=False)
)

products = Table(
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

shopping_cart = Table(
    "shopping_cart",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("status", String(20), nullable=False, default="active"),
)

cart_products = Table(
    "cart_products",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("cart_id", Integer, ForeignKey("shopping_cart.id"), nullable=False),
    Column("product_id", Integer, ForeignKey("products.id"), nullable=False),
    Column("quantity", Integer, nullable=False),
    UniqueConstraint("cart_id", "product_id", name="uix_cart_products")
)

orders = Table(
    "orders",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("cart_id", Integer, ForeignKey("shopping_cart.id"), nullable=False),
    Column("total_price", Float, nullable=False),
    Column("created_at", DateTime, default=utc_now),
    Column("status", String(20), nullable=False)
)

order_products = Table(
    "order_products",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("order_id", Integer, ForeignKey("orders.id"), nullable=False),
    Column("product_id", Integer, ForeignKey("products.id"), nullable=False),
    Column("quantity", Integer, nullable=False),
    Column("price_at_purchase", Float, nullable=False),
    UniqueConstraint("order_id", "product_id", name="uix_order_products")
)

billing_info = Table(
    "billing_info",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("full_name", String(100), nullable=False),
    Column("email", String(100), nullable=False),
    Column("shipping_address", String(255), nullable=False),
    Column("phone_number", String(20), nullable=False),
)

order_info = Table(
    "order_info",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("order_id", Integer, ForeignKey("orders.id"), nullable=False),
    Column("billing_info_id", Integer, ForeignKey("billing_info.id"), nullable=False),
)
