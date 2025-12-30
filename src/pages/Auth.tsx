import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NeonGrid } from "@/components/NeonGrid";
import { ImaginaryLogo } from "@/components/ImaginaryLogo";
import { Mail, Lock, ArrowLeft, User } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "login";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Temporary: Skip auth and go directly to dashboard
    toast.success(mode === "login" ? "Welcome back!" : "Account created!");
    navigate("/dashboard");
  };

  const handleSkip = () => {
    toast.info("Skipping auth for now - entering dashboard");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <NeonGrid />
      
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-body">Back to home</span>
        </Link>

        {/* Logo */}
        <div className="mb-8">
          <ImaginaryLogo size="lg" />
        </div>

        {/* Auth Card */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl opacity-50 blur" />
          <div className="relative bg-card rounded-xl p-8 border border-border/50">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground font-body mb-6">
              {mode === "login" 
                ? "Sign in to continue creating" 
                : "Start your creative journey"
              }
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-sm font-body text-muted-foreground">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-muted/50 border-border focus:border-neon-cyan"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-body text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/50 border-border focus:border-neon-cyan"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-body text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-muted/50 border-border focus:border-neon-cyan"
                  />
                </div>
              </div>

              <Button type="submit" variant="neonGradient" size="lg" className="w-full">
                {mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Skip button for development */}
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="w-full mt-4 text-muted-foreground hover:text-neon-cyan"
            >
              Skip for now (Dev Mode)
            </Button>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground font-body text-sm">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <Link 
                  to={`/auth?mode=${mode === "login" ? "signup" : "login"}`}
                  className="text-neon-cyan hover:underline"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
