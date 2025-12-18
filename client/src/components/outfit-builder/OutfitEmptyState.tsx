import { Plus, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { OutfitsIllustration } from '@/components/ui/Illustrations';

interface OutfitEmptyStateProps {
  onCreateOutfit?: () => void;
  onGetSuggestions?: () => void;
}

export function OutfitEmptyState({ onCreateOutfit, onGetSuggestions }: OutfitEmptyStateProps) {
  return (
    <EmptyState
      illustration={<OutfitsIllustration />}
      title="No outfits created yet"
      description="Combine your closet items to create beautiful outfits. You can also get AI-powered suggestions based on your style!"
      action={onCreateOutfit ? {
        label: 'Create Outfit',
        onClick: onCreateOutfit,
        icon: <Plus className="w-4 h-4 mr-2" />,
      } : undefined}
      secondaryAction={onGetSuggestions ? {
        label: 'Get AI Suggestions',
        onClick: onGetSuggestions,
      } : undefined}
    />
  );
}
