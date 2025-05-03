
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileInput, ExternalLink, Save } from "lucide-react";

interface Step4GoogleFormProps {
  questions: any[];
  onQuizSave: (quizTitle: string, questions: any[]) => void;
}

const Step4GoogleForm = ({ questions, onQuizSave }: Step4GoogleFormProps) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  
  useEffect(() => {
    // Try to get the SOP title from localStorage
    const savedTitle = localStorage.getItem("currentSopTitle");
    if (savedTitle) {
      setQuizTitle(`${savedTitle} Quiz`);
    } else {
      setQuizTitle("SOP Knowledge Quiz");
    }
  }, []);

  const openGoogleForms = () => {
    window.open("https://forms.google.com", "_blank");
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }
    
    if (!questions || questions.length === 0) {
      toast.error("No questions to save");
      return;
    }
    
    onQuizSave(quizTitle, questions);
  };

  const generateGoogleFormUrl = () => {
    // This is a simplified approach - Google Forms doesn't actually support
    // direct URL construction with questions, but we can give users some help
    let url = "https://docs.google.com/forms/d/e/1FAIpQLSfeeF96POj7yHi-qU3Cw_fN9gVCTzFHEkJBYGK95hAyQPmJTw/viewform?usp=pp_url";
    
    // Just open the base form creation URL
    return "https://forms.google.com/create";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileInput className="mr-2 h-5 w-5 text-primary" />
          Step 4: Create Quiz Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Create a Google Form quiz with the questions generated, or save them directly to EASY AI Quiz.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quiz Title:</label>
              <Input
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Passing Score (%):</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="bg-gray-50 border rounded-md p-4">
            <h4 className="font-medium text-sm mb-3">Google Form Instructions:</h4>
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li>Click "Open Google Forms" below to open the Google Forms website</li>
              <li>Click "Create a new form" or "Blank Quiz"</li>
              <li>Enter "{quizTitle}" as the title</li>
              <li>In the form settings:</li>
              <ul className="list-disc pl-5 mt-1 mb-2">
                <li>Click on the Settings gear icon</li>
                <li>Go to the "Quizzes" tab</li>
                <li>Toggle on "Make this a quiz"</li>
                <li>Choose when to release the score</li>
                <li>Click Save</li>
              </ul>
              <li>For each question:</li>
              <ul className="list-disc pl-5 mt-1">
                <li>Set question type to "Multiple choice"</li>
                <li>Paste the question text</li>
                <li>Add the 4 options (A-D)</li>
                <li>Click "Answer key" and select the correct answer</li>
                <li>Assign 1 point per question</li>
              </ul>
              <li>Use the "Preview" button to test your quiz</li>
              <li>Click "Send" to share the quiz with participants</li>
            </ol>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-sm mb-3">Quiz Preview:</h4>
            <div className="bg-white border rounded-md p-4">
              <h3 className="font-medium mb-4">{quizTitle}</h3>
              
              {questions.length > 0 ? (
                <div className="space-y-6">
                  {questions.slice(0, 2).map((q, index) => (
                    <div key={index} className="space-y-2">
                      <p className="font-medium">Question {index + 1}: {q.question}</p>
                      <div className="space-y-1 pl-4">
                        {q.options.map((option: string, i: number) => (
                          <div key={i} className="flex items-center">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 text-sm ${q.correctAnswer === i ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {questions.length > 2 && (
                    <p className="text-gray-500 text-sm italic">
                      ...and {questions.length - 2} more questions
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No questions generated yet</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={openGoogleForms}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Google Forms
            </Button>
            
            <Button
              onClick={handleSaveQuiz}
              disabled={!questions || questions.length === 0}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Quiz in EASY AI Quiz
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4GoogleForm;
