'use client';

export default function Waves() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="wave wave-1"></div>
      <div className="wave wave-2"></div>
      <div className="wave wave-3"></div>
      <div className="wave wave-4"></div>
      <div className="wave wave-5"></div>

      <style jsx>{`
        .wave {
          position: absolute;
          width: 200%;
          height: 200%;
          opacity: 0.25;
        }

        .wave-1 {
          background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 50%);
          animation: wave-flow-1 18s ease-in-out infinite;
        }

        .wave-2 {
          background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
          animation: wave-flow-2 22s ease-in-out infinite;
          animation-delay: -4s;
        }

        .wave-3 {
          background: radial-gradient(ellipse 90% 45% at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
          animation: wave-flow-3 26s ease-in-out infinite;
          animation-delay: -8s;
        }

        .wave-4 {
          background: radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255, 255, 255, 0.35) 0%, transparent 50%);
          animation: wave-flow-4 20s ease-in-out infinite;
          animation-delay: -12s;
        }

        .wave-5 {
          background: radial-gradient(ellipse 85% 55% at 50% 50%, rgba(255, 255, 255, 0.25) 0%, transparent 50%);
          animation: wave-flow-5 24s ease-in-out infinite;
          animation-delay: -16s;
        }

        @keyframes wave-flow-1 {
          0%, 100% {
            transform: translate(-25%, -25%) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-30%, -20%) rotate(60deg) scale(1.1);
          }
          66% {
            transform: translate(-20%, -30%) rotate(120deg) scale(0.9);
          }
        }

        @keyframes wave-flow-2 {
          0%, 100% {
            transform: translate(-20%, -35%) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-35%, -25%) rotate(-60deg) scale(1.15);
          }
          66% {
            transform: translate(-25%, -35%) rotate(-120deg) scale(0.95);
          }
        }

        @keyframes wave-flow-3 {
          0%, 100% {
            transform: translate(-30%, -20%) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-20%, -30%) rotate(90deg) scale(1.1);
          }
        }

        @keyframes wave-flow-4 {
          0%, 100% {
            transform: translate(-22%, -28%) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-28%, -22%) rotate(45deg) scale(0.9);
          }
          66% {
            transform: translate(-32%, -32%) rotate(90deg) scale(1.05);
          }
        }

        @keyframes wave-flow-5 {
          0%, 100% {
            transform: translate(-28%, -25%) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-25%, -28%) rotate(-90deg) scale(1.12);
          }
        }
      `}</style>
    </div>
  );
}
