// Gemini API integration (Supabase completely removed)

const API_KEY = "AIzaSyCkaqj5jnpqs0T51blATrCM5AO0ou87z4I";

interface GenerateContentRequest {
  prompt: string;
  imageData?: string;
  imageMediaType?: string;
  model?: string;
}

interface GeminiPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

interface GeminiRequestBody {
  contents: {
    parts: GeminiPart[];
  }[];
}

export async function callAIAPI(request: GenerateContentRequest) {
  const model = request.model || "gemini-1.5-flash";

  const parts: GeminiPart[] = [
    {
      text: request.prompt,
    },
  ];

  if (request.imageData) {
    parts.push({
      inline_data: {
        mime_type: request.imageMediaType || "image/jpeg",
        data: request.imageData,
      },
    });
  }

  const body: GeminiRequestBody = {
    contents: [
      {
        parts,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();

    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    return {
      success: true,
      text: result,
      raw: data,
    };
  } catch (error) {
    console.error("AI request failed:", error);

    return {
      success: false,
      text: "AI request failed",
      error,
    };
  }
}
