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
  - [Public User](#public-user)
- [Algorithms](#algorithms)
  - [Validating Usernames](#validating-usernames)
  - [Validating Emails](#validating-emails)
  - [Validating Passwords](#validating-passwords)
  - [Email Links](#email-links)
    - [Verify email link](#verify-email-link)
    - [reset password email link](#reset-password-email-link)
  - [Success Rate](#success-rate)
  - [Rank Score](#rank-score)
  - [Quiz Result](#quiz-result)
  - [Collecting Random Questions](#collecting-random-questions)
- [Server API](#server-api)
  - [Success Response](#success-response)
  - [Server Errors](#server-errors)
  - [API Endpoints](#api-endpoints)
    - [- `BaseUrl`](#--baseurl)
    - [- POST `/api/v1/user/create`](#--post-apiv1usercreate)
    - [- POST `/api/v1/user/login`](#--post-apiv1userlogin)
    - [- PATCH `/api/v1/user/verify_email/:oneTimeToken`](#--patch-apiv1userverify_emailonetimetoken)
    - [- POST `/api/v1/user/resend_email`](#--post-apiv1userresend_email)
    - [- POST `/api/v1/user/forgot_password`](#--post-apiv1userforgot_password)
    - [- POST `/api/v1/user/reset_password/:oneTimeToken`](#--post-apiv1userreset_passwordonetimetoken)
    - [- PUT `/user/stats/update`](#--put-userstatsupdate)
    - [- GET `/category/get/:id/:level`](#--get-categorygetidlevel)
    - [- GET `/question/random/:level`](#--get-questionrandomlevel)
    - [- GET `/question/rpdfire`](#--get-questionrpdfire)
    - [- POST `question/rpdfire/completed`](#--post-questionrpdfirecompleted)
    - [- GET `users/ranked`](#--get-usersranked)

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
-  A `emailConfirmationStatus` boolean value, initially set to false.
-  A `quizzesPlayed` integer value, initially set to 0.
-  A `successRate` percentage value, initially set to 0.
-  A `stars` integer value, initially set to 0.
-  A `rapidFireCheckpoint`, initially set to null.

### Public User

The public interface for a [user](#user) is an object containing only the:

-  username
-  `quizzesPlayed`
-  `successRate`, and
-  `stars`
   of a user.

---

## Algorithms

### Validating Usernames

To validate a given username:

1. If the username is not in lowercase, return false.
2. If the username starts with a digit, return false.
3. If the username contains a character that is not an alphanumeric character or an underscore, return false.
4. If the username has a length less than 3 and greater than 16, return false.
5. Return true.

### Validating Emails

To validate a given email:

1. check if email matches regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`;

### Validating Passwords

To validate a given password:

1. If the password length is less than 8, return false.
2. If the password does not contain a number, return false.
3. If the password does not contains one uppercase and one lowercase letter, return false.
4. Return true.

### Email Links

#### Verify email link

<https://quizwiz-game.vercel.app/verify_email/${oneTimeToken}>

#### reset password email link

<https://quizwiz-game.vercel.app/reset_password/${oneTimeToken}>

### Success Rate

The success rate of a [user](#user) is defined as the average of all their [quiz results](#quiz-result).

### Rank Score

The rank score of a user is defined as the sum of:

-  the number of quizzes played times the quiz weight (0.4)
-  the number of stars times the stars weight (0.6)

$Rank = (Quizzes _ 0.4) + (Stars _ 0.6)

### Quiz Result

The result of a quiz is a percentage of the number of [questions](#questions) answered right, over the number of questions answered.

$QR = \frac{\sum_{n=1}^{correct} n}{\sum_{n=1}^{total} n} \times 100$

### Collecting Random Questions

To return a list of random [questions](#question), given a `number`, a specified `level` and an optional `category`:

1. Let `questions` be a new list or array.
2. Let `categoryList` be an array of [categories](#category).
3. If `category` is defined, add `category` to `categoryList`. Else, add all 6 categories to `categoryList`.
4. Implementations can determine a MAX_ITERATION_COUNT, to prevent forever loops on insufficient topics and levels.
5. While the length of `questions` is less than `number` and MAX_ITERATION_COUNT has not been surpassed:

   -  For each topic in each shuffled version of category in shuffled version of `categoryList`:

      -  Select 2 random questions from the specified level.

      -  For each of these random questions:

         -  If the length of `questions` is equal to `number`, return a shuffled version of `questions`.
         -  Else while question is already in `questions`:
            -  Replace question with another random question.
         -  Add question to `questions`.

6. Return a shuffled version of `questions`.

---

## Server API

The following section defines the endpoints that are expected by the client and related information.

### Success Response

Success reponses have a status field set to 'success', a message field and an optional data field.

```json
{
    "status": "success",
    "message": "string",
    "data": "string" | "object" | "array"
}

```

### Server Errors

Error reponses have a status field set to 'fail' or 'error' and a message field.

```json
{
    "status": "fail" | "error",
    "message": "string",
}

```

### API Endpoints

#### - `BaseUrl`

<https://quiz-app-server-pvx6.onrender.com>

#### - POST `/api/v1/user/create`

1. If the request method is not POST, return error response with message being "{route} is not a valid route".
2. If the request body does not have the shape:

```json
{
   "username": "string"
   "email": "string"
   "password": "string"
   "confirmPassword": "string"
}
```

return erorr response with message being "Invalid {{ key not provided }}" . 3. If the [username is not valid](#validating-usernames), return error response with message being "Invalid username". 4. If the [email is not valid](#validating-emails), return error response with message being "Invalid email". 5. If the [password is not valid](#validating-passwords), return error response with message being "Invalid password". 6. If the confirmPassword is not equal to password, return error response with message being "Passwords do not match". 7. If a [user](#user) with the username already exists, return error response with message being "{{ username }} already exist". 8. If a user with the email already exists, return error response with message being "{{ email }} already exist". 9. Create user in database and set initial values. 10. Send verification email and return a response with the shape:

```json
{
   "status": "success",
   "message": "registration successful, kindly check your email for next step",
   "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGMxN2NkYTU3ZGFlYmEwODZjYjIxM2EiLCJpYXQiOjE2OTA0MDIwMTQsImV4cCI6MTY5MDQwMjAxNH0.3wuIgX4ORL7bfjFCVS1XPxn3Vh_XiSo-MMEveLnTz_I",
      "user": {
         "username": "dejalayo",
         "email": "dejalayo@gmail.com",
         "emailConfirmationStatus": false,
         "quizzesPlayed": 0,
         "successRate": 0,
         "stars": 0,
         "rapidFireCheckpoint": null,
         "_id": "64c17cda57daeba086cb213a",
         "createdAt": "2023-07-26T20:06:50.072Z",
         "updatedAt": "2023-07-26T20:06:50.072Z"
      }
   }
}
```

where the token is used for authentication of subsequent user requests.

#### - POST `/api/v1/user/login`

1. If the request method is not POST, return error response with message being "{route} is not a valid route".
2. If the request body does not have the shape:

```json
{
   "username": "string",
   "password": "string"
}
```

return erorr response with message being "Email/Username and Password must be provided" .

3. If the username does not exist in the database, return erorr response with message being "Invalid email/username or password".
4. If the username exists but the passwords do not match, rreturn erorr response with message being "Invalid email/username or password".
5. Return a response with the shape:

```json
{
   "status": "success",
   "message": "login successful",
   "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGMxN2NkYTU3ZGFlYmEwODZjYjIxM2EiLCJpYXQiOjE2OTA0MDIzMjcsImV4cCI6MTY5MDQwMjMyN30.pfGEMYIKwlLCHalvieqbvNTvC8ZwyuLJf6ueDh4Aj24",
      "user": {
         "_id": "64c17cda57daeba086cb213a",
         "username": "dejalayo",
         "email": "dejalayo@gmail.com",
         "emailConfirmationStatus": false,
         "quizzesPlayed": 0,
         "successRate": 0,
         "stars": 0,
         "rapidFireCheckpoint": null,
         "createdAt": "2023-07-26T20:06:50.072Z",
         "updatedAt": "2023-07-26T20:06:50.072Z"
      }
   }
}
```

where the token is used for authentication of subsequent user requests.

#### - PATCH `/api/v1/user/verify_email/:oneTimeToken`

1. If the request method is not PATCH, return error response with message being "{route} is not a valid route".
2. If `:oneTimeToken` is invalid or has expired, return erorr response with message being "token expired, kindly request a new one".
3. Return a response with the shape:

```json
{
   "status": "success",
   "message": "Email successfully activated"
}
```

#### - POST `/api/v1/user/resend_email`

1. If the request method is not POST, return error response with message being "{route} is not a valid route".
2. If the request body does not have the shape:
   ```json
   {
      "email": "string",
   }
      return erorr response with message being "Invalid email" .
   ```
3. If [user](#user) is not in the db, return erorr response with message being "User not found"".
4. If [emailConfirmation](#user) is true, return erorr response with message being "Your account is already activated".
5. Send email and Return a response with the shape:

```json
{
   "status": "success",
   "message": "Verification email sent successfully!"
}
```

#### - POST `/api/v1/user/forgot_password`

1. If the request method is not POST, return error response with message being "{route} is not a valid route".
2. If the request body does not have the shape:

```json
{
   "email": "string"
}
```

return erorr response with message being "Invalid email" . 3. If [user](#user) is not in the db, return erorr response with message being "User not found"". 4. Send email and Return a response with the shape:

```json
{
   "status": "success",
   "message": "Message sent to your email, kindly check"
}
```

#### - POST `/api/v1/user/reset_password/:oneTimeToken`

1. If the request method is not POST, return error response with message being "{route} is not a valid route".
2. If `:oneTimeToken` is invalid or has expired, return erorr response with message being "Invalid or expired token".
3. If the request body does not have the shape:
   ```json
   {
      "password": "string",
      "confirmPassword": "string"
   }
   ```
   return erorr response with message being "Invalid password / Password not provided" .
4. If the [password is not valid](#validating-passwords), return error response with message being "Invalid password / Password not provided".
5. If the confirmPassword is not equal to password, return error response with message being "Passwords do not match / Confirm Password not provided".
6. Return a response with the shape:

```json
{
   "status": "success",
   "message": "Password was reset successfully"
}
```

#### - PUT `/user/stats/update`

This route is protected. Only users should be able to access it.

1. If the request method is not PUT, return error response with message being "{route} is not a valid route".
2. If the request body does not have the below shape:

   ```json
   {
      "quizResult": 56.5,
      "starsEarned": 4
   }
   ```

   return erorr response with message being ""quizResult" is required" or ""starsEarned" is required".

   > **note**: `starsEarned` can be a negative value.

3. if `quizResult` is not an integer or a stringified integer, "quizResult" must be a number
4. if `starsEarned` is not an integer or a stringified integer, "starsEarned" must be a number.
5. Increase the user's `quizzesPlayed` value by 1.
6. Recalculate the user's success rate by adding `quizResult` to the former `successRate` multiplied by former `quizzesPlayed`, and dividing the sum by:
   1. 1 if the initial success rate is 0.
   2. else, 2.
7. Increase the user's stars by `starsEarned`.
8. Return a response with the shape:

```json
{
   "status": "success",
   "message": "User stats updated successfully",
   "data": {
      "user": "user"
   }
}
```

#### - GET `/category/get/:id/:level`

1. If the request method is not GET, return error response with message being "{route} is not a valid route".
2. If `id` is not a number between 1 and 6, return error with message "categoryId must be from 1 to 6".
3. If `level` is not a number between 0 and 4, return error with message "level must be from 0 to 4".
4. Let the defined [category](#category) be the category with an ID that equals `id`.
5. Let `quizObject` be a new quiz object.
   -  Set its name to the name of the defined category.
   -  Set its `questions` to an array of 20 [random questions](#collecting-random-questions) from the defined category, which have a level equal to `level`.
   -  Set its `level` to the defined `level`.
6. Return response with shape

```json
{
   "status": "success",
   "message": "Quiz fetched successfully",
   "data": {
      "quiz": "quizObject"
   }
}
```

#### - GET `/question/random/:level`

1. If the request method is not GET, return error response with message being "{route} is not a valid route".
2. If `level` is not a number between 0 and 4, return error with message "level must be from 0 to 4".
3. let `questions` be an array of 20 [random questions](#collecting-random-questions) which have a level equal to `level`.
4. Return response with shape

```json
{
   "status": "success",
   "message": "Questions fetched successfully",
   "data": {
      "questions": "questions"
   }
}
```

#### - GET `/question/rpdfire`

This route is protected. Only users should be able to access it.

1. If the request method is not GET, return error response with message being "{route} is not a valid route".
2. Let `questions` be an empty array.
3. If the `rapidFireCheckpoint` of the user is _not_ set to the current day,
   -  Let `rfQuestionsL0` be an array of 10 [random questions](#collecting-random-questions) that have the level 0.
   -  Let `rfQuestionsL1` be an array of 20 [random questions](#collecting-random-questions) that have the level 1.
   -  Let `rfQuestionsL2` be an array of 40 [random questions](#collecting-random-questions) that have the level 2.
   -  Let `rfQuestionsL3` be an array of 60 [random questions](#collecting-random-questions) that have the level 3.
   -  Let `rfQuestionsL4` be an array of 75 [random questions](#collecting-random-questions) that have the level 4.
   -  Concatenate and flatten all the above arrays into `questions`.
4. Return response with shape

```json
{
   "status": "success",
   "message": "Questions fetched successfully",
   "data": {
      "questions": "questions"
   }
}
```

#### - POST `question/rpdfire/completed`

This route is protected. Only users should be able to access it.

1. If the request method is not `POST`, return error response with message being "{route} is not a valid route.
2. repeat 2-7 in [`/user/stats/update`](#userstatsupdate).
3. Set `rapidFireCheckpoint` of the user with id `userid`, to the current day.
4. Return a response with the shape:

```json
{
   "status": "success",
   "message": "Rapid fire completed successfully",
   "data": {
      "user": "user"
   }
}
```

#### - GET `users/ranked`

This route is protected. Only users should be able to access it.

1. If the request method is not `GET`, return error response with message being "{route} is not a valid route.
2. Let users be a list containing the [public data](#public-user) of at most 45 users with the highest [rank scores](#rank-score).
3. Return a response with the shape:

```json
{
   "status": "success",
   "message": "Ranked users retrieved successfully",
   "data": {
      "users": "users"
   }
}
```
