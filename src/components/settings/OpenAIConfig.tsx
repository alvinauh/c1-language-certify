
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, AlertTriangle, Server } from "lucide-react";
import { configureOpenAI, isOpenAIConfigured } from "@/services/openai";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const OpenAIConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [configured, setConfigured] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useProxy, setUseProxy] = useState(true);

  useEffect(() => {
    // Check if API is already configured
    setConfigured(isOpenAIConfigured());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!useProxy && (!apiKey || !apiKey.startsWith("sk-"))) {
        throw new Error("Invalid API key format");
      }

      configureOpenAI(useProxy ? null : apiKey, useProxy);
      setConfigured(true);
      toast({
        title: "OpenAI API Configured",
        description: useProxy 
          ? "Using secure backend proxy for OpenAI calls."
          : "Your API key has been securely stored for this session."
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
          Configure OpenAI API access for AI-powered test generation and assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {configured ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle>API Access Configured</AlertTitle>
            <AlertDescription>
              {useProxy 
                ? "Using secure backend proxy to access OpenAI."
                : "Your OpenAI API key has been configured for this session."}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="mb-4">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>API Configuration Required</AlertTitle>
              <AlertDescription>
                Choose whether to use the secure backend proxy or provide your own API key.
              </AlertDescription>
            </Alert>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <Server className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="use-proxy" className="text-base font-medium">Use Secure Backend Proxy</Label>
                  <p className="text-sm text-muted-foreground">
                    Recommended for production use. The API key is stored on the server.
                  </p>
                </div>
                <Switch
                  id="use-proxy"
                  checked={useProxy}
                  onCheckedChange={setUseProxy}
                />
              </div>
              
              {!useProxy && (
                <div className="space-y-2">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <div className="flex">
                    <Input
                      id="apiKey"
                      type={showKey ? "text" : "password"}
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      required={!useProxy}
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
              )}
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Configuring..." : "Configure API"}
              </Button>
            </form>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Alert variant={useProxy ? "default" : "destructive"} className="w-full">
          {useProxy ? (
            <>
              <Server className="h-5 w-5" />
              <AlertTitle>Backend Proxy Enabled</AlertTitle>
              <AlertDescription className="text-sm">
                Using secure backend proxy. API key is stored as an environment variable on the server.
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Security Warning</AlertTitle>
              <AlertDescription className="text-sm">
                Never share your API key. In production, API keys should be handled server-side, not in the browser. 
                We recommend using the secure backend proxy option for production use.
              </AlertDescription>
            </>
          )}
        </Alert>
      </CardFooter>
    </Card>
  );
};

export default OpenAIConfig;
