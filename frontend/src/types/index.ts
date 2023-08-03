import { MouseEventHandler, ReactNode } from "react";

export interface User {
   _id: string;
   username: string;
   email: string;
   emailConfirmationStatus: boolean;
   role: string;
   quizzesPlayed: number;
   successRate: number;
   stars: number;
   rapidFireCheckpoint: string | null;
   createdAt: string;
   updatedAt: string;
}

export type Stats = Pick<
   User,
   "quizzesPlayed" | "rapidFireCheckpoint" | "stars" | "successRate"
>;
export interface UserAuthService {
   updateToken(token: string): void;
   status:
      | {
           token: null;
           isAuthenticated: false;
        }
      | { token: string; isAuthenticated: true };
}

export interface UserCreationParams {
   username: string;
   email: string;
   password: string;
   confirmPassword: string;
}

export type LoginParams = {
   username: string;
   password: string;
};

export interface StatsUpdateParams {
   quizResult: number;
   starsEarned: number;
}

export interface UserSession {
   username: string;
   token: string;
}

export type ApiResponse<
   T,
   status extends "fail" | "success" | "error" = "success"
> = {
   status: status;
   message: string;
   data: T;
};

export type RequestError = {
   response: { data: ApiResponse<null, "fail" | "error"> };
};

export type NotificationType = "error" | "success" | "info";

export type Level = 0 | 1 | 2 | 3 | 4;
export type FormObject = { [keyof: string]: HTMLInputElement };
export type ImageImport = string;

interface CategoryData {
   id: number;
   info: string;
   MainIcon: ImageImport;
   BoxIcon: React.FC;
   gradient: string;
}

export type CategoryName =
   | "Random Quiz"
   | "Mathematics"
   | "Language & Literature"
   | "History, Politics & Geography"
   | "Sports"
   | "Technology"
   | "Pop Culture";

export type CategoryStore = {
   [key in CategoryName]: CategoryData;
};

export interface ModalProps {
   children: ReactNode;
   className?: string;
   /**
    * Event that should occur if the close button is clicked.
    * Should ideally be a handle to remove the modal from the screen.
    */
   onClose: MouseEventHandler;
   /** Modal styles */
   style?: React.CSSProperties;
   closeButtonRef: React.RefObject<HTMLButtonElement>;
   /**
    * Whether or not the modal should close if the user clicks outside it.
    */
   closeOnClickOutside?: boolean;
}

export interface Quiz {
   name: string;
   level: Level;
   questions: Question[];
}
export interface Question {
   id: string;
   prompt: string;
   options: [string, string, string, string];
   level: Level;
   correctAnswer: 0 | 1 | 2 | 3 | 4;
}

export type CategoryResponse = ApiResponse<{
   quiz: Quiz;
}>;

export type RandomQuizResponse = ApiResponse<{
   questions: Question[];
}>;

export type RapidFireResponse = ApiResponse<{
   questions: Question[];
}>;
