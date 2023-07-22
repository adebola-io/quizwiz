# Specification

This file explains all information pertaining to this project and its implementation.

## Definition of Terms

### Prompt

A prompt is the query asked in a [question](#question). **It is a string that must always end with a question mark**. Examples include `"What is the height of the Eiffel Tower?"`, `"Who was the 23rd president of the United States?"` and `"The father of computer science is?"`.

### Question

A question is an object containing:
- a [prompt](#prompt), 
- an option array. Each option is a string.
- a [level](#level), and
- a correct answer. The correct answer is a zero based index pointing to the valid option in the option array.

An example would be:

```json
{
  "prompt": "What is 2 + 2?",
  "options": ["4", "5", "6", "7"],
  "level": 0,
  "correctAnswer": 0
}
```

### Quiz
A quiz is an object containing:
- An optional quiz name,
- An optional [category](#category) id,
- A background image,
- An associated level, and
- An array of [questions](#question).

If a quiz has no name, it must have a category id, and vice versa. All questions in a quiz have the same level. An example of a quiz is:

```json
{
  "name": "Pretty Paintings",
  "backgroundImage": "pretty-painting.jpg",
  "categoryID": null,
  "level": 2,
  "questions": []
}
```

### Category
A category is a broad topic or subject description. The defined categories are:
1. History
2. Language
3. Cuisine
4. Mathematics
5. Physics
6. Chemistry
7. Pop Culture
8. Technology 
Each category has an ID from 1-8.

### Level
The level of a [question](#question) or [quiz](#quiz) is a number from 0 - 5 that indicates the difficulty associated with it. For example, a question with level 0 is very easy, while a question with 5 is extremely difficult. 

### Success Rate
The success rate of a user is defined as the average of all their [quiz results](#quiz-result).

### Quiz Result
The quiz result is a percentage of the number of questions answered right, over the number of questions answered.

---
## API Routes

The following list defines the endpoints that are expected by the client.

#### - `/user/create`

#### - `/user/login`

#### - `/user/stats`

Protected `GET` Request that returns the metrics of the user's performance. The metrics are the number of [Quizzes](#quiz) played, the stars earned and the [success rate](#success-rate). Response should have the shape:

```json
{
  "quizzesPlayed": 7,
  "stars": 230,
  "successRate": 72.9
}
```

#### - `/user/stats/update`
`PUT` endpoint that updates user metrics. It is fired after the end of every [quiz](#quiz) session. Request has the shape:
```json
{
  "quizResult": 75.3,
  "starsEarned": 10,
}
```

#### - `/categories/${id}/${level}`

- If request has method `GET`
  - Assert that category with id `id` exists.
  - Assert that level is a number between 0 and 5.
  - Let `quizObject` be a new quiz object.
  - Set its category ID to`id`.
  - Set its name to null.
  - Set its `questions` to an array of 20 random questions from the defined category.
  - Set its `backgroundImage` to the defined category's associated image.
  - Set its level to the defined level.
  - Return `quizObject`.

### - `/special`
`GET` endpoint that returns a list of special [quizzes](#quiz) for the day. Response should have the shape.
```json
{
  "quizzes": []
}
```

### - `/rapid-fire/questions`

`GET` endpoint to retrieve 90 rapid fire questions for the day. The first 25 should be level 1, the next 40 should be level 2, and the last 25 should be level 3. Response should have the below shapes.  `isAllowed` is false if Rapid Fire has already been played on the same day. 

```json
{
  "isAllowed": false, 
  "questions": null
}
```
Otherwise:

```
{
  "isAllowed": true, 
  "questions": []
}
```

### `/rapid-fire/completed`

`POST` endpoint to signify that the rapid fire is done for the day. Subsequent GET requests to [`/rapid-fire/questions`](#rapid-fire-questions) on the same day should return an object with `isAllowed` set to false. 







