
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import QuizList, { Quiz } from "@/components/QuizList";
import { Award, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading quizzes from an API
    const loadUserData = async () => {
      try {
        // In a real app, this would be fetched from a backend API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        const userResults = JSON.parse(localStorage.getItem(`results-${user?.id}`) || "[]");
        
        // Combine quizzes with user results
        const userQuizzes = savedQuizzes.map((quiz: any) => {
          const result = userResults.find((r: any) => r.quizId === quiz.id);
          
          if (result) {
            return {
              id: quiz.id,
              title: quiz.title,
              description: quiz.description,
              questionsCount: quiz.questions.length,
              passingScore: quiz.passingScore,
              completed: true,
              score: result.score,
              passed: result.passed,
            };
          }
          
          return {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            questionsCount: quiz.questions.length,
            passingScore: quiz.passingScore,
            completed: false,
          };
        });
        
        // Get certificates
        const userCertificates = userResults
          .filter((result: any) => result.passed)
          .map((result: any) => {
            const quiz = savedQuizzes.find((q: any) => q.id === result.quizId);
            return {
              id: result.quizId,
              title: quiz ? quiz.title : "Unknown Quiz",
              date: result.completedAt,
              score: result.score,
            };
          });
        
        setQuizzes(userQuizzes);
        setCertificates(userCertificates);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadUserData();
    }
  }, [user]);

  if (!user || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Candidate Dashboard
              </h1>
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600">Welcome back, {user.name}</span>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-4 mt-4 md:mt-0">
              <Button variant="outline" asChild>
                <a href="mailto:support@autoassess.example.com">
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="quizzes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="quizzes">Available Quizzes</TabsTrigger>
              <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
              <TabsTrigger value="certificates">My Certificates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quizzes">
              <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
              <QuizList 
                quizzes={quizzes.filter(quiz => !quiz.completed)} 
                userRole="candidate" 
              />
              
              {quizzes.filter(quiz => !quiz.completed).length === 0 && (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">
                        You don't have any available quizzes at the moment.
                      </p>
                      <p className="text-sm text-gray-400">
                        New assessments will appear here when they're assigned to you.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              <h2 className="text-xl font-semibold mb-4">Completed Quizzes</h2>
              <QuizList 
                quizzes={quizzes.filter(quiz => quiz.completed)} 
                userRole="candidate" 
              />
              
              {quizzes.filter(quiz => quiz.completed).length === 0 && (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">
                        You haven't completed any quizzes yet.
                      </p>
                      <p className="text-sm text-gray-400">
                        Take a quiz from the Available Quizzes tab to see results here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="certificates">
              <h2 className="text-xl font-semibold mb-4">My Certificates</h2>
              
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate) => (
                    <Card key={certificate.id} className="overflow-hidden border-2 border-primary/20">
                      <CardHeader className="bg-primary/5 pb-3">
                        <div className="flex items-start">
                          <Award className="h-6 w-6 text-primary mr-2" />
                          <div>
                            <CardTitle className="text-lg">{certificate.title}</CardTitle>
                            <CardDescription>
                              Awarded on {new Date(certificate.date).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-500 mb-4">
                          Score achieved: <span className="font-semibold text-primary">{certificate.score}%</span>
                        </p>
                        <Button asChild variant="outline" className="w-full">
                          <a href={`/certificate/${certificate.id}`}>
                            View Certificate
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        You haven't earned any certificates yet
                      </p>
                      <p className="text-sm text-gray-400 mb-6">
                        Complete quizzes with a score of 75% or higher to earn certificates
                      </p>
                      <Button asChild variant="secondary">
                        <a href="#quizzes">View Available Quizzes</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
