import React, { useEffect, useState } from 'react';

const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        type: Math.floor(Math.random() * 4) + 1,
        rotation: Math.random() * 360
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 6000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map(p => (
        <div 
          key={p.id}
          className={`confetti p${p.type}`}
          style={{
            left: `${p.left}%`,
            animation: `confetti-fall ${p.duration}s var(--ease-out-expo) ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
