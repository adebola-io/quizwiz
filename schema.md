# Question Schema
```ts
interface Question {
   prompt: string,
   options: string[],
   correctAnswer: "A" | "B" | "C" | "D",
   difficulty: 1 | 2 | 3,
   tags: Tags[]
}
```
