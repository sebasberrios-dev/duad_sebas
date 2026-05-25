import { z } from "zod";
export const assignCoachSchema = z.object({
    clientId: z.number(),
    coachId: z.number(),
});
