const { CATEGORIES, QUESTIONS_PER_QUIZ } = require("../constants");
const { ServerError, utils } = require("../lib");
const db = require("../db");
const logger = require("../lib/logger");

/**
 * Returns a random set of 20 questions from a predefined category and level.
 * @route "/category/get/:id/level"
 * @param {apigen.Request} req Server request.
 * @throws {apigen.ServerError}
 * @return {SucessResponse}
 */
function getCategoryQuestions(req) {
   if (req.method !== "GET") {
      throw new ServerError(
         `${req.method} /category/get/:id/:level is not a valid route.`,
         401
      );
   }
   const { id, level } = req.params;
   if (typeof id !== "string" || typeof level !== "string") {
      throw new ServerError("id or level undefined");
   }
   const idAsNumber = parseInt(id);
   /**@type {Level} */ //@ts-ignore
   const levelAsNumber = parseInt(level);

   if (Number.isNaN(idAsNumber) || Number.isNaN(levelAsNumber)) {
      throw new ServerError("Invalid id or level parameters");
   }
   if (
      !Object.keys(CATEGORIES)
         .map((a) => parseInt(a))
         .includes(idAsNumber)
   ) {
      throw new ServerError("categoryId must be from 1 to 6");
   }
   if (![0, 1, 2, 3, 4].includes(levelAsNumber)) {
      throw new ServerError("level must be from 0 to 4");
   }

   let categoryName = CATEGORIES[idAsNumber];
   const questions = db.getQuestions();

   /**@type {Quiz} */
   const quizObject = {
      name: categoryName,
      questions: questions.random({
         //@ts-ignore
         categoryName: utils.hyphenate(categoryName),
         level: levelAsNumber,
         number: QUESTIONS_PER_QUIZ,
      }),
      level: levelAsNumber,
   };

   logger.inform(`Retrieved questions for ${categoryName}`);
   if (quizObject.questions.length < QUESTIONS_PER_QUIZ) {
      logger.warn(`Insufficient questions returned to client.`);
   }

   return {
      status: "success",
      message: "Quiz fetched successfully",
      data: {
         quiz: quizObject,
      },
   };
}

/**
 * Returns a random set of 20 questions from all categories, given a predefined level.
 * @route `"/question/random/:level"`
 * @param {apigen.Request} req Server request.
 * @throws {apigen.ServerError}
 * @return {SucessResponse}
 */
function getRandomQuestions(req) {
   if (req.method !== "GET") {
      throw new ServerError(
         `${req.method} /question/random/:level is not a valid route.`,
         401
      );
   }
   const { level } = req.params;
   if (typeof level !== "string") {
      throw new ServerError("level undefined");
   }

   /**@type {Level} */ //@ts-ignore
   const levelAsNumber = parseInt(level);

   if (Number.isNaN(levelAsNumber)) {
      throw new ServerError("Invalid level parameter");
   }

   if (![0, 1, 2, 3, 4].includes(levelAsNumber)) {
      throw new ServerError("level must be from 0 to 4");
   }

   const questionData = db.getQuestions();
   let questions = questionData.random({
      number: QUESTIONS_PER_QUIZ,
      level: levelAsNumber,
   });

   logger.inform(`Retrieved questions for random quiz, level ${levelAsNumber}`);
   if (questions.length < QUESTIONS_PER_QUIZ) {
      logger.warn(`Insufficient questions returned to client.`);
   }

   return {
      status: "success",
      message: "Questions fetched successfully",
      data: {
         questions,
      },
   };
}

/**
 * Returns rapid fire questions for the day.
 * @protected
 * @route `"/question/rpdfire"`
 * @param {apigen.Request} req Server request.
 * @throws {apigen.ServerError}
 * @return {SucessResponse}
 */
function getRapidFireQuestions(req) {
   if (req.method !== "GET") {
      throw new ServerError(
         `${req.method} /question/rdpfire is not a valid route.`,
         401
      );
   }
   /**
    * @type {User}
    */
   let user = req["user"];
   /**@type {Question[]} */
   let questions = [];
   let shouldRetrieve =
      user.rapidFireCheckpoint !== null ||
      utils.dates.isLater(new Date(), new Date(user.rapidFireCheckpoint));

   if (shouldRetrieve) {
      const questionData = db.getQuestions();
      let rfQuestions0 = questionData.random({ level: 0, number: 15 });
      let rfQuestions1 = questionData.random({ level: 1, number: 30 });
      let rfQuestions2 = questionData.random({ level: 2, number: 45 });
      let rfQuestions3 = questionData.random({ level: 3, number: 60 });
      let rfQuestions4 = questionData.random({ level: 4, number: 75 });
      questions.push(
         ...rfQuestions0,
         ...rfQuestions1,
         ...rfQuestions2,
         ...rfQuestions3,
         ...rfQuestions4
      );
   }

   return {
      status: "success",
      message: "Questions fetched successfully",
      data: {
         questions,
      },
   };
}

module.exports = {
   getCategoryQuestions,
   getRandomQuestions,
   getRapidFireQuestions,
};
