// Creative prompt templates for AI image generation

const styles = [
  "cyberpunk",
  "steampunk",
  "art nouveau",
  "surrealist",
  "impressionist",
  "photorealistic",
  "anime",
  "watercolor",
  "oil painting",
  "digital art",
  "3D render",
  "concept art",
  "fantasy illustration",
  "minimalist",
  "baroque",
  "vaporwave",
  "synthwave",
  "gothic",
  "art deco",
  "pop art",
];

const subjects = [
  "a majestic dragon",
  "an ancient temple",
  "a futuristic cityscape",
  "a mystical forest",
  "a cosmic nebula",
  "a samurai warrior",
  "a steampunk airship",
  "an enchanted castle",
  "a cybernetic creature",
  "a floating island",
  "a phoenix rising",
  "an underwater kingdom",
  "a time traveler",
  "a magical library",
  "a robot gardener",
  "a crystal cave",
  "a wise wizard",
  "a space station",
  "a haunted mansion",
  "a neon-lit alley",
];

const settings = [
  "at golden hour",
  "under a starry sky",
  "in a post-apocalyptic world",
  "during a thunderstorm",
  "in an alien landscape",
  "at the edge of the universe",
  "in a parallel dimension",
  "during cherry blossom season",
  "in eternal twilight",
  "at the bottom of the ocean",
  "on a distant planet",
  "in a dream sequence",
  "during an eclipse",
  "in a frozen wasteland",
  "at the gates of heaven",
];

const moods = [
  "ethereal and mystical",
  "dark and ominous",
  "vibrant and energetic",
  "serene and peaceful",
  "chaotic and dynamic",
  "melancholic and nostalgic",
  "whimsical and playful",
  "epic and grandiose",
  "intimate and personal",
  "mysterious and enigmatic",
];

const details = [
  "with intricate details",
  "with volumetric lighting",
  "with dramatic shadows",
  "with bioluminescent elements",
  "with holographic effects",
  "with particle effects",
  "with reflective surfaces",
  "with atmospheric fog",
  "with dynamic composition",
  "with cinematic framing",
];

const qualityEnhancers = [
  "8K resolution",
  "highly detailed",
  "masterpiece quality",
  "award-winning",
  "trending on ArtStation",
  "unreal engine 5",
  "octane render",
  "ray tracing",
  "hyperrealistic",
  "studio lighting",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateCreativePrompt(): string {
  const style = getRandomElement(styles);
  const subject = getRandomElement(subjects);
  const setting = getRandomElement(settings);
  const mood = getRandomElement(moods);
  const detail = getRandomElement(details);
  const quality = getRandomElement(qualityEnhancers);

  // Randomly decide prompt complexity (simple, medium, complex)
  const complexity = Math.random();

  if (complexity < 0.3) {
    // Simple prompt
    return `${subject} in ${style} style, ${quality}`;
  } else if (complexity < 0.7) {
    // Medium prompt
    return `${subject} ${setting}, ${style} style, ${mood}, ${quality}`;
  } else {
    // Complex prompt
    return `${subject} ${setting}, ${style} style, ${mood} atmosphere, ${detail}, ${quality}`;
  }
}

export function generateSimplePrompt(): string {
  const style = getRandomElement(styles);
  const subject = getRandomElement(subjects);
  return `${subject}, ${style} style`;
}
