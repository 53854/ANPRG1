CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    passw TEXT NOT NULL 
);

INSERT INTO accounts (username, passw) VALUES ("Bob", "secret");
INSERT INTO accounts (username, passw) VALUES ("Carla", "123");