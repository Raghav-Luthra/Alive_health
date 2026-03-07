import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateContentRequest {
  prompt: string;
  imageData?: string;
  imageMediaType?: string;
  model?: string;
}

async function getApiKey(provider: string): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from("api_keys")
    .select("key_value")
    .eq("provider", provider)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    throw new Error(`Failed to retrieve API key for ${provider}`);
  }

  return data.key_value;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: GenerateContentRequest = await req.json();
    const { prompt, imageData, imageMediaType, model = "gemini-2.5-flash" } = payload;

    const apiKey = await getApiKey("gemini");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let content: Record<string, unknown>[] = [];

    if (imageData && imageMediaType) {
      content = [
        {
          text: prompt,
        },
        {
          inlineData: {
            mimeType: imageMediaType,
            data: imageData,
          },
        },
      ];
    } else {
      content = [
        {
          text: prompt,
        },
      ];
    }

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: content,
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);

    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
