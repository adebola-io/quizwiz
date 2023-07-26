import { ServerError } from "../middleware/errors";

export {};

type ServerResponse = import("http").ServerResponse;
type _IncomingMessage = import("http").IncomingMessage;

declare global {
  declare module apigen {
    type ServerError = ServerError;
    interface Request extends _IncomingMessage {
      body: any;
      params: {};
    }
    interface RoutePath {
      /** Function that should handle the request. */
      handler?: RequestHandler;
      /** Boolean value indicating whether the route url is protected. */
      protected?: boolean;
      /** The nested paths. */
      children?: { [keyof: string]: RoutePath };
    }
    type RoutePathLeaf = {
      protected?: boolean;
      handler: RequestHandler;
    } | RequestHandler;

    type RoutesConfig = {
      [keyof: string]: RoutePathLeaf;
    };

    type RequestHandler = (
      req: Request,
      res: Response,
    ) => unknown;

    type ContentType = "text/html" | "application/json";

    interface Response extends ServerResponse {
      contentType: ContentType;
    }

    interface Middleware {
      errorHandler: ErrorHandler;
      protect: Protector;
    }

    interface ErrorHandler {
      (options: ErrorHandlerOptions): { fatal: boolean; feedback?: any };
    }

    interface ErrorHandlerOptions {
      res: Response;
      error: ServerError;
    }

    interface DataResponseOptions {
      res: Response;
      data: Object;
    }

    interface Protector {
      (req: Request);
    }
  }

  interface User {
    id: string;
    username: string;
    password: string;
    emailAddress: string;
    rapidFireCheckpoint: string | null;
    quizzesPlayed: number;
    successRate: number;
    stars: number;
  }

  type Categories =
    | "history-politics-and-geography"
    | "language-and-literature"
    | "mathematics"
    | "pop-culture"
    | "sports"
    | "technology";

  type Level = 0 | 1 | 2 | 3 | 4;
  type LevelProperty = `level${Level}`;

  type Topic =
    & { title: string }
    & {
      [key in LevelProperty]: Question[];
    };

  interface RandomQuestionParams {
    number: number;
    level: Level;
    categoryName?: Categories;
  }

  interface Question {
    id: string;
    prompt: string;
    options: string[];
    correctAnswer: 0 | 1 | 2 | 3;
    level: Level;
  }
  interface Category {
    topics: Array<Topic>;
  }

  interface UserSession {
    username: string;
    token: string;
  }

  type ErrorType = number;
}
