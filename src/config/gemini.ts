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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseKey}`,
  };

  const response = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Edge Function error:', errorData);
    throw new Error(`AI API error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}
