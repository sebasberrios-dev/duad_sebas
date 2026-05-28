import { User, Coach, Admin } from "../../types/interfaces";
export interface UserContextValue {
    users: User[];
    coachs: Coach[];
    admins: Admin[];
    addUser: (user: User) => void;
    addCoach: (coach: Coach) => void;
    addAdmin: (admin: Admin) => void;
    updateUser: (id: number, partial: Partial<Omit<User, "id">>) => void;
    updateCoach: (id: number, partial: Partial<Omit<Coach, "id">>) => void;
    updateAdmin: (id: number, partial: Partial<Omit<Admin, "id">>) => void;
}
