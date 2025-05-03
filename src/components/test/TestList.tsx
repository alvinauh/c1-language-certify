
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { fetchTests, hasCompletedAllTests } from "@/services/supabaseService";
import { generateTest } from "@/services/openai";
import { Tables } from "@/types/database";
import TestGenerator from "./TestGenerator";

interface TestListProps {
  subject: string;
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  cefrLevel: string;
  userId?: string;
}

const TestList = ({ subject, skill, cefrLevel, userId }: TestListProps) => {
  const [tests, setTests] = useState<Tables<'tests'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        const testsData = await fetchTests(subject);
        setTests(testsData.filter(test => test.skill === skill));
        
        if (userId) {
          const completed = await hasCompletedAllTests(userId, subject, skill);
          setAllCompleted(completed);
        }
      } catch (error) {
        console.error("Error loading tests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTests();
  }, [subject, skill, userId]);

  const handleNoTestsAvailable = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const newTest = await generateTest(cefrLevel, skill, subject as any, 5, userId);
      setTests(prev => [newTest, ...prev]);
    } catch (error) {
      console.error("Error generating initial test:", error);
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

  if (tests.length === 0) {
    return (
      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle>No Tests Available</CardTitle>
          <CardDescription>
            There are no {cefrLevel} {subject} {skill} tests available yet.
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
            cefrLevel={cefrLevel} 
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
