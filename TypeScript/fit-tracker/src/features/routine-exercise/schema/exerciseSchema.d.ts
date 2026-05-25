import { z } from "zod";
export declare const exerciseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    catalogExerciseId: z.ZodNumber;
    exerciseName: z.ZodString;
    durationMinutes: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        completed: "completed";
        skipped: "skipped";
    }>>;
    category: z.ZodLiteral<"Cardio">;
    details: z.ZodObject<{
        distanceKm: z.ZodNumber;
        fcm: z.ZodEnum<{
            zone1: "zone1";
            zone2: "zone2";
            zone3: "zone3";
            zone4: "zone4";
            zone5: "zone5";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    catalogExerciseId: z.ZodNumber;
    exerciseName: z.ZodString;
    durationMinutes: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        completed: "completed";
        skipped: "skipped";
    }>>;
    category: z.ZodLiteral<"Fuerza">;
    details: z.ZodObject<{
        sets: z.ZodArray<z.ZodObject<{
            reps: z.ZodNumber;
            weightKg: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    catalogExerciseId: z.ZodNumber;
    exerciseName: z.ZodString;
    durationMinutes: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        completed: "completed";
        skipped: "skipped";
    }>>;
    category: z.ZodLiteral<"Flexibilidad">;
    details: z.ZodObject<{
        poses: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>], "category">;
export type ExerciseFormData = z.infer<typeof exerciseSchema>;
