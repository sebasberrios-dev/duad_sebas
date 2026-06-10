import { AppUser, User, Coach, Admin } from "../../types/interfaces";

export interface SessionContextValue {
  currentUser: AppUser | null;
  login: (userId: number) => void;
  logout: () => void;
  updateCurrentUser: (user: AppUser) => void;
  isUser: (u: AppUser) => u is User;
  isCoach: (u: AppUser) => u is Coach;
  isAdmin: (u: AppUser) => u is Admin;
}
