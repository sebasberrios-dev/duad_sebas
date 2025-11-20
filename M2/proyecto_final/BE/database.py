from sqlalchemy import create_engine
from sqlalchemy import MetaData
from sqlalchemy import Table, Column
from sqlalchemy import String, Integer, DateTime, Text, JSON, Boolean, ForeignKey
from datetime import datetime

class DBManager:
    def __init__(self):
        # Use SQLite for testing - change this to PostgreSQL URL when deploying
        url = "postgresql://postgres:sebas0408@localhost:5432/postgres"
        self.engine = create_engine(url, echo=False)
        metadata_obj.create_all(self.engine)

metadata_obj = MetaData(schema="lyfter_dnd")

users_table = Table(
    "users",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("username", String(50), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("role", String(20), nullable=False),  # player, dm, admin
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)

characters_table = Table(
    "characters", 
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("name", String(100), nullable=False),
    Column("race", String(20), nullable=False),  # human, elf, gnome
    Column("class", String(20), nullable=False),  # warrior, wizard, rogue
    Column("level", Integer, nullable=False, default=1),
    Column("attributes", JSON, nullable=False),
    Column("story", Text, nullable=False),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)

games_table = Table(
    "games",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("dm_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("title", String(150), nullable=False),
    Column("description", Text, nullable=False),
    Column("link", String(255), nullable=True),
    Column("is_active", Boolean, nullable=False, default=True),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)

participants_table = Table(
    "participants",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("character_id", Integer, ForeignKey("characters.id"), nullable=False),
    Column("joined_at", DateTime, nullable=False, default=datetime.utcnow),
)

darts_throws_table = Table(
    "darts_throws",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("participant_id", Integer, ForeignKey("participants.id"), nullable=False),
    Column("dart_type", String(10), nullable=False),  # d4, d6, d8, d10, d12, d20
    Column("visible_to_dm", Boolean, nullable=False, default=True),
    Column("visible_to_players", Boolean, nullable=False, default=False),
    Column("throw_value", Integer, nullable=False),
    Column("thrown_at", DateTime, nullable=False, default=datetime.utcnow),
)

chat_messages_table = Table(
    "chat_messages",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("message", Text, nullable=False), 
    Column("sent_at", DateTime, nullable=False, default=datetime.utcnow),
)

npcs_table = Table(
    "npcs",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), nullable=False),
    Column("name", String(100), nullable=False),
    Column("description", Text, nullable=False),
    Column("attributes", JSON, nullable=False),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)
