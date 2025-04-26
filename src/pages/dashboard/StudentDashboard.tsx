
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const StudentDashboard = () => {
  // This is sample data - will be replaced with actual data from Supabase
  const skills = [
    { name: "Reading", level: "B2+", progress: 85, color: "bg-blue-500" },
    { name: "Writing", level: "B2", progress: 70, color: "bg-green-500" },
    { name: "Listening", level: "C1", progress: 92, color: "bg-yellow-500" },
    { name: "Speaking", level: "B2", progress: 75, color: "bg-red-500" },
    { name: "Vocabulary", level: "B2+", progress: 80, color: "bg-purple-500" },
  ];

  const availableTests = [
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
    {
      id: 4,
      title: "C1 Speaking Assessment",
      description: "Record responses to demonstrate oral proficiency at C1 level",
      duration: 30,
      skillType: "speaking",
    },
  ];

  const recentResults = [
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
    {
      id: 103,
      testTitle: "B2 Speaking Practice",
      score: 75,
      cefrLevel: "B2",
      completedDate: "2023-03-15",
    },
  ];

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

  const getCEFRColor = (level: string) => {
    switch(level) {
      case "A1": return "text-gray-500";
      case "A2": return "text-blue-500";
      case "B1": return "text-green-500";
      case "B2": return "text-yellow-600";
      case "B2+": return "text-orange-500";
      case "C1": return "text-red-500";
      case "C2": return "text-purple-500";
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
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Track your progress towards C1 certification</p>
        </div>
        <Button className="mt-4 md:mt-0">Take Assessment Test</Button>
      </div>

      {/* CEFR Level Progress Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your CEFR Level Progress</CardTitle>
          <CardDescription>Your current standing across all language skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{skill.name}</span>
                    <span className={`text-sm font-medium ${getCEFRColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{skill.progress}% to C1</span>
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
          <TabsTrigger value="available-tests">Available Tests</TabsTrigger>
          <TabsTrigger value="recent-results">Recent Results</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        {/* Available Tests Tab */}
        <TabsContent value="available-tests" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.map((test) => (
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
                    <span>{test.duration} minutes</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/test/${test.id}`} className="w-full">
                    <Button className="w-full">Start Test</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Recent Results Tab */}
        <TabsContent value="recent-results" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentResults.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{result.testTitle}</CardTitle>
                  <CardDescription>Completed on {result.completedDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold">{result.score}%</div>
                    <div className={`text-lg font-medium ${getCEFRColor(result.cefrLevel)}`}>
                      {result.cefrLevel}
                    </div>
                  </div>
                  <Progress value={result.score} className="h-2" />
                </CardContent>
                <CardFooter>
                  <Link to={`/results/${result.id}`} className="w-full">
                    <Button variant="outline" className="w-full">View Details</Button>
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
                  <Button variant="outline" className="w-full">View Resources</Button>
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
