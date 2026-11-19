const express = require("express");
const Task = require("./models");
const { TaskCreate } = require("./schemas");

const app = express();
app.use(express.json()); // JSON বডি পড়ার জন্য



// ID যাচাই করার সহায়ক ফাংশন
function getId(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(422).json({ detail: "id must be an integer" });
        return null;
    }
    return id;
}



app.get("/", (req, res) => {
    res.json({ message: "My Express Backend is running!" });
});

// Create
app.post("/tasks", (req, res) => {
    const result = TaskCreate.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({ detail: result.error.issues });
    }
    const task = Task.create(result.data);
    res.status(201).json(task);
});

// Read all
app.get("/tasks", (req, res) => {
    res.json(Task.all());
});

// Read one
app.get("/tasks/:id", (req, res) => {
    const id = getId(req, res);
    if (id === null) return;

    const task = Task.find(id);
    if (!task) return res.status(404).json({ detail: "Task not found" });
    res.json(task);
});

// Update
app.put("/tasks/:id", (req, res) => {
    const id = getId(req, res);
    if (id === null) return;

    const result = TaskCreate.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({ detail: result.error.issues });
    }
    const task = Task.update(id, result.data);
    if (!task) return res.status(404).json({ detail: "Task not found" });
    res.json(task);
});

// Delete
app.delete("/tasks/:id", (req, res) => {
    const id = getId(req, res);
    if (id === null) return;

    const deleted = Task.remove(id);
    if (!deleted) return res.status(404).json({ detail: "Task not found" });
    res.status(204).send();
});

// const PORT = 8000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});