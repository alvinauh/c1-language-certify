
// This simulates a database for now, would be replaced with Supabase
// once it's connected to the project

interface Question {
  id: number;
  questionText: string;
  questionType: 'multiple-choice' | 'essay' | 'audio-response';
  options?: string[];
  correctAnswer?: number | null;
  audioUrl?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  createdAt: Date;
  cefrLevel: string;
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  questions: Question[];
  userId?: string; // Creator ID
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: Record<number, any>;
  feedback?: string;
  score?: number;
}

// Simulated storage
let tests: Test[] = [];
let attempts: TestAttempt[] = [];

// Load from localStorage on init
const loadFromStorage = () => {
  try {
    const storedTests = localStorage.getItem('tests');
    const storedAttempts = localStorage.getItem('test_attempts');
    
    if (storedTests) {
      tests = JSON.parse(storedTests).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt)
      }));
    }
    
    if (storedAttempts) {
      attempts = JSON.parse(storedAttempts).map((a: any) => ({
        ...a,
        startedAt: new Date(a.startedAt),
        completedAt: a.completedAt ? new Date(a.completedAt) : undefined
      }));
    }
  } catch (e) {
    console.error('Error loading from storage', e);
  }
};

// Save to localStorage
const saveToStorage = () => {
  localStorage.setItem('tests', JSON.stringify(tests));
  localStorage.setItem('test_attempts', JSON.stringify(attempts));
};

// Initialize
loadFromStorage();

// Test functions
export const saveTest = (test: Omit<Test, 'id' | 'createdAt'>): Test => {
  const newTest: Test = {
    ...test,
    id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date()
  };
  
  tests.push(newTest);
  saveToStorage();
  return newTest;
};

export const getTests = (userId?: string): Test[] => {
  if (userId) {
    return tests.filter(test => test.userId === userId);
  }
  return [...tests];
};

export const getTestById = (id: string): Test | undefined => {
  return tests.find(test => test.id === id);
};

// Test attempt functions
export const createTestAttempt = (testId: string, userId: string): TestAttempt => {
  const attempt: TestAttempt = {
    id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    testId,
    userId,
    startedAt: new Date(),
    answers: {}
  };
  
  attempts.push(attempt);
  saveToStorage();
  return attempt;
};

export const saveTestAnswers = (
  attemptId: string, 
  answers: Record<number, any>,
  feedback?: string,
  score?: number
): TestAttempt | null => {
  const attemptIndex = attempts.findIndex(a => a.id === attemptId);
  if (attemptIndex === -1) return null;
  
  attempts[attemptIndex] = {
    ...attempts[attemptIndex],
    answers,
    completedAt: new Date(),
    feedback,
    score
  };
  
  saveToStorage();
  return attempts[attemptIndex];
};

export const getUserAttempts = (userId: string): TestAttempt[] => {
  return attempts.filter(attempt => attempt.userId === userId);
};

export const getAttemptById = (id: string): TestAttempt | undefined => {
  return attempts.find(attempt => attempt.id === id);
};
