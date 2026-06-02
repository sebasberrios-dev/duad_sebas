import { AppUser, User, Coach, Admin } from "../../types/interfaces";
export interface UserContextValue {
    users: User[];
    coachs: Coach[];
    admins: Admin[];
    add: (entity: AppUser) => void;
    replace: (entity: AppUser) => void;
    deleteById: (id: number) => void;
    findById: (id: number) => AppUser | undefined;
}
