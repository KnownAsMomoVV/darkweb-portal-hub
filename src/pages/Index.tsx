
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Service Dashboard Hub</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your centralized dashboard for all your web services and applications.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/your-username/service-dashboard" target="_blank" rel="noopener noreferrer">
              View Source
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
