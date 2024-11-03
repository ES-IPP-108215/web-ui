import config from "@/config";
import { createClient } from "./client";

const client = createClient(config.API_TASK_URL);

const TaskService = {
    async getTasks() {
        //get tasks by user
        return client.get("/");
    },
    async createTask(task: any) {
        return client.post("/", task);
    },
    async getTask(taskId: string) {
        return client.get(`/${taskId}`);
    },
    async updateTask(task: any) {
        return client.put(`/${task.id}`, task);
    },
    async deleteTask(taskId: string) {
        return client.delete(`/${taskId}`);
    },
    };

export { TaskService };