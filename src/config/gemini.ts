import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const edgeFunctionUrl = `${supabaseUrl}/functions/v1/ai-api-proxy`;

interface GenerateContentRequest {
  prompt: string;
  imageData?: string;
  imageMediaType?: string;
  model?: string;
}

export async function callAIAPI(request: GenerateContentRequest) {
  const response = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.statusText}`);
  }

  return response.json();
}
