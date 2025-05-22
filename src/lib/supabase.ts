import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client only if valid credentials are present
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Function to check if Supabase is properly initialized
export function isSupabaseInitialized(): boolean {
  return supabase !== null;
}

// Function to get user projects
export async function getUserProjects(userId: string) {
  if (!isSupabaseInitialized()) {
    return {
      success: false,
      error: 'Supabase client is not initialized'
    };
  }

  try {
    const { data, error } = await supabase!
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Add type definitions for the API
interface DocumentSubmission {
  id: string;
  content: string;
  readability: string;
  purpose: string;
  strength: string;
  model: string;
  user_agent?: string;
  document_type?: string;
  url?: string;
}

interface DocumentRetrieval {
  id: string;
}

interface HumanizeOptions {
  readability?: string;
  purpose?: string;
  strength?: string;
  model?: string;
  maxAttempts?: number;
  pollInterval?: number;
}

// Separate the API service logic
class UndetectableAIService {
  private apiKey: string;
  private baseUrl = 'https://humanize.undetectable.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async submitDocument(submission: DocumentSubmission): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        const errorData = await this.getErrorDetails(response);
        return {
          success: false,
          error: `Submit failed (${response.status}): ${errorData}`
        };
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async retrieveDocument(retrieval: DocumentRetrieval): Promise<{ success: boolean; output?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey
        },
        body: JSON.stringify(retrieval)
      });

      if (!response.ok) {
        const errorData = await this.getErrorDetails(response);
        return {
          success: false,
          error: `Retrieve failed (${response.status}): ${errorData}`
        };
      }

      const data = await response.json();
      return { success: true, output: data.output };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  private async getErrorDetails(response: Response): Promise<string> {
    try {
      const errorData = await response.json();
      return JSON.stringify(errorData);
    } catch {
      return await response.text().catch(() => 'No error details available');
    }
  }
}

// Separate credit management
class CreditManager {
  constructor(private supabase: any) {}

  async checkAndDeductCredits(userId: string, wordCount: number): Promise<{ success: boolean; error?: string }> {
    try {
      const userCredits = await this.getUserCredits(userId);
      
      if (userCredits < wordCount) {
        return {
          success: false,
          error: `Insufficient credits. You need ${wordCount} credits but have ${userCredits} available.`
        };
      }

      // Deduct credits
      const deductResult = await this.deductCredits(userId, wordCount);
      return deductResult;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Credit check failed'
      };
    }
  }

  private async getUserCredits(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      // If user doesn't exist, create them with default credits
      if (!data) {
        await this.createUserWithDefaultCredits(userId);
        return 1000; // Default credits
      }

      return data.credits ?? 1000;
    } catch (error) {
      console.error('Error getting user credits:', error);
      return 1000; // Fallback
    }
  }

  private async createUserWithDefaultCredits(userId: string): Promise<void> {
    try {
      await this.supabase
        .from('users')
        .upsert([{ id: userId, credits: 1000 }], { onConflict: 'id' });
    } catch (error) {
      console.error('Failed to create user record:', error);
    }
  }

  private async deductCredits(userId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: currentUserData } = await this.supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      const currentCredits = currentUserData?.credits ?? 1000;
      
      const { error } = await this.supabase
        .from('users')
        .update({ credits: currentCredits - amount })
        .eq('id', userId);

      if (error) {
        console.error('Failed to update credits:', error);
        return { success: false, error: 'Failed to update credits' };
      }

      return { success: true };
    } catch (error) {
      console.error('Could not update credits:', error);
      return { success: true }; // Don't fail the operation if credits can't be updated
    }
  }
}

// Refactored main function
export async function humanizeText(text: string): Promise<{
  success: boolean;
  data?: string;
  error?: string;
}> {
  if (!isSupabaseInitialized()) {
    return { success: false, error: 'Supabase client is not initialized' };
  }

  const apiKey = import.meta.env.VITE_UNDETECTABLE_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: 'Undetectable AI API key not configured'
    };
  }

  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase!.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check and deduct credits
    const wordCount = text.trim().split(/\s+/).length;
    const userCredits = await getUserCredits(user.id);
    
    if (userCredits < wordCount) {
      return {
        success: false,
        error: `Insufficient credits. You need ${wordCount} credits but have ${userCredits} available.`
      };
    }

    // Generate a unique id for the document
    const id = uuidv4();
    
    // 1. Submit the document with the correct structure
    const submitResponse = await fetch('https://humanize.undetectable.ai/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        id: id,
        content: text,
        readability: 'High School',
        purpose: 'General Writing',
        strength: 'More Human',
        model: 'v2',
        user_agent: navigator.userAgent,
        document_type: 'Text',
        url: 'https://example.com/'
      })
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text().catch(() => 'No error details available');
      return {
        success: false,
        error: `Submit failed (${submitResponse.status}): ${errorText}`
      };
    }

    const submitData = await submitResponse.json();
    const documentId = submitData.id;

    // 2. Poll for the result
    let output = null;
    let attempts = 0;
    while (attempts < 10) {
      await new Promise(res => setTimeout(res, 3000)); // wait 3 seconds
      
      const docResponse = await fetch('https://humanize.undetectable.ai/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        },
        body: JSON.stringify({ id: documentId })
      });

      if (!docResponse.ok) {
        const errorText = await docResponse.text().catch(() => 'No error details available');
        return {
          success: false,
          error: `Document fetch failed (${docResponse.status}): ${errorText}`
        };
      }

      const docData = await docResponse.json();
      if (docData.output) {
        output = docData.output;
        break;
      }
      attempts++;
    }

    if (output) {
      // Deduct credits after successful processing
      const newCredits = userCredits - wordCount;
      await updateUserCredits(user.id, newCredits);
      
      return { success: true, data: output };
    } else {
      return { success: false, error: 'Timed out waiting for humanized text.' };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to save a project to Supabase
export async function saveProject(
  userId: string,
  inputText: string,
  outputText: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  if (!isSupabaseInitialized()) {
    return {
      success: false,
      error: 'Supabase client is not initialized'
    };
  }

  try {
    const { data, error } = await supabase!
      .from('projects')
      .insert([
        {
          user_id: userId,
          input_text: inputText,
          output_text: outputText,
        },
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Function to get user credits
export async function getUserCredits(userId: string): Promise<number> {
  if (!isSupabaseInitialized()) {
    console.error('Supabase client is not initialized');
    return 0;
  }

  try {
    const { data, error } = await supabase!
      .from('users')
      .select('credits')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    // If user doesn't exist, create them with default credits
    if (!data) {
      await supabase!
        .from('users')
        .upsert([{ id: userId, credits: 1000 }], { onConflict: 'id' });
      return 1000;
    }

    return data?.credits ?? 1000;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 1000; // Return default credits on error
  }
}

// Function to update user credits
export async function updateUserCredits(
  userId: string,
  credits: number
): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseInitialized()) {
    return {
      success: false,
      error: 'Supabase client is not initialized'
    };
  }

  try {
    const { error } = await supabase!
      .from('users')
      .update({ credits })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}