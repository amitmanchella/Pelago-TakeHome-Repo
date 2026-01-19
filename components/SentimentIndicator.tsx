'use client';

import { SentimentType } from '@/lib/types';

interface SentimentIndicatorProps {
  sentiment: SentimentType | null;
  isLoading: boolean;
}

const sentimentConfig = {
  happy: {
    label: 'Happy',
    emoji: '😊',
    bgColor: 'bg-green-500/30',
    borderColor: 'border-green-400/50',
    textColor: 'text-green-800',
    glowColor: 'shadow-green-400/30',
  },
  sad: {
    label: 'Sad',
    emoji: '😢',
    bgColor: 'bg-blue-500/30',
    borderColor: 'border-blue-400/50',
    textColor: 'text-blue-800',
    glowColor: 'shadow-blue-400/30',
  },
  angry: {
    label: 'Angry',
    emoji: '😠',
    bgColor: 'bg-red-500/30',
    borderColor: 'border-red-400/50',
    textColor: 'text-red-800',
    glowColor: 'shadow-red-400/30',
  },
};

export default function SentimentIndicator({ sentiment, isLoading }: SentimentIndicatorProps) {
  if (!sentiment && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full transition-all duration-500 ease-in-out">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-700">Analyzing mood...</span>
        </div>
      </div>
    );
  }

  const config = sentimentConfig[sentiment!];

  return (
    <div className="flex justify-center mb-4">
      <div
        className={`
          inline-flex items-center gap-2 px-5 py-2.5
          ${config.bgColor} backdrop-blur-md
          border ${config.borderColor}
          rounded-full
          shadow-lg ${config.glowColor}
          transition-all duration-500 ease-in-out
          animate-sentiment-appear
        `}
      >
        <span className="text-xl animate-bounce-gentle">{config.emoji}</span>
        <span className={`text-sm font-semibold ${config.textColor}`}>
          Feeling {config.label}
        </span>
      </div>

      <style jsx>{`
        @keyframes sentiment-appear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(-10px);
          }
          50% {
            transform: scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .animate-sentiment-appear {
          animation: sentiment-appear 0.5s ease-out forwards;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
