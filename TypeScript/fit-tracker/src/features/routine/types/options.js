import { DAYS_LIST } from "../../../types/types";
export const daysOptions = DAYS_LIST.map((day) => ({
    id: day,
    displayName: day,
}));
