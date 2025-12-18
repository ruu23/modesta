import { useState } from 'react';
import { Sparkles, Heart, Tag, Calendar, CloudSun, Save, Wand2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CanvasItem } from './OutfitCanvas';
import { ClosetItem, OCCASIONS, SEASONS } from '@/types/closet';

interface AISuggestionsPanelProps {
  canvasItems: CanvasItem[];
  allItems: ClosetItem[];
  outfitName: string;
  setOutfitName: (name: string) => void;
  selectedOccasions: string[];
  setSelectedOccasions: (occasions: string[]) => void;
  selectedSeasons: string[];
  setSelectedSeasons: (seasons: string[]) => void;
  onSave: () => void;
  onAddItem: (item: ClosetItem) => void;
}

export function AISuggestionsPanel({
  canvasItems,
  allItems,
  outfitName,
  setOutfitName,
  selectedOccasions,
  setSelectedOccasions,
  selectedSeasons,
  setSelectedSeasons,
  onSave,
  onAddItem,
}: AISuggestionsPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    score: number;
    feedback: string[];
    occasion: string;
    suggestions: ClosetItem[];
  } | null>(null);

  const analyzeOutfit = () => {
    if (canvasItems.length === 0) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const items = canvasItems.map(ci => ci.item);
      const colors = items.flatMap(i => i.colors);
      const hasAccessory = items.some(i => i.category === 'accessories');
      const hasShoes = items.some(i => i.category === 'shoes');
      const hasHijab = items.some(i => i.category === 'hijabs');

      // Calculate a mock score
      let score = 50;
      if (colors.length >= 2 && new Set(colors).size <= 4) score += 20;
      if (hasAccessory) score += 10;
      if (hasShoes) score += 10;
      if (hasHijab) score += 10;
      score = Math.min(100, score);

      const feedback: string[] = [];
      if (score >= 80) feedback.push("Great color harmony! 💚");
      if (!hasAccessory) feedback.push("Try adding a belt or jewelry");
      if (!hasShoes) feedback.push("Don't forget the shoes!");
      if (items.length >= 3) feedback.push("Nice layering 👌");

      // Determine occasion
      const occasionScores: Record<string, number> = {};
      items.forEach(item => {
        item.occasions.forEach(occ => {
          occasionScores[occ] = (occasionScores[occ] || 0) + 1;
        });
      });
      const topOccasion = Object.entries(occasionScores)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'casual';

      // Suggest items
      const usedCategories = new Set(items.map(i => i.category));
      const suggestions = allItems
        .filter(i => !usedCategories.has(i.category))
        .filter(i => i.colors.some(c => colors.includes(c)))
        .slice(0, 3);

      setAiAnalysis({
        score,
        feedback,
        occasion: topOccasion,
        suggestions,
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions(
      selectedOccasions.includes(occasion)
        ? selectedOccasions.filter(o => o !== occasion)
        : [...selectedOccasions, occasion]
    );
  };

  const toggleSeason = (season: string) => {
    setSelectedSeasons(
      selectedSeasons.includes(season)
        ? selectedSeasons.filter(s => s !== season)
        : [...selectedSeasons, season]
    );
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* AI Analysis Button */}
          <div>
            <Button
              onClick={analyzeOutfit}
              disabled={canvasItems.length === 0 || isAnalyzing}
              className="w-full gradient-rose text-primary-foreground border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Get AI Help'}
            </Button>
          </div>

          {/* AI Results */}
          {aiAnalysis && (
            <div className="space-y-4 animate-fade-in">
              {/* Score */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Compatibility Score</span>
                  <span className="text-2xl font-bold text-primary">{aiAnalysis.score}%</span>
                </div>
                <Progress value={aiAnalysis.score} className="h-2" />
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                {aiAnalysis.feedback.map((fb, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground bg-muted/50 rounded-lg p-2"
                  >
                    <Heart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {fb}
                  </div>
                ))}
              </div>

              {/* Occasion */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Perfect for:</span>
                <Badge className="bg-accent text-accent-foreground capitalize">
                  {aiAnalysis.occasion}
                </Badge>
              </div>

              {/* Weather */}
              <div className="flex items-center gap-2 text-sm">
                <CloudSun className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Weather:</span>
                <Badge variant="outline">Fall-ready ☁️</Badge>
              </div>

              {/* Suggestions */}
              {aiAnalysis.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Complete your look
                  </h4>
                  <div className="flex gap-2">
                    {aiAnalysis.suggestions.map(item => (
                      <button
                        key={item.id}
                        onClick={() => onAddItem(item)}
                        className="w-16 h-16 rounded-lg overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all group"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Save Outfit */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Save Outfit</h3>
            
            <Input
              placeholder="Name your outfit..."
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="bg-muted border-0"
            />

            {/* Occasions */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Occasions</label>
              <div className="flex flex-wrap gap-1.5">
                {OCCASIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleOccasion(value)}
                    className={`px-2 py-1 rounded-full text-xs transition-all ${
                      selectedOccasions.includes(value)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seasons */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Seasons</label>
              <div className="flex flex-wrap gap-1.5">
                {SEASONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleSeason(value)}
                    className={`px-2 py-1 rounded-full text-xs transition-all ${
                      selectedSeasons.includes(value)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={onSave}
              disabled={canvasItems.length === 0}
              className="w-full gradient-rose text-primary-foreground border-0"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Outfit
            </Button>

            <Button variant="outline" className="w-full" disabled={canvasItems.length === 0}>
              <Wand2 className="w-4 h-4 mr-2" />
              Create Variations
            </Button>

            <Button variant="ghost" className="w-full" disabled={canvasItems.length === 0}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Outfit
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
