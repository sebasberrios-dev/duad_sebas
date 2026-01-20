from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column
from sqlalchemy import String, Integer, DateTime, Text, JSON, Boolean, ForeignKey
from datetime import datetime, timezone

class DBManager:
    def __init__(self):
        url = "postgresql://postgres:sebas0408@localhost:5432/postgres"
        self.engine = create_engine(url, echo=False)
        metadata_obj.create_all(self.engine)

metadata_obj = MetaData(schema="lyfter_dnd")

def utc_now():
    return datetime.now(timezone.utc)

users_table = Table(
    "users",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("username", String(50), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("role", String(50), nullable=False),
    Column("created_at", DateTime, nullable=False, default=utc_now),
)

characters_table = Table(
    "characters", 
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("name", String(100), nullable=False),
    Column("race", String(50), nullable=False),
    Column("class", String(50), nullable=False),
    Column("level", Integer, nullable=False, default=1),
    Column("xp", Integer, nullable=False, default=0),
    Column("attributes", JSON, nullable=False),
    Column("story", Text, nullable=False),
    Column("created_at", DateTime, nullable=False, default=utc_now),
)

games_table = Table(
    "games",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("title", String(150), nullable=False),
    Column("description", Text, nullable=False),
    Column("link", String(255), nullable=True),
    Column("is_active", Boolean, nullable=False, default=True),
    Column("created_at", DateTime, nullable=False, default=utc_now),
)

participants_table = Table(
    "participants",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("character_id", Integer, ForeignKey("characters.id"), nullable=True),
    Column("joined_at", DateTime, nullable=False, default=utc_now),
)

darts_throws_table = Table(
    "darts_throws",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("participant_id", Integer, ForeignKey("participants.id"), nullable=False),
    Column("dart_type", String(10), nullable=False),
    Column("visible_to_dm", Boolean, nullable=False, default=True),
    Column("visible_to_players", Boolean, nullable=False, default=False),
    Column("throw_value", Integer, nullable=False),
    Column("thrown_at", DateTime, nullable=False, default=utc_now),
)

chat_messages_table = Table(
    "chat_messages",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("message", Text, nullable=False), 
    Column("sent_at", DateTime, nullable=False, default=utc_now),
)

npcs_table = Table(
    "npcs",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("name", String(100), nullable=False),
    Column("role", String(50), nullable=False),
    Column("level", Integer, nullable=False, default=1),
    Column("description", Text, nullable=False),
    Column("attributes", JSON, nullable=False),
    Column("hp", Integer, nullable=False, default=15),
    Column("created_at", DateTime, nullable=False, default=utc_now),
)

items_table = Table(
    "items",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("name", String(100), nullable=False),
    Column("description", Text, nullable=False),
    Column("type", String(50), nullable=False),
    Column("attributes", JSON, nullable=False),
    Column("rarity", String(50), nullable=False),
    Column("created_at", DateTime, nullable=False, default=utc_now),
)

inventories_table = Table(
    "inventories",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("character_id", Integer, ForeignKey("characters.id"), nullable=False),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("updated_at", DateTime, nullable=False, default=utc_now, onupdate=utc_now),
)

inventory_items_table = Table(
    "inventory_items",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("inventory_id", Integer, ForeignKey("inventories.id"), nullable=False),
    Column("item_id", Integer, ForeignKey("items.id"), nullable=False),
    Column("quantity", Integer, nullable=False, default=1),
    Column("created_at", DateTime, nullable=False, default=utc_now),
)

notes_table = Table(
    "notes",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("visible_for_players", Boolean, nullable=False, default=False),
    Column("visible_for_dm", Boolean, nullable=False, default=True),
    Column("content", Text, nullable=False),
    Column("updated_at", DateTime, nullable=False, default=utc_now, onupdate=utc_now),
)

combat_state_table = Table(
    "combat_state",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("npc_id", Integer, ForeignKey("npcs.id"), nullable=False),
    Column("npc_current_hp", Integer, nullable=False),
    Column("npc_max_hp", Integer, nullable=False),
    Column("max_rolls", Integer, nullable=False),
    Column("current_rolls", Integer, nullable=False, default=0),
    Column("is_active", Boolean, nullable=False, default=True),
    Column("created_at", DateTime, nullable=False, default=utc_now),
)

coins_table = Table(
    "coins",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("character_id", Integer, ForeignKey("characters.id"), nullable=False),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("amount", Integer, nullable=False, default=0),
    Column("updated_at", DateTime, nullable=False, default=utc_now, onupdate=utc_now),
)
