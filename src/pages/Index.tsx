
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <p className="text-xl text-muted-foreground mb-6">Access all your services from one place</p>
        <Link to="/">
          <Button size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
