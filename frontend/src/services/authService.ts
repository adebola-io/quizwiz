import { ENDPOINTS, USER_TOKEN } from "@/constants";

export class AuthService {
  status = {
    token: null as string | null,
    isAuthenticated: false,
  };

  async setup() {
    (window as unknown as { __authService__: AuthService }).__authService__ =
      this;
    const token = localStorage.getItem(USER_TOKEN);
    if (token === null) {
      return;
    }
    if (await this.validateToken(token)) {
      this.status.isAuthenticated = true;
      this.status.token = token;
    } else {
      localStorage.removeItem(USER_TOKEN);
    }
  }
  /**
   * Confirms that token is still valid.
   * @param token JWT Token
   */
  async validateToken(token: string) {
    let isValid = false;
    try {
      const res = await fetch(ENDPOINTS.USER_STATS, {
        method: "GET",
        headers: {
          authorization: "Token " + token,
        },
      });
      isValid = res.status === 200;
    } catch {
      //
    }
    return isValid;
  }

  async updateToken(token: string) {
    if (await this.validateToken(token)) {
      this.status.token = token;
      this.status.isAuthenticated = true;
      localStorage.setItem(USER_TOKEN, token);
      return true;
    }
    return false;
  }
}

/**
 * Service for managing user authentication.
 */
export function getAuthService(): AuthService {
  return (window as unknown as { __authService__: AuthService })
    .__authService__;
}
