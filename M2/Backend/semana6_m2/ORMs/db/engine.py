from sqlalchemy import create_engine
db_url = "postgresql://postgres:sebas0408@localhost:5432/postgres"
engine = create_engine(db_url, echo=True)


    