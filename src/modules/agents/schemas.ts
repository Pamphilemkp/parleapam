import {z} from "zod";

export const AgentsInsertSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    instructions: z.string().min(1, {message: "Instrutions are required"}),  
});

export const AgentsUpdateSchema = AgentsInsertSchema.extend({
    id: z.string().min(1, {message: "Id is required"}),
});

