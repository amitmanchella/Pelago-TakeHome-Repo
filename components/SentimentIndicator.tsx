'use client';

import { SentimentType } from '@/lib/types';

interface SentimentIndicatorProps {
  sentiment: SentimentType | null;
  isAnalyzing: boolean;
  glassClass: string;
}

const sentimentConfig = {
  happy: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Feeling Happy',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-400/40',
    textColor: 'text-green-800',
    glowColor: 'shadow-green-400/30',
  },
  sad: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Feeling Sad',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/40',
    textColor: 'text-blue-800',
    glowColor: 'shadow-blue-400/30',
  },
  angry: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l2-2m6 2l-2-2" />
      </svg>
    ),
    label: 'Feeling Frustrated',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-400/40',
    textColor: 'text-red-800',
    glowColor: 'shadow-red-400/30',
  },
};

export default function SentimentIndicator({
  sentiment,
  isAnalyzing,
  glassClass,
}: SentimentIndicatorProps) {
  if (!sentiment && !isAnalyzing) {
    return null;
  }

  if (isAnalyzing) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 ${glassClass} rounded-full transition-all duration-500 ease-in-out`}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-sm font-medium text-gray-700">Sensing mood...</span>
      </div>
    );
  }

  if (!sentiment) {
    return null;
  }

  const config = sentimentConfig[sentiment];

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 ${config.bgColor} ${config.borderColor} border backdrop-blur-md rounded-full shadow-lg ${config.glowColor} transition-all duration-500 ease-in-out animate-sentiment-appear`}
    >
      <div className={`${config.textColor} animate-sentiment-icon`}>
        {config.icon}
      </div>
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.label}
      </span>

      <style jsx>{`
        @keyframes sentiment-appear {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes sentiment-icon {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-sentiment-appear {
          animation: sentiment-appear 0.4s ease-out;
        }

        .animate-sentiment-icon {
          animation: sentiment-icon 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
