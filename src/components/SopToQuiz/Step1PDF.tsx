
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractTextFromPdf } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { FileText, Upload, Check, X } from "lucide-react";

interface Step1PDFProps {
  onTextExtracted: (text: string) => void;
}

const Step1PDF = ({ onTextExtracted }: Step1PDFProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large! Maximum size is 10MB");
        return;
      }
      
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error("Please select a PDF file");
        return;
      }
      
      setFile(selectedFile);
      setExtractedText(null);
      toast.success(`File "${selectedFile.name}" selected successfully`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file type
      if (!droppedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error("Please upload PDF files only");
        return;
      }
      
      // Check file size (max 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large! Maximum size is 10MB");
        return;
      }
      
      setFile(droppedFile);
      setExtractedText(null);
      toast.success(`File "${droppedFile.name}" dropped successfully`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setExtractedText(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processDocument = async () => {
    if (!file) {
      toast.error("Please select a file to process");
      return;
    }

    setIsLoading(true);
    
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      onTextExtracted(text);
      toast.success("Text extracted successfully from PDF!");
    } catch (error) {
      toast.error("Failed to extract text from PDF. Please try again.");
      console.error("Processing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!extractedText) return;
    
    navigator.clipboard.writeText(extractedText)
      .then(() => toast.success("Text copied to clipboard!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Step 1: Convert SOP PDF to Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="flex flex-col items-center justify-center h-40 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer p-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf"
          />
          
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {file ? file.name : "Drop your SOP PDF here, or click to browse"}
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF files only (Max 10MB)
          </p>
        </div>
        
        {file && (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
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
        
        <div className="flex gap-2">
          <Button
            onClick={processDocument}
            disabled={!file || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Extract Text
              </>
            )}
          </Button>
          
          {extractedText && (
            <Button 
              variant="outline"
              onClick={copyToClipboard}
              className="flex-1"
            >
              Copy Text to Clipboard
            </Button>
          )}
        </div>
        
        {extractedText && (
          <div className="mt-4">
            <div className="font-medium text-sm mb-2 flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Text Extracted Successfully
            </div>
            <div className="bg-gray-50 border rounded-md p-3 h-60 overflow-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">{extractedText}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Step1PDF;
