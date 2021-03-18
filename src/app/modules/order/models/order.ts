import { User } from "../../user/models/user";

export interface Order {
    id?: number;
    name: string;
    description?: string;
    user?: User;
    userId?: number;
    priority: number;
    linkedAt?: Date;
    doneAt?: Date;
    createdAt?: Date;
}
