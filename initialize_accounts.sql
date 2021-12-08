CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    passw TEXT NOT NULL 
);

INSERT INTO accounts (username, passw) VALUES ("Bob", "secret");
INSERT INTO accounts (username, passw) VALUES ("Carla", "123");

SELECT * FROM accounts;