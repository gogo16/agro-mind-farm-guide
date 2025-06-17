
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

const MarketInsights = () => {
  const { getRecommendationsByZone, isLoading } = useAIRecommendations();
  const marketInsights = getRecommendationsByZone('ai-market-insights');

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0" data-ai-zone="ai-market-insights">
        <CardHeader>
          <CardTitle>📈 Perspective Piață</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white/10 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/15 rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0" data-ai-zone="ai-market-insights">
      <CardHeader>
        <CardTitle>📈 Perspective Piață</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {marketInsights.length > 0 ? (
          marketInsights.map((insight) => (
            <div key={insight.id} className="bg-white/10 rounded-lg p-3 relative">
              {insight.isNew && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              )}
              <p className="text-sm font-medium mb-1">{insight.title}</p>
              <p className="text-xs">{insight.content}</p>
              {insight.priority === 'high' && (
                <div className="mt-2">
                  <span className="text-xs bg-red-500/20 text-red-100 px-2 py-1 rounded">Urgent</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Analiză în curs</p>
            <p className="text-xs">
              Sistemul AI analizează datele de piață pentru a genera perspective personalizate.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
