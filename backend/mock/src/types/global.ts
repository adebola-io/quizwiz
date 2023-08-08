export {};

type ServerResponse = import("http").ServerResponse;
type _IncomingMessage = import("http").IncomingMessage;

declare global {
   module apigen {
      type ServerError = InstanceType<typeof import("../lib").ServerError>;
      interface Request extends _IncomingMessage {
         body: any;
         params: { [keyof: string]: string };
      }
      interface RoutePath {
         /** Function that should handle the request. */
         handler?: RequestHandler;
         /** Boolean value indicating whether the route url is protected. */
         protected?: boolean;
         /** The nested paths. */
         children?: { [keyof: string]: RoutePath };
      }
      type RoutePathLeaf =
         | {
              protected?: boolean;
              handler: RequestHandler;
           }
         | RequestHandler;

      type RoutesConfig = {
         [keyof: string]: RoutePathLeaf;
      };

      type RequestHandler = (req: Request, res: Response) => unknown;

      type ContentType = "text/html" | "application/json";

      interface Response extends ServerResponse {
         contentType: ContentType;
      }

      interface Middleware {
         errorHandler: ErrorHandler;
         protect: Protector;
      }

      interface ErrorHandler {
         (options: ErrorHandlerOptions): { fatal: boolean; message?: string };
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

   interface UserRecord {
      data: User;
      metadata: UserMetadata;
   }

   interface UserMetadata {
      _id: string;
      createdAt: ISODateString;
      updatedAt: ISODateString;
   }

   interface User {
      username: string;
      password: string;
      email: string;
      emailConfirmationStatus: boolean;
      rapidFireCheckpoint: string | null;
      quizzesPlayed: number;
      successRate: number;
      stars: number;
   }

   interface PublicUser
      extends Pick<
         User,
         "username" | "quizzesPlayed" | "stars" | "successRate"
      > {}

   interface CreateUserResponse {
      status: "success";
      message: string;
      data: {
         token: string;
         user: Exclude<User, "password"> & {
            // username: string;
            // email: string;
            // "emailConfirmationStatus": false;
            // "quizzesPlayed": 0;
            // "successRate": 0;
            // "stars": 0;
            // "rapidFireCheckpoint": null;
            _id: string;
            createdAt: ISODateString;
            updatedAt: ISODateString;
         };
      };
   }

   interface UserStatsResponse {
      quizzesPlayed: number;
      stars: number;
      successRate: number;
   }

   interface SucessResponse {
      status: "success";
      message: string;
      data?: string | object | Array<any>;
   }

   interface ErrorResponse {
      status: "fail" | "error";
      message: string;
   }

   interface Token {
      id: number;
      type: 0 | 1;
      value: string;
      reference: any;
      timeout?: NodeJS.Timeout;
   }

   type Categories =
      | "history-politics-and-geography"
      | "language-and-literature"
      | "mathematics"
      | "pop-culture"
      | "sports"
      | "technology";

   type LevelProperty = `level${Level}`;

   interface Category {
      topics: Array<Topic>;
   }

   interface Question {
      id: string;
      prompt: string;
      options: string[];
      correctAnswer: 0 | 1 | 2 | 3;
      level: Level;
   }

   type ISODateString = string;

   type Level = 0 | 1 | 2 | 3 | 4;

   type Topic = { title: string } & {
      [key in LevelProperty]: Question[];
   };

   interface RandomQuestionParams {
      number: number;
      level: Level;
      categoryName?: Categories;
   }

   interface Quiz {
      name: string;
      level: Level;
      questions: Question[];
   }

   type ErrorType = number;
}
