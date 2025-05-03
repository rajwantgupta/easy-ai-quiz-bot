
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
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [prompt, setPrompt] = useState<string>(() => {
    // Create a dynamic prompt based on the SOP text
    return `You are a quiz generator assistant for corporate training.

Based on the following internal policy document, create 5 multiple-choice questions (MCQs) with 4 options each (A–D) and clearly mark the correct answer.

Keep the language simple and professional. Focus on key information relevant to employees.

Here is the policy text:
${sopText.substring(0, 3000)}${sopText.length > 3000 ? '...' : ''}`;
  });

  // Update prompt when SOP text changes
  React.useEffect(() => {
    setPrompt(`You are a quiz generator assistant for corporate training.

Based on the following internal policy document, create 5 multiple-choice questions (MCQs) with 4 options each (A–D) and clearly mark the correct answer.

Keep the language simple and professional. Focus on key information relevant to employees.

Here is the policy text:
${sopText.substring(0, 3000)}${sopText.length > 3000 ? '...' : ''}`);
  }, [sopText]);

  const generateQuestionsWithMockData = async () => {
    // This is a fallback if the user doesn't provide an API key
    setIsGenerating(true);
    
    try {
      // Simulate AI generating questions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we generate mock questions based on the SOPText title if present
      const sopTitle = sopText.split('\n')[0] || "Company Policy";
      const mockQuestions = `
Question 1: What is the main purpose of ${sopTitle}?
A) To provide technical specifications
B) To outline policy guidelines
C) To analyze market conditions
D) To document legal requirements
Correct Answer: B

Question 2: Who is responsible for ensuring compliance with the ${sopTitle.includes('Policy') ? sopTitle : sopTitle + ' Policy'}?
A) HR Department
B) Individual employees
C) Managers
D) Department heads
Correct Answer: C

Question 3: How often should the ${sopTitle.includes('Policy') ? sopTitle : sopTitle + ' Policy'} be reviewed?
A) Monthly
B) Quarterly
C) Yearly
D) Every two years
Correct Answer: C

Question 4: What happens if an employee violates the ${sopTitle.includes('Policy') ? sopTitle : sopTitle + ' Policy'}?
A) Immediate termination
B) Verbal warning only
C) Disciplinary action based on severity
D) No consequences
Correct Answer: C

Question 5: Which department should be contacted for questions regarding the ${sopTitle.includes('Policy') ? sopTitle : sopTitle + ' Policy'}?
A) Marketing
B) Human Resources
C) Legal
D) IT Support
Correct Answer: B
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

  const generateQuestionsWithOpenAI = async () => {
    if (!apiKey) {
      toast.error("Please enter your OpenAI API key");
      setShowApiInput(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates quiz questions based on provided content."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate questions");
      }
      
      const data = await response.json();
      const generatedContent = data.choices[0].message.content;
      
      setGeneratedQuestions(generatedContent);
      
      // Parse the questions into a structured format
      const questions = parseQuestions(generatedContent);
      onQuestionsGenerated(questions);
      
      toast.success("Questions generated successfully!");
    } catch (error: any) {
      toast.error(`Failed to generate questions: ${error.message}`);
      console.error("OpenAI error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!sopText) {
      toast.error("No SOP text provided");
      return;
    }
    
    if (apiKey) {
      await generateQuestionsWithOpenAI();
    } else {
      if (showApiInput) {
        toast.error("Please enter your OpenAI API key or use the mock generator");
      } else {
        await generateQuestionsWithMockData();
      }
    }
  };

  const parseQuestions = (questionsText: string): any[] => {
    const lines = questionsText.trim().split('\n');
    const questions: any[] = [];
    
    let currentQuestion: any = null;
    let currentOptions: string[] = [];
    
    for (const line of lines) {
      // Start of a new question
      if (line.trim().match(/^Question\s*\d+:/) || line.trim().match(/^\d+\.\s*[A-Z]/)) {
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
      // Option line - matches A), a), A., a. or just A
      else if (line.trim().match(/^[A-D][).:]?\s+/) || line.trim().match(/^[a-d][).:]?\s+/)) {
        const option = line.trim().substring(line.trim().indexOf(' ') + 1).trim();
        currentOptions.push(option);
      }
      // Correct answer line
      else if (line.trim().toLowerCase().startsWith('correct answer:') || 
               line.trim().toLowerCase().startsWith('answer:')) {
        const answerText = line.substring(line.indexOf(':') + 1).trim();
        let correctAnswerIndex = 0;
        
        // Parse the correct answer letter
        if (answerText.match(/^[A-Da-d]/)) {
          const letter = answerText.charAt(0).toUpperCase();
          correctAnswerIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0);
        } else if (answerText.includes('A')) correctAnswerIndex = 0;
        else if (answerText.includes('B')) correctAnswerIndex = 1;
        else if (answerText.includes('C')) correctAnswerIndex = 2;
        else if (answerText.includes('D')) correctAnswerIndex = 3;
        
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
        
        {showApiInput && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              OpenAI API Key (optional, but recommended for better results):
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                className="flex-1 px-3 py-2 border rounded-md"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <Button 
                variant="secondary"
                onClick={() => setShowApiInput(false)}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Your API key is used only for this request and is not stored.
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleGenerateQuestions}
            disabled={isGenerating || !sopText}
            className="flex-1"
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
          
          {!showApiInput && (
            <Button
              variant="outline"
              onClick={() => setShowApiInput(true)}
              className="flex-1"
              disabled={isGenerating}
            >
              Use OpenAI API
            </Button>
          )}
        </div>
        
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
