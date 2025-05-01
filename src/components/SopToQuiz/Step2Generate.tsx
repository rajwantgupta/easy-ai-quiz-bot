
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Brain, Copy, RefreshCw } from "lucide-react";

interface Step2GenerateProps {
  sopText: string;
  onQuestionsGenerated: (questions: any[]) => void;
}

const Step2Generate = ({ sopText, onQuestionsGenerated }: Step2GenerateProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(
    `You are a quiz generator assistant for corporate training.

Based on the following internal policy document, create 5 multiple-choice questions (MCQs) with 4 options each (A–D) and clearly mark the correct answer.

Keep the language simple and professional. Focus on key information relevant to employees.

Here is the policy text:
${sopText.substring(0, 500)}...`
  );

  const handleGenerateQuestions = async () => {
    if (!sopText) {
      toast.error("No SOP text provided");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate AI generating questions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call an actual AI API (e.g., OpenAI)
      // For demo purposes, we generate mock questions
      const mockQuestions = `
Question 1: What is the maximum number of annual leave days that can be carried forward to the next calendar year?
A) 3 days
B) 5 days
C) 10 days
D) 20 days
Correct Answer: B

Question 2: How many days of paid sick leave do full-time employees receive per year?
A) 5 days
B) 10 days
C) 15 days
D) 20 days
Correct Answer: B

Question 3: How much advance notice is required for standard leave requests?
A) 1 week
B) 2 weeks
C) 3 weeks
D) 4 weeks
Correct Answer: B

Question 4: Who is responsible for ensuring adequate coverage during employee absence?
A) HR Department
B) The employee taking leave
C) Managers
D) Department heads
Correct Answer: C

Question 5: How long is the paid leave period for a primary caregiver under Parental Leave?
A) 6 weeks
B) 8 weeks
C) 10 weeks
D) 12 weeks
Correct Answer: D
      `;
      
      setGeneratedQuestions(mockQuestions);
      
      // Parse the questions into a structured format
      const questions = parseQuestions(mockQuestions);
      onQuestionsGenerated(questions);
      
      toast.success("Questions generated successfully!");
    } catch (error) {
      toast.error("Failed to generate questions. Please try again.");
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const parseQuestions = (questionsText: string): any[] => {
    const lines = questionsText.trim().split('\n');
    const questions: any[] = [];
    
    let currentQuestion: any = null;
    let currentOptions: string[] = [];
    
    for (const line of lines) {
      // Start of a new question
      if (line.startsWith('Question')) {
        // Save previous question if it exists
        if (currentQuestion) {
          questions.push({
            ...currentQuestion,
            options: currentOptions
          });
        }
        
        // Extract question text
        const questionText = line.substring(line.indexOf(':') + 1).trim();
        
        currentQuestion = {
          question: questionText,
          id: `q${questions.length + 1}`,
        };
        currentOptions = [];
      }
      // Option line
      else if (line.match(/^[A-D]\)/)) {
        const option = line.substring(3).trim();
        currentOptions.push(option);
      }
      // Correct answer line
      else if (line.startsWith('Correct Answer:')) {
        const correctAnswerLetter = line.substring(line.length - 1);
        const correctAnswerIndex = correctAnswerLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        currentQuestion.correctAnswer = correctAnswerIndex;
      }
    }
    
    // Add the last question
    if (currentQuestion) {
      questions.push({
        ...currentQuestion,
        options: currentOptions
      });
    }
    
    return questions;
  };

  const copyToClipboard = () => {
    if (!generatedQuestions) return;
    
    navigator.clipboard.writeText(generatedQuestions)
      .then(() => toast.success("Questions copied to clipboard!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          Step 2: Generate Quiz Using AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">AI Prompt:</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <Button
          onClick={handleGenerateQuestions}
          disabled={isGenerating || !sopText}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Generate Questions
            </>
          )}
        </Button>
        
        {generatedQuestions && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">Generated Questions:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 px-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy All
              </Button>
            </div>
            <div className="bg-gray-50 border rounded-md p-3 h-60 overflow-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">{generatedQuestions}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Step2Generate;
