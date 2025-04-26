
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

// Sample test data - would be fetched from Supabase in a real implementation
const sampleTest = {
  id: 1,
  title: "C1 Reading Comprehension",
  description: "Assess your reading skills at C1 level with academic texts",
  duration: 60,
  questions: [
    {
      id: 1,
      questionText: `Read the following passage and answer the questions below:
      
The concept of circular economy represents a paradigm shift in how we think about production and consumption. Unlike the traditional linear economy—characterized by a "take-make-dispose" model—the circular economy emphasizes the importance of keeping resources in use for as long as possible, extracting the maximum value from them, and then recovering and regenerating products and materials at the end of their service life.

This approach addresses several pressing environmental issues, including resource depletion, waste management, and carbon emissions. By designing products for durability, reuse, remanufacturing, and recycling, companies can significantly reduce their ecological footprint while potentially creating new business opportunities.

Critics argue that transitioning to a fully circular economic model faces substantial barriers, including technological limitations, established business practices, consumer behavior, and policy frameworks that often incentivize linear production methods. Nevertheless, as resource scarcity becomes more acute and environmental regulations tighten, the circular economy is increasingly seen not only as an environmental necessity but also as a strategic business imperative.`,
      questionType: "multiple-choice",
      options: [
        "The circular economy model focuses primarily on recycling consumer waste.",
        "The circular economy aims to extract maximum value from resources and extend their useful life.",
        "The main barrier to implementing circular economy is consumer resistance to change.",
        "The linear economy model is more environmentally sustainable than the circular model."
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      questionText: "What is the primary difference between a circular economy and a linear economy?",
      questionType: "multiple-choice",
      options: [
        "Circular economies are only applicable to developing countries.",
        "Linear economies focus on sustainability while circular economies prioritize profit.",
        "Circular economies keep resources in use longer while linear economies follow a take-make-dispose model.",
        "There is no significant difference; the terms describe the same economic approach."
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      questionText: "Write an essay discussing the challenges and opportunities of implementing circular economy principles in the fashion industry.",
      questionType: "essay",
      options: [],
      correctAnswer: null
    }
  ]
};

const TestInterface = () => {
  const { testId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(sampleTest.duration * 60); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real app, we would fetch the test data based on testId from Supabase
  const test = sampleTest;
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
  
  const handleSubmitTest = () => {
    // Check if all questions are answered
    const unansweredQuestions = test.questions.filter(q => answers[q.id] === undefined);
    
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Warning",
        description: `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would submit the answers to Supabase
    setTimeout(() => {
      toast({
        title: "Test Submitted",
        description: "Your test has been submitted successfully and is being evaluated.",
      });
      // Redirect to results page (in a real app)
      setIsSubmitting(false);
    }, 2000);
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
            <p className="whitespace-pre-line">{currentQuestion.questionText}</p>
          </div>
          
          <div className="mt-8">
            {currentQuestion.questionType === 'multiple-choice' ? (
              <RadioGroup 
                value={answers[currentQuestion.id]?.toString()} 
                onValueChange={(value) => handleAnswerChange(parseInt(value))}
                className="space-y-4"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-base font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : currentQuestion.questionType === 'essay' ? (
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
