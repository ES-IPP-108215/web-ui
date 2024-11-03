export interface UserResponse {
    givenName: string;
    email: string;
    familyName: string;
    username: string;
    id: string;
    isActive: boolean;
    updatedAt: string;
}

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    state: string;
    created_at: string;
    updated_at: string;
    deadline: string;
    priority: string;
    user_id: string;
}

export interface TaskCreate {
    title: string;
    description: string;
    deadline: string;
    priority: string;
}

export type TaskState = 'to_do' | 'in_progress' | 'done';