CREATE TABLE fanfixion_episodes (
    id SERIAL PRIMARY KEY,
    image TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id INTEGER REFERENCES fanfixion_users(id)
);