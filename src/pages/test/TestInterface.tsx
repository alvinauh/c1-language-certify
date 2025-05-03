
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getTestById, createTestAttempt, saveTestAnswers } from "@/services/supabaseService";
import { generateFeedback } from "@/services/openai";
import { useQuery, useMutation } from "@tanstack/react-query";

const TestInterface = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // Default 60 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  
  // Fetch test data from Supabase
  const { data: test, isLoading, error } = useQuery({
    queryKey: ['test', testId],
    queryFn: () => testId ? getTestById(testId) : Promise.reject('No test ID provided'),
    enabled: !!testId
  });
  
  // Create test attempt when the test loads
  const createAttemptMutation = useMutation({
    mutationFn: createTestAttempt,
    onSuccess: (data) => {
      setAttemptId(data.id);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create test attempt. Please try again.",
        variant: "destructive",
      });
      console.error("Create attempt error:", error);
    }
  });
  
  // Save test answers
  const saveAnswersMutation = useMutation({
    mutationFn: (data: { attemptId: string, updates: any }) => {
      return saveTestAnswers(data.attemptId, data.updates);
    },
    onSuccess: () => {
      toast({
        title: "Test Submitted",
        description: "Your test has been submitted successfully and is being evaluated.",
      });
      navigate("/dashboard"); // Navigate to dashboard or results page
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
      console.error("Submit test error:", error);
      setIsSubmitting(false);
    }
  });
  
  // Initialize the timer and attempt when test loads
  useEffect(() => {
    if (test) {
      // Set timer based on test duration
      setTimeRemaining(test.duration * 60);
      
      // Create a new attempt if we don't have one yet
      if (!attemptId) {
        // TODO: Replace with actual user ID from auth context
        const userId = "test-user-id"; // Temporary placeholder
        
        createAttemptMutation.mutate({
          test_id: test.id,
          user_id: userId,
          answers: {}
        });
      }
    }
  }, [test, attemptId]);
  
  // Timer effect
  useEffect(() => {
    if (!test || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [test, timeRemaining]);
  
  // Loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading test...</div>;
  }
  
  // Error state
  if (error || !test) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Test</h1>
        <p>Unable to load test. Please try again later.</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  const currentQuestion = test.questions[currentQuestionIndex];
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleAnswerChange = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };
  
  const handleSubmitTest = async () => {
    if (!attemptId) {
      toast({
        title: "Error",
        description: "Test attempt not initialized. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if all questions are answered
    const unansweredQuestions = test.questions.filter(q => answers[q.id] === undefined);
    
    if (unansweredQuestions.length > 0 && timeRemaining > 0) {
      toast({
        title: "Warning",
        description: `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate AI feedback based on answers
      const feedback = await generateFeedback(
        test.cefr_level,
        answers,
        test.questions
      );
      
      // Calculate a simple score for multiple choice questions
      let score = 0;
      let totalPossible = 0;
      
      test.questions.forEach(q => {
        if (q.questionType === 'multiple-choice' && q.correctAnswer !== undefined) {
          totalPossible++;
          if (answers[q.id] === q.correctAnswer) {
            score++;
          }
        }
      });
      
      // Scale score to percentage if there are scorable questions
      const finalScore = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : null;
      
      // Save the answers, feedback and score to Supabase
      saveAnswersMutation.mutate({
        attemptId,
        updates: {
          answers,
          completed_at: new Date().toISOString(),
          feedback,
          score: finalScore
        }
      });
    } catch (error) {
      console.error("Error during submission:", error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Test Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{test.title}</h1>
          <p className="text-muted-foreground">{test.description}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="bg-muted p-2 rounded-md text-center">
            <div className="text-sm text-muted-foreground">Time Remaining</div>
            <div className="text-xl font-mono">{formatTime(timeRemaining)}</div>
          </div>
        </div>
      </div>
      
      {/* Test Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </span>
          <span className="text-sm font-medium">
            {Math.round(((currentQuestionIndex + 1) / test.questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question Display */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{currentQuestion?.questionText}</p>
          </div>
          
          <div className="mt-8">
            {currentQuestion?.questionType === 'multiple-choice' ? (
              <RadioGroup 
                value={answers[currentQuestion.id]?.toString()} 
                onValueChange={(value) => handleAnswerChange(parseInt(value))}
                className="space-y-4"
              >
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-base font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : currentQuestion?.questionType === 'essay' ? (
              <div className="space-y-2">
                <Label htmlFor="essay-answer">Your Answer:</Label>
                <Textarea 
                  id="essay-answer" 
                  placeholder="Write your answer here..." 
                  rows={10} 
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="resize-none"
                />
              </div>
            ) : (
              <p>Unsupported question type</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="space-x-2">
          {currentQuestionIndex < test.questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>Next</Button>
          ) : (
            <Button 
              onClick={handleSubmitTest}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Question Navigator */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Question Navigator</h3>
        <div className="flex flex-wrap gap-2">
          {test.questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? "default" : answers[test.questions[index].id] !== undefined ? "outline" : "ghost"}
              size="sm"
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 ${answers[test.questions[index].id] !== undefined ? "border-primary" : ""}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
