import { z } from "zod";
import { Admin, Coach, User } from "../../types/interfaces";
export declare const userStorageSchema: z.ZodType<User>;
export declare const coachStorageSchema: z.ZodType<Coach>;
export declare const adminStorageSchema: z.ZodType<Admin>;
