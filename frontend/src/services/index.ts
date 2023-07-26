import { ENDPOINTS } from "@/constants";
import {
  LoginParams,
  RequestError,
  UserCreationParams,
  UserSession,
} from "@/types";
import { AuthService, getAuthService } from "./authService";

function authorizedFetch(
  token: string,
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const header = {
    authorization: `Token ${token}`,
  };
  init = init ?? {};
  init.headers = { ...(init.headers ?? {}), ...header };
  return fetch(input, init);
}

export async function createNewUser(values: UserCreationParams) {
  const res = await fetch(ENDPOINTS.USER_CREATE, {
    method: "POST",
    body: JSON.stringify(values),
  });
  const data: UserSession | RequestError = await res.json();
  if (res.status !== 201) {
    throw new Error((data as RequestError).message);
  }
  const authService = getAuthService();
  const isUpdated = await authService.updateStatus({
    ...(data as UserSession),
    isAuthenticated: true,
  });
  if (!isUpdated) {
    throw new Error("Internal Server Error.");
  }

  return data;
}

export async function loginUser(payload: LoginParams) {
  const res = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data: UserSession | RequestError = await res.json();
  if (res.status !== 200) {
    throw new Error((data as RequestError).message);
  }
  const authService = getAuthService();
  const isUpdated = await authService.updateStatus({
    ...(data as UserSession),
    isAuthenticated: true,
  });
  if (!isUpdated) {
    throw new Error("Internal Server Error.");
  }
}

export async function getUserStats() {
  const authService = getAuthService();
  const res = await authorizedFetch(
    authService.status.token as string,
    ENDPOINTS.USER_STATS,
  );
  const data = await res.json();
  return data;
}
export { AuthService, getAuthService };
