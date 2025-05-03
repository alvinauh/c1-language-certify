
import { supabase } from '@/integrations/supabase/client';
import { Tables, InsertTables, UpdateTables } from '@/types/database';

// Tests table functions
export const fetchTests = async (subject?: string, userId?: string) => {
  let query = supabase.from('tests').select('*');
  
  if (subject) {
    query = query.eq('subject', subject);
  }
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
  
  return data as Tables<'tests'>[];
};

// Check if user has completed all available tests for a given subject and skill
export const hasCompletedAllTests = async (userId: string, subject: string, skill: string) => {
  try {
    // First get all tests for this subject and skill
    const { data: tests } = await supabase
      .from('tests')
      .select('id')
      .eq('subject', subject)
      .eq('skill', skill);
      
    if (!tests || tests.length === 0) {
      return true; // No tests available means we need to generate one
    }
    
    // Now get all completed attempts for this user
    const { data: attempts } = await supabase
      .from('test_attempts')
      .select('test_id')
      .eq('user_id', userId)
      .not('completed_at', 'is', null);
      
    if (!attempts || attempts.length === 0) {
      return false; // User hasn't completed any tests
    }
    
    // Check if all test IDs are in the completed attempts
    const completedTestIds = attempts.map(attempt => attempt.test_id);
    const allTestsCompleted = tests.every(test => 
      completedTestIds.includes(test.id)
    );
    
    return allTestsCompleted;
  } catch (error) {
    console.error('Error checking completed tests:', error);
    return false; // Assume not all completed on error
  }
};

// Get the next available test that the user hasn't attempted
export const getNextAvailableTest = async (userId: string, subject: string, skill: string) => {
  try {
    // Get all tests for this subject and skill
    const { data: tests } = await supabase
      .from('tests')
      .select('*')
      .eq('subject', subject)
      .eq('skill', skill)
      .order('created_at', { ascending: true });
      
    if (!tests || tests.length === 0) {
      return null; // No tests available
    }
    
    // Get all test attempts by this user
    const { data: attempts } = await supabase
      .from('test_attempts')
      .select('test_id')
      .eq('user_id', userId);
      
    const attemptedTestIds = attempts ? attempts.map(attempt => attempt.test_id) : [];
    
    // Find the first test that hasn't been attempted
    const nextTest = tests.find(test => !attemptedTestIds.includes(test.id));
    
    return nextTest as Tables<'tests'> | null;
  } catch (error) {
    console.error('Error getting next available test:', error);
    return null;
  }
};

export const getTestById = async (id: string) => {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
  
  return data as Tables<'tests'>;
};

export const saveTest = async (test: InsertTables<'tests'>) => {
  const { data, error } = await supabase
    .from('tests')
    .insert(test)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving test:', error);
    throw error;
  }
  
  return data as Tables<'tests'>;
};

// Test attempt functions
export const createTestAttempt = async (testAttempt: InsertTables<'test_attempts'>) => {
  const { data, error } = await supabase
    .from('test_attempts')
    .insert(testAttempt)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating test attempt:', error);
    throw error;
  }
  
  return data as Tables<'test_attempts'>;
};

export const saveTestAnswers = async (
  attemptId: string,
  updates: UpdateTables<'test_attempts'>
) => {
  const { data, error } = await supabase
    .from('test_attempts')
    .update(updates)
    .eq('id', attemptId)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving test answers:', error);
    throw error;
  }
  
  return data as Tables<'test_attempts'>;
};

export const getUserAttempts = async (userId: string) => {
  const { data, error } = await supabase
    .from('test_attempts')
    .select(`
      *,
      tests (*)
    `)
    .eq('user_id', userId)
    .order('started_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user attempts:', error);
    throw error;
  }
  
  return data as (Tables<'test_attempts'> & { tests: Tables<'tests'> })[];
};

export const getAttemptById = async (id: string) => {
  const { data, error } = await supabase
    .from('test_attempts')
    .select(`
      *,
      tests (*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching attempt:', error);
    throw error;
  }
  
  return data as (Tables<'test_attempts'> & { tests: Tables<'tests'> });
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
  
  return data as Tables<'profiles'>;
};

export const updateUserProfile = async (userId: string, updates: UpdateTables<'profiles'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  
  return data as Tables<'profiles'>;
};
