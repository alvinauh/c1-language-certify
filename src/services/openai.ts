import { toast } from "@/components/ui/use-toast";

// In a real production app, this would be handled by Supabase Edge Functions
// to keep the API key secure. For now, we'll simulate this behavior.

// Rate limiting constants
const MAX_REQUESTS_PER_DAY = 50;
const RATE_LIMIT_RESET_HOURS = 24;

// Store rate limiting data in localStorage
const getRateLimitData = (): { count: number; resetTime: number } => {
  const stored = localStorage.getItem('ai_rate_limit');
  if (!stored) {
    return { count: 0, resetTime: Date.now() + RATE_LIMIT_RESET_HOURS * 60 * 60 * 1000 };
  }
  return JSON.parse(stored);
};

const updateRateLimitData = (data: { count: number; resetTime: number }) => {
  localStorage.setItem('ai_rate_limit', JSON.stringify(data));
};

const checkRateLimit = (): boolean => {
  const data = getRateLimitData();
  
  // Reset counter if the time has passed
  if (Date.now() > data.resetTime) {
    updateRateLimitData({ 
      count: 0, 
      resetTime: Date.now() + RATE_LIMIT_RESET_HOURS * 60 * 60 * 1000 
    });
    return true;
  }
  
  // Check if under limit
  if (data.count < MAX_REQUESTS_PER_DAY) {
    data.count++;
    updateRateLimitData(data);
    return true;
  }
  
  return false;
};

interface OpenAIConfig {
  apiKey: string;
}

// This would be passed from a secure backend in production
let config: OpenAIConfig | null = null;

export const configureOpenAI = (apiKey: string) => {
  config = { apiKey };
  // In a real app, we might validate the API key here
  localStorage.setItem('openai_configured', 'true');
};

export const isOpenAIConfigured = (): boolean => {
  return localStorage.getItem('openai_configured') === 'true';
};

export const callOpenAI = async (
  prompt: string, 
  options: { 
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<string> => {
  // Check if API is configured
  if (!config?.apiKey) {
    throw new Error("OpenAI API is not configured");
  }
  
  // Check rate limit
  if (!checkRateLimit()) {
    const data = getRateLimitData();
    const resetTime = new Date(data.resetTime);
    throw new Error(`Rate limit reached. Try again after ${resetTime.toLocaleString()}`);
  }
  
  try {
    // In production, this request would go to a Supabase Edge Function
    // that safely handles the API key server-side
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        prompt,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Unknown error occurred');
    }
    
    const data = await response.json();
    return data.choices[0].text.trim();
    
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    toast({
      title: "AI Generation Failed",
      description: error.message || "An error occurred while generating content",
      variant: "destructive"
    });
    throw error;
  }
};

// Helper for generating tests based on CEFR level
export const generateTest = async (
  cefrLevel: string,
  skill: 'reading' | 'writing' | 'listening' | 'speaking',
  numQuestions: number = 5
): Promise<any> => {
  const prompt = `Create a ${cefrLevel} level language ${skill} test with ${numQuestions} questions following CEFR guidelines. 
  Format the response as a valid JSON object with the following structure:
  {
    "title": "Title of the test",
    "description": "Brief description of the test",
    "duration": duration in minutes,
    "questions": [
      {
        "id": 1,
        "questionText": "The full text of the question",
        "questionType": "multiple-choice" or "essay" or "audio-response",
        "options": ["option1", "option2", "option3", "option4"] (for multiple-choice only),
        "correctAnswer": index of correct option (for multiple-choice only),
        "audioUrl": "url" (for listening questions only)
      }
    ]
  }`;
  
  const response = await callOpenAI(prompt, {
    maxTokens: 2000,
    temperature: 0.7
  });
  
  try {
    return JSON.parse(response);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to generate a valid test format");
  }
};

export const generateFeedback = async (
  cefrLevel: string,
  answers: Record<number, any>,
  questions: any[]
): Promise<string> => {
  // Create a detailed prompt for the AI to analyze the answers
  let answersText = '';
  questions.forEach(q => {
    const answer = answers[q.id];
    answersText += `Question: ${q.questionText}\n`;
    answersText += `Student's answer: ${
      q.questionType === 'multiple-choice' 
        ? q.options[answer] || 'No answer'
        : answer || 'No answer'
    }\n\n`;
  });
  
  const prompt = `You are a ${cefrLevel} CEFR language proficiency assessor. 
  Evaluate the following student responses and provide detailed feedback according to CEFR standards.
  
  ${answersText}
  
  Provide constructive feedback on the student's language abilities at the ${cefrLevel} level.
  Include strengths, areas for improvement, and suggestions for further practice.`;
  
  return await callOpenAI(prompt, {
    maxTokens: 1000,
    temperature: 0.7
  });
};
