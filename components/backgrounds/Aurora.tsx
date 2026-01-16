'use client';

export default function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="aurora-light aurora-1"></div>
      <div className="aurora-light aurora-2"></div>
      <div className="aurora-light aurora-3"></div>
      <div className="aurora-light aurora-4"></div>
      <div className="aurora-light aurora-5"></div>
      <div className="aurora-light aurora-6"></div>

      <style jsx>{`
        .aurora-light {
          position: absolute;
          width: 150%;
          height: 150%;
          filter: blur(80px);
          opacity: 0.35;
          mix-blend-mode: screen;
        }

        .aurora-1 {
          background: linear-gradient(60deg,
            rgba(0, 255, 200, 0.4) 0%,
            rgba(100, 200, 255, 0.3) 50%,
            transparent 100%);
          animation: aurora-flow-1 16s ease-in-out infinite;
          top: -20%;
          left: -10%;
        }

        .aurora-2 {
          background: linear-gradient(-60deg,
            rgba(255, 100, 200, 0.4) 0%,
            rgba(200, 100, 255, 0.3) 50%,
            transparent 100%);
          animation: aurora-flow-2 20s ease-in-out infinite;
          animation-delay: -4s;
          top: -15%;
          right: -10%;
        }

        .aurora-3 {
          background: linear-gradient(120deg,
            rgba(100, 255, 150, 0.35) 0%,
            rgba(150, 255, 200, 0.3) 50%,
            transparent 100%);
          animation: aurora-flow-3 24s ease-in-out infinite;
          animation-delay: -8s;
          bottom: -20%;
          left: -15%;
        }

        .aurora-4 {
          background: linear-gradient(-120deg,
            rgba(255, 200, 100, 0.35) 0%,
            rgba(255, 150, 200, 0.3) 50%,
            transparent 100%);
          animation: aurora-flow-4 18s ease-in-out infinite;
          animation-delay: -12s;
          bottom: -15%;
          right: -10%;
        }

        .aurora-5 {
          background: radial-gradient(ellipse at center,
            rgba(150, 150, 255, 0.4) 0%,
            rgba(200, 100, 255, 0.3) 30%,
            transparent 70%);
          animation: aurora-pulse-1 14s ease-in-out infinite;
          animation-delay: -6s;
          top: 20%;
          left: 30%;
        }

        .aurora-6 {
          background: radial-gradient(ellipse at center,
            rgba(100, 255, 255, 0.35) 0%,
            rgba(150, 200, 255, 0.3) 30%,
            transparent 70%);
          animation: aurora-pulse-2 17s ease-in-out infinite;
          animation-delay: -10s;
          bottom: 25%;
          right: 35%;
        }

        @keyframes aurora-flow-1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(8%, -12%) rotate(5deg) scale(1.15);
          }
          66% {
            transform: translate(-8%, 8%) rotate(-3deg) scale(0.95);
          }
        }

        @keyframes aurora-flow-2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-10%, 10%) rotate(-8deg) scale(1.1);
          }
          66% {
            transform: translate(10%, -8%) rotate(5deg) scale(0.9);
          }
        }

        @keyframes aurora-flow-3 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(6%, 10%) rotate(4deg) scale(1.12);
          }
        }

        @keyframes aurora-flow-4 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-7%, -9%) rotate(-6deg) scale(1.08);
          }
        }

        @keyframes aurora-pulse-1 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes aurora-pulse-2 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.45;
          }
        }
      `}</style>
    </div>
  );
}
