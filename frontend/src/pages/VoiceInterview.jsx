import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import Confetti from '../components/Confetti';
import { 
    MicrophoneIcon, 
    SparklesIcon, 
    ChartBarIcon, 
    ChevronRightIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const VoiceInterview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    
    const skill = location.state?.skill;
    const [difficulty, setDifficulty] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('selection'); // selection, interview, results
    const [showConfetti, setShowConfetti] = useState(false);
    
    const recognitionRef = useRef(null);
    const finalScore = evaluations.length > 0 
        ? Math.round(evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length * 10)
        : 0;

    useEffect(() => {
        if (!skill) navigate('/dashboard');
    }, [skill, navigate]);

    // Initialize Web Speech API
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            
            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscript(prev => prev + event.results[i][0].transcript + ' ');
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
    }, []);

    const startInterview = async (diff) => {
        setDifficulty(diff);
        setLoading(true);
        try {
            const res = await api.post('/quizzes/ai-interview/questions', 
                { role: skill.name, difficulty: diff.toLowerCase() }
            );
            if (res.data.status === 'success' && res.data.questions?.length > 0) {
                setQuestions(res.data.questions);
                setStep('interview');
            } else {
                alert('Could not load questions for this role. Please try again.');
            }
        } catch (err) {
            console.error('AI Interview Error:', err.response?.data || err.message);
            alert(`Failed to load interview questions: ${err.response?.data?.message || 'Please ensure all services are running.'}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleNextQuestion = async () => {
        if (isListening) recognitionRef.current.stop();
        
        setLoading(true);
        try {
            const res = await api.post('/quizzes/ai-interview/evaluate', 
                { question: questions[currentQuestionIndex], answer: transcript || '(No answer provided)' }
            );
            
            if (res.data.status === 'success') {
                const newEval = res.data.evaluation;
                setEvaluations(prev => [...prev, { ...newEval, question: questions[currentQuestionIndex], answer: transcript }]);
                
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setTranscript('');
                } else {
                    setStep('results');
                    if (finalScore >= 70) setShowConfetti(true);
                }
            }
        } catch (err) {
            console.error('Evaluation Error:', err.response?.data || err.message);
            alert('Failed to evaluate answer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>AI is preparing your interview room...</p>
        </div>
    );

    if (step === 'selection') return (
        <div className="container" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="animate-in">AI Voice Interview: <span style={{ color: 'var(--primary-color)' }}>{skill?.name}</span></h2>
            <div className="card animate-in stagger-1" style={{ marginTop: '2rem', textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-light)', padding: '2rem', borderRadius: '50%', marginBottom: '2rem' }}>
                    <MicrophoneIcon style={{ width: '4rem', color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Choose Your Challenge</h3>
                <p style={{ margin: '1rem 0 3rem', color: 'var(--text-muted)', maxWidth: '450px' }}>
                    Prepare for oral technical questions. You will speak your answers, and the AI will analyze your communication and technical accuracy.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" style={{ backgroundColor: '#10B981', padding: '1rem 2rem' }} onClick={() => startInterview('Easy')}>Beginner</button>
                    <button className="btn btn-primary" style={{ backgroundColor: '#F59E0B', padding: '1rem 2rem' }} onClick={() => startInterview('Medium')}>Professional</button>
                    <button className="btn btn-primary" style={{ backgroundColor: '#EF4444', padding: '1rem 2rem' }} onClick={() => startInterview('Hard')}>Expert</button>
                </div>
            </div>
        </div>
    );

    if (step === 'interview') return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--primary-color)' }}>Level: {difficulty}</span>
            </div>
            
            <div className="card animate-in" style={{ marginTop: '2rem', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>"{questions[currentQuestionIndex]}"</h2>
                
                {/* AI Visualizer Mockup */}
                <div className={`ai-visualizer ${isListening ? 'active' : ''}`} style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
                    boxShadow: isListening ? '0 0 30px var(--primary-color)' : 'none',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    transition: 'all 0.3s ease',
                    marginBottom: '2rem',
                    animation: isListening ? 'pulse 1.5s infinite' : 'none'
                }}>
                    {isListening ? (
                        <SparklesIcon style={{ width: '2.5rem', color: 'white' }} />
                    ) : (
                        <MicrophoneIcon style={{ width: '2.5rem', color: 'white' }} />
                    )}
                </div>

                <div style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', minHeight: '100px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                    <p style={{ color: transcript ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: transcript ? 'normal' : 'italic' }}>
                        {transcript || (isListening ? 'Listening to your brilliance...' : 'Click the microphone and start speaking your answer.')}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <button onClick={toggleListening} className={`btn ${isListening ? 'btn-danger' : 'btn-primary'}`} style={{ padding: '0.8rem 2rem' }}>
                        {isListening ? 'Stop Recording' : 'Start Speaking'}
                    </button>
                    <button onClick={handleNextQuestion} disabled={(!transcript && !isListening)} className="btn btn-secondary" style={{ padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                        <ChevronRightIcon style={{ width: '1.25rem' }} />
                    </button>
                </div>
            </div>
        </div>
    );

    if (step === 'results') return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Confetti active={showConfetti} />
            <h2 className="animate-in">Interview Performance Report</h2>
            <div className="card animate-in stagger-1" style={{ marginTop: '2rem', padding: '3rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                        background: 'var(--primary-light)', 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        border: '4px solid var(--primary)'
                    }}>
                        <ChartBarIcon style={{ width: '3rem', color: 'var(--primary)' }} />
                    </div>
                    <div style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--primary)', lineHeight: 1 }}>{finalScore}%</div>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Aggregate Mock Score</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {evaluations.map((ev, i) => (
                        <div key={i} className="animate-in" style={{ padding: '1.5rem', borderLeft: `5px solid ${ev.is_accurate ? '#10B981' : '#EF4444'}`, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>Q: {ev.question}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Your Answer: "{ev.answer}"</p>
                            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-xs)', fontSize: '0.95rem' }}>
                                <strong>AI Feedback:</strong> {ev.feedback}
                                <div style={{ marginTop: '0.5rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>Score: {ev.score}/10</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 auto' }} onClick={() => navigate('/dashboard')}>
                        <ArrowPathIcon style={{ width: '1.25rem' }} /> Complete Session
                    </button>
                </div>
            </div>
        </div>
    );

    return null;
};

export default VoiceInterview;
