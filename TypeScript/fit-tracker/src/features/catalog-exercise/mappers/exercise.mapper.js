export function mapTypeToCategory(type) {
    const normalizedType = type.toLowerCase().trim();
    switch (normalizedType) {
        case "strength":
            return "Fuerza";
        case "cardio":
            return "Cardio";
        case "stretching":
            return "Flexibilidad";
        default:
            return undefined;
    }
}
export function mapApiExercisetoCatalogExercise(dto, index) {
    return {
        id: index + 1,
        exerciseName: dto.name,
        category: mapTypeToCategory(dto.type),
        muscle: dto.muscle,
        description: dto.instructions,
        source: "api",
    };
}
