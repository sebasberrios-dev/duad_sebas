import { CatalogContextValue } from "./catalog-context-types";
import { RoutineContextValue } from "./routine-context-types";
import { UserContextValue } from "./user-context-types";

export interface AppStoreValue {
  users: UserContextValue;
  routines: RoutineContextValue;
  catalog: CatalogContextValue;
}
