import { ENDPOINTS } from "@/constants";
import { RequestError, UserCreationParams, UserSession } from "@/types";
import { AuthService, getAuthService } from "./authService";

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
  const isUpdated = await authService.updateToken((data as UserSession).token);
  if (!isUpdated) {
    throw new Error("Internal Server Error.");
  }

  return data;
}
export { AuthService, getAuthService };
