'use client';

import { SentimentAnalysisResult, SentimentType } from '@/lib/types';

interface SentimentIndicatorProps {
  sentiment: SentimentAnalysisResult | null;
  isLoading: boolean;
  glassClass: string;
}

const SENTIMENT_CONFIG: Record<SentimentType, { color: string; icon: string; label: string }> = {
  positive: {
    color: 'bg-green-500/30 border-green-500/50',
    icon: '😊',
    label: 'Positive',
  },
  negative: {
    color: 'bg-red-500/30 border-red-500/50',
    icon: '😔',
    label: 'Negative',
  },
  neutral: {
    color: 'bg-gray-500/30 border-gray-500/50',
    icon: '😐',
    label: 'Neutral',
  },
  mixed: {
    color: 'bg-yellow-500/30 border-yellow-500/50',
    icon: '🤔',
    label: 'Mixed',
  },
};

export default function SentimentIndicator({
  sentiment,
  isLoading,
  glassClass,
}: SentimentIndicatorProps) {
  if (!sentiment && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 px-4 py-2 ${glassClass} rounded-xl border border-white/30`}>
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-700">Analyzing sentiment...</span>
      </div>
    );
  }

  if (!sentiment) {
    return null;
  }

  const config = SENTIMENT_CONFIG[sentiment.sentiment];
  const confidencePercent = Math.round(sentiment.confidence * 100);

  return (
    <div className={`flex items-center gap-3 px-4 py-2 ${config.color} backdrop-blur-md rounded-xl border`}>
      <span className="text-xl">{config.icon}</span>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{config.label}</span>
          <span className="text-xs text-gray-700">({confidencePercent}% confidence)</span>
        </div>
        <span className="text-xs text-gray-700 line-clamp-1">{sentiment.summary}</span>
      </div>
    </div>
  );
}
