import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NeonGrid } from "@/components/NeonGrid";
import { 
  Zap, Home, ChevronRight, Copy, Check, 
  Database, Cloud, Cpu, Image, Users,
  ArrowRight, AlertTriangle, CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Guides = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CodeBlock = ({ code, section }: { code: string; section: string }) => (
    <div className="relative group">
      <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono border border-border/30">
        <code className="text-foreground/90">{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, section)}
        className="absolute top-2 right-2 p-2 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copiedSection === section ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <NeonGrid />

      {/* Header */}
      <header className="relative z-20 border-b border-border/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-neon-cyan" />
              <span className="font-display text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                PROMPTCRAFT
              </span>
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-body text-muted-foreground">Guides</span>
          </div>
          
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Firebase Migration Guide */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Cloud className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Firebase Migration Guide
              </h1>
              <p className="text-muted-foreground">Move your entire project to Firebase</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-display font-bold">1</span>
                <h2 className="font-display text-xl font-semibold">Export Project from Lovable</h2>
              </div>
              <ol className="list-decimal ml-12 space-y-2 text-foreground/80 font-body">
                <li>Go to your Lovable project settings</li>
                <li>Click <strong>"Export to GitHub"</strong> (if not already)</li>
                <li>Clone the repository to your local machine:</li>
              </ol>
              <div className="mt-4 ml-8">
                <CodeBlock 
                  code="git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO"
                  section="clone"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-display font-bold">2</span>
                <h2 className="font-display text-xl font-semibold">Set Up Firebase Project</h2>
              </div>
              <ol className="list-decimal ml-12 space-y-2 text-foreground/80 font-body">
                <li>Go to <a href="https://console.firebase.google.com" className="text-neon-cyan hover:underline" target="_blank">Firebase Console</a></li>
                <li>Click "Add Project" and follow the setup wizard</li>
                <li>Enable the services you need:
                  <ul className="list-disc ml-6 mt-2">
                    <li><strong>Firebase Hosting</strong> - for deploying your React app</li>
                    <li><strong>Cloud Firestore</strong> - replaces Supabase database</li>
                    <li><strong>Firebase Authentication</strong> - replaces Supabase auth</li>
                    <li><strong>Cloud Storage</strong> - for image storage (or keep Cloudinary)</li>
                    <li><strong>Cloud Functions</strong> - replaces Edge Functions</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-display font-bold">3</span>
                <h2 className="font-display text-xl font-semibold">Install Firebase Tools</h2>
              </div>
              <CodeBlock 
                code={`# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
cd YOUR_PROJECT
firebase init

# Select:
# - Hosting (for React app)
# - Firestore (for database)
# - Functions (for backend)
# - Storage (optional)

# Build directory: dist
# Single-page app: Yes`}
                section="firebase-init"
              />
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-display font-bold">4</span>
                <h2 className="font-display text-xl font-semibold">Install Firebase SDK</h2>
              </div>
              <CodeBlock 
                code={`npm install firebase`}
                section="firebase-sdk"
              />
              <p className="mt-4 text-foreground/80 font-body">Create a new file <code className="bg-muted px-2 py-0.5 rounded">src/lib/firebase.ts</code>:</p>
              <div className="mt-4">
                <CodeBlock 
                  code={`import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);`}
                  section="firebase-config"
                />
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-display font-bold">5</span>
                <h2 className="font-display text-xl font-semibold">Replace Supabase with Firebase</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <h3 className="font-display font-semibold text-neon-magenta mb-2">Authentication Changes</h3>
                  <CodeBlock 
                    code={`// BEFORE (Supabase)
import { supabase } from "@/integrations/supabase/client";
const { data, error } = await supabase.auth.signUp({
  email, password
});

// AFTER (Firebase)
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
const userCredential = await createUserWithEmailAndPassword(
  auth, email, password
);`}
                    section="auth-migration"
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <h3 className="font-display font-semibold text-neon-magenta mb-2">Database Changes</h3>
                  <CodeBlock 
                    code={`// BEFORE (Supabase)
const { data } = await supabase.from('images').select('*');

// AFTER (Firebase Firestore)
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
const querySnapshot = await getDocs(collection(db, "images"));
const data = querySnapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));`}
                    section="db-migration"
                  />
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-display font-bold">6</span>
                <h2 className="font-display text-xl font-semibold">Migrate Edge Functions to Cloud Functions</h2>
              </div>
              <p className="text-foreground/80 font-body mb-4">
                Move your <code className="bg-muted px-2 py-0.5 rounded">supabase/functions/</code> to 
                <code className="bg-muted px-2 py-0.5 rounded ml-1">functions/src/</code>
              </p>
              <CodeBlock 
                code={`// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Convert Deno edge function to Cloud Function
export const generateImage = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { prompt, model } = req.body;
  
  // Your existing logic here...
  // Replace Deno.env.get() with functions.config()
  const apiKey = functions.config().lovable.api_key;
  
  // Return response
  res.json({ image: imageUrl });
});`}
                section="cloud-functions"
              />
              <p className="mt-4 text-foreground/80 font-body">Set environment variables:</p>
              <CodeBlock 
                code={`firebase functions:config:set lovable.api_key="YOUR_API_KEY"
firebase deploy --only functions`}
                section="functions-config"
              />
            </div>

            {/* Step 7 */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center font-display font-bold">7</span>
                <h2 className="font-display text-xl font-semibold">Deploy to Firebase Hosting</h2>
              </div>
              <CodeBlock 
                code={`# Build your React app
npm run build

# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules`}
                section="deploy"
              />
            </div>

            {/* Important Notes */}
            <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold text-amber-500 mb-2">Important Considerations</h3>
                  <ul className="list-disc ml-4 space-y-1 text-foreground/80 font-body">
                    <li><strong>Keep Cloudinary</strong> - You can continue using Cloudinary for images, no changes needed</li>
                    <li><strong>API Keys</strong> - Update all environment variables in <code className="bg-muted px-1 rounded">.env</code></li>
                    <li><strong>Remove Supabase folder</strong> - Delete <code className="bg-muted px-1 rounded">supabase/</code> folder after migration</li>
                    <li><strong>Update imports</strong> - Replace all <code className="bg-muted px-1 rounded">@/integrations/supabase</code> imports</li>
                    <li><strong>Test thoroughly</strong> - Test all features before going live</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Face Training Guide */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                AI Face/Subject Training Guide
              </h1>
              <p className="text-muted-foreground">Train AI to recognize and generate specific faces</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <h2 className="font-display text-xl font-semibold mb-4">How AI Face Training Works</h2>
              <p className="text-foreground/80 font-body mb-4">
                To train AI to recognize and generate specific faces/subjects, you need to use a technique called 
                <strong className="text-neon-cyan"> Fine-Tuning</strong> or <strong className="text-neon-cyan">LoRA (Low-Rank Adaptation)</strong>.
                This requires specialized services as the Lovable AI models don't support direct fine-tuning.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <h3 className="font-display font-semibold text-neon-magenta mb-2">Option 1: Replicate</h3>
                  <p className="text-sm text-muted-foreground mb-2">Best for production apps</p>
                  <ul className="list-disc ml-4 text-sm text-foreground/80">
                    <li>Train custom SDXL/Flux models</li>
                    <li>API-first, easy integration</li>
                    <li>Pay per training + generation</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <h3 className="font-display font-semibold text-neon-magenta mb-2">Option 2: RunPod</h3>
                  <p className="text-sm text-muted-foreground mb-2">Best for flexibility</p>
                  <ul className="list-disc ml-4 text-sm text-foreground/80">
                    <li>Run your own GPU servers</li>
                    <li>Full control over training</li>
                    <li>More technical setup required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-display font-bold">1</span>
                <h2 className="font-display text-xl font-semibold">Prepare Training Images</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display font-semibold text-green-500 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Best Practices
                  </h3>
                  <ul className="list-disc ml-4 text-sm text-foreground/80 space-y-1">
                    <li>15-30 high-quality images</li>
                    <li>Various angles (front, side, 3/4)</li>
                    <li>Different lighting conditions</li>
                    <li>Different expressions</li>
                    <li>Clear, focused face shots</li>
                    <li>Consistent subject appearance</li>
                    <li>512x512 or 1024x1024 resolution</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-red-500 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Avoid
                  </h3>
                  <ul className="list-disc ml-4 text-sm text-foreground/80 space-y-1">
                    <li>Blurry or low-quality images</li>
                    <li>Heavy filters or effects</li>
                    <li>Multiple people in frame</li>
                    <li>Extreme angles only</li>
                    <li>Dramatically different ages</li>
                    <li>Sunglasses/face coverings</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 - Replicate */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-display font-bold">2</span>
                <h2 className="font-display text-xl font-semibold">Train with Replicate (Recommended)</h2>
              </div>
              
              <p className="text-foreground/80 font-body mb-4">
                Replicate offers easy API-based training for custom face models.
              </p>

              <CodeBlock 
                code={`# 1. Install Replicate
npm install replicate

# 2. Set up API key
export REPLICATE_API_TOKEN="your_token"

# 3. Create training using their API`}
                section="replicate-setup"
              />

              <div className="mt-4">
                <CodeBlock 
                  code={`// Train a custom model
const replicate = new Replicate();

// Upload your training images as a zip file
const training = await replicate.trainings.create(
  "stability-ai",
  "sdxl",
  "1.0.0",
  {
    destination: "your-username/your-model-name",
    input: {
      input_images: "https://your-storage.com/training-images.zip",
      // Trigger word for your subject
      token_string: "PERSON_NAME",
      // Caption prefix
      caption_prefix: "a photo of PERSON_NAME",
      // Training steps (more = better, but slower)
      max_train_steps: 1000,
    }
  }
);

// Wait for training to complete
// Then use the model for generation
const output = await replicate.run(
  "your-username/your-model-name:version",
  {
    input: {
      prompt: "PERSON_NAME as a superhero, cinematic lighting",
      num_inference_steps: 25
    }
  }
);`}
                  section="replicate-train"
                />
              </div>
            </div>

            {/* Step 3 - Integration */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-display font-bold">3</span>
                <h2 className="font-display text-xl font-semibold">Integrate into Your App</h2>
              </div>

              <p className="text-foreground/80 font-body mb-4">
                Create a new edge function to handle trained model generation:
              </p>

              <CodeBlock 
                code={`// supabase/functions/generate-custom/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "npm:replicate";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, modelVersion } = await req.json();
    
    const replicate = new Replicate({
      auth: Deno.env.get("REPLICATE_API_TOKEN"),
    });

    const output = await replicate.run(modelVersion, {
      input: {
        prompt,
        num_inference_steps: 25,
        guidance_scale: 7.5,
      }
    });

    return new Response(
      JSON.stringify({ image: output[0] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});`}
                section="custom-function"
              />
            </div>

            {/* Workflow Summary */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-neon-cyan/10 border border-border/30">
              <h2 className="font-display text-xl font-semibold mb-4">Complete Workflow</h2>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/30">
                  <Image className="h-5 w-5 text-neon-magenta" />
                  <span className="text-sm font-body">Upload 15-30 photos</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/30">
                  <Cpu className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-body">Train on Replicate (~15 min)</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/30">
                  <Database className="h-5 w-5 text-neon-cyan" />
                  <span className="text-sm font-body">Save model version</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-border/30">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-body">Generate with trigger word</span>
                </div>
              </div>
            </div>

            {/* Cost Estimates */}
            <div className="p-6 rounded-xl bg-card/50 border border-border/30">
              <h2 className="font-display text-xl font-semibold mb-4">Cost Estimates</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-2xl font-display font-bold text-neon-cyan">~$5</p>
                  <p className="text-sm text-muted-foreground">Training (one-time)</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-2xl font-display font-bold text-neon-magenta">~$0.01</p>
                  <p className="text-sm text-muted-foreground">Per image generation</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-2xl font-display font-bold text-purple-500">15 min</p>
                  <p className="text-sm text-muted-foreground">Training time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Dashboard */}
        <div className="flex justify-center">
          <Link to="/dashboard">
            <Button variant="neonGradient" size="lg">
              <Zap className="h-5 w-5" />
              Back to Studio
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Guides;
