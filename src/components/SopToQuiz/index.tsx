
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Step1PDF from "./Step1PDF";
import Step2Generate from "./Step2Generate";
import Step3GoogleSheets from "./Step3GoogleSheets";
import Step4GoogleForm from "./Step4GoogleForm";
import Step5Share from "./Step5Share";
import Step6Track from "./Step6Track";
import Step7Certificates from "./Step7Certificates";

const SopToQuiz = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("step1");
  const [sopText, setSopText] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [savedQuizId, setSavedQuizId] = useState<string | null>(null);

  const handleTextExtracted = (text: string) => {
    setSopText(text);
    setActiveTab("step2");
  };

  const handleQuestionsGenerated = (generatedQuestions: any[]) => {
    setQuestions(generatedQuestions);
    setActiveTab("step3");
  };

  const handleQuizSave = (quizTitle: string, quizQuestions: any[]) => {
    try {
      // In a real app, this would be an API call
      const quizId = `quiz-${Date.now()}`;
      
      // Get existing quizzes
      const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
      
      // Create new quiz
      savedQuizzes.push({
        id: quizId,
        title: quizTitle,
        description: `Generated from SOP document on ${new Date().toLocaleDateString()}`,
        questions: quizQuestions,
        passingScore: 80,
        createdAt: new Date().toISOString(),
      });
      
      // Save to localStorage
      localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));
      
      // Update state
      setSavedQuizId(quizId);
      toast.success("Quiz saved successfully!");
      
      // Move to next step
      setActiveTab("step5");
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    }
  };

  const handleViewResults = () => {
    navigate("/admin");
    toast.success("Navigating to admin dashboard...");
  };

  const handleViewCertificates = () => {
    navigate("/admin");
    toast.success("Navigating to admin dashboard...");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="step1" className="flex-1 md:flex-none">
              1. PDF to Text
            </TabsTrigger>
            <TabsTrigger value="step2" className="flex-1 md:flex-none" disabled={!sopText}>
              2. Generate Quiz
            </TabsTrigger>
            <TabsTrigger value="step3" className="flex-1 md:flex-none" disabled={questions.length === 0}>
              3. Google Sheets
            </TabsTrigger>
            <TabsTrigger value="step4" className="flex-1 md:flex-none" disabled={questions.length === 0}>
              4. Quiz Form
            </TabsTrigger>
            <TabsTrigger value="step5" className="flex-1 md:flex-none" disabled={!savedQuizId}>
              5. Share
            </TabsTrigger>
            <TabsTrigger value="step6" className="flex-1 md:flex-none" disabled={!savedQuizId}>
              6. Track
            </TabsTrigger>
            <TabsTrigger value="step7" className="flex-1 md:flex-none" disabled={!savedQuizId}>
              7. Certificates
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="step1">
          <Step1PDF onTextExtracted={handleTextExtracted} />
        </TabsContent>
        
        <TabsContent value="step2">
          <Step2Generate 
            sopText={sopText} 
            onQuestionsGenerated={handleQuestionsGenerated} 
          />
        </TabsContent>
        
        <TabsContent value="step3">
          <Step3GoogleSheets questions={questions} />
        </TabsContent>
        
        <TabsContent value="step4">
          <Step4GoogleForm 
            questions={questions} 
            onQuizSave={handleQuizSave} 
          />
        </TabsContent>
        
        <TabsContent value="step5">
          <Step5Share savedQuizId={savedQuizId} />
        </TabsContent>
        
        <TabsContent value="step6">
          <Step6Track 
            savedQuizId={savedQuizId} 
            onViewResults={handleViewResults} 
          />
        </TabsContent>
        
        <TabsContent value="step7">
          <Step7Certificates 
            savedQuizId={savedQuizId} 
            onViewCertificates={handleViewCertificates} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SopToQuiz;
