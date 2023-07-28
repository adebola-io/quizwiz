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

export interface UserSession {
  username: string;
  token: string;
}

export type ApiResponse<T = any> = {
  status: "fail" | "success" | "error";
  message: string;
  data: T;
};

export interface RequestError {
  message: string;
  status: string;
}

export type NotificationType = "error" | "success" | "info";

export type Level = 0 | 1 | 2 | 3 | 4;
export type FormObject = { [keyof: string]: HTMLInputElement };
