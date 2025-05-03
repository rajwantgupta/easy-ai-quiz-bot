
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractTextFromPdf } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { FileText, Upload, Check, X, FileDigit } from "lucide-react";

interface Step1PDFProps {
  onTextExtracted: (text: string) => void;
}

const Step1PDF = ({ onTextExtracted }: Step1PDFProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [sopTitle, setSopTitle] = useState<string>("Leave Policy");
  
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
      
      // Try to extract a title from the filename
      const fileName = selectedFile.name.replace(".pdf", "");
      setSopTitle(fileName.charAt(0).toUpperCase() + fileName.slice(1));
      
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
      
      // Try to extract a title from the filename
      const fileName = droppedFile.name.replace(".pdf", "");
      setSopTitle(fileName.charAt(0).toUpperCase() + fileName.slice(1));
      
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
      
      // If text extraction fails or returns very little text, show error
      if (!text || text.length < 50) {
        throw new Error("Could not extract meaningful text from PDF.");
      }
      
      // Try to extract a better title from first line of content
      const firstLine = text.split('\n')[0];
      if (firstLine && firstLine.length > 3 && firstLine.length < 50) {
        setSopTitle(firstLine.trim());
      }
      
      setExtractedText(text);
      onTextExtracted(text);
      toast.success("Text extracted successfully from PDF!");
      
      // Save the SOP title to localStorage
      localStorage.setItem("currentSopTitle", sopTitle);
      
    } catch (error) {
      toast.error("Failed to extract text from PDF. Please try again.");
      console.error("Processing error:", error);
      
      // Fallback option - manual input
      const manualInput = window.confirm("PDF extraction failed. Would you like to input the text manually?");
      if (manualInput) {
        setExtractedText("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExtractedText(e.target.value);
  };

  const handleManualTextSubmit = () => {
    if (extractedText && extractedText.length > 50) {
      onTextExtracted(extractedText);
      toast.success("Text submitted successfully!");
    } else {
      toast.error("Please enter at least 50 characters of text");
    }
  };

  const copyToClipboard = () => {
    if (!extractedText) return;
    
    navigator.clipboard.writeText(extractedText)
      .then(() => toast.success("Text copied to clipboard!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  // Function to open PDF2GO in a new tab
  const openPDF2GO = () => {
    window.open("https://www.pdf2go.com/pdf-to-text", "_blank");
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
        
        <div className="flex flex-col sm:flex-row gap-2">
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
          
          <Button 
            variant="outline"
            onClick={openPDF2GO}
            className="flex-1"
          >
            <FileDigit className="mr-2 h-4 w-4" />
            Open PDF2GO Tool
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">SOP Title:</label>
          <input 
            type="text" 
            value={sopTitle}
            onChange={(e) => setSopTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter SOP title"
          />
        </div>
        
        {extractedText !== null && (
          <div className="mt-4">
            <div className="font-medium text-sm mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Text Extracted {extractedText ? "Successfully" : "Failed - Enter Manually"}
              </div>
              {extractedText && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  Copy Text
                </Button>
              )}
            </div>
            <div className="bg-gray-50 border rounded-md p-3 h-60 overflow-auto">
              {extractedText !== "" ? (
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">{extractedText}</pre>
              ) : (
                <textarea
                  className="w-full h-full p-2 text-xs border rounded-md"
                  placeholder="PDF extraction failed. Paste your SOP text here manually..."
                  onChange={handleManualTextChange}
                />
              )}
            </div>
            
            {extractedText === "" && (
              <Button 
                className="mt-2 w-full"
                onClick={handleManualTextSubmit}
              >
                Submit Manual Text
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Step1PDF;
