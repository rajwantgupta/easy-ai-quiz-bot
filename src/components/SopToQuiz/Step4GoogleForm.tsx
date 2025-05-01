
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FormInput, ExternalLink, Save } from "lucide-react";

interface Step4GoogleFormProps {
  questions: any[];
  onQuizSave: (quizTitle: string, questions: any[]) => void;
}

const Step4GoogleForm = ({ questions, onQuizSave }: Step4GoogleFormProps) => {
  const [quizTitle, setQuizTitle] = useState("Leave Policy Quiz");

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FormInput className="mr-2 h-5 w-5 text-primary" />
          Step 4: Create Quiz Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Create a Google Form quiz with the questions generated, or save them directly to EASY AI Quiz.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Quiz Title:</label>
            <Input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
            />
          </div>
          
          <div className="bg-gray-50 border rounded-md p-4">
            <h4 className="font-medium text-sm mb-3">Google Form Instructions:</h4>
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li>Click "Open Google Forms" below to open the Google Forms website</li>
              <li>Click "Create a new form" or "Blank Quiz"</li>
              <li>Enter "{quizTitle}" as the title</li>
              <li>For each question:
                <ul className="list-disc pl-5 mt-1">
                  <li>Paste the question text</li>
                  <li>Add the 4 options (A-D)</li>
                  <li>Click "Answer key" and select the correct answer</li>
                  <li>Assign 1 point per question</li>
                </ul>
              </li>
              <li>In the form settings, enable "Make this a quiz" option</li>
            </ol>
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
