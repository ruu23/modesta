import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
      <div className="divider-gold w-16 mb-12" />
      <h1 className="text-display mb-4">404</h1>
      <div className="divider-gold w-16 mb-12" />
      
      <h2 className="text-headline mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-12 tracking-wide">
        The page you are looking for does not exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="gold" asChild>
          <Link to="/"><Home className="w-4 h-4 mr-2" />Return Home</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />Go Back
        </Button>
      </div>
    </div>
  );
}