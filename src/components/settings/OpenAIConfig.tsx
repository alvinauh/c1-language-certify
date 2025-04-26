
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { configureOpenAI, isOpenAIConfigured } from "@/services/openai";
import { toast } from "@/components/ui/use-toast";

const OpenAIConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [configured, setConfigured] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if API is already configured
    setConfigured(isOpenAIConfigured());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!apiKey.startsWith("sk-")) {
        throw new Error("Invalid API key format");
      }

      configureOpenAI(apiKey);
      setConfigured(true);
      toast({
        title: "OpenAI API Configured",
        description: "Your API key has been securely stored for this session."
      });
      
      // Clear the input field for security
      setApiKey("");
    } catch (error: any) {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to configure OpenAI API",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OpenAI API Configuration</CardTitle>
        <CardDescription>
          Configure your OpenAI API key to enable AI-powered test generation and assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {configured ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle>API Key Configured</AlertTitle>
            <AlertDescription>
              Your OpenAI API key has been configured for this session.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="mb-4">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>API Key Required</AlertTitle>
              <AlertDescription>
                For security reasons, your OpenAI API key is stored only for the current browser session and is not persisted.
              </AlertDescription>
            </Alert>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <div className="flex">
                  <Input
                    id="apiKey"
                    type={showKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowKey(!showKey)}
                    className="ml-2"
                  >
                    {showKey ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Configuring..." : "Configure API"}
              </Button>
            </form>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Alert variant="destructive" className="w-full">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Security Warning</AlertTitle>
          <AlertDescription className="text-sm">
            Never share your API key. In production, API keys should be handled server-side, not in the browser. 
            Connect this app to Supabase for proper backend security.
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
};

export default OpenAIConfig;
