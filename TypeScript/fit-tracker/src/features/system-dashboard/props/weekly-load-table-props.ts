import { User } from "../../../types/interfaces";

export interface WeeklyLoadTableProps {
  users: User[];
  firstColumnLabel?: string;
  showAge?: boolean;
  showWeight?: boolean;
  showMinutes?: boolean;
  showCalories?: boolean;
}
