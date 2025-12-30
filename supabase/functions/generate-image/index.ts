import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supported models
const SUPPORTED_MODELS = [
  "google/gemini-2.5-flash-image-preview",
  "google/gemini-3-pro-image-preview",
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model, referenceImage, styleImage, subjectInfluence, styleInfluence } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default to nano banana if no model specified or invalid model
    const selectedModel = SUPPORTED_MODELS.includes(model) 
      ? model 
      : "google/gemini-2.5-flash-image-preview";

    console.log("Generating image with model:", selectedModel);
    console.log("Prompt:", prompt);
    console.log("Has reference image:", !!referenceImage);
    console.log("Has style image:", !!styleImage);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the message content
    let messageContent: any[];
    
    // Build enhanced prompt with reference context
    let enhancedPrompt = prompt;
    
    if (referenceImage && subjectInfluence) {
      const influenceLevel = subjectInfluence > 0.7 ? "very closely" : subjectInfluence > 0.4 ? "moderately" : "loosely";
      enhancedPrompt = `Using the provided reference image as a subject guide (follow it ${influenceLevel}), generate: ${prompt}`;
    }
    
    if (styleImage && styleInfluence) {
      const influenceLevel = styleInfluence > 0.7 ? "very closely" : styleInfluence > 0.4 ? "moderately" : "loosely";
      enhancedPrompt = `${enhancedPrompt}. Match the artistic style of the style reference image ${influenceLevel}.`;
    }

    // If we have reference images, include them in the message
    if (referenceImage || styleImage) {
      messageContent = [
        {
          type: "text",
          text: `Generate a stunning, high-quality image based on this description: ${enhancedPrompt}. Make it visually impressive and artistic.`
        }
      ];
      
      if (referenceImage) {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: referenceImage
          }
        });
      }
      
      if (styleImage) {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: styleImage
          }
        });
      }
    } else {
      messageContent = [
        {
          type: "text",
          text: `Generate a stunning, high-quality image based on this description: ${enhancedPrompt}. Make it visually impressive and artistic.`
        }
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "user",
            content: messageContent,
          },
        ],
        modalities: ["image", "text"],
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
    console.log("AI response received successfully");

    // Extract the image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image was generated");
    }

    return new Response(
      JSON.stringify({ image: imageUrl, model: selectedModel }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
