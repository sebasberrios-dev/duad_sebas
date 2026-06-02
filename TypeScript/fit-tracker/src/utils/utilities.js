import { FCM_TO_MET, LEVEL_TO_MET_FLEXIBILITY, LEVEL_TO_MET_STRENGTH, } from "../types/types";
function estimateCardioMet(zone) {
    return FCM_TO_MET[zone];
}
function estimateStrengthMet(level) {
    return LEVEL_TO_MET_STRENGTH[level];
}
function estimateFlexMet(level) {
    return LEVEL_TO_MET_FLEXIBILITY[level];
}
function calculateCaloriesPerMinute(met, bodyWeight) {
    return (met * bodyWeight) / 60;
}
export function calculateCalories(duration, calPerMin) {
    const calories = duration * calPerMin;
    return Number(calories.toFixed(0));
}
export function calculateAllCalories(routine, bodyWeight, level) {
    let cardioCalories = 0;
    let strengthCalories = 0;
    let flexCalories = 0;
    const perExercise = [];
    for (const entry of routine.workouts) {
        for (const exercise of entry.exercises) {
            const { exerciseName, details, durationMinutes } = exercise;
            let met;
            if (details.category === "Cardio") {
                met = estimateCardioMet(details.fcm);
            }
            else if (details.category === "Fuerza") {
                met = estimateStrengthMet(level);
            }
            else {
                met = estimateFlexMet(level);
            }
            const calPerMin = calculateCaloriesPerMinute(met, bodyWeight);
            const calories = calculateCalories(durationMinutes, calPerMin);
            perExercise.push({ exerciseName, calories });
            if (details.category === "Cardio") {
                cardioCalories += calories;
            }
            else if (details.category === "Fuerza") {
                strengthCalories += calories;
            }
            else {
                flexCalories += calories;
            }
        }
    }
    const totalCalories = cardioCalories + strengthCalories + flexCalories;
    return {
        cardioCalories,
        strengthCalories,
        flexCalories,
        perExercise,
        totalCalories,
    };
}
export function calculatePace(duration, distance) {
    const pace = duration / distance;
    return Number(pace.toFixed(2));
}
export function formatDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const parts = [];
    if (hours > 0)
        parts.push(`${hours}h`);
    if (minutes > 0)
        parts.push(` ${minutes} min`);
    return parts.length > 0 ? parts.join("") : "0 min";
}
export function formatDate(date) {
    return new Date(date).toLocaleDateString();
}
function getUniqueDays(routine, days) {
    for (const day of routine.workouts) {
        days.push(...day.day);
    }
    const uniqueDays = [...new Set(days)];
    return uniqueDays;
}
export function getTotalExercises(routine) {
    return routine.workouts.length;
}
export function getTotalExercisesByCategory(routine) {
    let totalCardio = 0;
    let totalStrength = 0;
    let totalFlex = 0;
    for (const entry of routine.workouts) {
        for (const exercise of entry.exercises) {
            const { category } = exercise.details;
            if (category === "Cardio") {
                totalCardio += 1;
            }
            else if (category === "Fuerza") {
                totalStrength += 1;
            }
            else {
                totalFlex += 1;
            }
        }
    }
    return {
        totalCardio,
        totalStrength,
        totalFlex,
    };
}
export function getTotalDuration(routine) {
    let totalCardio = 0;
    let totalStrength = 0;
    let totalFlex = 0;
    for (const entry of routine.workouts) {
        for (const exercise of entry.exercises) {
            const { category } = exercise.details;
            const duration = exercise.durationMinutes;
            if (category === "Cardio") {
                totalCardio += duration;
            }
            else if (category === "Fuerza") {
                totalStrength += duration;
            }
            else {
                totalFlex += duration;
            }
        }
    }
    const total = totalCardio + totalStrength + totalFlex;
    const cardioDuration = formatDuration(totalCardio);
    const strengthDuration = formatDuration(totalStrength);
    const flexDuration = formatDuration(totalFlex);
    const formatTotalDuration = formatDuration(total);
    return {
        cardioDuration,
        strengthDuration,
        flexDuration,
        total,
        formatTotalDuration,
    };
}
export function calculateWeeklyAvgCalories(routine, totalCalories) {
    const days = [];
    const uniqueDays = getUniqueDays(routine, days);
    const result = uniqueDays.length === 0 ? 0 : totalCalories / uniqueDays.length;
    return {
        cal: Number(result.toFixed(0)),
        uniqueDays: uniqueDays.length,
    };
}
export function genUniqueId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}
export function getWeeklyRecommendation(routine, bodyWeight, level) {
    const { total } = getTotalDuration(routine);
    const { totalCalories } = calculateAllCalories(routine, bodyWeight, level);
    const { uniqueDays } = calculateWeeklyAvgCalories(routine, totalCalories);
    if (uniqueDays > 5 || total > 300)
        return "Considerá tener un día más de descanso esta semana.";
    if (uniqueDays < 3 || total < 150)
        return "Considerá agregar un día más de entrenamiento esta semana.";
    return "Carga semanal equilibrada";
}
