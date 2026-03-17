import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
    EyeIcon, 
    PrinterIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    CheckIcon,
    PlusIcon,
    XMarkIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

const formatUrl = (url) => {
    if (!url) return '';
    return url.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '');
};


const ResumeBuilder = () => {
    const { user } = useContext(AuthContext);
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState(1);
    const [isPreview, setIsPreview] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        summary: '',
        github_url: '',
        linkedin_url: '',
        portfolio_url: '',
        experience: [{ title: '', company: '', period: '', description: '' }],
        education: [{ degree: '', school: '', year: '' }],
        projects: [{ name: '', description: '', link: '' }],
        skills: [''],
        certifications: [''],
        languages: [''],
        achievements: [''],
        template_id: 'template1'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/resumes/builder');
                if (res.data.user_id) {
                    setFormData({
                        phone: res.data.phone || '',
                        address: res.data.address || '',
                        summary: res.data.summary || '',
                        github_url: res.data.github_url || '',
                        linkedin_url: res.data.linkedin_url || '',
                        portfolio_url: res.data.portfolio_url || '',
                        experience: res.data.experience || [{ title: '', company: '', period: '', description: '' }],
                        education: res.data.education || [{ degree: '', school: '', year: '' }],
                        projects: res.data.projects || [{ name: '', description: '', link: '' }],
                        skills: res.data.skills || [''],
                        certifications: res.data.certifications || [''],
                        languages: res.data.languages || [''],
                        achievements: res.data.achievements || [''],
                        template_id: res.data.template_id || 'template1'
                    });
                }
            } catch (err) {
                console.error("Fetch resume info failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDynamicChange = (idx, field, value, type) => {
        const newList = [...formData[type]];
        newList[idx][field] = value;
        setFormData({ ...formData, [type]: newList });
    };

    const addField = (type, template) => {
        setFormData({ ...formData, [type]: [...formData[type], template] });
    };

    const removeField = (type, idx) => {
        const newList = [...formData[type]];
        newList.splice(idx, 1);
        setFormData({ ...formData, [type]: newList });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/resumes/builder', formData);
            alert('Resume saved successfully!');
        } catch (err) {
            alert('Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    const renderTemplate = () => {
        const style = templateStyles[formData.template_id] || templateStyles.template1;
        
        return (
            <div id="resume-template" style={{ ...style.resume, transition: 'all 0.3s ease' }}>
                <div style={{ ...style.header, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={style.name}>{user.name.toUpperCase()}</h1>
                    <div style={style.contact}>
                        {user.email} • {formData.phone} • {formData.address}
                    </div>
                    <div style={{...style.contact, marginTop: '8px', fontSize: '10pt', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        {formData.linkedin_url && (
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <LinkedInIcon /> {formatUrl(formData.linkedin_url)}
                            </span>
                        )}
                        {formData.github_url && (
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <GitHubIcon /> {formatUrl(formData.github_url)}
                            </span>
                        )}
                        {formData.portfolio_url && (
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <strong>Portfolio:</strong> {formatUrl(formData.portfolio_url)}
                            </span>
                        )}
                    </div>
                </div>

                <div style={style.section}>
                    <h2 style={style.sectionTitle}>PROFESSIONAL SUMMARY</h2>
                    <div style={style.divider}></div>
                    <p style={style.text}>{formData.summary}</p>
                </div>

                {formData.experience.some(exp => exp.title) && (
                    <div style={style.section}>
                        <h2 style={style.sectionTitle}>WORK EXPERIENCE</h2>
                        <div style={style.divider}></div>
                        {formData.experience.map((exp, i) => exp.title && (
                            <div key={i} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{exp.title} | {exp.company}</span>
                                    <span>{exp.period}</span>
                                </div>
                                <p style={style.text}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div style={style.section}>
                    <h2 style={style.sectionTitle}>PROJECTS</h2>
                    <div style={style.divider}></div>
                    {formData.projects.map((proj, i) => proj.name && (
                        <div key={i} style={{ marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 'bold' }}>
                                {proj.name} {proj.link && <span style={{ fontWeight: 'normal', fontSize: '0.85em', opacity: 0.8 }}> - {proj.link}</span>}
                            </div>
                            <p style={style.text}>{proj.description}</p>
                        </div>
                    ))}
                </div>

                <div style={style.section}>
                    <h2 style={style.sectionTitle}>EDUCATION</h2>
                    <div style={style.divider}></div>
                    {formData.education.map((edu, i) => edu.school && (
                        <div key={i} style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span><strong>{edu.degree}</strong>, {edu.school}</span>
                            <span>{edu.year}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={style.section}>
                        <h2 style={style.sectionTitle}>TECHNICAL SKILLS</h2>
                        <div style={style.divider}></div>
                        <p style={style.text}>{formData.skills.filter(s => s).join(', ')}</p>
                    </div>

                    {formData.languages.some(l => l) && (
                        <div style={style.section}>
                            <h2 style={style.sectionTitle}>LANGUAGES</h2>
                            <div style={style.divider}></div>
                            <p style={style.text}>{formData.languages.filter(l => l).join(', ')}</p>
                        </div>
                    )}
                </div>

                {formData.certifications.some(c => c) && (
                    <div style={style.section}>
                        <h2 style={style.sectionTitle}>CERTIFICATIONS</h2>
                        <div style={style.divider}></div>
                        <ul style={{ ...style.text, paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
                            {formData.certifications.map((cert, i) => cert && (
                                <li key={i}>{cert}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {formData.achievements.some(a => a) && (
                    <div style={style.section}>
                        <h2 style={style.sectionTitle}>AWARDS & ACHIEVEMENTS</h2>
                        <div style={style.divider}></div>
                        <ul style={{ ...style.text, paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
                            {formData.achievements.map((ach, i) => ach && (
                                <li key={i}>{ach}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    const [zoom, setZoom] = useState(1);

    const handleZoom = (delta) => {
        setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 1.5));
    };

    if (loading) return <div className="container">Loading Builder...</div>;

    if (isPreview) {
        return (
            <div className="preview-container" style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-main)' }}>
                <div className="no-print" style={{ 
                    position: 'sticky', 
                    top: '80px', 
                    zIndex: 100, 
                    backgroundColor: 'var(--card-bg)', 
                    backdropFilter: 'blur(10px)',
                    padding: '1rem', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '1rem', 
                    alignItems: 'center',
                    maxWidth: '1280px',
                    margin: '0 auto 1rem'
                }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn" onClick={() => setIsPreview(false)} style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ChevronLeftIcon style={{ width: '1.25rem' }} /> Back
                        </button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckIcon style={{ width: '1.5rem' }} /> {saving ? 'Saving...' : 'Save Progress'}
                        </button>
                        <button className="btn btn-primary" onClick={() => window.print()} style={{ background: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <PrinterIcon style={{ width: '1.5rem' }} /> Download PDF
                        </button>
                    </div>
                    
                    <div className="template-selector" style={{ 
                        display: 'flex', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--bg-main)',
                        borderRadius: '3rem',
                        overflowX: 'auto',
                        width: 'f-content',
                        maxWidth: '100%',
                        scrollbarWidth: 'none'
                    }}>
                        {Object.keys(templateStyles).map(id => (
                            <button 
                                key={id}
                                onClick={() => setFormData({ ...formData, template_id: id })}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    borderRadius: '2rem',
                                    background: formData.template_id === id ? 'var(--primary)' : 'var(--bg-card)',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    color: formData.template_id === id ? 'white' : 'var(--text-main)',
                                    border: `1px solid ${formData.template_id === id ? 'var(--primary)' : 'var(--border-light)'}`,
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {templateStyles[id].label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="resume-preview-wrapper">
                    <div className="resume-scale-container" style={{ 
                        transform: `scale(${zoom})`, 
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: 'fit-content',
                        margin: '0 auto'
                    }}>
                        {renderTemplate()}
                    </div>
                </div>

                {/* Dynamic Zoom Controls */}
                <div className="resume-zoom-controls no-print">
                    <button className="zoom-btn" onClick={() => handleZoom(-0.1)} title="Zoom Out">−</button>
                    <div className="zoom-level">{Math.round(zoom * 100)}%</div>
                    <button className="zoom-btn" onClick={() => handleZoom(0.1)} title="Zoom In">+</button>
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }}></div>
                    <button className="zoom-btn" onClick={() => setZoom(1)} style={{ width: 'auto', padding: '0 1rem', fontSize: '0.8rem' }}>Reset</button>
                </div>

                <style>
                    {`
                        @media print {
                            nav, .no-print, .template-selector, .resume-zoom-controls, #root > div > nav { display: none !important; }
                            body { background: white !important; margin: 0 !important; padding: 0 !important; }
                            .resume-preview-wrapper { margin: 0 !important; padding: 0 !important; display: block !important; }
                            .resume-scale-container { transform: none !important; width: 100% !important; margin: 0 !important; transition: none !important; }
                            #resume-template { 
                                margin: 0 auto !important; 
                                border: none !important; 
                                box-shadow: none !important; 
                                width: 210mm !important; 
                                min-height: 297mm !important; 
                                padding: 0.5in !important;
                                transform: none !important;
                                visibility: visible !important;
                                display: flex !important;
                            }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Resume Builder <span style={{ color: 'var(--primary)', opacity: 0.5 }}>/ Step {step} of 5</span></h1>
                    <button className="btn btn-primary" onClick={() => setIsPreview(true)} style={{ background: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <EyeIcon style={{ width: '1.25rem' }} /> Review & Build
                    </button>
                </div>

                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${(step / 5) * 100}%` }}></div>
                </div>

                {step === 1 && (
                    <div style={styles.formSection}>
                        <h2>Contact & Professional Links</h2>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                            gap: '1rem' 
                        }}>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input name="phone" className="form-control" placeholder="+91 83284 87013" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Address / Location</label>
                                <input name="address" className="form-control" placeholder="Tirupati, AP" value={formData.address} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>LinkedIn Profile URL</label>
                            <input name="linkedin_url" className="form-control" placeholder="linkedin.com/in/username" value={formData.linkedin_url} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>GitHub Profile URL</label>
                            <input name="github_url" className="form-control" placeholder="github.com/username" value={formData.github_url} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Portfolio / Personal Website</label>
                            <input name="portfolio_url" className="form-control" placeholder="yourportfolio.com" value={formData.portfolio_url} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Professional Summary</label>
                            <textarea name="summary" className="form-control" rows="5" placeholder="Passionate computer science graduate with strong foundations in..." value={formData.summary} onChange={handleChange}></textarea>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div style={styles.formSection}>
                        <h2>Work Experience & Internships</h2>
                        <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Freshers can add internships or part-time roles here.</p>
                        {formData.experience.map((exp, idx) => (
                            <div key={idx} style={styles.dynamicItem}>
                                <input placeholder="Job/Intern Title" className="form-control" value={exp.title} onChange={(e) => handleDynamicChange(idx, 'title', e.target.value, 'experience')} />
                                <input placeholder="Company Name" className="form-control" value={exp.company} onChange={(e) => handleDynamicChange(idx, 'company', e.target.value, 'experience')} />
                                <input placeholder="Period (e.g. May 2023 - July 2023)" className="form-control" value={exp.period} onChange={(e) => handleDynamicChange(idx, 'period', e.target.value, 'experience')} />
                                <textarea placeholder="Describe your key responsibilities and learnings" className="form-control" rows="3" value={exp.description} onChange={(e) => handleDynamicChange(idx, 'description', e.target.value, 'experience')}></textarea>
                                {formData.experience.length > 1 && <button onClick={() => removeField('experience', idx)} style={styles.removeBtn}>Remove</button>}
                            </div>
                        ))}
                        <button className="btn" onClick={() => addField('experience', { title: '', company: '', period: '', description: '' })} style={styles.addBtn}>
                            <PlusIcon style={{ width: '1rem' }} /> Add Experience
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div style={styles.formSection}>
                        <h2>Education & Skills</h2>
                        <h3>Education</h3>
                        {formData.education.map((edu, idx) => (
                            <div key={idx} style={styles.dynamicItem}>
                                <input placeholder="Degree (e.g. B.Tech in CSE)" className="form-control" value={edu.degree} onChange={(e) => handleDynamicChange(idx, 'degree', e.target.value, 'education')} />
                                <input placeholder="College/School Name" className="form-control" value={edu.school} onChange={(e) => handleDynamicChange(idx, 'school', e.target.value, 'education')} />
                                <input placeholder="Passing Year" className="form-control" value={edu.year} onChange={(e) => handleDynamicChange(idx, 'year', e.target.value, 'education')} />
                                {formData.education.length > 1 && <button onClick={() => removeField('education', idx)} style={styles.removeBtn}>Remove</button>}
                            </div>
                        ))}
                        <button className="btn" onClick={() => addField('education', { degree: '', school: '', year: '' })} style={styles.addBtn} >
                            <PlusIcon style={{ width: '1rem' }} /> Add Education
                        </button>

                        <h3 style={{ marginTop: '2rem' }}>Technical Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                            {formData.skills.map((skill, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input 
                                        className="form-control" 
                                        style={{ width: '180px' }} 
                                        value={skill} 
                                        onChange={(e) => {
                                            const newSkills = [...formData.skills];
                                            newSkills[idx] = e.target.value;
                                            setFormData({ ...formData, skills: newSkills });
                                        }} 
                                    />
                                    <button onClick={() => {
                                        const newSkills = [...formData.skills];
                                        newSkills.splice(idx, 1);
                                        setFormData({ ...formData, skills: newSkills });
                                    }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                        <XMarkIcon style={{ width: '1.25rem' }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="btn" onClick={() => setFormData({ ...formData, skills: [...formData.skills, ''] })} style={styles.addBtn}>
                            <PlusIcon style={{ width: '1rem' }} /> Add Skill
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div style={styles.formSection}>
                        <h2>Projects & Languages</h2>
                        <h3>Academic/Personal Projects</h3>
                        {formData.projects.map((proj, idx) => (
                            <div key={idx} style={styles.dynamicItem}>
                                <input placeholder="Project Name" className="form-control" value={proj.name} onChange={(e) => handleDynamicChange(idx, 'name', e.target.value, 'projects')} />
                                <input placeholder="GitHub/Demo Link" className="form-control" value={proj.link} onChange={(e) => handleDynamicChange(idx, 'link', e.target.value, 'projects')} />
                                <textarea placeholder="Describe the technology stack and what you built" className="form-control" rows="2" value={proj.description} onChange={(e) => handleDynamicChange(idx, 'description', e.target.value, 'projects')}></textarea>
                                {formData.projects.length > 1 && <button onClick={() => removeField('projects', idx)} style={styles.removeBtn}>Remove</button>}
                            </div>
                        ))}
                        <button className="btn" onClick={() => addField('projects', { name: '', description: '', link: '' })} style={styles.addBtn}>
                            <PlusIcon style={{ width: '1rem' }} /> Add Project
                        </button>

                        <h3 style={{ marginTop: '2rem' }}>Languages</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                            {formData.languages.map((lang, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input 
                                        className="form-control" 
                                        placeholder="English, Telugu, etc."
                                        style={{ width: '180px' }} 
                                        value={lang} 
                                        onChange={(e) => {
                                            const newLangs = [...formData.languages];
                                            newLangs[idx] = e.target.value;
                                            setFormData({ ...formData, languages: newLangs });
                                        }} 
                                    />
                                    <button onClick={() => {
                                        const newLangs = [...formData.languages];
                                        newLangs.splice(idx, 1);
                                        setFormData({ ...formData, languages: newLangs });
                                    }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                        <XMarkIcon style={{ width: '1.25rem' }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="btn" onClick={() => setFormData({ ...formData, languages: [...formData.languages, ''] })} style={styles.addBtn}>
                            <PlusIcon style={{ width: '1rem' }} /> Add Language
                        </button>
                    </div>
                )}

                {step === 5 && (
                    <div style={{ ...styles.formSection, gap: '1rem' }}>
                        <h2>Certifications & Achievements</h2>
                        <h3 style={{ marginTop: '0.2rem' }}>Certifications</h3>
                        {formData.certifications.map((cert, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <input 
                                    className="form-control" 
                                    placeholder="e.g. AWS Certified Developer"
                                    value={cert} 
                                    onChange={(e) => {
                                        const newCerts = [...formData.certifications];
                                        newCerts[idx] = e.target.value;
                                        setFormData({ ...formData, certifications: newCerts });
                                    }} 
                                />
                                <button onClick={() => {
                                    const newCerts = [...formData.certifications];
                                    newCerts.splice(idx, 1);
                                    setFormData({ ...formData, certifications: newCerts });
                                }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                    <XMarkIcon style={{ width: '1.25rem' }} />
                                </button>
                            </div>
                        ))}
                        <button className="btn" onClick={() => setFormData({ ...formData, certifications: [...formData.certifications, ''] })} style={styles.addBtn}>
                            <PlusIcon style={{ width: '1rem' }} /> Add Certification
                        </button>

                        <h3 style={{ marginTop: '0.5rem' }}>Key Achievements / Awards</h3>
                        {formData.achievements.map((ach, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <input 
                                    className="form-control" 
                                    placeholder="e.g. Winners of Smart India Hackathon"
                                    value={ach} 
                                    onChange={(e) => {
                                        const newAchs = [...formData.achievements];
                                        newAchs[idx] = e.target.value;
                                        setFormData({ ...formData, achievements: newAchs });
                                    }} 
                                />
                                <button onClick={() => {
                                    const newAchs = [...formData.achievements];
                                    newAchs.splice(idx, 1);
                                    setFormData({ ...formData, achievements: newAchs });
                                }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                    <XMarkIcon style={{ width: '1.25rem' }} />
                                </button>
                            </div>
                        ))}
                        <button className="btn" onClick={() => setFormData({ ...formData, achievements: [...formData.achievements, ''] })} style={styles.addBtn}>
                            <PlusIcon style={{ width: '1rem' }} /> Add Achievement
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                    <button className="btn" disabled={step === 1} onClick={() => setStep(step - 1)} style={{ background: '#F3F4F6', color: '#374151' }}>Previous</button>
                    {step < 5 ? (
                        <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next Step</button>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setIsPreview(true)} style={{ background: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <EyeIcon style={{ width: '1.25rem' }} /> Review & Build
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    progressBar: { height: '8px', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '2rem', overflow: 'hidden' },
    progressFill: { height: '100%', background: 'var(--primary-color)', transition: 'width 0.3s ease' },
    formSection: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    dynamicItem: { padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', backgroundColor: 'var(--background-color)' },
    removeBtn: { alignSelf: 'flex-end', background: 'var(--danger-color)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' },
    addBtn: { marginTop: '0.5rem', fontSize: '0.95rem', color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '800' },
};

const baseAts = {
    resume: {
        background: 'white',
        padding: '0.6in',
        color: 'black',
        fontFamily: "'Times New Roman', serif",
        lineHeight: '1.5',
        fontSize: '10.5pt',
        width: '210mm',
        minHeight: '297mm',
        margin: '2rem auto',
        boxShadow: '0 0 40px rgba(0,0,0,0.1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    header: { textAlign: 'center', marginBottom: '1.5rem', width: '100%' },
    name: { fontSize: '20pt', fontWeight: 'bold', margin: '0 0 8px 0', borderBottom: 'none' },
    contact: { fontSize: '9.5pt', marginBottom: '0.4rem', color: '#333' },
    section: { marginTop: '1.2rem', width: '100%' },
    sectionTitle: { fontSize: '11.5pt', fontWeight: 'bold', margin: '0 0 4px 0', color: 'black', textTransform: 'uppercase' },
    divider: { height: '1.5px', background: 'black', marginBottom: '0.8rem' },
    text: { margin: '0.5rem 0', fontSize: '10pt', textAlign: 'justify' }
};

const templateStyles = {
    template1: { ...baseAts, label: 'Classic ATS' },
    template2: { ...baseAts, label: 'Modern Minimal', name: { ...baseAts.name, fontSize: '22pt', fontWeight: '300' } },
    template3: { ...baseAts, label: 'Executive', resume: { ...baseAts.resume, fontFamily: 'Georgia, serif' }, header: { ...baseAts.header, textAlign: 'center' } },
    template4: { ...baseAts, label: 'Compact Fresh', resume: { ...baseAts.resume, fontSize: '9pt', lineHeight: '1.2' } },
    template5: { ...baseAts, label: 'Blue Professional', sectionTitle: { ...baseAts.sectionTitle, color: '#1E40AF' }, divider: { ...baseAts.divider, background: '#1E40AF' }, name: { ...baseAts.name, color: '#1E40AF' } },
    template6: { ...baseAts, label: 'Sans Serif', resume: { ...baseAts.resume, fontFamily: 'Arial, sans-serif' } },
    template7: { ...baseAts, label: 'Underlined Head', name: { ...baseAts.name, borderBottom: '2px solid black', paddingBottom: '3px' } },
    template8: { ...baseAts, label: 'Soft Gray', sectionTitle: { ...baseAts.sectionTitle, background: '#f3f4f6', padding: '2px 8px' }, divider: { display: 'none' } },
    template9: { ...baseAts, label: 'Professional Narrow', resume: { ...baseAts.resume, padding: '0.4in' } },
    template10: { ...baseAts, label: 'Bold Header', name: { ...baseAts.name, fontWeight: '900', fontSize: '24pt' } }
};

export default ResumeBuilder;
