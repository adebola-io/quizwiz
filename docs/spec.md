# Specification

This file explains all information pertaining to this project and its implementation.

## Definition of Terms

### Prompt

A prompt is the query asked in a [question](#question). **It is a string that must always end with a question mark, and it can contain HTML text**. Examples include:
-  `What is the height of the Eiffel Tower?`
- `Who was the 23rd president of the US?`
- `The father of computer science is?`.
- `In the 1994 TV show <i>Friends</i>, who is Joey's best friend?`

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
- An associated [level](#level), and
- An array of [questions](#question).

All questions in a quiz have the same level. An example of a quiz is:

```json
{
  "name": "Pretty Paintings",
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
5. Pop Culture, and
6. Technology.

Each category has an ID from 1-6.
Categories each have subtopics. A subtopic consists of 25 [questions](#question) for each [level](#level) from 0 - 4.

### Level
The level of a [question](#question) or [quiz](#quiz) is a number from 0 - 4 that indicates its perceived difficulty. For example, a question with level 0 is very easy, while a question with 4 is extremely difficult. 

### User
A user is an entity that uses the app. Each user should have the following fields:
- An associated [username](#validating-usernames).
- An associated email address.
- A hashed [password](#validating-passwords).
- A `quizzesPlayed` integer value, initially set to 0.
- A `successRate` percentage value, initially set to 0.
- A `stars` integer value, initially set to 0.
- A `rapidFireCheckpoint`, initially set to the day before the current day. 


---
## Algorithms

### Validating Usernames
To validate a given username:
1. Assert that the username is in lowercase, else it is invalid, return false. 
2. Assert that the username does not start with a digit. Else it is invalid, return false. 
3. Assert that the username only contains alphanumeric characters and underscores, else it is invalid, return false.
4. Assert that the username has a length greater than 2 and less than or equal to 16. Else it is invalid, return false. 
5. Return true.

### Validating Passwords 


### Success Rate
The success rate of a [user](#user) is defined as the average of all their [quiz results](#quiz-result).



### Quiz Result
The result of a quiz is a percentage of the number of [questions](#questions) answered right, over the number of questions answered.

$QR = \frac{\sum_{n=1}^{correct} n}{\sum_{n=1}^{total} n} \times 100$



### Random Questions 
To return a list of random [questions](#question), given a `number`, a specified `level` and an optional `category`:
1. Let `questions` be a new list or array.
2. Let `categoryList` be an array of [categories](#category). 
3. If `category` is defined, add `category` to `categoryList`. Else, add all 6 categories to `categoryList`.
4. While the length of `questions` is less than `number`:
	1. For each topic in each category in `categoryList`:<br>
			1. ​Select 3 random questions from the specified level.
			2. For each question `q`; if the length of `questions` is equal to `number`, return a shuffled version of `questions`. Else, add `q` to `questions`.
5. Return a shuffled version of `questions`.


---
## API Routes

The following list defines the endpoints that are expected by the client.

#### - `/user/create`

#### - `/user/login`

#### - `/user/${userid}/stats`
This route is protected. Only users should be able to access it. 
1. Assert that the request method is `GET`, else the request is invalid.
2. Assert that `userid` points to an actual user, else the request is invalid.
3. Assert that it is the same user with id `userid` that is making this request.
4. Let `quizzesPlayed` be the number of quizzes played by this user. 
5. Let `stars` be the number of stars earned by this user. 
6. Let `successRate` be the [success rate](#success-rate) of this user. 
7. Return a response with the shape:
```js
{
  quizzesPlayed, 
  stars,
  successRate
}
```


#### - `/user/${userid}/stats/update`
This route is protected. Only users should be able to access it. 
1. Assert that the request method is `PUT`, else the request is invalid.
2. Assert that `userid` points to an actual user, else the request is invalid.
3. Assert that it is the same user with id `userid` that is making this request.
4. Assert that request body has the below  shape, else the request is invalid.
```ts
{
  quizResult: number,
  starsEarned: number,
}
```
> **note**: `starsEarned` can be a negative value. 

5. Increase the user's `quizzesPlayed` value by 1.
6. Recalculate the user's success rate by adding quizResult to the former value, and dividing the sum by quizzesPlayed.
7. Increase the user's stars by starsEarned.
8. Return a [success response](#success-response).


#### - `/categories/${id}/${level}`

1. Assert that the request method is  `GET`, else the request is invalid. 
2. Assert that `id` is a number between 1 and 6, else the request is invalid.
3. Assert that `level` is a number between 0 and 4, else the request is invalid. 
4. Let the defined [category](#category) be the category with an ID that equals `id`.
5. Let `quizObject` be a new quiz object.
	  - Set its name to the name of the defined category.
	  - Set its `questions` to an array of 20 [random questions](#random-questions) from the defined category, which have a level equal to `level`.
	  - Set its `level` to the defined `level`.
6. Return `quizObject`.

### - `/special`
`GET` endpoint that returns a list of special [quizzes](#quiz) for the day. Response should have the shape.
```js
{ quizzes }
```

### - `/rpdfire/${userid}/questions`

This route is protected. Only users should be able to access it. 
1. Assert that the request method is `GET`, else the request is invalid.
2. Assert that `userid` points to an actual user, else the request is invalid.
3. Assert that it is the same user with id `userid` that is making this request. 
4. If the `rapidFireCheckpoint` of the user is set to the current day, return a response with the shape:
```js
{
  questions: null
}
```
5. Else:
	1. Let `rfQuestionsL0` be an array of 15 [random questions](#random-questions) that have the level 0.
	2. Let `rfQuestionsL1` be an array of  30 [random questions](#random-questions) that have the level 1.
	3. Let `rfQuestionsL2` be an array of 45 [random questions](#random-questions) that have the level 2.
	4. Let `rfQuestionsL3` be an array of 60 [random questions](#random-questions) that have the level 3.
	5. Let `rfQuestionsL4` be an array of 75 [random questions](#random-questions) that have the level 4.
	6. Concat all the above arrays into a single ordered array called `questions`.
	7. Return a response with the shape:
```js
{ questions }
```

#### - `/rpdfire/${userid}/completed`
This route is protected. Only users should be able to access it. 
1. Assert that the request method is `POST`, else the request is invalid. 
2. Assert that `userid` points to an actual user, else the request is invalid. 
3. Assert that it is the same user with id `userid` that is making this request. 
4. Set `rapidFireCheckpoint` of the user with id `userid`, to the current day. 
5. Return a [success response](#success-response). 







