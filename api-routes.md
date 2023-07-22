This file explains all information pertaining to this project and its implementation.

---
---
## Definition of Terms

### Prompt

A prompt is the query asked in a [question](#question). **It is a string that must always end with a question mark**. Examples include _`"What is the height of the Eiffel Tower?"`_, _`"Who was the 23rd president of the United States?"`_ and _`"The father of computer science is?"`_.

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
- A quiz name,
- An optional [category](#category) id,
- An associated level, and
- An array of [questions](#question).

All questions in a quiz have the same level. An example of a quiz is:

```json
{
  "name": "Pretty Paintings",
  "category": null,
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

### Level
The level of a [question](#question) or [quiz](#quiz) is a number from 0 - 5 that indicates the difficulty associated with it. For example, a question with level 0 is very easy, while a question with 5 is extremely difficult. 

### Success Rate
The success rate of a user is defined as the average of all their [quiz results](#quiz-result).

### Quiz Result
The quiz result is a percentage of the number of questions answered right, over the number of questions answered.

---
---
## API Routes

The following list defines the endpoints that are expected by the client.

#### - `/user/login`

#### - `/user/stats`

`GET` Request that returns the metrics of the user's performance. The metrics are the number of Quizzes played, the stars earned and the [success rate](#success-rate). Response should have the shape:

```json
{
  "quizzesPlayed": 7,
  "stars": 230,
  "successRate": 72.9
}
```

#### - `/categories/${id}/${level}`

`GET` endpoint to retrieve 20 random [questions](#question) in any of the [categories](#category) based on difficulty. Response should have the shape.
```json
{
  "category": "Language",
  "level": 2,
  "questions": []
}
```

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
if rapid fire has already been played, and 

```
{
  "isAllowed": true, 
  "questions": []
}
```


### `/rapid-fire/result`

`POST` endpoint to return the results of the rapid fire 







