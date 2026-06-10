import { Routine } from "../../types/interfaces";

export interface RoutineContextValue {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  replaceRoutine: (routine: Routine) => void;
  deleteRoutineById: (id: number) => void;
  findRoutineById: (id: number) => Routine | undefined;
}
