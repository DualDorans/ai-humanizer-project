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

// Function to humanize text using backend FastAPI
export async function humanizeText(text: string): Promise<{
  success: boolean;
  data?: string;
  error?: string;
}> {
  if (!isSupabaseInitialized()) {
    return {
      success: false,
      error: 'Supabase client is not initialized'
    };
  }

  try {
    // Get user credits first
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (userError) {
      throw new Error('Failed to check user credits');
    }

    const credits = userData?.credits ?? 0;
    const wordCount = text.trim().split(/\s+/).length;

    if (credits < wordCount) {
      return {
        success: false,
        error: `Insufficient credits. You need ${wordCount} credits but have ${credits} available.`
      };
    }

    const apiKey = import.meta.env.VITE_UNDETECTABLE_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: 'Undetectable AI API key not configured'
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
      throw new Error(`Submit failed with status ${submitResponse.status}`);
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
        throw new Error(`Document fetch failed with status ${docResponse.status}`);
      }

      const docData = await docResponse.json();
      if (docData.output) {
        output = docData.output;
        break;
      }
      attempts++;
    }

    if (output) {
      // Deduct credits from user
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: credits - wordCount })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (updateError) {
        console.error('Failed to update credits:', updateError);
      }

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
    return data?.credits ?? 0;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0;
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