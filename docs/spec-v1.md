<h1 align=center>Project Backend Specification</h1>

<p align=center>This file explains all information pertaining to this project and its implementation.</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Definition of Terms](#definition-of-terms)
  - [Prompt](#prompt)
  - [Question](#question)
  - [Quiz](#quiz)
  - [Category](#category)
  - [Level](#level)
  - [User](#user)
- [Algorithms](#algorithms)
  - [Validating Usernames](#validating-usernames)
  - [Validating Passwords](#validating-passwords)
  - [Success Rate](#success-rate)
  - [Quiz Result](#quiz-result)
  - [Collecting Random Questions](#collecting-random-questions)
- [Server API](#server-api)
  - [Success Response](#success-response)
  - [Server Errors](#server-errors)
    - [Malformed Requests](#malformed-requests)
    - [Invalid Parameters](#invalid-parameters)
    - [Not Found](#not-found)
    - [Parameter Conflicts](#parameter-conflicts)
  - [API Endpoints](#api-endpoints)
    - [- `/user/create`](#--usercreate)
    - [- `/user/delete`](#--userdelete)
    - [- `/user/login`](#--userlogin)
    - [- `/user/stats`](#--userstats)
    - [- `/user/stats/update`](#--userstatsupdate)
    - [- `/category/get/:id/:level`](#--categorygetidlevel)
    - [- `/question/random/:level`](#--questionrandomlevel)
    - [- GET `/question/rpdfire`](#--get-questionrpdfire)
    - [- `question/rpdfire/completed`](#--questionrpdfirecompleted)

## Definition of Terms

### Prompt

A prompt is the query asked in a [question](#question). **It is a string that must always end with a question mark, and it can contain HTML text**. Examples include:

-  `What is the height of the Eiffel Tower?`
-  `Who was the 23rd president of the US?`
-  `The father of computer science is?`.
-  `In the 1994 TV show <i>Friends</i>, who is Joey's best friend?`

### Question

A question is an object containing:

-  a unique identifier,
-  a [prompt](#prompt),
-  an option array. Each option is a string.
-  a [level](#level), and
-  a correct answer. The correct answer is a zero based index pointing to the valid option in the option array.

An example would be:

```json
{
   "id": "ab5hhr589uve4",
   "prompt": "What is 2 + 2?",
   "options": ["4", "5", "6", "7"],
   "level": 0,
   "correctAnswer": 0
}
```

### Quiz

A quiz is an object containing:

-  A quiz name,
-  An associated [level](#level), and
-  An array of [questions](#question).

All questions in a quiz have the same level. An example of a quiz is:

```json
{
   "name": "Pretty Paintings",
   "level": 2,
   "questions": []
}
```

### Category

A category is a broad subject description. All the categories are stored in the `/backend/categories` folder. The defined categories are:

1. History, Politics & Geography
2. Language & Literature
3. Sports
4. Mathematics
5. Pop Culture, and
6. Technology.

Each category has an ID from 1-6.
Categories each have subtopics. A subtopic consists of [questions](#question) for each [level](#level) from 0 - 4.

### Level

The level of a [question](#question) or [quiz](#quiz) is a number from 0 - 4 that indicates its perceived difficulty. For example, a question with level 0 is very easy, while a question with 4 is extremely difficult.

### User

A user is an entity that uses the app. Each user should have the following fields:

-  An associated ID.
-  An associated [username](#validating-usernames).
-  An associated email address.
-  A hashed [password](#validating-passwords).
-  A `quizzesPlayed` integer value, initially set to 0.
-  A `successRate` percentage value, initially set to 0.
-  A `stars` integer value, initially set to 0.
-  A `rapidFireCheckpoint`, initially set to null.

---

## Algorithms

### Validating Usernames

To validate a given username:

1. If the username is not in lowercase, return false.
2. If the username starts with a digit, return false.
3. If the username contains a character that is not an alphanumeric character or an underscore, return false.
4. If the username has a length less than 3 and greater than 16, return false.
5. Return true.

### Validating Passwords

To validate a given password:

1. If the password length is less than 7, return false.
2. If the password does not contain a number, return false.
3. If the password does not contains one uppercase and one lowercase letter, return false.
4. Return true.

### Success Rate

The success rate of a [user](#user) is defined as the average of all their [quiz results](#quiz-result).

### Quiz Result

The result of a quiz is a percentage of the number of [questions](#questions) answered right, over the number of questions answered.

$QR = \frac{\sum_{n=1}^{correct} n}{\sum_{n=1}^{total} n} \times 100$

### Collecting Random Questions

To return a list of random [questions](#question), given a `number`, a specified `level` and an optional `category`:

1. Let `questions` be a new list or array.
2. Let `categoryList` be an array of [categories](#category).
3. If `category` is defined, add `category` to `categoryList`. Else, add all 6 categories to `categoryList`.
4. While the length of `questions` is less than `number`:

   -  For each topic in each category in `categoryList`:

      -  Select 3 random questions from the specified level.

      -  For each of these random questions:

         -  If the length of `questions` is equal to `number`, return a shuffled version of `questions`.
         -  Else while question is already in `questions`:
            -  Replace question with another random question.
         -  Add question to `questions`.

5. Return a shuffled version of `questions`.

---

## Server API

The following section defines the endpoints that are expected by the client and related information.

### Success Response

Success reponses have a success field set to true.

### Server Errors

The error codes are used to specify to the client what went wrong with a request, with a deeper level of detail. The complete list is in the JSON file in `/backend/json/error-codes.json`.

#### Malformed Requests

A malformed request error occurs when a request is sent with a wrong method or an invalid body.

#### Invalid Parameters

An invalid parameter error occurs if the username, email or password of a user is not valid. The 3 scenarios have their own individual error codes.

#### Not Found

A not found error occurs when a resource cannot be found: such as a route, a username in a database, a category with an id, etc.

#### Parameter Conflicts

A parameter conflict error occurs if a user with the same email or username already exists. The two scenarios have their own individual error codes.

| ERROR TYPE              | CODE |
| ----------------------- | ---- |
| MALFORMED_REQUEST       | 0    |
| INVALID_USERNAME        | 1    |
| INVALID_PASSWORD        | 2    |
| INVALID_EMAIL           | 3    |
| EMAIL_ALREADY_EXISTS    | 4    |
| USERNAME_ALREADY_EXISTS | 5    |
| NOT_FOUND               | 6    |
| UNAUTHORIZED            | 7    |

### API Endpoints

#### - `/user/create`

1. If the request method is not POST, return a [malformed request](#malformed-request) error.
2. If the request body does not have the shape:
   ```json
   {
      "username": "string"
      "emailAddress": "string"
      "password": "string"
   }
   ```
   return a malformed request error.
3. If the [username is not valid](#validating-usernames), return an [invalid parameter](#invalid-parameters) error.
4. If the email is not valid, return an invalid parameter error.
5. If the [password is not valid](#validating-passwords), return an invalid parameter error.
6. If a [user](#user) with the username already exists, return an [parameter conflict](#parameter-conflicts) error.
7. If a user with the email already exists, return a parameter conflict error.
8. Create user in database and set initial values.
9. Return a response with the shape:
   ```json
   {
      "username": "string",
      "token": "string"
   }
   ```
   where the token is used for authentication of subsequent user requests.

#### - `/user/delete`

This route is protected. Only users should be able to access it.

1. If the request method is not DELETE, return a [malformed request](#malformed-request) error.
2. Remove the user from the database.
3. Return a [success response](#success-response).

#### - `/user/login`

1. If the request method is not POST, return a [malformed request](#malformed-request) error.
2. If the request body does not have the shape:
   ```json
   {
      "username": "string",
      "password": "string"
   }
   ```
   or
   ```json
   {
      "email": "string",
      "password": "string"
   }
   ```
   return a [malformed request](#malformed-requests) error.
3. If the username does not exist in the database, return a [not found](#not-found) error.
4. If the username exists but the passwords do not match, return an [invalid parameter](#invalid-parameters) error.
5. Return a response with the shape:
   ```json
   {
      "username": "string",
      "token": "string"
   }
   ```

#### - `/user/stats`

This route is protected. Only users should be able to access it.

1. If the request method is not GET, return a [malformed request](#malformed-request) error.
2. Let `quizzesPlayed` be the number of quizzes played by this user.
3. Let `stars` be the number of stars earned by this user.
4. Let `successRate` be the [success rate](#success-rate) of this user.
5. Return a response with the shape:
   ```json
   {
      "quizzesPlayed": 7,
      "stars": 30,
      "successRate": 67.8
   }
   ```

#### - `/user/stats/update`

This route is protected. Only users should be able to access it.

1. If the request method is not `PUT`, return a [malformed request](#malformed-request) error.
2. If the request body does not have the below shape:

   ```json
   {
      "quizResult": 56.5,
      "starsEarned": 4
   }
   ```

   return a [malformed request](#malformed-request) error.

   > **note**: `starsEarned` can be a negative value.

3. Increase the user's `quizzesPlayed` value by 1.
4. Recalculate the user's success rate by adding `quizResult` to the former `successRate`, and dividing the sum by `quizzesPlayed`.
5. Increase the user's stars by `starsEarned`.
6. Return a [success response](#success-response).

#### - `/category/get/:id/:level`

1. If the request method is not GET, return a [malformed request](#malformed-requests) error.
2. If `id` is not a number between 1 and 6, return a [not found](#not-found) error.
3. If `level` is not a number between 0 and 4, return a [not found](#not-found) error.
4. Let the defined [category](#category) be the category with an ID that equals `id`.
5. Let `quizObject` be a new quiz object.
   -  Set its name to the name of the defined category.
   -  Set its `questions` to an array of 20 [random questions](#collecting-random-questions) from the defined category, which have a level equal to `level`.
   -  Set its `level` to the defined `level`.
6. Return `quizObject`.

#### - `/question/random/:level`

1. If the request method is not GET, return a [malformed request](#malformed-requests) error
2. If `level` is not a number between 0 and 4, return a [not found](#not-found) error.
3. let `questions` be an array of 20 [random questions](#collecting-random-questions) which have a level equal to `level`.
4. Return `questions`.

#### - GET `/question/rpdfire`

This route is protected. Only users should be able to access it.

1. If the request method is not GET, return a [malformed request](#malformed-requests) error.
2. Let `questions` be an empty array.
3. If the `rapidFireCheckpoint` of the user is _not_ set to the current day,
   -  Let `rfQuestionsL0` be an array of 15 [random questions](#collecting-random-questions) that have the level 0.
   -  Let `rfQuestionsL1` be an array of 30 [random questions](#collecting-random-questions) that have the level 1.
   -  Let `rfQuestionsL2` be an array of 45 [random questions](#collecting-random-questions) that have the level 2.
   -  Let `rfQuestionsL3` be an array of 60 [random questions](#collecting-random-questions) that have the level 3.
   -  Let `rfQuestionsL4` be an array of 75 [random questions](#collecting-random-questions) that have the level 4.
   -  Concatenate and flatten all the above arrays into `questions`.
4. Return a response with the shape:
   ```json
   {
      "questions": []
   }
   ```
   with the array set to `questions`.

#### - `question/rpdfire/completed`

This route is protected. Only users should be able to access it.

1. If the request method is not `POST`, return a [malformed request](#malformed-requests) error.
2. If the request does not have the same shape as a request to [`/user/stats/update`](#userstatsupdate), return a [malformed request](#malformed-requests) error.
3. Update the user stats, following steps 3-5 in [`/user/stats/update`](#userstatsupdate).
4. Set `rapidFireCheckpoint` of the user with id `userid`, to the current day.
5. Return a [success response](#success-response).
