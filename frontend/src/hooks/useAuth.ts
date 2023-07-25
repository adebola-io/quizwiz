import { ENDPOINTS, USER_TOKEN } from "@/constants";
import { UserAuthService } from "@/types";

const authService: UserAuthService = {
  status: {
    token: null,
    isAuthenticated: false,
  },
  updateToken(token: string) {
    this.status.token = token;
  },
};
/**
 * Hook for managing user authentication.
 */
export function useAuth(): UserAuthService {
  const token = localStorage.getItem(USER_TOKEN);
  if (token !== null) {
    /// Confirm that token is valid.
    fetch(ENDPOINTS.USER_STATS, {
      method: "GET",
      headers: {
        auth: "Token " + token,
      },
    }).then((res) => {
      if (res.status === 200) {
        authService.updateToken(token);
      } else {
        throw {};
      }
    })
      .catch(() => {
        localStorage.removeItem(USER_TOKEN);
      });
  }
  return authService;
}
