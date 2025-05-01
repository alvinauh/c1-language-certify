
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
