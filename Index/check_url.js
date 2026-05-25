const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.get("SELECT value FROM settings WHERE key='instagram_url'", (err, row) => {
    console.log(row ? row.value : 'No instagram_url found');
});
