export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  invited_by?: any;
  points: number;
  created_at?: any;
  updated_at?: any;
};
export type UserData = {
  user: User;
};

export type UserStats = {
  correct_answers: number;
  incorrect_answers: number;
};
export type UserStatsData = {
  success: boolean;
  data: UserStats;
};

export type UserInvitedUsers = {
  id: number;
  name: string;
  is_premium: boolean;
};
export type UserInvitedUsersData = {
  success: boolean;
  data: UserInvitedUsers[];
};

export type UserPlan = {
  id: number;
  subscriber_type: string;
  subscriber_id: number;
  plan_id: number;
  slug: string;
  name: string;
  description: any;
  trial_ends_at: string;
  starts_at: string;
  ends_at: string;
  cancels_at: any;
  canceled_at: any;
  timezone: any;
  created_at: string;
  updated_at: string;
  deleted_at: any;
};

export type UserSettings = {
  personal: {
    name: string;
    surname: any;
    email: string;
    phone: string;
  };
  company: {
    name: string;
    nip: string;
    regon: string;
    address: {
      id: number;
      addressable_type: string;
      addressable_id: number;
      city: string;
      postcode: string;
      street: string;
      building_number: string;
      house_number: string;
      created_at: string;
      updated_at: string;
    };
  };
  financial: {
    iban: string;
    bank_name: string;
    swift: string;
  };
};

// {
//   "success": true,
//   "data": {
//       "current_page": 1,
//       "data": [
//           {
//               "id": 1,
//               "category_id": 1,
//               "title": "Jak dobrze znasz kuchnię polską?",
//               "description": "Jaka jest Twoja znajomość tradycyjnych polskich potraw?",
//               "image": "https://picsum.photos/300/400",
//               "time": 5,
//               "difficulty": "medium",
//               "is_active": 1,
//               "created_at": "2022-05-09T21:05:04.000000Z",
//               "updated_at": "2022-05-09T21:05:04.000000Z",
//               "questions_count": 6
//           },
//           {
//               "id": 4,
//               "category_id": 2,
//               "title": "Jak dobrze znasz kocią mowę ciała?",
//               "description": "Czy potrafisz dogadać się z kotami? Wiesz, co sygnalizują swoim zachowaniem?",
//               "image": "https://picsum.photos/300/400",
//               "time": 15,
//               "difficulty": "easy",
//               "is_active": 1,
//               "created_at": "2022-05-09T21:05:04.000000Z",
//               "updated_at": "2022-05-09T21:05:04.000000Z",
//               "questions_count": 14
//           }
//       ],
//       "first_page_url": "http://127.0.0.1:8000/api/quizzes?page=1",
//       "from": 1,
//       "last_page": 1,
//       "last_page_url": "http://127.0.0.1:8000/api/quizzes?page=1",
//       "links": [
//           {
//               "url": null,
//               "label": "&laquo; Previous",
//               "active": false
//           },
//           {
//               "url": "http://127.0.0.1:8000/api/quizzes?page=1",
//               "label": "1",
//               "active": true
//           },
//           {
//               "url": null,
//               "label": "Next &raquo;",
//               "active": false
//           }
//       ],
//       "next_page_url": null,
//       "path": "http://127.0.0.1:8000/api/quizzes",
//       "per_page": 2,
//       "prev_page_url": null,
//       "to": 2,
//       "total": 2
//   },
//   "message": "Objects fetched",
//   "count": 2
// }
export type QuizzesQuiz = {
  id: number;
  category_id: number;
  title: string;
  description: string;
  image: string;
  time: number;
  difficulty: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  questions_count: number;
};
export type QuizzesQuizData = {
  current_page: number;
  data: QuizzesQuiz[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};
export type QuizzesQuizDataData = {
  success: boolean;
  data: QuizzesQuizData;
  message: string;
  count: number;
};

export type QuizStartAnswer = {
  id: number;
  answer: string;
};
export type QuizStartNextQuestion = {
  id: number;
  question: string;
  answers: QuizStartAnswer[];
};
export type QuizStart = {
  submission_id: number;
  is_correct?: boolean;
  next_question: QuizStartNextQuestion;
};
export type QuizStartData = {
  success: boolean;
  data: QuizStart;
};

export type Quiz = {
  id: number;
  category_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};
export type QuizData = {
  success: boolean;
  data: Quiz;
  message: string;
};

export type Question = {
  id: number;
  quiz_id: number;
  question: string;
  created_at: string;
  updated_at: string;
};
export type QuestionsData = {
  success: boolean;
  data: Question[];
  message: string;
  count: number;
};

export type Category = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};
export type CategoryData = {
  success: boolean;
  data: Category[];
  message: string;
  count: number;
};
