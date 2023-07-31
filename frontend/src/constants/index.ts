import { Level } from "@/types";

// export const ENDPOINT_ROOT = "http://localhost:3010/api/v1";

// export const ENDPOINT_ROOT = "https://quiz-app-server-pvx6.onrender.com/api/v1";

export const ENDPOINT_ROOT = "http://localhost:4174";

export const ENDPOINTS = {
   USER_CREATE: `${ENDPOINT_ROOT}/user/create`,
   USER_DELETE: `${ENDPOINT_ROOT}/user/delete`,
   LOGIN: `${ENDPOINT_ROOT}/user/login`,
   USER_STATS: `${ENDPOINT_ROOT}/user/stats`,
   USER_STATS_UPDATE: `${ENDPOINT_ROOT}/user/stats/update`,
   CATEGORY_QUESTIONS(id: number, level: number) {
      return `${ENDPOINT_ROOT}/categories/${id}/${level}`;
   },
   RANDOM_QUESTIONS(level: Level) {
      return `${ENDPOINT_ROOT}/random/${level}`;
   },
   RAPID_FIRE_QUESTIONS: `${ENDPOINT_ROOT}/rpdfire/questions`,
   RAPID_FIRE_COMPLETED: `${ENDPOINT_ROOT}/rpdfire/completed`
};

export const USER_TOKEN_IDENT = "app-auth";
