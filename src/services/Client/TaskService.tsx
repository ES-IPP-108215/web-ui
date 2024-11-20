import config from "@/config";
import { createClient } from "./client";
import { TaskCreate, TaskUpdate } from "@/lib/types";

const client = createClient(config.API_TASK_URL);

const TaskService = {
    async getTasks() {
        //get tasks by user
        return client.get("");
    },
    async createTask(task: TaskCreate) {
        return client.post("", task);
    },
    async getTask(taskId: string) {
        return client.get(`/${taskId}`);
    },
    async updateTask(taskId: string, task: TaskUpdate) {
        return client.put(`/${taskId}`, task);
    },
    async deleteTask(taskId: string) {
        return client.delete(`/${taskId}`);
    },
    };

export { TaskService };