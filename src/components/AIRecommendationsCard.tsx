import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { useAIRecommendations, AIRecommendation } from '@/hooks/useAIRecommendations';
interface AIRecommendationsCardProps {
  zoneId: 'ai-financial-tips' | 'ai-inventory-recommendations' | 'ai-soil-recommendations' | 'ai-seasonal-guidance' | 'ai-field-status' | 'ai-season-progress';
  title: string;
  icon?: React.ReactNode;
  gradientClass?: string;
}
const AIRecommendationsCard = ({
  zoneId,
  title,
  icon = <Lightbulb className="h-5 w-5" />,
  gradientClass = "from-purple-500 to-indigo-600"
}: AIRecommendationsCardProps) => {
  const {
    getRecommendationsByZone,
    isLoading,
    refreshRecommendations
  } = useAIRecommendations();
  const recommendations = getRecommendationsByZone(zoneId);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-100';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-100';
      case 'low':
        return 'bg-green-500/20 text-green-100';
      default:
        return 'bg-gray-500/20 text-gray-100';
    }
  };
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Prioritate înaltă';
      case 'medium':
        return 'Prioritate medie';
      case 'low':
        return 'Prioritate scăzută';
      default:
        return 'Prioritate normală';
    }
  };
  return;
};
export default AIRecommendationsCard;