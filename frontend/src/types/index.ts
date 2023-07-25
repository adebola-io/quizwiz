export interface UserAuthService {
  updateToken(token: string): void;
  status: {
    token: null;
    isAuthenticated: false;
  } | { token: string; isAuthenticated: true };
}

export type Level = 0 | 1 | 2 | 3 | 4;
