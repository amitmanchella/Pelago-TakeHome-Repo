'use client';

export default function Particles() {
  const particleCount = 50;

  const particles = Array.from({ length: particleCount }).map(() => ({
    left: Math.random() * 100,
    startY: 100 + Math.random() * 20,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 20,
    duration: Math.random() * 15 + 20,
    drift: Math.random() * 100 - 50,
    opacity: Math.random() * 0.4 + 0.3,
    blur: Math.random() * 3 + 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${particle.left}%`,
            bottom: `-${particle.startY}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            '--drift': `${particle.drift}px`,
            '--opacity': particle.opacity,
            filter: `blur(${particle.blur}px)`,
          } as any}
        />
      ))}

      <style jsx>{`
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(255, 255, 255, var(--opacity)) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 50%;
          animation: float-particle linear infinite;
          pointer-events: none;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(-100vh - 200px)) translateX(var(--drift)) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
