import { User } from "../../types/interfaces";
interface RecentActivityProps {
    users: User[];
    limit?: number;
}
export declare function RecentActivity({ users, limit }: RecentActivityProps): import("react/jsx-runtime").JSX.Element;
export {};
