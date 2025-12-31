import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Improving prompt:", prompt);
    console.log("Type:", type);

    let systemPrompt = "";
    
    if (type === "improve") {
      systemPrompt = `You are an expert AI image prompt engineer. Your task is to take a user's simple prompt and enhance it to create stunning, professional-quality AI-generated images. 

Add these elements to improve the prompt:
- Specific art styles (photorealistic, digital art, oil painting, etc.)
- Lighting details (golden hour, dramatic lighting, cinematic)
- Camera angles and perspectives
- Quality enhancers (8K, ultra HD, highly detailed)
- Mood and atmosphere
- Color palette suggestions
- Composition elements

Keep the core idea but make it much more detailed and artistic. Return ONLY the improved prompt, nothing else.`;
    } else {
      systemPrompt = `You are an expert AI image prompt engineer. Your task is to enhance an existing image by suggesting improvements to its prompt.

Based on the original prompt, suggest enhancements for:
- Better composition
- Enhanced lighting
- More vivid colors
- Higher detail
- Artistic improvements
- Better quality descriptors

Return ONLY the improved prompt that would create an enhanced version of the image, nothing else.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Original prompt: "${prompt}"\n\nPlease improve this prompt for AI image generation.` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const improvedPrompt = data.choices?.[0]?.message?.content?.trim();
    
    if (!improvedPrompt) {
      throw new Error("Failed to improve prompt");
    }

    console.log("Improved prompt:", improvedPrompt);

    return new Response(
      JSON.stringify({ improvedPrompt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in improve-prompt function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to improve prompt" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
