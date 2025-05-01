
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step7CertificatesProps {
  savedQuizId: string | null;
  onViewCertificates: () => void;
}

const Step7Certificates = ({ savedQuizId, onViewCertificates }: Step7CertificatesProps) => {
  const openCanva = () => {
    window.open("https://www.canva.com/certificates/", "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Step 7: Certificates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            EASY AI Quiz automatically generates certificates for candidates who pass the quiz. 
            You can also customize certificates or create your own designs.
          </p>
          
          <div className="bg-gray-50 border rounded-md p-4">
            <h4 className="font-medium text-sm mb-2">Certificate Features:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Automatic generation on passing score</li>
              <li>Candidate name and quiz title</li>
              <li>Completion date and score</li>
              <li>Shareable by email or social media</li>
              <li>Downloadable as PDF</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onViewCertificates}
              disabled={!savedQuizId}
              className="flex-1"
            >
              <Award className="mr-2 h-4 w-4" />
              View Certificates
            </Button>
            
            <Button
              variant="outline"
              onClick={openCanva}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Custom Certificate Templates
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step7Certificates;
