
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 md:text-5xl">CEFR Language Certification</h1>
          <p className="text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Comprehensive C1 level assessment for undergraduate students with AI-powered evaluation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our CEFR Test System?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M8.943 20.619A10.944 10.944 0 0 0 19.5 10.5c0-2.438-.792-4.726-2.183-6.606" />
                      <path d="M4.5 10.5a5.5 5.5 0 0 1 8.456-4.631" />
                      <path d="M18 3v4h-4" />
                      <path d="M15.5 20.5l-.777-2.598a1.996 1.996 0 0 0-1.826-1.402H11.1c-.75 0-1.45.543-1.826 1.402L8.5 20.5" />
                      <path d="M2 14h2l1-1v-1a2 2 0 1 1 4 0v1l1 1h4.5" />
                      <path d="M8 19a3 3 0 0 1-3-3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mt-4">AI-Powered Assessment</h3>
                  <p className="mt-2 text-muted-foreground">Receive detailed feedback and accurate evaluations powered by advanced AI algorithms.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M18 3v4H6" />
                      <path d="M6 7V3" />
                      <path d="M18 21v-4H6" />
                      <path d="M6 17v4" />
                      <path d="M18 11H6" />
                      <path d="M18 21H2V3h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mt-4">CEFR Aligned</h3>
                  <p className="mt-2 text-muted-foreground">Tests designed specifically to align with C1 level requirements of the Common European Framework.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                      <path d="M12 10v6" />
                      <path d="m9 13 3-3 3 3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mt-4">Comprehensive Skills Testing</h3>
                  <p className="mt-2 text-muted-foreground">Evaluate all language skills: reading, writing, listening, speaking, and vocabulary.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-muted"></div>
              
              {/* Step 1 */}
              <div className="relative mb-8">
                <div className="flex items-center mb-2">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center z-10">1</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">Register an Account</h3>
                  </div>
                </div>
                <div className="ml-12">
                  <p className="text-muted-foreground">Create your student account to access all test materials and track your progress.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative mb-8">
                <div className="flex items-center mb-2">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center z-10">2</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">Take Assessment Tests</h3>
                  </div>
                </div>
                <div className="ml-12">
                  <p className="text-muted-foreground">Complete comprehensive tests for reading, writing, listening, speaking, and vocabulary.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative mb-8">
                <div className="flex items-center mb-2">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center z-10">3</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">Receive AI Evaluation</h3>
                  </div>
                </div>
                <div className="ml-12">
                  <p className="text-muted-foreground">Get detailed feedback and scoring based on CEFR C1 criteria.</p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative">
                <div className="flex items-center mb-2">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center z-10">4</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">Track Your Progress</h3>
                  </div>
                </div>
                <div className="ml-12">
                  <p className="text-muted-foreground">Monitor your improvement over time and focus on areas that need strengthening.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Certified?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully achieved their C1 certification through our platform.
          </p>
          <Link to="/register">
            <Button variant="outline" size="lg" className="bg-white hover:bg-gray-100 text-primary">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
