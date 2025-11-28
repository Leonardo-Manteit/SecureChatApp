CREATE TABLE SCA_users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE, -- helps against repudiation.
    password_digest TEXT NOT NULL
);