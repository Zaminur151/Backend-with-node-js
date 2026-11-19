const db = require("./database");

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     description TEXT DEFAULT '',
     completed INTEGER DEFAULT 0,
     created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
    `);

function toTask(row) {
    return row ? { ...row, completed: Boolean(row.completed) } : undefined;
}

const Task = {
    create({ title, description, completed }) {
        const info = db
            .prepare("INSERT INTO tasks (title, description, completed) VALUES(?,?,?)")
            .run(title, description, completed ? 1 : 0);
        return this.find(info.lastInsertRowid);
    },

    all() {
        return db.prepare("SELECT* FROM tasks").all().map(toTask);
    },

    find(id) {
        return toTask(db.prepare("SELECT * FROM tasks WHERE id = ?").get(id));
    },

    update(id, { title, description, completed }) {
        const info = db
            .prepare("UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?")
            .run(title, description, completed ? 1 : 0, id);
        return info.changes === 0 ? undefined : this.find(id);
    },

    remove(id) {
        return db.prepare("DELETE FROM tasks WHERE id = ?").run(id).changes > 0;
    },
};

module.exports = Task;
