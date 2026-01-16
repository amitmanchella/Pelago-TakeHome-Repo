'use client';

import { EndOfConversationScreen as EndScreenData } from '@/lib/types';

interface EndOfConversationScreenProps {
  data: EndScreenData;
  onStartNew: () => void;
  onClose: () => void;
  glassClass: string;
}

export default function EndOfConversationScreen({
  data,
  onStartNew,
  onClose,
  glassClass,
}: EndOfConversationScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
      <div className="max-w-2xl w-full bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl p-10 space-y-8 animate-fade-in shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Hero Section with Icon */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/40 to-white/20 rounded-full mb-2 animate-pulse-slow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">Thank you for sharing</h2>
          <div className="inline-block px-5 py-2 bg-white/35 backdrop-blur-sm rounded-full text-sm font-medium border border-white/40">
            You're feeling <span className="font-semibold">{data.emotionalTone}</span>
          </div>
        </div>

        {/* Validation - Larger, centered */}
        <div className="text-center px-6">
          <p className="text-xl font-medium leading-relaxed">{data.validation}</p>
        </div>

        {/* Visual Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-white/60"></div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        </div>

        {/* Grid Layout for Reflection and Themes */}
        <div className="grid gap-4">
          {/* Reflection Card with Icon */}
          <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">What we explored</h3>
                <p className="text-base leading-relaxed">{data.reflection}</p>
              </div>
            </div>
          </div>

          {/* Themes - Visual Pills */}
          {data.themes && data.themes.length > 0 && (
            <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70">Conversation themes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.themes.map((theme, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-white/35 backdrop-blur-sm rounded-full text-sm font-medium border border-white/40"
                  >
                    {theme}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Moment - If exists, make it special */}
        {data.keyMoment && (
          <div className="relative bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-white/60 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70">A moment that stood out</h3>
              </div>
              <p className="text-base italic leading-relaxed">{data.keyMoment}</p>
            </div>
          </div>
        )}

        {/* Encouragement - Big and bold */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-2xl font-semibold leading-relaxed">{data.encouragement}</p>
          {data.suggestedNextStep && (
            <p className="text-sm opacity-75 italic">{data.suggestedNextStep}</p>
          )}
        </div>

        {/* Actions - More prominent */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={onStartNew}
            className="relative overflow-hidden py-4 px-6 bg-gradient-to-r from-white/50 to-white/40 backdrop-blur-sm rounded-xl hover:from-white/60 hover:to-white/50 transition-all duration-300 font-bold border-2 border-white/60 hover:border-white/80 hover:scale-110 transform shadow-lg hover:shadow-2xl animate-pulse-glow group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            <span className="relative flex items-center justify-center gap-2">
              <span className="text-2xl animate-spin-slow">✨</span>
              <span>Start New Chat</span>
              <span className="text-2xl animate-spin-slow-reverse">✨</span>
            </span>
          </button>
          <button
            onClick={onClose}
            className="py-4 px-6 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition border border-white/30 hover:scale-105 transform"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          display: inline-block;
          animation: spin-slow 4s linear infinite;
        }

        .animate-spin-slow-reverse {
          display: inline-block;
          animation: spin-slow-reverse 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
