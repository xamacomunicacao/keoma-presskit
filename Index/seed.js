const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, type TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
    db.run("DELETE FROM videos");
    db.run("INSERT INTO videos (url, type) VALUES ('https://www.youtube.com/embed/8z4KxPOafzk', 'highlight')");
    db.run("INSERT INTO videos (url, type) VALUES ('https://www.youtube.com/embed/6pcOKSp9F0A', 'secondary')");
    db.run("INSERT INTO videos (url, type) VALUES ('https://www.youtube.com/embed/i_87Je0cMog', 'secondary')");
    console.log('Videos seeded');
});
