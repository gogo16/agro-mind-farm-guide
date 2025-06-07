
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Snowflake, Sun, Leaf, Calendar } from 'lucide-react';

const SeasonalGuidanceAI = () => {
  const [currentSeason, setCurrentSeason] = useState('');
  const [seasonalTips, setSeasonalTips] = useState<Array<{
    id: number;
    title: string;
    description: string;
    priority: string;
    category: string;
  }>>([]);

  useEffect(() => {
    const getCurrentSeason = () => {
      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) return 'spring';
      if (month >= 5 && month <= 7) return 'summer';
      if (month >= 8 && month <= 10) return 'autumn';
      return 'winter';
    };

    const season = getCurrentSeason();
    setCurrentSeason(season);

    const tips = {
      spring: [
        {
          id: 1,
          title: 'Pregătirea solului pentru semănat',
          description: 'Verifică umiditatea solului și planifică aratul de primăvară',
          priority: 'high',
          category: 'Lucrări sol'
        },
        {
          id: 2,
          title: 'Tratamente preventive',
          description: 'Aplică tratamente fungicide preventive pe culturile de toamnă',
          priority: 'medium',
          category: 'Protecția plantelor'
        }
      ],
      summer: [
        {
          id: 1,
          title: 'Monitorizarea irigației',
          description: 'Verifică sistemul de irigare și optimizează programul',
          priority: 'high',
          category: 'Irigații'
        },
        {
          id: 2,
          title: 'Controlul dăunătorilor',
          description: 'Monitorizează și tratează eventualele atacuri de dăunători',
          priority: 'high',
          category: 'Protecția plantelor'
        }
      ],
      autumn: [
        {
          id: 1,
          title: 'Pregătirea pentru recoltare',
          description: 'Verifică echipamentele de recoltare și planifică logistica',
          priority: 'high',
          category: 'Recoltare'
        },
        {
          id: 2,
          title: 'Semănatul culturilor de toamnă',
          description: 'Planifică și execută semănatul grâului de toamnă',
          priority: 'medium',
          category: 'Semănat'
        }
      ],
      winter: [
        {
          id: 1,
          title: 'Întreținerea echipamentelor',
          description: 'Efectuează revizia și reparațiile la tractoare și utilaje',
          priority: 'medium',
          category: 'Întreținere'
        },
        {
          id: 2,
          title: 'Planificarea sezonului următor',
          description: 'Analizează rezultatele anului și planifică culturile pentru anul următor',
          priority: 'low',
          category: 'Planificare'
        }
      ]
    };

    setSeasonalTips(tips[season as keyof typeof tips] || []);
  }, []);

  const getSeasonIcon = () => {
    switch (currentSeason) {
      case 'spring': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'summer': return <Sun className="h-5 w-5 text-yellow-600" />;
      case 'autumn': return <Calendar className="h-5 w-5 text-orange-600" />;
      case 'winter': return <Snowflake className="h-5 w-5 text-blue-600" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getSeasonName = () => {
    switch (currentSeason) {
      case 'spring': return 'Primăvara';
      case 'summer': return 'Vara';
      case 'autumn': return 'Toamna';
      case 'winter': return 'Iarna';
      default: return '';
    }
  };

  const getSeasonColor = () => {
    switch (currentSeason) {
      case 'spring': return 'bg-green-100 text-green-800 border-green-200';
      case 'summer': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'autumn': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'winter': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
    <Card className="bg-white/90 backdrop-blur-sm border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-800 flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Ghid Sezonier</span>
          </CardTitle>
          <Badge className={`${getSeasonColor()} flex items-center space-x-1`}>
            {getSeasonIcon()}
            <span>{getSeasonName()}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 font-medium mb-1">
            🤖 Recomandări AI pentru {getSeasonName().toLowerCase()}:
          </p>
          <p className="text-xs text-blue-700">
            Pe baza sezonului actual și a datelor fermei, iată activitățile recomandate:
          </p>
        </div>

        {seasonalTips.map((tip) => (
          <div key={tip.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{tip.title}</h4>
              {getPriorityBadge(tip.priority)}
            </div>
            <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {tip.category}
              </Badge>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Planifică activitatea
              </Button>
            </div>
          </div>
        ))}

        <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white">
          Vezi toate recomandările AI
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeasonalGuidanceAI;
