import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/apiServices';
import { 
    RocketLaunchIcon, 
    ArrowLeftIcon,
    MicrophoneIcon
} from '@heroicons/react/24/outline';

const CurriculumView = () => {
  const { roleName } = useParams();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setLoading(true);
        const data = await jobService.getInDepthCurriculum(roleName);
        setCurriculum(data);
      } catch (err) {
        setError('Failed to fetch the in-depth curriculum. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (roleName) {
      fetchCurriculum();
    }
  }, [roleName]);

  if (loading) return (
    <div className="container animate-in" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: '40px', width: '400px', margin: '0 auto 2rem' }}></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Scanning global learning repositories for {roleName}...</p>
      <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div className="card" style={{ height: '120px' }}></div>
        <div className="card" style={{ height: '120px' }}></div>
        <div className="card" style={{ height: '120px' }}></div>
      </div>
    </div>
  );

  return (
    <div className="container animate-in" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <button 
            className="btn" 
            style={{ color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => navigate('/dashboard')}
        >
            <ArrowLeftIcon style={{ width: '1.25rem' }} /> Back to Dashboard
        </button>
        <span style={{ 
            color: 'var(--primary)', fontWeight: '900', letterSpacing: '0.1em', 
            fontSize: '0.8rem', textTransform: 'uppercase' 
        }}>Curated Masterclass</span>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '3rem' }}>
          <strong>Resource Fetch Error:</strong> {error}
        </div>
      )}

      {curriculum && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          <header style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{curriculum.jobTitle}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
              A precision-engineered chronological learning path. Level up from fundamental concepts to enterprise-grade expertise using the industry's best free resources.
            </p>
          </header>

          <div style={{ 
            position: 'relative', 
            paddingLeft: '4rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Precision Timeline Line */}
            <div style={{ 
                position: 'absolute', left: '1rem', top: '1rem', bottom: '1rem', 
                width: '4px', background: 'var(--border-light)', borderRadius: '2px' 
            }}></div>
            
            {curriculum.roadmap.map((step, index) => (
              <div key={index} className="animate-in" style={{ position: 'relative', marginBottom: '4rem', animationDelay: `${index * 150}ms` }}>
                {/* Timeline Orb */}
                <div style={{ 
                    position: 'absolute', left: '-3.75rem', top: '0.25rem', 
                    width: '2rem', height: '2rem', borderRadius: '50%', 
                    background: 'var(--primary)', border: '4px solid var(--bg-main)',
                    boxShadow: 'var(--shadow-md)', zIndex: 1
                }}></div>

                <div className="card" style={{ padding: '2.5rem', transition: 'all 0.4s var(--ease-out-expo)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <span style={{ 
                            background: 'var(--primary-light)', color: 'var(--primary)', 
                            padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', 
                            fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase'
                        }}>
                            Module {String(index + 1).padStart(2, '0')}: {step.skill}
                        </span>
                        <span style={{ opacity: 0.3, fontWeight: '900', fontSize: '1.5rem' }}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.8' }}>
                        Master this module to unlock the next phase of your {curriculum.jobTitle} journey. This resource provides the depth required for technical interviews.
                    </p>
                    
                    <a 
                      href={step.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
                    >
                      <RocketLaunchIcon style={{ width: '1.25rem' }} /> Access Learning Module
                    </a>
                </div>
              </div>
            ))}
          </div>

          <footer style={{ textAlign: 'center', padding: '5rem 0', borderTop: '1px solid var(--border-light)' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Ready to validate your progress?</h3>
            <button className="btn" style={{ background: 'var(--secondary)', color: 'white', padding: '1.25rem 3rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }} onClick={() => navigate('/ai-interview', { state: { skill: { name: curriculum.jobTitle } } })}>
                <MicrophoneIcon style={{ width: '1.5rem' }} /> Start Proficiency Interview
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default CurriculumView;
