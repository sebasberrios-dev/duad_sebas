import { User, Coach, Admin } from "../../types/interfaces";

export interface UserContextValue {
  users: User[];
  coachs: Coach[];
  admins: Admin[];
  addUser: (user: User) => void;
  addCoach: (coach: Coach) => void;
  addAdmin: (admin: Admin) => void;
  updateUser: (user: User) => void;
  updateCoach: (coach: Coach) => void;
  updateAdmin: (admin: Admin) => void;
}
