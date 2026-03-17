import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { jobService, resumeService, learningService } from '../services/apiServices';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { 
  RocketLaunchIcon, 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  ArrowUpTrayIcon,
  SparklesIcon,
  BeakerIcon,
  MicrophoneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [customJob, setCustomJob] = useState(''); // New state for dynamic search
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [gapResult, setGapResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [matchingScore, setMatchingScore] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getJobs();
        setJobs(data);
      } catch (err) {
        console.error("Failed to load jobs", err);
      }
    };
    fetchJobs();
  }, []);

  // AI Autocomplete Logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (customJob.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const data = await jobService.getSuggestions(customJob);
        setSuggestions(data.suggestions);
      } catch (err) {
        console.error("Suggestion fetch failed", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [customJob]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first.');
    setUploadStatus('Uploading and Analyzing...');
    try {
      const result = await resumeService.upload(file);
      setAnalysisResult(result);
      setUploadStatus('Analysis Complete!');
    } catch (err) {
      setUploadStatus('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCustomJobSearch = async () => {
    if (!customJob.trim()) return alert('Please enter a job role to search for.');
    try {
      const roadmapResponse = await jobService.analyzeCustomRole(customJob);
      setGapResult(roadmapResponse);
    } catch (err) {
      alert('Error generating custom learning roadmap');
    }
  };

  const handleScoreResume = async () => {
    if (!customJob) return alert('Please search for a job role first.');
    try {
      setIsScoring(true);
      const result = await learningService.scoreResume('', customJob);
      setMatchingScore(result);
      setShowScoreModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error scoring resume.');
    } finally {
      setIsScoring(false);
    }
  };

  const colors = {
    primary: '#4F46E5',
    secondary: '#10B981',
    accent1: '#F59E0B',
    accent2: '#EF4444',
    bg: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#0F172A'
  };

  const pieData = gapResult ? {
    labels: ['Matched Skills', 'Missing Skills'],
    datasets: [{
      data: [gapResult.matchingSkills?.length || 0, gapResult.missingSkills?.length || 0],
      backgroundColor: [colors.secondary, colors.accent2],
      borderColor: colors.bg,
      borderWidth: 2,
    }]
  } : null;

  const barData = analysisResult ? {
    labels: ['Structure', 'Communication', 'Technical', 'Overall'],
    datasets: [{
      label: 'Performance Score',
      data: [
        analysisResult.analysis?.breakdown?.structure || 0,
        analysisResult.analysis?.breakdown?.length_communication || 0,
        analysisResult.analysis?.breakdown?.technical_skills || 0,
        analysisResult.score || 0
      ],
      backgroundColor: ['rgba(79, 70, 229, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(129, 140, 248, 0.8)', 'rgba(16, 185, 129, 0.8)'],
      borderRadius: 8,
    }]
  } : null;

  const chartOptions = {
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 70,
        top: 10
      }
    },
    plugins: {
      legend: { 
        position: 'top',
        labels: { 
          color: colors.text, 
          font: { family: 'Plus Jakarta Sans', weight: '600', size: 12 },
          padding: 20
        } 
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100, 
        grid: { color: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, 
        ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans' } } 
      },
      x: { 
        grid: { display: false }, 
        ticks: { 
          color: colors.text, 
          font: { family: 'Plus Jakarta Sans', weight: '500' },
          padding: 10
        } 
      }
    }
  };

  if (loading) return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="skeleton" style={{ height: '40px', width: '300px', marginBottom: '2rem' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {[1, 2].map(i => <div key={i} className="card" style={{ height: '400px' }}><div className="skeleton" style={{ height: '200px' }}></div></div>)}
      </div>
    </div>
  );

  return (
    <div className="container animate-in" style={{ paddingBottom: '6rem' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        margin: '3rem 0',
        padding: '2rem',
        background: 'var(--primary-light)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)'
      }}>
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            Welcome back, {user?.name} <SparklesIcon className="w-8 h-8 text-amber-400" style={{ width: '2rem' }} />
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Ready to accelerate your career today?
          </p>
        </div>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '3rem' 
      }}>
        
        {/* Step 1: Resume Analysis */}
        <section className="animate-in stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>Step 01</span>
              <h2 style={{ marginTop: '0.75rem', fontSize: '1.5rem' }}>Analyze Your Resume</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Get a technical audit of your resume structure.</p>
            </div>

            <div 
              className={`upload-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{ minHeight: '140px', padding: '1.5rem' }}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept=".pdf,.docx" 
                style={{ display: 'none' }} 
              />
              <div className="upload-icon" style={{ width: '50px', height: '50px' }}>
                {file ? (
                  <DocumentTextIcon style={{ width: '2rem', color: 'var(--primary)' }} />
                ) : (
                  <ArrowUpTrayIcon style={{ width: '2rem', opacity: 0.5 }} />
                )}
              </div>
              <div className="upload-text">
                {file ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="file-name" style={{ color: 'var(--text-main)', fontWeight: '800' }}>{file.name}</span>
                    <span className="file-size" style={{ opacity: 0.7 }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <>
                    <strong style={{ fontSize: '1rem' }}>Click to upload</strong>
                    <span style={{ fontSize: '0.85rem' }}>or drag & drop</span>
                    <span className="file-types" style={{ fontSize: '0.75rem' }}>PDF, DOCX</span>
                  </>
                )}
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleUpload} 
              disabled={!file}
              style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
            >
              <RocketLaunchIcon style={{ width: '1.25rem' }} /> Analyze Resume
            </button>
            {uploadStatus && (
              <p style={{ 
                marginTop: '1.5rem', 
                textAlign: 'center', 
                fontWeight: '700',
                color: uploadStatus.includes('Error') ? 'var(--danger)' : 'var(--secondary)'
              }}>
                {uploadStatus}
              </p>
            )}
          </div>

          {analysisResult && (
            <div className="card animate-in" style={{ 
              borderLeft: '6px solid var(--primary)',
              background: 'linear-gradient(to right, var(--bg-card), var(--primary-light))'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>AI Performance Metric</h3>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: '900', 
                  color: 'var(--primary)' 
                }}>{analysisResult.score}<small style={{ fontSize: '1rem', opacity: 0.6 }}>/100</small></span>
              </div>
              <div style={{ height: '550px', width: '100%', marginTop: '2rem' }}>
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          )}
        </section>

        {/* Step 2: Career Discovery */}
        <section className="animate-in stagger-2" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ overflow: 'visible' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ 
                background: 'var(--secondary)', 
                color: 'white', 
                padding: '0.4rem 1rem', 
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>Step 02</span>
              <h2 style={{ marginTop: '1.25rem' }}>Career Discovery</h2>
              <p style={{ color: 'var(--text-muted)' }}>Generate industry-standard learning roadmaps for any technical role.</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ flex: 1, height: '4rem', paddingLeft: '1.5rem', fontSize: '1.1rem' }} 
                  placeholder="e.g. MERN Stack Developer..." 
                  value={customJob} 
                  onChange={(e) => { setCustomJob(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)} 
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleCustomJobSearch}
                  style={{ width: '8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  <MagnifyingGlassIcon style={{ width: '1.25rem' }} /> Find
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div style={{ 
                  position: 'absolute', top: 'calc(100% + 12px)', left: 0, right: 0, zIndex: 1000, 
                  background: 'var(--bg-card)', border: '1px solid var(--border-light)', 
                  borderRadius: 'var(--radius-md)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                  overflowY: 'auto', maxHeight: '250px'
                }}>
                  {suggestions.map((s, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setCustomJob(s); handleCustomJobSearch(); }} 
                      style={{ 
                        padding: '1rem 1.5rem', cursor: 'pointer', borderBottom: '1px solid var(--border-light)',
                        transition: 'all 0.2s', fontWeight: '600', color: 'var(--text-main)',
                        display: 'flex', alignItems: 'center', gap: '0.75rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--primary-light)';
                        e.target.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--text-main)';
                      }}
                    >
                      <MagnifyingGlassIcon style={{ width: '1rem', opacity: 0.5 }} />
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {gapResult && (
            <div className="card animate-in" style={{ borderLeft: '6px solid var(--secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Skill Match Intelligence</h3>
                <span style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '900', 
                  color: 'var(--secondary)' 
                }}>{gapResult.matchPercentage}%</span>
              </div>
              <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: '180px', height: '180px' }}>
                  {pieData && <Pie data={pieData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: 'var(--secondary)', margin: 0 }}>Matched Skills</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{gapResult.matchingSkills.length}</p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--danger)', margin: 0 }}>Missing Gaps</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{gapResult.missingSkills.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Hierarchical Roadmap Section */}
      {gapResult && (
        <section className="animate-in stagger-3" style={{ marginTop: '4rem' }}>
          <div className="card" style={{ padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{ 
                color: 'var(--primary)', 
                fontWeight: '900', 
                textTransform: 'uppercase', 
                letterSpacing: '0.2em',
                fontSize: '0.9rem'
              }}>Specialized Learning Path</span>
              <h2 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>{gapResult.jobTitle} Roadmap</h2>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '3rem',
              position: 'relative',
              paddingLeft: '3rem'
            }}>
              {/* Timeline Line */}
              <div style={{ 
                position: 'absolute', left: '1rem', top: '1rem', bottom: '1rem', 
                width: '4px', background: 'var(--border-light)', borderRadius: '2px' 
              }}></div>

              {gapResult.hierarchicalRoadmap ? (
                gapResult.hierarchicalRoadmap.map((section, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Timeline Node */}
                    <div style={{ 
                      position: 'absolute', left: '-3.75rem', top: '0.25rem', 
                      width: '2rem', height: '2rem', borderRadius: '50%', 
                      background: 'var(--primary)', border: '4px solid var(--bg-card)',
                      boxShadow: 'var(--shadow-md)', zIndex: 1
                    }}></div>

                    <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>{section.category}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                      {section.skills.map((skill, sIdx) => (
                        <div key={sIdx} style={{ 
                          padding: '0.8rem 1.5rem', borderRadius: '1rem', 
                          background: skill.matched ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-main)',
                          color: skill.matched ? 'var(--secondary)' : 'var(--text-muted)', 
                          border: `1px solid ${skill.matched ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-light)'}`,
                          display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700',
                          boxShadow: skill.matched ? '0 4px 12px rgba(16, 185, 129, 0.1)' : 'none',
                          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-5px) scale(1.05)';
                          if (skill.matched) e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          if (skill.matched) e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.1)';
                        }}
                        >
                          {skill.name} {skill.matched && <SparklesIcon style={{ width: '1rem', color: 'inherit' }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                  <div className="skeleton" style={{ height: '40px', width: '300px', margin: '0 auto 2rem' }}></div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>AI is carefully crafting your career trajectory...</p>
                </div>
              )}
            </div>

            <div style={{ 
              marginTop: '5rem', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              paddingTop: '3rem',
              borderTop: '1px solid var(--border-light)'
            }}>
              <button className="btn btn-primary" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }} onClick={() => navigate(`/curriculum/${encodeURIComponent(gapResult.jobTitle)}`)}>
                <DocumentTextIcon style={{ width: '1.5rem' }} /> View Master Curriculum
              </button>
              <button className="btn" style={{ background: 'var(--secondary)', color: 'white', padding: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }} onClick={handleScoreResume} disabled={isScoring}>
                <BeakerIcon style={{ width: '1.5rem' }} /> {isScoring ? 'Analysing Match...' : 'Deep AI Match Audit'}
              </button>
                <button 
                  className="btn" 
                  style={{ 
                    background: 'linear-gradient(45deg, var(--primary), #9333ea)', 
                    color: 'white', 
                    border: 'none',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }} 
                  onClick={() => navigate('/ai-interview', { state: { skill: { name: gapResult.jobTitle } } })}
                >
                  <MicrophoneIcon style={{ width: '1.5rem' }} /> Take Mock Interview
                </button>
            </div>
          </div>
        </section>
      )}

      {/* Improved Match Score Modal */}
      {showScoreModal && matchingScore && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(15, 23, 42, 0.85)', display: 'flex', justifyContent: 'center', 
          alignItems: 'center', zIndex: 2000, padding: '1rem', backdropFilter: 'blur(12px)'
        }}>
          <div className="card animate-in" style={{ 
            maxWidth: '650px', width: '100%', padding: '3rem',
            maxHeight: '90vh', overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ margin: 0 }}>AI System Match Audit</h2>
              <button onClick={() => setShowScoreModal(false)} style={{ 
                background: 'var(--bg-main)', border: 'none', width: '40px', height: '40px', 
                borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)'
              }} onMouseEnter={(e) => e.target.style.background = 'var(--danger)'} 
                 onMouseLeave={(e) => e.target.style.background = 'var(--bg-main)'}>
                <XMarkIcon style={{ width: '1.25rem' }} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', width: '160px', height: '160px', borderRadius: '50%',
                background: `conic-gradient(${
                  matchingScore.score >= 70 ? 'var(--secondary)' : matchingScore.score >= 40 ? 'var(--accent)' : 'var(--danger)'
                } ${matchingScore.score * 3.6}deg, var(--border-light) 0deg)`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '130px', height: '130px', borderRadius: '50%',
                  background: 'var(--bg-card)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '2.5rem', fontStyle: 'italic', fontWeight: '900', color: matchingScore.score >= 70 ? 'var(--secondary)' : matchingScore.score >= 40 ? 'var(--accent)' : 'var(--danger)' }}>
                    {matchingScore.score}%
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '0.1em' }}>FIT SCORE</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {matchingScore.matches && (
                <div>
                  <h4 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Matched Proficiencies</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {matchingScore.matches.map((s, i) => (
                      <span key={i} style={{
                        padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem',
                        background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', fontWeight: '700'
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {matchingScore.suggestions && (
                <div style={{ background: 'var(--bg-main)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>AI Insights & Improvements</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {matchingScore.suggestions.map((s, i) => (
                      <div key={i} style={{
                        padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.95rem',
                        background: 'var(--bg-card)', borderLeft: '4px solid var(--primary)',
                        lineHeight: '1.6'
                      }}>{s}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '3rem', padding: '1.25rem' }} onClick={() => setShowScoreModal(false)}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
