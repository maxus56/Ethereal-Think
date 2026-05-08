import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Button onClick={() => navigate("/")} variant="outline">
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
