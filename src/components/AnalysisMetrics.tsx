import { motion } from 'framer-motion';
import { Activity, TrendingUp, AlertTriangle, Target, Zap, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { type AnalysisResult } from '@/utils/poseAnalyzer';

interface AnalysisMetricsProps {
  results: AnalysisResult[];
  currentFrame: number;
  onFrameChange: (frame: number) => void;
}

export default function AnalysisMetrics({ results, currentFrame, onFrameChange }: AnalysisMetricsProps) {
  if (results.length === 0) return null;

  const current = results[currentFrame] || results[0];
  const { metrics } = current;

  // Calculate averages
  const avgMetrics = results.reduce((acc, result) => {
    acc.speed += result.metrics.speed;
    acc.jumpHeight += result.metrics.jumpHeight;
    acc.cadence += result.metrics.cadence;
    acc.agilityScore += result.metrics.agilityScore;
    return acc;
  }, { speed: 0, jumpHeight: 0, cadence: 0, agilityScore: 0 });

  Object.keys(avgMetrics).forEach(key => {
    avgMetrics[key as keyof typeof avgMetrics] /= results.length;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Frame Control */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Frame Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Frame: {currentFrame + 1}</span>
              <span>Total: {results.length}</span>
            </div>
            <Slider
              value={[currentFrame]}
              onValueChange={([value]) => onFrameChange(value)}
              max={results.length - 1}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-electric-blue" />
                <span className="font-medium">Speed</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-electric-blue">
                  {metrics.speed.toFixed(1)} m/s
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg: {avgMetrics.speed.toFixed(1)} m/s
                </div>
              </div>
            </div>
            <Progress value={Math.min(metrics.speed * 10, 100)} className="h-2" />
          </div>

          {/* Jump Height */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neon-green" />
                <span className="font-medium">Jump Height</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-neon-green">
                  {metrics.jumpHeight.toFixed(1)} cm
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg: {avgMetrics.jumpHeight.toFixed(1)} cm
                </div>
              </div>
            </div>
            <Progress value={Math.min(metrics.jumpHeight * 2, 100)} className="h-2" />
          </div>

          {/* Cadence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="font-medium">Cadence</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-400">
                  {metrics.cadence.toFixed(0)} spm
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg: {avgMetrics.cadence.toFixed(0)} spm
                </div>
              </div>
            </div>
            <Progress value={Math.min(metrics.cadence / 2, 100)} className="h-2" />
          </div>

          {/* Agility Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="font-medium">Agility Score</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-400">
                  {metrics.agilityScore.toFixed(1)}/100
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg: {avgMetrics.agilityScore.toFixed(1)}/100
                </div>
              </div>
            </div>
            <Progress value={metrics.agilityScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Injury Risk Assessment */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Injury Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Risk */}
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <span className="font-medium">Overall Risk</span>
            <Badge variant={getRiskBadgeVariant(metrics.injuryRisk.overall)}>
              {metrics.injuryRisk.overall.toUpperCase()}
            </Badge>
          </div>

          {/* Risk Areas */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(metrics.injuryRisk.areas).map(([area, risk]) => (
              <div key={area} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{area}</span>
                  <span className={`text-sm font-bold ${getRiskColor(
                    risk > 50 ? 'high' : risk > 25 ? 'medium' : 'low'
                  )}`}>
                    {risk.toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={risk} 
                  className="h-2"
                />
              </div>
            ))}
          </div>

          {/* Risk Recommendations */}
          <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <h4 className="font-medium text-orange-400 mb-2">Recommendations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {metrics.injuryRisk.overall === 'high' && (
                <>
                  <li>• Consider reducing training intensity</li>
                  <li>• Focus on proper form and technique</li>
                  <li>• Consult with a sports physiotherapist</li>
                </>
              )}
              {metrics.injuryRisk.overall === 'medium' && (
                <>
                  <li>• Monitor form during training</li>
                  <li>• Include strengthening exercises</li>
                  <li>• Ensure adequate rest between sessions</li>
                </>
              )}
              {metrics.injuryRisk.overall === 'low' && (
                <>
                  <li>• Maintain current training routine</li>
                  <li>• Continue monitoring technique</li>
                  <li>• Gradually increase intensity as needed</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}