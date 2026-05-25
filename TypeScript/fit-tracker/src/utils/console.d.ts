import { Routine, User } from "../types/interfaces";
import { CatalogReport } from "./types";
export declare function printUserInfo(user: User): void;
export declare function printRoutine(routine: Routine, user: User): void;
export declare function printWeeklyLoad(routine: Routine, user: User): void;
export declare function printClientsInfo(users: User[], userId: User["id"]): void;
export declare function printCatalogReport(report: CatalogReport, filter?: {
    kind: "muscle" | "type";
    value: string;
}): void;
