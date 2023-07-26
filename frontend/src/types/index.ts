export interface UserAuthService {
  updateToken(token: string): void;
  status: {
    token: null;
    isAuthenticated: false;
  } | { token: string; isAuthenticated: true };
}

export interface UserCreationParams {
  username: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export type LoginParams = {
  email: string;
  password: string;
} | {
  username: string;
  password: string;
};

export interface UserSession {
  username: string;
  token: string;
}

export interface RequestError {
  message: string;
  code: number;
}

export type NotificationType = "error" | "success" | "info";

export type Level = 0 | 1 | 2 | 3 | 4;
export type FormObject = { [keyof: string]: HTMLInputElement };
