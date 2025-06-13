
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { useAIRecommendations, AIRecommendation } from '@/hooks/useAIRecommendations';

interface AIRecommendationsCardProps {
  zoneId: 'ai-financial-tips' | 'ai-inventory-recommendations';
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
  const { getRecommendationsByZone, isLoading, refreshRecommendations } = useAIRecommendations();
  const recommendations = getRecommendationsByZone(zoneId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-100';
      case 'medium': return 'bg-yellow-500/20 text-yellow-100';
      case 'low': return 'bg-green-500/20 text-green-100';
      default: return 'bg-gray-500/20 text-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Prioritate înaltă';
      case 'medium': return 'Prioritate medie';
      case 'low': return 'Prioritate scăzută';
      default: return 'Prioritate normală';
    }
  };

  return (
    <Card 
      className={`bg-gradient-to-r ${gradientClass} text-white border-0`}
      data-ai-zone={zoneId}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshRecommendations}
          disabled={isLoading}
          className="text-white hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 rounded-lg p-3 animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/15 rounded mb-1"></div>
                <div className="h-3 bg-white/15 rounded w-3/4"></div>
              </div>
            ))}
          </>
        ) : recommendations.length > 0 ? (
          // AI recommendations
          recommendations.map((recommendation) => (
            <div key={recommendation.id} className="bg-white/10 rounded-lg p-3 relative">
              {recommendation.isNew && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium">{recommendation.title}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(recommendation.priority)} border-white/20`}
                >
                  {getPriorityText(recommendation.priority)}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed">{recommendation.content}</p>
              <div className="mt-2 text-xs text-white/70">
                {new Date(recommendation.timestamp).toLocaleString('ro-RO', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))
        ) : (
          // No recommendations available
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-sm font-medium mb-1">Fără recomandări disponibile</p>
            <p className="text-xs">
              Sistemul AI va genera recomandări personalizate pe baza activității tale.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsCard;
