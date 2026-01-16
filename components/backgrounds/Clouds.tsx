'use client';

export default function Clouds() {
  const clouds = [
    { top: '10%', delay: 0, duration: 60, size: 1.2 },
    { top: '25%', delay: -15, duration: 70, size: 0.9 },
    { top: '45%', delay: -30, duration: 80, size: 1.4 },
    { top: '60%', delay: -20, duration: 65, size: 1.1 },
    { top: '75%', delay: -40, duration: 75, size: 1.0 },
    { top: '15%', delay: -50, duration: 55, size: 0.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {clouds.map((cloud, i) => (
        <div
          key={i}
          className="cloud-group"
          style={{
            top: cloud.top,
            left: '-400px',
            animationDelay: `${cloud.delay}s`,
            animationDuration: `${cloud.duration}s`,
            transform: `scale(${cloud.size})`,
          }}
        >
          <div className="cloud-part cloud-main"></div>
          <div className="cloud-part cloud-left"></div>
          <div className="cloud-part cloud-right"></div>
          <div className="cloud-part cloud-top"></div>
          <div className="cloud-part cloud-bottom"></div>
        </div>
      ))}

      <style jsx>{`
        .cloud-group {
          position: absolute;
          width: 500px;
          height: 180px;
          animation: float-cloud linear infinite;
        }

        .cloud-part {
          position: absolute;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 70%, transparent 100%);
          border-radius: 50%;
          filter: blur(20px);
        }

        .cloud-main {
          width: 220px;
          height: 80px;
          left: 140px;
          top: 50px;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 60%, transparent 100%);
        }

        .cloud-left {
          width: 180px;
          height: 70px;
          left: 50px;
          top: 60px;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.25) 60%, transparent 100%);
        }

        .cloud-right {
          width: 160px;
          height: 65px;
          left: 270px;
          top: 65px;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.2) 60%, transparent 100%);
        }

        .cloud-top {
          width: 140px;
          height: 90px;
          left: 180px;
          top: 20px;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.25) 60%, transparent 100%);
        }

        .cloud-bottom {
          width: 120px;
          height: 50px;
          left: 140px;
          top: 90px;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.15) 60%, transparent 100%);
        }

        @keyframes float-cloud {
          from {
            transform: translateX(0) translateY(0);
          }
          to {
            transform: translateX(calc(100vw + 600px)) translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
