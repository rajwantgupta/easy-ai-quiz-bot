
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const Certificate = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadCertificate = async () => {
      try {
        if (!id || !user) return;
        
        const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        const quiz = savedQuizzes.find((q: any) => q.id === id);
        
        if (!quiz) {
          toast.error("Certificate not found");
          navigate("/dashboard");
          return;
        }
        
        const userResults = JSON.parse(localStorage.getItem(`results-${user.id}`) || "[]");
        const result = userResults.find((r: any) => r.quizId === id);
        
        if (!result || !result.passed) {
          toast.error("No certificate available for this quiz");
          navigate("/dashboard");
          return;
        }
        
        setQuizData(quiz);
        setResultData(result);
      } catch (error) {
        console.error("Error loading certificate:", error);
        toast.error("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };
    
    loadCertificate();
  }, [id, user, navigate]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      toast.info("Preparing certificate for download...");
      
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Higher scale for better quality
        backgroundColor: "#ffffff",
        logging: false
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Certificate_${quizData.title.replace(/\s+/g, '_')}.png`;
      link.click();
      
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to download certificate");
    }
  };

  const handleSendEmail = () => {
    // In a real app, this would trigger an API call to send the email
    toast.success("Certificate has been sent to your email!");
  };

  if (!user || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!quizData || !resultData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Certificate Not Found</h1>
            <p className="mb-4">The certificate you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")} 
            className="mb-6"
          >
            Back to Dashboard
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Certificate</h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button onClick={handleSendEmail}>
                  <Mail className="mr-2 h-4 w-4" /> Send via Email
                </Button>
              </div>
            </div>
            
            <Card className="p-0 overflow-hidden">
              <div 
                ref={certificateRef} 
                className="certificate bg-white p-8 sm:p-12 relative flex flex-col items-center text-center"
              >
                <div className="absolute top-6 left-6 opacity-30">
                  <Award className="h-24 w-24 text-primary" />
                </div>
                <div className="absolute bottom-6 right-6 opacity-30">
                  <Award className="h-24 w-24 text-primary" />
                </div>
                
                <div className="text-primary font-bold text-2xl sm:text-4xl mb-4">
                  Certificate of Achievement
                </div>
                
                <div className="text-lg text-gray-600 mb-6">
                  This certifies that
                </div>
                
                <div className="text-xl sm:text-3xl font-semibold mb-6">
                  {user.name}
                </div>
                
                <div className="text-lg text-gray-600 mb-6 max-w-lg">
                  has successfully completed the assessment for
                </div>
                
                <div className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  {quizData.title}
                </div>
                
                <div className="mb-6 text-gray-500">
                  {quizData.description}
                </div>
                
                <div className="bg-primary/10 rounded-md px-6 py-3 mb-8">
                  <div className="text-primary font-semibold">
                    Achievement Score: {resultData.score}%
                  </div>
                </div>
                
                <div className="text-gray-600 mb-6">
                  Awarded on {formatDate(resultData.completedAt)}
                </div>
                
                <div className="flex justify-between w-full max-w-md">
                  <div className="text-center">
                    <div className="w-32 h-12 border-b border-gray-400 mb-2"></div>
                    <div className="text-gray-600 text-sm">Candidate Signature</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-32 h-12 border-b border-gray-400 mb-2 flex items-end justify-center">
                      <span className="font-script text-gray-700">
                        AutoAssess
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">Issuer Signature</div>
                  </div>
                </div>
                
                <div className="mt-12 text-xs text-gray-400">
                  Certificate ID: CERT-{id?.substring(0, 8).toUpperCase()}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Certificate;
