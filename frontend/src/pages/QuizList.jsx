import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { 
    AcademicCapIcon, 
    BriefcaseIcon, 
    RocketLaunchIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const QuizList = () => {
    const { isDarkMode } = useTheme();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get('/quizzes/all');
                setQuizzes(res.data);
            } catch (err) {
                console.error("Failed to fetch quizzes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const handleAttemptClick = (skill) => {
        setSelectedSkill(skill);
        setShowModal(true);
    };

    const startQuiz = (level) => {
        navigate('/interview', { 
            state: { 
                skill: selectedSkill, 
                selectedDiff: level 
            } 
        });
        setShowModal(false);
    };

  if (loading) return (
    <div className="container animate-in" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: '40px', width: '300px', margin: '0 auto 1.5rem' }}></div>
      <div className="skeleton" style={{ height: '20px', width: '60%', margin: '0 auto 4rem' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card" style={{ height: '320px' }}></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container animate-in" style={{ padding: '4rem 2rem', maxWidth: '1200px' }}>
      <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <span style={{ 
            color: 'var(--primary)', fontWeight: '900', letterSpacing: '0.1em', 
            fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' 
        }}>PROVING GROUNDS</span>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Assessment Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
            Validate your technical proficiency through high-fidelity simulations. Select a domain to begin your certification journey.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {quizzes.map((quiz, idx) => (
          <div key={idx} className="card animate-in" style={{ 
            padding: '3rem 2.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            animationDelay: `${idx * 100}ms`
          }}>
            <div style={{ 
                width: '64px', height: '64px', borderRadius: '1rem', 
                background: 'var(--primary-light)', color: 'var(--primary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '2rem', fontWeight: '900', marginBottom: '2rem',
                boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.2)'
            }}>
                {quiz.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                {quiz.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', flex: 1 }}>
                A comprehensive technical evaluation covering core principles and industry best practices for {quiz.name} ecosystems.
            </p>
            <button 
                className="btn btn-primary" 
                style={{ marginTop: '2.5rem', padding: '1rem' }}
                onClick={() => handleAttemptClick(quiz)}
            >
                Initialize Assessment
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ 
            position: 'fixed', inset: 0, background: 'rgba(5, 8, 15, 0.8)', 
            backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', z_index: 2000, padding: '2rem' 
        }}>
          <div className="card animate-in" style={{ 
            width: '100%', maxWidth: '500px', padding: '3.5rem 3rem', 
            background: 'var(--bg-card)', border: '1px solid var(--border-light)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Configuration</span>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <XMarkIcon style={{ width: '1.5rem' }} />
                </button>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Set Complexity</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: '500' }}>
                Adjust the simulation difficulty to match your current proficiency level.
            </p>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
                <button 
                    className="btn" 
                    style={{ 
                        padding: '1.5rem', textAlign: 'left', fontWeight: '700', 
                        background: 'rgba(16, 185, 129, 0.05)', color: '#10B981', 
                        border: '1px solid rgba(16, 185, 129, 0.2)' 
                    }} 
                    onClick={() => startQuiz('Easy')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AcademicCapIcon style={{ width: '1.5rem' }} /> Foundational (Easy)
                    </div>
                </button>
                <button 
                    className="btn" 
                    style={{ 
                        padding: '1.5rem', textAlign: 'left', fontWeight: '700', 
                        background: 'rgba(245, 158, 11, 0.05)', color: '#F59E0B', 
                        border: '1px solid rgba(245, 158, 11, 0.2)' 
                    }} 
                    onClick={() => startQuiz('Medium')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <BriefcaseIcon style={{ width: '1.5rem' }} /> Professional (Medium)
                    </div>
                </button>
                <button 
                    className="btn" 
                    style={{ 
                        padding: '1.5rem', textAlign: 'left', fontWeight: '700', 
                        background: 'rgba(239, 68, 68, 0.05)', color: '#EF4444', 
                        border: '1px solid rgba(239, 68, 68, 0.2)' 
                    }} 
                    onClick={() => startQuiz('Hard')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <RocketLaunchIcon style={{ width: '1.5rem' }} /> Enterprise Layer (Hard)
                    </div>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
    quizCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        height: '100%',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)'
    },
    iconBox: {
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
    },
    attemptBtn: {
        marginTop: '1.5rem',
        padding: '0.8rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
    },
    modalContent: {
        width: '90%',
        maxWidth: '450px',
        padding: '2rem'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#9CA3AF'
    },
    levelBtn: {
        padding: '1rem',
        textAlign: 'left',
        fontSize: '1rem',
        fontWeight: '500',
        background: 'white',
        borderWidth: '1px'
    }
};

export default QuizList;
