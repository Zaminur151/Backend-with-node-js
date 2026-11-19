const { z } = require("zod");

const TaskCreate = z.object({
    title: z.string().min(1),
    description: z.string().default(""),
    completed: z.boolean().default(false),
});

module.exports = { TaskCreate };