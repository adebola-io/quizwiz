import { ReactNode, createContext, useEffect, useReducer } from "react";
import axios, { globalConfig } from "@/api";
import { isValidToken, setSession } from "@/utils/jwt";
import {
   User,
   LoginParams,
   UserCreationParams,
   ApiResponse,
   StatsUpdateParams
} from "@/types";

interface AuthState {
   isAuthenticated: boolean;
   isVerified: boolean;
   isInitialized: boolean;
   user: User | null;
}

type AuthAction =
   | {
        type: "INITIALIZE";
        payload: {
           isAuthenticated: boolean;
           isVerified: boolean;
           user: User | null;
        };
     }
   | {
        type: "LOGIN";
        payload: { isAuthenticated: boolean; isVerified: boolean; user: User };
     }
   | {
        type: "LOGOUT";
        payload: { isAuthenticated: boolean; isVerified: boolean; user: null };
     }
   | {
        type: "REGISTER";
        payload: { isAuthenticated: boolean; isVerified: boolean; user: User };
     }
   | {
        type: "UPDATE_STATS";
        payload: { isAuthenticated: boolean; isVerified: boolean; user: User };
     }
   | {
        type: "UPDATE_RAPID_FIRE";
        payload: { isAuthenticated: boolean; isVerified: boolean; user: User };
     };

const initialState: AuthState = {
   isAuthenticated: false,
   isVerified: false,
   isInitialized: false,
   user: null
};

const handlers: Record<
   string,
   (state: AuthState, action: AuthAction) => AuthState
> = {
   INITIALIZE: (state, action) => {
      const { isAuthenticated, isVerified, user } = action.payload;
      return {
         ...state,
         isAuthenticated,
         isVerified,
         isInitialized: true,
         user
      };
   },
   LOGIN: (state, action) => {
      const { isAuthenticated, isVerified, user } = action.payload;

      return {
         ...state,
         isAuthenticated,
         isVerified,
         user
      };
   },
   LOGOUT: (state, action) => {
      const { isAuthenticated, isVerified, user } = action.payload;

      return { ...state, isAuthenticated, isVerified, user };
   },
   REGISTER: (state, action) => {
      const { isAuthenticated, isVerified, user } = action.payload;

      return {
         ...state,
         isAuthenticated,
         isVerified,
         user
      };
   },
   UPDATE_STATS: (state, action) => {
      const { isAuthenticated, isVerified, user } = action.payload;

      return {
         ...state,
         isAuthenticated,
         isVerified,
         user
      };
   },
   UPDATE_RAPID_FIRE: (state, action) => {
      const { isAuthenticated, isVerified, user } = action.payload;

      return {
         ...state,
         isAuthenticated,
         isVerified,
         user
      };
   }
};

const reducer = (state: AuthState, action: AuthAction) =>
   handlers[action.type] ? handlers[action.type](state, action) : state;

interface AuthContextValue extends AuthState {
   login: (payload: LoginParams) => Promise<void>;
   logout: () => Promise<void>;
   signup: (payload: UserCreationParams) => Promise<void>;
   updateStats: (payload: StatsUpdateParams) => void;
   updateRapidFire: (payload: StatsUpdateParams) => void;
}

const AuthContext = createContext<AuthContextValue>({
   ...initialState,
   login: () => Promise.resolve(),
   logout: () => Promise.resolve(),
   signup: () => Promise.resolve(),
   updateStats: () => Promise.resolve(),
   updateRapidFire: () => Promise.resolve()
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
                     isVerified: user.emailConfirmationStatus,
                     user
                  }
               });
            } else {
               dispatch({
                  type: "INITIALIZE",
                  payload: {
                     isAuthenticated: false,
                     isVerified: false,
                     user: null
                  }
               });
            }
         } catch (err: unknown) {
            console.log((err as { message: string }).message);
            dispatch({
               type: "INITIALIZE",
               payload: {
                  isAuthenticated: false,
                  isVerified: false,
                  user: null
               }
            });
         }
      };

      initialize();
   }, []);

   const login = async (payload: LoginParams) => {
      const { data } = await axios.post<{
         data: { token: string; user: User };
      }>("/user/login", payload);
      const { token, user } = data.data;

      setSession(token);
      dispatch({
         type: "LOGIN",
         payload: {
            user,
            isAuthenticated: true,
            isVerified: user?.emailConfirmationStatus
         }
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
            user,
            isAuthenticated: true,
            isVerified: user?.emailConfirmationStatus
         }
      });
   };

   const updateStats = async (payload: StatsUpdateParams) => {
      const { data } = await axios.put<ApiResponse<{ user: User }>>(
         "/user/stats/update",
         payload,
         globalConfig
      );

      const { user } = data.data;

      dispatch({
         type: "UPDATE_STATS",
         payload: {
            user,
            isAuthenticated: true,
            isVerified: true
         }
      });
   };

   const updateRapidFire = async (payload: StatsUpdateParams) => {
      const { data } = await axios.post<ApiResponse<{ user: User }>>(
         "/question/rpdfire/completed",
         payload,
         globalConfig
      );
      console.log(data.data);
      const { user } = data.data;
      console.log(user);
      dispatch({
         type: "UPDATE_RAPID_FIRE",
         payload: {
            user,
            isAuthenticated: true,
            isVerified: true
         }
      });
   };

   const logout = async () => {
      setSession(null);
      dispatch({
         type: "LOGOUT",
         payload: {
            user: null,
            isAuthenticated: false,
            isVerified: false
         }
      });
   };

   return (
      <AuthContext.Provider
         value={{
            ...state,
            login,
            logout,
            signup,
            updateStats,
            updateRapidFire
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export { AuthContext, AuthProvider };
