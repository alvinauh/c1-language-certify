import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tables, InsertTables } from '@/types/database';
import { saveTest as saveTestToSupabase } from './supabaseService';

// Rate limiting constants (client-side rate limiting)
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

// Two approaches for handling OpenAI API calls:
// 1. Using backend proxy (recommended for production)
// 2. Using direct API call with client-side API key (development/testing only)

// Flag to determine if we're using the backend proxy
let useBackendProxy = true;

// This would be passed from a secure backend in production
let clientSideApiKey: string | null = null;

export const configureOpenAI = (apiKey: string | null, useProxy: boolean = true) => {
  useBackendProxy = useProxy;
  
  if (!useProxy && apiKey) {
    clientSideApiKey = apiKey;
    localStorage.setItem('openai_configured', 'true');
  } else if (useProxy) {
    // When using proxy, we don't need the client-side API key
    clientSideApiKey = null;
    localStorage.setItem('openai_configured', 'true');
  } else {
    // No configuration
    clientSideApiKey = null;
    localStorage.removeItem('openai_configured');
  }
};

export const isOpenAIConfigured = (): boolean => {
  return localStorage.getItem('openai_configured') === 'true';
};

// Main function to call OpenAI API (either through proxy or directly)
export const callOpenAI = async (
  prompt: string, 
  options: { 
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<string> => {
  // Check rate limit first
  if (!checkRateLimit()) {
    const data = getRateLimitData();
    const resetTime = new Date(data.resetTime);
    throw new Error(`Rate limit reached. Try again after ${resetTime.toLocaleString()}`);
  }
  
  try {
    if (useBackendProxy) {
      // Use our backend proxy (Supabase Edge Function)
      return await callOpenAIViaProxy(prompt, options);
    } else {
      // Direct API call (not recommended for production)
      return await callOpenAIDirectly(prompt, options);
    }
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

// Backend proxy approach
const callOpenAIViaProxy = async (
  prompt: string,
  options: { 
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> => {
  // Get the backend URL, either from environment or hardcoded for deployed version
  const backendUrl = process.env.BACKEND_URL || 'https://openai-proxy-server.onrender.com';
  
  const response = await fetch(`${backendUrl}/api/openai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      model: options.model || 'gpt-4o-mini',
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }
  
  const data = await response.json();
  return data.completion || '';
};

// Direct API call approach (development/testing only)
const callOpenAIDirectly = async (
  prompt: string,
  options: { 
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> => {
  // Check if API is configured client-side
  if (!clientSideApiKey) {
    throw new Error("OpenAI API key is not configured");
  }
  
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientSideApiKey}`
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
};

// Cache generated tests in memory to avoid regenerating the same tests
const testCache: Record<string, any> = {};

// Helper for generating tests based on CEFR level
export const generateTest = async (
  cefrLevel: string,
  skill: 'reading' | 'writing' | 'listening' | 'speaking',
  subject: 'english' | 'math' | 'science' | 'history' | 'bahasa',
  numQuestions: number = 5,
  userId?: string,
  forceNewGeneration: boolean = false
): Promise<Tables<'tests'>> => {
  // Create a cache key for this test configuration
  const cacheKey = `${cefrLevel}_${skill}_${subject}_${numQuestions}`;
  
  try {
    // If not forcing new generation, check if a similar test already exists in Supabase
    // that the user hasn't attempted yet
    if (!forceNewGeneration && userId) {
      const nextAvailableTest = await getNextAvailableTest(userId, subject, skill);
      if (nextAvailableTest) {
        console.log('Using next available test from database');
        return nextAvailableTest;
      }
    }
    
    // If forcing generation or all tests have been attempted, create a new test
    
    // Check memory cache next if not forcing new generation
    if (!forceNewGeneration && testCache[cacheKey]) {
      console.log('Using cached test');
      return testCache[cacheKey];
    }
    
    // If not found, generate a new test
    const prompt = `Create a ${cefrLevel} level language ${skill} test for ${subject} with ${numQuestions} questions following CEFR guidelines. 
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
    
    console.log('Generating new test with AI');
    const response = await callOpenAI(prompt, {
      maxTokens: 2000,
      temperature: 0.7
    });
    
    // Parse the AI response
    const testData = JSON.parse(response);
    
    // Format for Supabase storage
    const testToSave: InsertTables<'tests'> = {
      title: testData.title,
      description: testData.description,
      duration: testData.duration,
      cefr_level: cefrLevel,
      skill: skill,
      questions: testData.questions,
      subject: subject,
      user_id: userId
    };
    
    // Save to Supabase
    const savedTest = await saveTest(testToSave);
    
    // Cache the test
    testCache[cacheKey] = savedTest;
    
    return savedTest;
  } catch (e) {
    console.error("Failed to generate or parse test", e);
    throw new Error("Failed to generate a valid test");
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

// Add this new function to import the needed functions
import { saveTest, getNextAvailableTest } from './supabaseService';
