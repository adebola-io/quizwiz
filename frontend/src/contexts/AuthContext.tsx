import { ReactNode, createContext, useEffect, useReducer } from "react";
import axios from "@/api";
import { isValidToken, setSession } from "@/utils/jwt";
import { User, LoginParams, UserCreationParams, ApiResponse } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
}

type AuthAction =
  | {
      type: "INITIALIZE";
      payload: { isAuthenticated: boolean; user: User | null };
    }
  | { type: "LOGIN"; payload: { isAuthenticated: true; user: User } }
  | { type: "LOGOUT"; payload: { isAuthenticated: false; user: null } }
  | { type: "REGISTER"; payload: { isAuthenticated: true; user: User } };

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers: Record<
  string,
  (state: AuthState, action: AuthAction) => AuthState
> = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      user,
    };
  },
  LOGOUT: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return { ...state, isAuthenticated, user: user };
  },
  REGISTER: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      user,
    };
  },
};

const reducer = (state: AuthState, action: AuthAction) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface AuthContextValue extends AuthState {
  login: (payload: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  signup: (payload: UserCreationParams) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signup: () => Promise.resolve(),
});

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const { data } = await axios.get<ApiResponse<{ user: User }>>(
            "/user/profile"
          );
          const { user } = data.data;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err: any) {
        console.log(err.message);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (payload: LoginParams) => {
    const { data } = await axios.post<{ data: { token: string; user: User } }>(
      "/user/login",
      payload
    );
    const { token, user } = data.data;

    setSession(token);
    dispatch({
      type: "LOGIN",
      payload: {
        user,
        isAuthenticated: true,
      },
    });
  };

  const signup = async (payload: UserCreationParams) => {
    const { data } = await axios.post<
      ApiResponse<{ token: string; user: User }>
    >("/user/create", payload);

    const { token, user } = data.data;

    setSession(token);
    dispatch({
      type: "REGISTER",
      payload: {
        isAuthenticated: true,
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({
      type: "LOGOUT",
      payload: { user: null, isAuthenticated: false },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
