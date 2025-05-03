
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import TestList from "@/components/test/TestList";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const SKILLS = ["reading", "writing", "listening", "speaking"];

const TestCatalog = () => {
  const { subject, skill } = useParams();
  const [selectedSubject, setSelectedSubject] = useState(subject || "english");
  const [selectedSkill, setSelectedSkill] = useState<'reading' | 'writing' | 'listening' | 'speaking'>(
    (skill as any) || "reading"
  );
  const [cefrLevel, setCefrLevel] = useState("C1");
  
  const { user } = useAuth();
  
  useEffect(() => {
    if (subject) setSelectedSubject(subject);
    if (skill) setSelectedSkill(skill as any);
  }, [subject, skill]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Language Tests</h1>
      
      {/* Subject Selection Tabs */}
      <Tabs
        defaultValue={selectedSubject}
        value={selectedSubject}
        onValueChange={setSelectedSubject}
        className="mb-6"
      >
        <TabsList className="mb-2">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="math">Math</TabsTrigger>
          <TabsTrigger value="science">Science</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="bahasa">Bahasa</TabsTrigger>
        </TabsList>
        
        {/* Tab Content for Each Subject */}
        {["english", "math", "science", "history", "bahasa"].map((subj) => (
          <TabsContent key={subj} value={subj}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {subj.charAt(0).toUpperCase() + subj.slice(1)} Language Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Skill Selection Tabs */}
                <Tabs
                  defaultValue={selectedSkill}
                  value={selectedSkill}
                  onValueChange={(value) => setSelectedSkill(value as any)}
                  className="mb-6"
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="reading">Reading</TabsTrigger>
                    <TabsTrigger value="writing">Writing</TabsTrigger>
                    <TabsTrigger value="listening">Listening</TabsTrigger>
                    <TabsTrigger value="speaking">Speaking</TabsTrigger>
                  </TabsList>
                  
                  {/* CEFR Level Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">CEFR Level</h3>
                    <div className="flex flex-wrap gap-2">
                      {CEFR_LEVELS.map((level) => (
                        <button
                          key={level}
                          onClick={() => setCefrLevel(level)}
                          className={`px-4 py-2 rounded-md transition-colors ${
                            cefrLevel === level
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Test List for Each Skill */}
                  {SKILLS.map((skillType) => (
                    <TabsContent key={skillType} value={skillType}>
                      <TestList
                        subject={selectedSubject}
                        skill={skillType as any}
                        cefrLevel={cefrLevel}
                        userId={user?.id}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TestCatalog;
