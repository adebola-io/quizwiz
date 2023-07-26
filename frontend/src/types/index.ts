export interface UserAuthService {
  updateToken(token: string): void;
  status: {
    token: null;
    isAuthenticated: false;
  } | { token: string; isAuthenticated: true };
}

export interface ErrorObject {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserCreationParams {
  username: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

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
