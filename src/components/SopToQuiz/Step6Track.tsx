
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step6TrackProps {
  savedQuizId: string | null;
  onViewResults: () => void;
}

const Step6Track = ({ savedQuizId, onViewResults }: Step6TrackProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-primary" />
          Step 6: Track Quiz Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            After candidates complete the quiz, you can track their performance and results automatically in the admin dashboard.
          </p>
          
          <div className="bg-gray-50 border rounded-md p-4">
            <h4 className="font-medium text-sm mb-2">Quiz data will automatically include:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Candidate name and email</li>
              <li>Submission time</li>
              <li>Score and pass/fail status</li>
              <li>Time taken to complete</li>
              <li>Detailed answers for each question</li>
            </ul>
          </div>
          
          <Button
            onClick={onViewResults}
            disabled={!savedQuizId}
            className="w-full"
          >
            View Results Dashboard
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step6Track;
