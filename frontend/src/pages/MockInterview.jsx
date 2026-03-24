import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import Confetti from '../components/Confetti';
import { useTheme } from '../context/ThemeContext';
import { 
    AcademicCapIcon, 
    BriefcaseIcon, 
    RocketLaunchIcon,
    ArrowLeftIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const MockInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Passed from dashboard or routing state
  const skill = location.state?.skill;
  
  const [difficulty, setDifficulty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!skill) {
       navigate('/dashboard');
    }
  }, [skill, navigate]);

  const handleStartQuiz = async (selectedDiff) => {
    setDifficulty(selectedDiff);
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await interviewService.getQuizForSkill(skill.id, skill.name, selectedDiff.toLowerCase());
      if (data) {
        setQuizData(data);
      } else {
        setErrorMsg(`We currently don't have a ${selectedDiff} mock interview available for this specific skill. Please try another level or skill!`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error fetching mock interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quizData.questions.length) {
      const confirmSubmit = window.confirm("You haven't answered all questions. Submit anyway?");
      if (!confirmSubmit) return;
    }

    try {
      const res = await interviewService.submitQuiz(quizData.quiz.id, answers);
      setResult(res);
      if (res.percentage >= 70) {
        setShowConfetti(true);
      }
    } catch (err) {
      alert("Error submitting quiz");
    }
  };

  if (loading) return (
    <div className="container animate-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '300px', margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Preparing your technical simulation environment...</p>
      </div>
      <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem' }}>
        <div className="skeleton" style={{ height: '24px', width: '40%' }}></div>
        <div className="skeleton" style={{ height: '100px', width: '100%' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto' }}>
            <div className="skeleton" style={{ height: '60px' }}></div>
            <div className="skeleton" style={{ height: '60px' }}></div>
            <div className="skeleton" style={{ height: '60px' }}></div>
            <div className="skeleton" style={{ height: '60px' }}></div>
        </div>
      </div>
    </div>
  );

  if (!quizData || errorMsg) {
     return (
       <div className="container animate-in" style={{ padding: '4rem 2rem', maxWidth: '700px' }}>
         <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ 
                background: 'var(--primary-light)', color: 'var(--primary)', 
                padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', 
                fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em'
            }}>TECHNICAL SIMULATION</span>
            <h1 style={{ marginTop: '1.5rem', fontSize: '3rem' }}>{skill?.name} Mockup</h1>
         </div>
         
         {errorMsg && (
           <div className="alert alert-error" style={{ marginBottom: '2.5rem' }}>
             {errorMsg}
           </div>
         )}
         
         <div className="card" style={{ textAlign: 'center', padding: '4rem 3rem' }}>
           <h3 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Select Assessment Tier</h3>
           <p style={{ marginBottom: '3rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
             Ready to validate your proficiency? Choose a difficulty to begin the AI-driven assessment.
           </p>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
             <button 
                className="btn" 
                style={{ background: 'var(--bg-main)', color: 'var(--secondary)', border: '2px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', fontSize: '1.1rem' }} 
                onClick={() => handleStartQuiz('Easy')}
                onMouseEnter={(e) => { e.target.style.background = 'var(--secondary)'; e.target.style.color = 'white'; }}
                onMouseLeave={(e) => { e.target.style.background = 'var(--bg-main)'; e.target.style.color = 'var(--secondary)'; }}
             >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><AcademicCapIcon style={{ width: '1.5rem' }} /> Easy</div>
             </button>
             <button 
                className="btn" 
                style={{ background: 'var(--bg-main)', color: 'var(--accent)', border: '2px solid rgba(245, 158, 11, 0.2)', padding: '1.5rem', fontSize: '1.1rem' }} 
                onClick={() => handleStartQuiz('Medium')}
                onMouseEnter={(e) => { e.target.style.background = 'var(--accent)'; e.target.style.color = 'white'; }}
                onMouseLeave={(e) => { e.target.style.background = 'var(--bg-main)'; e.target.style.color = 'var(--accent)'; }}
             >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><BriefcaseIcon style={{ width: '1.5rem' }} /> Medium</div>
             </button>
             <button 
                className="btn" 
                style={{ background: 'var(--bg-main)', color: 'var(--danger)', border: '2px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', fontSize: '1.1rem' }} 
                onClick={() => handleStartQuiz('Hard')}
                onMouseEnter={(e) => { e.target.style.background = 'var(--danger)'; e.target.style.color = 'white'; }}
                onMouseLeave={(e) => { e.target.style.background = 'var(--bg-main)'; e.target.style.color = 'var(--danger)'; }}
             >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><RocketLaunchIcon style={{ width: '1.5rem' }} /> Hard</div>
             </button>
           </div>
         </div>
         
         <div style={{ marginTop: '3rem', textAlign: 'center' }}>
           <button className="btn" onClick={() => navigate('/dashboard')} style={{ color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', width: '100%' }}>
             <ArrowLeftIcon style={{ width: '1.25rem' }} /> Exit to Dashboard
           </button>
         </div>
       </div>
     );
  }

  return (
    <div className="container animate-in" style={{ padding: '3rem 2rem', maxWidth: '1000px' }}>
      <Confetti active={showConfetti} />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '3rem',
        padding: '1.5rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger)', animation: 'pulse 1.5s infinite' }}></div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{quizData.quiz.title}</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ 
                padding: '0.4rem 1rem', background: 'var(--primary-light)', 
                color: 'var(--primary)', borderRadius: 'var(--radius-full)', 
                fontSize: '0.85rem', fontWeight: '800' 
            }}>
                Level: {quizData.quiz.difficulty}
            </span>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                Progression: {Math.round((Object.keys(answers).length / quizData.questions.length) * 100)}%
            </div>
        </div>
      </div>

      {result ? (
        <div className="card animate-in" style={{ padding: '4rem 2rem' }}>
           <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
             <h1 style={{ 
                color: result.percentage >= 70 ? 'var(--secondary)' : 'var(--danger)', 
                fontSize: '5rem', 
                fontWeight: '900',
                margin: '0 0 1rem' 
             }}>
               {result.percentage}%
             </h1>
             <h2 style={{ fontSize: '2rem' }}>Simulation Result</h2>
             <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto' }}>
               {result.percentage >= 70 
                  ? "Outstanding achievement! You've demonstrated expert-level proficiency in this domain." 
                  : "Valuable experience gained. Focus on the identified gaps to strengthen your technical foundation."}
             </p>
             <div style={{ display: 'inline-flex', gap: '2rem', marginTop: '2rem', padding: '1rem 2rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>{result.score} / {result.totalQuestions}</span>
                </div>
                <div style={{ width: '1px', background: 'var(--border-light)' }}></div>
                <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verdict</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: result.percentage >= 70 ? 'var(--secondary)' : 'var(--danger)' }}>
                        {result.percentage >= 70 ? 'CERTIFIED' : 'RESEARCH NEEDED'}
                    </span>
                </div>
             </div>
           </div>
           
           {result.detailedReview && (
             <div style={{ marginTop: '5rem' }}>
               <h3 style={{ fontSize: '1.75rem', marginBottom: '2.5rem', textAlign: 'center' }}>Technical Audit Log</h3>
               
               <div style={{ display: 'grid', gap: '1.5rem' }}>
               {result.detailedReview.map((rev, idx) => (
                 <div key={rev.questionId} className="animate-in" style={{ 
                    padding: '2rem', 
                    backgroundColor: rev.isCorrect ? 'rgba(16, 185, 129, 0.03)' : 'rgba(239, 68, 68, 0.03)', 
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${rev.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
                    borderLeft: `6px solid ${rev.isCorrect ? 'var(--secondary)' : 'var(--danger)'}`
                 }}>
                   <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{idx + 1}. {rev.questionText}</h4>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                     <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Submission</span>
                        <div style={{ 
                            padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', 
                            background: rev.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: rev.isCorrect ? 'var(--secondary)' : 'var(--danger)',
                            fontWeight: '700', fontSize: '0.9rem'
                        }}>
                            {rev.userAnswer !== 'Not answered' ? `${rev.userAnswer}: ${rev.options[rev.userAnswer]}` : 'Unanswered'}
                        </div>
                     </div>
                     {!rev.isCorrect && (
                        <div>
                            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Verified Accuracy</span>
                            <div style={{ 
                                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', 
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: 'var(--secondary)',
                                fontWeight: '700', fontSize: '0.9rem'
                            }}>
                                {rev.correctAnswer}: {rev.options[rev.correctAnswer]}
                            </div>
                        </div>
                     )}
                   </div>
                 </div>
               ))}
               </div>
             </div>
           )}

           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem', gap: '1.5rem' }}>
             <button className="btn" onClick={() => window.location.reload()} style={{ padding: '1.25rem 2rem', fontWeight: '700', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}><ArrowPathIcon style={{ width: '1.25rem' }} /> Restart Simulation</div>
             </button>
             <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '1.25rem 3rem' }}>
                Dashboard Home
             </button>
           </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {quizData.questions.map((q, index) => (
            <div key={q.id} className="card animate-in" style={{ 
                padding: '2.5rem', 
                borderLeft: answers[q.id] ? '6px solid var(--primary)' : '6px solid transparent',
                transition: 'border 0.3s'
            }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                <span style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '1rem', display: 'block' }}>QUERY {index + 1} OF {quizData.questions.length}</span>
                {q.question_text}
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {['A', 'B', 'C', 'D'].map(opt => {
                  const optionText = q[`option_${opt.toLowerCase()}`];
                  const isSelected = answers[q.id] === opt;
                  return (
                    <label 
                        key={opt} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            cursor: 'pointer', 
                            padding: '1.25rem 1.75rem', 
                            borderRadius: 'var(--radius-md)', 
                            background: isSelected ? 'var(--primary-light)' : 'var(--bg-main)', 
                            border: `2px solid ${isSelected ? 'var(--primary)' : 'transparent'}`,
                            transition: 'all 0.2s',
                            fontWeight: '600'
                        }}
                        onMouseEnter={(e) => { if(!isSelected) e.target.style.background = 'var(--border-light)'; }}
                        onMouseLeave={(e) => { if(!isSelected) e.target.style.background = 'var(--bg-main)'; }}
                    >
                      <input 
                        type="radio" 
                        name={`question_${q.id}`} 
                        value={opt}
                        checked={isSelected}
                        onChange={() => handleOptionChange(q.id, opt)}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: '1rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        <strong style={{ opacity: 0.6, marginRight: '0.5rem' }}>{opt}</strong> {optionText}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ 
            marginTop: '3rem', 
            padding: '2rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                {Object.keys(answers).length} of {quizData.questions.length} questions resolved
            </div>
            <button className="btn btn-primary" onClick={handleSubmit} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
              Finalize Submission
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
