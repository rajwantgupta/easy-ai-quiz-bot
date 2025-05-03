
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Table, ExternalLink, Copy, FileSpreadsheet } from "lucide-react";

interface Step3GoogleSheetsProps {
  questions: any[];
}

const Step3GoogleSheets = ({ questions }: Step3GoogleSheetsProps) => {
  const [sopTitle, setSopTitle] = useState<string>("Leave Policy");
  
  useEffect(() => {
    // Try to get the SOP title from localStorage
    const savedTitle = localStorage.getItem("currentSopTitle");
    if (savedTitle) {
      setSopTitle(savedTitle);
    }
  }, []);
  
  const generateSheetText = () => {
    if (!questions || questions.length === 0) return "";
    
    let text = "SOP Title\tOriginal Policy Text\tQuestion\tOption A\tOption B\tOption C\tOption D\tCorrect Answer\n";
    
    questions.forEach((q, index) => {
      const correctLetter = String.fromCharCode(65 + q.correctAnswer);
      text += `${sopTitle}\t-\t${q.question}\t${q.options[0]}\t${q.options[1]}\t${q.options[2]}\t${q.options[3]}\tOption ${correctLetter}\n`;
    });
    
    return text;
  };

  const copyToClipboard = () => {
    const text = generateSheetText();
    
    if (!text) {
      toast.error("No questions to copy");
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Questions copied in spreadsheet format!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  const openGoogleSheets = () => {
    window.open("https://sheets.google.com", "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
          Step 3: Prepare for Google Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
            <label className="text-sm font-medium w-full sm:w-auto">SOP Title:</label>
            <input 
              type="text" 
              value={sopTitle}
              onChange={(e) => setSopTitle(e.target.value)}
              className="w-full sm:w-auto flex-1 px-3 py-2 border rounded-md"
            />
          </div>
          
          <p className="text-sm text-gray-600">
            Copy the formatted questions to paste into Google Sheets. The content is already formatted with tabs for easy pasting into columns.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
            <h4 className="font-medium text-sm mb-3">Google Sheets Instructions:</h4>
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li>Click "Open Google Sheets" below to open Google Sheets</li>
              <li>Create a new blank spreadsheet</li>
              <li>Click on cell A1 in the spreadsheet</li>
              <li>Click "Copy for Google Sheets" button below</li>
              <li>Paste the content in Google Sheets (Ctrl+V or Cmd+V)</li>
              <li>The data will automatically format into columns</li>
              <li>Use this spreadsheet for question management and reference</li>
            </ol>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-500">SOP Title</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Question</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Option A</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Option B</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Option C</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Option D</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Correct</th>
                </tr>
              </thead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map((q, i) => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="py-2 px-3 text-gray-800">{sopTitle}</td>
                      <td className="py-2 px-3 text-gray-800">{q.question}</td>
                      <td className="py-2 px-3 text-gray-800">{q.options[0]}</td>
                      <td className="py-2 px-3 text-gray-800">{q.options[1]}</td>
                      <td className="py-2 px-3 text-gray-800">{q.options[2]}</td>
                      <td className="py-2 px-3 text-gray-800">{q.options[3]}</td>
                      <td className="py-2 px-3 text-gray-800">
                        Option {String.fromCharCode(65 + q.correctAnswer)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No questions generated yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={copyToClipboard}
              disabled={!questions || questions.length === 0}
              className="flex-1"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy for Google Sheets
            </Button>
            
            <Button
              variant="outline"
              onClick={openGoogleSheets}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Google Sheets
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3GoogleSheets;
