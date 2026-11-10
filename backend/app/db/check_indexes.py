from sqlalchemy import text
from app.core.database import engine

def check_indexes():
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;")
        )
        print("=== Database Indexes in PostgreSQL ===")
        for r in result:
            print(f"{r[0]}: {r[1]}")

if __name__ == "__main__":
    check_indexes()

