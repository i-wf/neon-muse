import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Extracting style from image...");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert art analyst and prompt engineer. Your task is to analyze an image and extract its visual style into a reusable prompt that can be used to generate new images in the same style.

Focus on these aspects:
1. **Art Style**: (e.g., photorealistic, anime, oil painting, watercolor, digital art, 3D render, concept art, etc.)
2. **Color Palette**: Describe the dominant colors, color harmony, saturation levels, and mood
3. **Lighting**: (e.g., dramatic shadows, soft diffused light, golden hour, neon lighting, etc.)
4. **Texture & Details**: (e.g., smooth, grainy, detailed, minimal, etc.)
5. **Atmosphere/Mood**: (e.g., dark and moody, bright and cheerful, ethereal, gritty, etc.)
6. **Composition Style**: (e.g., cinematic, centered, dynamic angles, etc.)
7. **Special Effects**: (e.g., bokeh, lens flare, grain, vignette, etc.)

DO NOT describe the actual content/subject of the image - only the STYLE.

Return ONLY the style prompt, nothing else. Make it concise but comprehensive (2-4 sentences max).
Format: Write it as a style instruction that can be appended to any subject prompt.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and extract its visual style as a reusable prompt. Focus only on the artistic style, not the subject matter.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
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
    const stylePrompt = data.choices?.[0]?.message?.content;

    if (!stylePrompt) {
      console.error("No style prompt in response:", JSON.stringify(data));
      throw new Error("Failed to extract style from image");
    }

    console.log("Style extracted successfully:", stylePrompt);

    return new Response(
      JSON.stringify({ stylePrompt: stylePrompt.trim() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in extract-style function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to extract style" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
