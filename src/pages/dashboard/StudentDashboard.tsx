import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Book, Calculator, AtomIcon, Landmark, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface StudentDashboardProps {
  subject?: 'english' | 'math' | 'science' | 'history' | 'bahasa' | 'mandarin' | 'notes';
}

const StudentDashboard = ({ subject = 'english' }: StudentDashboardProps) => {
  const { t } = useLanguage();
  
  // This is sample data - will be replaced with actual data from Supabase
  const skills = [
    { name: "Reading", level: "B2+", progress: 85, color: "bg-blue-500" },
    { name: "Writing", level: "B2", progress: 70, color: "bg-green-500" },
    { name: "Listening", level: "C1", progress: 92, color: "bg-yellow-500" },
    { name: "Speaking", level: "B2", progress: 75, color: "bg-red-500" },
    { name: "Vocabulary", level: "B2+", progress: 80, color: "bg-purple-500" },
  ];

  const subjectSkillsMap = {
    english: skills,
    math: [
      { name: "Algebra", level: "Advanced", progress: 80, color: "bg-blue-500" },
      { name: "Geometry", level: "Intermediate", progress: 65, color: "bg-green-500" },
      { name: "Calculus", level: "Beginner", progress: 40, color: "bg-yellow-500" },
      { name: "Statistics", level: "Advanced", progress: 85, color: "bg-red-500" },
    ],
    science: [
      { name: "Physics", level: "Intermediate", progress: 70, color: "bg-blue-500" },
      { name: "Chemistry", level: "Advanced", progress: 85, color: "bg-green-500" },
      { name: "Biology", level: "Advanced", progress: 90, color: "bg-yellow-500" },
      { name: "Environmental Science", level: "Intermediate", progress: 75, color: "bg-red-500" },
    ],
    history: [
      { name: "World History", level: "Advanced", progress: 88, color: "bg-blue-500" },
      { name: "Local History", level: "Advanced", progress: 90, color: "bg-green-500" },
      { name: "Historical Analysis", level: "Intermediate", progress: 65, color: "bg-yellow-500" },
      { name: "Historical Writing", level: "Advanced", progress: 82, color: "bg-red-500" },
    ],
    bahasa: [
      { name: "Reading", level: "Advanced", progress: 92, color: "bg-blue-500" },
      { name: "Writing", level: "Advanced", progress: 88, color: "bg-green-500" },
      { name: "Grammar", level: "Advanced", progress: 85, color: "bg-yellow-500" },
      { name: "Vocabulary", level: "Advanced", progress: 90, color: "bg-red-500" },
    ],
    mandarin: [
      { name: "Reading", level: "Intermediate", progress: 65, color: "bg-blue-500" },
      { name: "Writing", level: "Beginner", progress: 45, color: "bg-green-500" },
      { name: "Speaking", level: "Intermediate", progress: 70, color: "bg-yellow-500" },
      { name: "Listening", level: "Intermediate", progress: 75, color: "bg-red-500" },
    ],
    notes: [
      { name: "Organization", level: "Advanced", progress: 95, color: "bg-blue-500" },
      { name: "Comprehension", level: "Advanced", progress: 90, color: "bg-green-500" },
      { name: "Note-taking Speed", level: "Intermediate", progress: 75, color: "bg-yellow-500" },
      { name: "Summarization", level: "Advanced", progress: 85, color: "bg-red-500" },
    ]
  };

  // Sample available tests for each subject
  const availableTestsMap = {
    english: [
      {
        id: 1,
        title: "C1 Reading Comprehension",
        description: "Assess your reading skills at C1 level with academic texts",
        duration: 60,
        skillType: "reading",
      },
      {
        id: 2,
        title: "Advanced Essay Writing",
        description: "Write essays to demonstrate C1 level writing skills",
        duration: 90,
        skillType: "writing",
      },
      {
        id: 3,
        title: "Academic Listening Test",
        description: "Evaluate your listening comprehension of lectures and discussions",
        duration: 45,
        skillType: "listening",
      },
    ],
    math: [
      {
        id: 101,
        title: "Advanced Algebra Test",
        description: "Test your knowledge of advanced algebraic concepts",
        duration: 60,
        skillType: "algebra",
      },
      {
        id: 102,
        title: "Calculus Assessment",
        description: "Evaluate your understanding of calculus principles",
        duration: 75,
        skillType: "calculus",
      },
      {
        id: 103,
        title: "Statistics Quiz",
        description: "Test your ability to analyze and interpret statistical data",
        duration: 45,
        skillType: "statistics",
      },
    ],
    science: [
      {
        id: 201,
        title: "Physics Principles Test",
        description: "Evaluate your understanding of fundamental physics concepts",
        duration: 60,
        skillType: "physics",
      },
      {
        id: 202,
        title: "Chemistry Lab Assessment",
        description: "Demonstrate your knowledge of chemical reactions and formulas",
        duration: 75,
        skillType: "chemistry",
      },
      {
        id: 203,
        title: "Biology Systems Quiz",
        description: "Test your knowledge of biological systems and processes",
        duration: 45,
        skillType: "biology",
      },
    ],
    history: [
      {
        id: 301,
        title: "World History Assessment",
        description: "Test your knowledge of key historical events and figures",
        duration: 60,
        skillType: "world",
      },
      {
        id: 302,
        title: "Historical Analysis Test",
        description: "Demonstrate your ability to analyze historical documents",
        duration: 75,
        skillType: "analysis",
      },
      {
        id: 303,
        title: "Local History Quiz",
        description: "Assess your knowledge of local historical developments",
        duration: 45,
        skillType: "local",
      },
    ],
    bahasa: [
      {
        id: 401,
        title: "Bahasa Reading Comprehension",
        description: "Assess your Bahasa Malaysia reading comprehension skills",
        duration: 60,
        skillType: "reading",
      },
      {
        id: 402,
        title: "Bahasa Essay Writing",
        description: "Demonstrate your written Bahasa Malaysia proficiency",
        duration: 75,
        skillType: "writing",
      },
      {
        id: 403,
        title: "Bahasa Grammar and Vocabulary",
        description: "Test your knowledge of Bahasa Malaysia grammar and vocabulary",
        duration: 45,
        skillType: "grammar",
      },
    ],
    mandarin: [
      {
        id: 501,
        title: "Mandarin Reading Test",
        description: "Test your ability to read and comprehend Mandarin texts",
        duration: 60,
        skillType: "reading",
      },
      {
        id: 502,
        title: "Mandarin Character Writing",
        description: "Practice writing Mandarin characters correctly",
        duration: 45,
        skillType: "writing",
      },
      {
        id: 503,
        title: "Mandarin Listening Comprehension",
        description: "Test your ability to understand spoken Mandarin",
        duration: 30,
        skillType: "listening",
      },
    ],
    notes: [
      {
        id: 601,
        title: "Note-Taking Skills Assessment",
        description: "Evaluate your ability to take effective notes during lectures",
        duration: 45,
        skillType: "taking",
      },
      {
        id: 602,
        title: "Note Organization Test",
        description: "Demonstrate your ability to organize study notes effectively",
        duration: 30,
        skillType: "organization",
      },
      {
        id: 603,
        title: "Summarization Skills Quiz",
        description: "Test your ability to summarize complex information accurately",
        duration: 40,
        skillType: "summary",
      },
    ],
  };

  // Sample recent results for each subject
  const recentResultsMap = {
    english: [
      {
        id: 101,
        testTitle: "B2 Reading Assessment",
        score: 82,
        cefrLevel: "B2+",
        completedDate: "2023-04-10",
      },
      {
        id: 102,
        testTitle: "Academic Vocabulary Test",
        score: 78,
        cefrLevel: "B2+",
        completedDate: "2023-03-28",
      },
    ],
    math: [
      {
        id: 201,
        testTitle: "Advanced Algebra Quiz",
        score: 85,
        level: "Advanced",
        completedDate: "2023-04-12",
      },
      {
        id: 202,
        testTitle: "Statistics Assessment",
        score: 90,
        level: "Advanced",
        completedDate: "2023-03-25",
      },
    ],
    science: [
      {
        id: 301,
        testTitle: "Chemistry Fundamentals",
        score: 88,
        level: "Advanced",
        completedDate: "2023-04-15",
      },
      {
        id: 302,
        testTitle: "Physics Principles",
        score: 75,
        level: "Intermediate",
        completedDate: "2023-03-30",
      },
    ],
    history: [
      {
        id: 401,
        testTitle: "World History Assessment",
        score: 92,
        level: "Advanced",
        completedDate: "2023-04-08",
      },
      {
        id: 402,
        testTitle: "Local History Quiz",
        score: 85,
        level: "Advanced",
        completedDate: "2023-03-22",
      },
    ],
    bahasa: [
      {
        id: 501,
        testTitle: "Bahasa Comprehension Test",
        score: 94,
        level: "Advanced",
        completedDate: "2023-04-05",
      },
      {
        id: 502,
        testTitle: "Bahasa Grammar Assessment",
        score: 88,
        level: "Advanced",
        completedDate: "2023-03-18",
      },
    ],
    mandarin: [
      {
        id: 601,
        testTitle: "Mandarin Vocabulary Test",
        score: 62,
        level: "Intermediate",
        completedDate: "2023-04-05",
      },
      {
        id: 602,
        testTitle: "Basic Characters Assessment",
        score: 55,
        level: "Beginner",
        completedDate: "2023-03-20",
      },
    ],
    notes: [
      {
        id: 701,
        testTitle: "Note Organization Assessment",
        score: 95,
        level: "Advanced",
        completedDate: "2023-04-02",
      },
      {
        id: 702,
        testTitle: "Summarization Skills Test",
        score: 85,
        level: "Advanced",
        completedDate: "2023-03-15",
      },
    ],
  };

  const recommendations = [
    {
      id: 1,
      title: "Improve Essay Structure",
      description: "Focus on cohesion and coherence in academic essays",
      skillType: "writing",
    },
    {
      id: 2,
      title: "Expand Vocabulary Range",
      description: "Work on using more varied academic vocabulary",
      skillType: "vocabulary",
    },
    {
      id: 3,
      title: "Practice Note-taking",
      description: "Enhance listening skills by practicing note-taking during lectures",
      skillType: "listening",
    },
  ];

  // Current subject data
  const currentSkills = subjectSkillsMap[subject] || skills;
  const currentTests = availableTestsMap[subject] || availableTestsMap.english;
  const currentResults = recentResultsMap[subject] || recentResultsMap.english;

  // Get subject title and icon
  const getSubjectTitle = () => {
    switch(subject) {
      case 'english': return { title: t('english'), icon: <Book className="h-5 w-5 mr-2" /> };
      case 'math': return { title: t('mathematics'), icon: <Calculator className="h-5 w-5 mr-2" /> };
      case 'science': return { title: t('science'), icon: <AtomIcon className="h-5 w-5 mr-2" /> };
      case 'history': return { title: t('history'), icon: <Landmark className="h-5 w-5 mr-2" /> };
      case 'bahasa': return { title: t('bahasa'), icon: <Book className="h-5 w-5 mr-2" /> };
      case 'mandarin': return { title: t('mandarin'), icon: <Globe className="h-5 w-5 mr-2" /> };
      case 'notes': return { title: t('notes'), icon: <Book className="h-5 w-5 mr-2" /> };
      default: return { title: t('english'), icon: <Book className="h-5 w-5 mr-2" /> };
    }
  };

  const subjectInfo = getSubjectTitle();

  const getCEFRColor = (level: string) => {
    switch(level) {
      case "A1": return "text-gray-500";
      case "A2": return "text-blue-500";
      case "B1": return "text-green-500";
      case "B2": return "text-yellow-600";
      case "B2+": return "text-orange-500";
      case "C1": return "text-red-500";
      case "C2": return "text-purple-500";
      case "Advanced": return "text-red-500";
      case "Intermediate": return "text-yellow-600";
      case "Beginner": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getSkillIcon = (skillType: string) => {
    switch(skillType) {
      case "reading":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
      case "writing":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        );
      case "listening":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
        );
      case "speaking":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 18.5a3.5 3.5 0 1 0 7 0 8.5 8.5 0 1 0-17 0 3.5 3.5 0 1 0 7 0"></path>
            <path d="M7 15h4.5a2 2 0 1 0 0-4h-3a2 2 0 1 1 0-4H13"></path>
          </svg>
        );
      case "vocabulary":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center">
          {subjectInfo.icon}
          <div>
            <h1 className="text-3xl font-bold">{subjectInfo.title} {t('dashboard')}</h1>
            <p className="text-muted-foreground">
              {subject === 'english' 
                ? t('track_progress')
                : `${t('track_progress_in')} ${subjectInfo.title}`}
            </p>
          </div>
        </div>
        <Button className="mt-4 md:mt-0">{t('take_assessment')}</Button>
      </div>

      {/* Progress Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{subject === 'english' ? t('your_cefr_level') : t('your_skill_level')}</CardTitle>
          <CardDescription>{t('your_standing')} {subject} {t('skills')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentSkills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{skill.name}</span>
                    <span className={`text-sm font-medium ${getCEFRColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {subject === 'english' 
                      ? `${skill.progress}% ${t('to_c1')}` 
                      : `${skill.progress}% ${t('proficiency')}`}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${skill.color}`} 
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="available-tests" className="mt-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="available-tests">{t('available_tests')}</TabsTrigger>
          <TabsTrigger value="recent-results">{t('recent_results')}</TabsTrigger>
          <TabsTrigger value="recommendations">{t('recommendations')}</TabsTrigger>
        </TabsList>
        
        {/* Available Tests Tab */}
        <TabsContent value="available-tests" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTests.map((test) => (
              <Card key={test.id} className="overflow-hidden">
                <div className={`h-2 w-full bg-blue-500`}></div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {getSkillIcon(test.skillType)}
                    <span className="text-sm font-medium uppercase">{test.skillType}</span>
                  </div>
                  <CardTitle className="text-lg mt-2">{test.title}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{test.duration} {t('minutes')}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/test/${test.id}`} className="w-full">
                    <Button className="w-full">{t('start_test')}</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Recent Results Tab */}
        <TabsContent value="recent-results" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentResults.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{result.testTitle}</CardTitle>
                  <CardDescription>{t('completed_on')} {result.completedDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold">{result.score}%</div>
                    <div className={`text-lg font-medium ${getCEFRColor(result.cefrLevel || (result as any).level)}`}>
                      {result.cefrLevel || (result as any).level}
                    </div>
                  </div>
                  <Progress value={result.score} className="h-2" />
                </CardContent>
                <CardFooter>
                  <Link to={`/results/${result.id}`} className="w-full">
                    <Button variant="outline" className="w-full">{t('view_details')}</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {getSkillIcon(rec.skillType)}
                    <span className="text-sm font-medium uppercase">{rec.skillType}</span>
                  </div>
                  <CardTitle className="text-lg mt-2">{rec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{rec.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">{t('view_resources')}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
