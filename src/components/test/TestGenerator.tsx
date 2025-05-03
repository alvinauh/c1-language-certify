
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { generateTest } from "@/services/openai";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface TestGeneratorProps {
  level: string;
  levelType: 'cefr' | 'igcse' | 'uasa' | 'spm';
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  subject: 'english' | 'math' | 'science' | 'history' | 'bahasa';
  userId?: string;
}

const TestGenerator = ({ level, levelType, skill, subject, userId }: TestGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerateTest = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate a test",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const test = await generateTest(level, levelType, skill, subject, 5, userId, true);
      toast({
        title: "Test Generated",
        description: "Your new test is ready to take",
      });
      navigate(`/test/${test.id}`);
    } catch (error) {
      console.error("Error generating test:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate a new test. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getLevelTypeLabel = () => {
    switch (levelType) {
      case 'cefr': return 'CEFR';
      case 'igcse': return 'IGCSE';
      case 'uasa': return 'UASA';
      case 'spm': return 'SPM';
      default: return '';
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Generate New Test</CardTitle>
        <CardDescription>
          Create a fresh {getLevelTypeLabel()} {level} level {subject} test for {skill}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleGenerateTest} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate New Test'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestGenerator;
