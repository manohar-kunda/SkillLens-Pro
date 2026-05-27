/**
 * -----------------------------------------------------------------------------
 * File: Confetti.jsx
 * Component: React UI Micro-Animation Component
 * Purpose: Renders a lightweight, high-performance, visually stunning cascading 
 *          confetti shower to celebrate accomplishments (e.g. passing career quizzes).
 *
 * Responsibilities:
 * - Generate a coordinate array of 150 randomized particles with custom left-offsets, 
 *   animation delays, drop durations, color styling classes, and rotational matrices.
 * - Inject active inline CSS transitions triggering hardware-accelerated transforms.
 * - Establish an automatic 6-second garbage-collection cleanup timer that clears the 
 *   particles array to prevent memory leaks and unnecessary canvas rendering workloads.
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

import React, { useEffect, useState } from 'react';

/**
 * Confetti celebration visual effect component.
 *
 * @param {Object} props - React component props.
 * @param {boolean} props.active - Controls whether the visual celebration is triggered.
 * @returns {React.ReactElement|null} CSS animation container element, or null if inactive.
 */
const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);

  // React layout side-effect: Builds or clears the celebration particles catalog
  useEffect(() => {
    if (active) {
      // Procedurally generate particles parameters with structural entropy to ensure unique patterns
      const newParticles = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // Horizontal percentage offset
        delay: Math.random() * 3, // Staggered drop delays preventing massive startup CPU spikes
        duration: 2 + Math.random() * 3, // Varied rates of descent
        type: Math.floor(Math.random() * 4) + 1, // Determines color mappings from index CSS
        rotation: Math.random() * 360 // Startup orientation angle
      }));
      setParticles(newParticles);
      
      // Auto-collection cleanup timer to restore memory resources after completion
      const timer = setTimeout(() => setParticles([]), 6000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  // Render shield: Prevent DOM bloating when not active or after animation completion
  if (!active || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map(p => (
        <div 
          key={p.id}
          className={`confetti p${p.type}`}
          style={{
            left: `${p.left}%`,
            // Harnesses browser compositing layers using transform and transitions declarations
            animation: `confetti-fall ${p.duration}s var(--ease-out-expo) ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
