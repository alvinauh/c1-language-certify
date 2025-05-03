
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { fetchTests, hasCompletedAllTests } from "@/services/supabaseService";
import { generateTest } from "@/services/openai";
import { Tables } from "@/types/database";
import { toast } from "@/components/ui/use-toast";
import TestGenerator from "./TestGenerator";

interface TestListProps {
  subject: string;
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  level: string;
  levelType: 'cefr' | 'igcse' | 'uasa' | 'spm';
  userId?: string;
}

const TestList = ({ subject, skill, level, levelType, userId }: TestListProps) => {
  const [tests, setTests] = useState<Tables<'tests'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [allCompleted, setAllCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const testsData = await fetchTests(subject);
        // Filter by both skill and level
        setTests(testsData.filter(test => 
          test.skill === skill && 
          test.level === level &&
          test.level_type === levelType
        ));
        
        if (userId) {
          const completed = await hasCompletedAllTests(userId, subject, skill, level, levelType);
          setAllCompleted(completed);
        }
      } catch (error: any) {
        console.error("Error loading tests:", error);
        
        // Check if it's a missing table error
        if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
          setError("Database tables not yet created. Please initialize the database or generate the first test.");
        } else {
          setError("Failed to load tests. Please try again later.");
        }
        
        setTests([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTests();
  }, [subject, skill, level, levelType, userId]);

  const handleNoTestsAvailable = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate a test",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const newTest = await generateTest(level, levelType, skill, subject as any, 5, userId);
      setTests(prev => [newTest, ...prev]);
      toast({
        title: "Test Generated",
        description: "Your new test has been created successfully",
      });
    } catch (error) {
      console.error("Error generating initial test:", error);
      toast({
        title: "Error",
        description: "Failed to generate test. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle>Error Loading Tests</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleNoTestsAvailable}>
            Generate First Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (tests.length === 0) {
    return (
      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle>No Tests Available</CardTitle>
          <CardDescription>
            There are no {level} {subject} {skill} tests available yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleNoTestsAvailable}>
            Generate First Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map(test => (
          <Card key={test.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{test.title}</CardTitle>
              <CardDescription>
                {test.description?.substring(0, 100)}
                {test.description && test.description.length > 100 ? '...' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {test.questions.length} questions • {test.duration} min
                  </p>
                </div>
                <Link to={`/test/${test.id}`}>
                  <Button size="sm">Take Test</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Show the test generator if all tests have been completed */}
        {allCompleted && userId && (
          <TestGenerator 
            level={level}
            levelType={levelType}
            skill={skill} 
            subject={subject as any} 
            userId={userId} 
          />
        )}
      </div>
    </div>
  );
};

export default TestList;
