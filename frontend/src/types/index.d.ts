type Category =
  | "History and Politics"
  | "Language and Literature"
  | "Mathematics"
  | "Pop Culture"
  | "Sports"
  | "Technology";

interface Question {
  prompt: string;
  options: [string, string, string, string];
  level: 0 | 1 | 2 | 3 | 4;
  correctAnswer: 0 | 1 | 2 | 3;
}

interface Topic {
  title: string;
  category: Category;
  level0: Question[];
  level1: Question[];
  level2: Question[];
  level3: Question[];
  level4: Question[];
}
