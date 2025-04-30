
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Quiz = {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  passingScore: number;
  completed?: boolean;
  score?: number;
  passed?: boolean;
};

type QuizListProps = {
  quizzes: Quiz[];
  userRole: "admin" | "candidate";
};

const QuizList = ({ quizzes, userRole }: QuizListProps) => {
  if (quizzes.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">
          {userRole === "admin" 
            ? "No quizzes created yet. Upload a document to create a new quiz."
            : "No quizzes available for you at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
              {userRole === "candidate" && quiz.completed && (
                <Badge variant={quiz.passed ? "default" : "destructive"}>
                  {quiz.passed ? "PASSED" : "FAILED"}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <div>Questions: {quiz.questionsCount}</div>
              <div>Passing: {quiz.passingScore}%</div>
            </div>
            
            {userRole === "candidate" && quiz.completed ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">
                  Your score: <span className={quiz.passed ? "text-green-600" : "text-red-600"}>
                    {quiz.score}%
                  </span>
                </div>
                
                {quiz.passed && (
                  <Link to={`/certificate/${quiz.id}`}>
                    <Button variant="outline" className="w-full">
                      View Certificate
                    </Button>
                  </Link>
                )}
                
                <Link to={`/quiz/${quiz.id}`}>
                  <Button variant="secondary" className="w-full">
                    Review Quiz
                  </Button>
                </Link>
              </div>
            ) : userRole === "candidate" ? (
              <Link to={`/quiz/${quiz.id}`}>
                <Button className="w-full">Take Quiz</Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  Edit Quiz
                </Button>
                <Button className="w-full" variant="secondary">
                  View Results
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuizList;
