import { ENDPOINTS, USER_TOKEN_IDENT } from "@/constants";

export class AuthService {
  status = {
    token: null,
    isAuthenticated: false,
    username: null,
  } as ({
    token: string;
    isAuthenticated: true;
    username: string;
  } | {
    token: null;
    isAuthenticated: false;
    username: null;
  });

  async setup() {
    (window as unknown as { __authService__: AuthService }).__authService__ =
      this;
    const stored = localStorage.getItem(USER_TOKEN_IDENT);
    if (stored === null) {
      return;
    }
    const status: typeof this.status = JSON.parse(stored);
    if (status.token && await this.validateToken(status.token)) {
      this.status = status;
    } else {
      localStorage.removeItem(USER_TOKEN_IDENT);
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

  async updateStatus(status: typeof this.status) {
    if (!status.token) {
      return false;
    }
    if (await this.validateToken(status.token)) {
      this.status = status;
      localStorage.setItem(USER_TOKEN_IDENT, JSON.stringify(this.status));
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
