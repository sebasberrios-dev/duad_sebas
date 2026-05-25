import React from "react";
import { SessionContextValue } from "./types/session-context-types";
export declare function SessionProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useSession(): SessionContextValue;
