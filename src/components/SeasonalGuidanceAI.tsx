
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Snowflake, Sun, Leaf, Calendar, RefreshCw } from 'lucide-react';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

const SeasonalGuidanceAI = () => {
  const { getRecommendationsByZone, isLoading, refreshRecommendations } = useAIRecommendations();
  const seasonalRecommendations = getRecommendationsByZone('ai-seasonal-guidance');

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return { name: 'Primăvara', icon: <Leaf className="h-5 w-5 text-green-600" />, color: 'bg-green-100 text-green-800 border-green-200' };
    if (month >= 5 && month <= 7) return { name: 'Vara', icon: <Sun className="h-5 w-5 text-yellow-600" />, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (month >= 8 && month <= 10) return { name: 'Toamna', icon: <Calendar className="h-5 w-5 text-orange-600" />, color: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { name: 'Iarna', icon: <Snowflake className="h-5 w-5 text-blue-600" />, color: 'bg-blue-100 text-blue-800 border-blue-200' };
  };

  const currentSeason = getCurrentSeason();

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Prioritate Mare</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Prioritate Medie</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Prioritate Scăzută</Badge>;
      default:
        return <Badge variant="secondary">Necunoscut</Badge>;
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-green-200" data-ai-zone="ai-seasonal-guidance">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-800 flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Ghid Sezonier</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={`${currentSeason.color} flex items-center space-x-1`}>
              {currentSeason.icon}
              <span>{currentSeason.name}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshRecommendations}
              disabled={isLoading}
              className="text-green-700 hover:bg-green-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 font-medium mb-1">
            🤖 Recomandări AI pentru {currentSeason.name.toLowerCase()}:
          </p>
          <p className="text-xs text-blue-700">
            Pe baza sezonului actual și a datelor fermei, iată activitățile recomandate:
          </p>
        </div>

        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </>
        ) : seasonalRecommendations.length > 0 ? (
          seasonalRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 relative">
              {recommendation.isNew && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                {getPriorityBadge(recommendation.priority)}
              </div>
              <p className="text-sm text-gray-600 mb-3">{recommendation.content}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {recommendation.type === 'seasonal' ? 'Sezonier' : 'General'}
                </Badge>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Planifică activitatea
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm font-medium mb-1">Fără recomandări disponibile</p>
            <p className="text-xs text-gray-600">
              Sistemul AI va genera recomandări sezoniere personalizate pe baza activității fermei.
            </p>
          </div>
        )}

        <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white">
          Vezi toate recomandările AI
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeasonalGuidanceAI;
