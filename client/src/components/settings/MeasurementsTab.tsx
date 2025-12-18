import { useState } from 'react';
import { Ruler, Info, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Measurements, BODY_TYPES } from '@/types/settings';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MeasurementsTabProps {
  measurements: Measurements;
  measurementUnit: 'cm' | 'inches';
  onUpdateMeasurements: (updates: Partial<Measurements>) => void;
  onUpdateDetailedMeasurements: (updates: Partial<Measurements['detailed']>) => void;
}

export const MeasurementsTab = ({ 
  measurements, 
  measurementUnit,
  onUpdateMeasurements,
  onUpdateDetailedMeasurements 
}: MeasurementsTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const unit = measurementUnit === 'cm' ? 'cm' : 'in';

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Measurements updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Basic Measurements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Basic Measurements
          </CardTitle>
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height ({unit})</Label>
              <Input 
                id="height"
                type="number"
                value={measurements.height || ''}
                onChange={(e) => onUpdateMeasurements({ height: Number(e.target.value) || null })}
                disabled={!isEditing}
                placeholder={`Enter height in ${unit}`}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <span className="text-xs text-muted-foreground">(optional)</span>
              </div>
              <Input 
                id="weight"
                type="number"
                value={measurements.weight || ''}
                onChange={(e) => onUpdateMeasurements({ weight: Number(e.target.value) || null })}
                disabled={!isEditing}
                placeholder="Enter weight"
              />
            </div>
          </div>

          {measurements.lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {format(new Date(measurements.lastUpdated), 'MMMM d, yyyy')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Body Type */}
      <Card>
        <CardHeader>
          <CardTitle>Body Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={measurements.bodyType}
            onValueChange={(value) => onUpdateMeasurements({ bodyType: value })}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            disabled={!isEditing}
          >
            {BODY_TYPES.map((type) => (
              <div key={type}>
                <RadioGroupItem 
                  value={type} 
                  id={type}
                  className="peer sr-only"
                  disabled={!isEditing}
                />
                <Label
                  htmlFor={type}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                    "hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="w-12 h-16 mb-2 flex items-center justify-center">
                    {/* Simplified body silhouette */}
                    <svg viewBox="0 0 40 60" className="w-full h-full fill-current text-muted-foreground">
                      {type === 'Hourglass' && (
                        <path d="M12 5 Q20 5 28 5 Q32 20 28 30 Q32 40 28 55 Q20 55 12 55 Q8 40 12 30 Q8 20 12 5" />
                      )}
                      {type === 'Pear' && (
                        <path d="M15 5 Q20 5 25 5 Q27 20 25 30 Q32 45 28 55 Q20 55 12 55 Q8 45 15 30 Q13 20 15 5" />
                      )}
                      {type === 'Apple' && (
                        <path d="M10 5 Q20 5 30 5 Q34 20 30 30 Q28 45 25 55 Q20 55 15 55 Q12 45 10 30 Q6 20 10 5" />
                      )}
                      {type === 'Rectangle' && (
                        <path d="M13 5 Q20 5 27 5 Q28 20 27 30 Q28 45 27 55 Q20 55 13 55 Q12 45 13 30 Q12 20 13 5" />
                      )}
                      {type === 'Inverted Triangle' && (
                        <path d="M8 5 Q20 5 32 5 Q30 20 28 30 Q26 45 24 55 Q20 55 16 55 Q14 45 12 30 Q10 20 8 5" />
                      )}
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-center">{type}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Detailed Measurements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Detailed Measurements
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>These measurements help us provide more accurate outfit suggestions and size recommendations. All fields are optional.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-xs text-muted-foreground font-normal">(optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'bust', label: 'Bust' },
              { key: 'waist', label: 'Waist' },
              { key: 'hips', label: 'Hips' },
              { key: 'shoulderWidth', label: 'Shoulder Width' },
              { key: 'armLength', label: 'Arm Length' },
              { key: 'inseam', label: 'Inseam' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label} ({unit})</Label>
                <Input 
                  id={key}
                  type="number"
                  value={measurements.detailed[key as keyof typeof measurements.detailed] || ''}
                  onChange={(e) => onUpdateDetailedMeasurements({ 
                    [key]: Number(e.target.value) || null 
                  })}
                  disabled={!isEditing}
                  placeholder="-"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Figure Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Measurements Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              {/* Stylized figure */}
              <svg viewBox="0 0 120 200" className="w-32 h-48 text-primary/20">
                <ellipse cx="60" cy="20" rx="15" ry="18" fill="currentColor" />
                <path 
                  d="M40 45 Q60 40 80 45 Q90 80 85 110 Q80 150 75 180 Q60 182 45 180 Q40 150 35 110 Q30 80 40 45" 
                  fill="currentColor"
                />
              </svg>
              {/* Measurement labels */}
              {measurements.detailed.bust && (
                <div className="absolute top-12 -right-16 text-xs bg-background border rounded px-2 py-1">
                  Bust: {measurements.detailed.bust}{unit}
                </div>
              )}
              {measurements.detailed.waist && (
                <div className="absolute top-24 -left-16 text-xs bg-background border rounded px-2 py-1">
                  Waist: {measurements.detailed.waist}{unit}
                </div>
              )}
              {measurements.detailed.hips && (
                <div className="absolute top-36 -right-14 text-xs bg-background border rounded px-2 py-1">
                  Hips: {measurements.detailed.hips}{unit}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
