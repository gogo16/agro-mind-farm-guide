
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { useAIRecommendations, AIRecommendation } from '@/hooks/useAIRecommendations';

interface AIRecommendationsCardProps {
  zoneId: 'ai-financial-tips' | 'ai-inventory-recommendations' | 'ai-soil-recommendations' | 'ai-seasonal-guidance' | 'ai-field-status' | 'ai-season-progress' | 'ai-crop-rotation' | 'ai-equipment-maintenance' | 'ai-seasonal-planning' | 'ai-analytics';
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

  return (
    <Card className="bg-white border-green-200">
      <CardHeader className={`bg-gradient-to-r ${gradientClass} text-white`}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshRecommendations}
            disabled={isLoading}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6" data-ai-zone={zoneId}>
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {getPriorityText(recommendation.priority)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {recommendation.content}
                </p>
                {recommendation.isNew && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Nou
                  </Badge>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nu există recomandări disponibile</p>
              <p className="text-sm">Recomandările AI vor apărea aici</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsCard;
