
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, File, X } from "lucide-react";

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "text/plain": [".txt"],
};

type DocumentUploaderProps = {
  onDocumentProcessed: (questions: any[]) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
};

const DocumentUploader = ({ onDocumentProcessed, isProcessing, setIsProcessing }: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large! Maximum size is 10MB");
        return;
      }
      
      setFile(selectedFile);
      toast.success(`File "${selectedFile.name}" selected successfully`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file type
      const validFileType = Object.keys(ACCEPTED_FILE_TYPES).includes(droppedFile.type);
      if (!validFileType) {
        toast.error("Invalid file type. Please upload PDF, DOCX, XLSX or TXT files only.");
        return;
      }
      
      // Check file size (max 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large! Maximum size is 10MB");
        return;
      }
      
      setFile(droppedFile);
      toast.success(`File "${droppedFile.name}" dropped successfully`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processDocument = async () => {
    if (!file) {
      toast.error("Please select a file to process");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate document processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate AI-generated questions based on document content
      // In a real app, this would call an actual AI service to analyze the document
      const mockQuestions = [
        {
          id: "q1",
          question: "What is the main purpose of the document?",
          options: [
            "To provide technical specifications",
            "To outline strategic goals",
            "To analyze market conditions",
            "To document legal requirements"
          ],
          correctAnswer: 1
        },
        {
          id: "q2",
          question: "What methodology is described in section 3?",
          options: [
            "Agile development",
            "Waterfall model",
            "Six Sigma",
            "Design Thinking"
          ],
          correctAnswer: 3
        },
        {
          id: "q3",
          question: "Which year does the financial forecast cover?",
          options: [
            "2023-2025",
            "2024-2026",
            "2022-2024",
            "2025-2027"
          ],
          correctAnswer: 1
        },
        {
          id: "q4",
          question: "Who is the target audience for this document?",
          options: [
            "Project managers",
            "Executive leadership",
            "Technical staff",
            "External stakeholders"
          ],
          correctAnswer: 1
        },
        {
          id: "q5",
          question: "What is the recommended implementation timeline?",
          options: [
            "6 months",
            "12 months",
            "18 months",
            "24 months"
          ],
          correctAnswer: 2
        },
        {
          id: "q6",
          question: "What is the primary risk identified in the analysis?",
          options: [
            "Budget constraints",
            "Technical limitations",
            "Market competition",
            "Regulatory changes"
          ],
          correctAnswer: 3
        },
        {
          id: "q7",
          question: "Which department is responsible for oversight?",
          options: [
            "Finance",
            "Operations",
            "Compliance",
            "Technology"
          ],
          correctAnswer: 2
        },
        {
          id: "q8",
          question: "What percentage growth is projected in year 2?",
          options: [
            "5%",
            "8%",
            "12%",
            "15%"
          ],
          correctAnswer: 2
        },
        {
          id: "q9",
          question: "Which technology platform is recommended?",
          options: [
            "AWS",
            "Azure",
            "Google Cloud",
            "Hybrid solution"
          ],
          correctAnswer: 3
        },
        {
          id: "q10",
          question: "What is the key performance indicator for success?",
          options: [
            "Customer satisfaction",
            "Revenue growth",
            "Operational efficiency",
            "Innovation rate"
          ],
          correctAnswer: 0
        }
      ];
      
      onDocumentProcessed(mockQuestions);
      toast.success("Document processed successfully!");
    } catch (error) {
      toast.error("Failed to process document. Please try again.");
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center justify-center h-48 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer p-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={Object.entries(ACCEPTED_FILE_TYPES)
                .map(([mimeType, extensions]) => extensions.join(","))
                .join(",")}
            />
            
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {file ? file.name : "Drop your file here, or click to browse"}
            </p>
            <p className="text-xs text-gray-500">
              Supports PDF, DOCX, XLSX, and TXT (Max 10MB)
            </p>
          </div>
          
          {file && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center">
                <File className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          <div className="mt-4">
            <Button 
              onClick={processDocument} 
              disabled={!file || isProcessing} 
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing Document...
                </>
              ) : (
                "Generate Quiz Questions"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploader;
